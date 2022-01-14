import sys
import threading
from cefpython3 import cefpython as cef

# 代码转自 https://blog.csdn.net/jianshen_5465/article/details/118699364
# 代码转自 https://segmentfault.com/a/1190000021672729?utm_source=tag-newest

sys.excepthook = cef.ExceptHook

class ClientHandler(object):
    r""" 自定义客户端 Handler """
    def __init__(self, chromeObject):
        self.chrome = chromeObject

    def GetViewRect(self, rect_out, **kwargs):
        r""" 渲染接口 """
        # [x, y, width, height]
        rect_out.extend([0, 0, self.chrome.width, self.chrome.height])
        return True

    def OnConsoleMessage(self, browser, message, **kwargs):
        r""" 浏览器控制台接口 """
        self.chrome.console.append(message)

    def OnLoadError(self, browser, frame, error_code, failed_url, **_):
        self.chrome.ready = error_code
        self.chrome._getReadyLock.acquire()
        self.chrome._getReadyLock.notify()
        self.chrome._getReadyLock.release()

    def OnLoadingStateChange(self, browser, is_loading, **kwargs):
        r""" 加载接口，当浏览器加载状态变化时调用 """
        if is_loading:
            # 加载中
            self.chrome.ready = False
        else:
            # 加载完成
            self.chrome.ready = True
            self.chrome._getReadyLock.acquire()
            self.chrome._getReadyLock.notify()
            self.chrome._getReadyLock.release()


class Client(object):
    def __init__(self, width=1920, height=1080, headless=False):
        self.width = width
        self.height = height
        self.headless = headless
        self.console = []
        self.browser = None
        self.source = None
        self.domArray = None
        self.windowParams = None
        self.ready = True
        self._getSourceLock = threading.Condition()
        self._getDOMLock = threading.Condition()
        self._getReadyLock = threading.Condition()
        self._handler = ClientHandler(self)

        settings,switches = {},{}
        if self.headless:
            settings['windowless_rendering_enabled'] = True
        cef.Initialize(settings=settings, switches=switches)

    def __getattr__(self, name):
        r""" 将所有未知的属性和方法传递给 CEF 浏览器 """
        return getattr(self.browser, name)

    def getBrowser(self):
        if self.browser:
            return self.browser
        # 创建浏览器实例
        if self.headless:
            parent_handle = 0
            wininfo = cef.WindowInfo()
            wininfo.SetAsOffscreen(parent_handle)
            self.browser = cef.CreateBrowserSync(window_info=wininfo)
        else:
            self.browser = cef.CreateBrowserSync()

        self.browser.SetClientHandler(self._handler)
        self.browser.SendFocusEvent(True)
        self.browser.WasResized()  # 在 headless 模式下应至少调用一次这个方法

        return self

    def LoadUrl(self, url, synchronous=False):
        r""" 将 URL 传递给浏览器 """
        self.ready = False
        self.browser.LoadUrl(url)
        if synchronous:  # 同步方式
            self._getReadyLock.acquire()
            if not self.ready:
                self._getReadyLock.wait()
            self._getReadyLock.release()

    def getSource(self, synchronous=False):
        r""" 返回 main frame 的 html 源码，  """
        self.source = None
        self.browser.GetMainFrame().GetSource(self)

        if synchronous:
            self._getSourceLock.acquire()
            if not self.source:
                # 等待 Visit 函数准备好 source 的通知
                self._getSourceLock.wait()
            self._getSourceLock.release()
        return self.source

    def Visit(self, value):
        r"StringVisitor 接口"
        self.source = value
        self._getSourceLock.acquire()
        self._getSourceLock.notify()
        self._getSourceLock.release()

def BrowserThread(browser):
    r""" 线程入口函数 """
    browser.ready = False
    browser.LoadUrl(url, True) # True 为同步调用
    with open('source.html', mode='w', encoding='utf8') as srcfp:
        source = browser.getSource(True) # 同步获取
        assert(source)
        srcfp.write(source)
    browser.CloseBrowser()


if __name__ == '__main__':
    url = 'http://www.baidu.com'
    browser = Client(width=640, height=480).getBrowser()
    browserThread = threading.Thread(target=BrowserThread, args=(browser,))
    browserThread.start()
    cef.MessageLoop()
    browserThread.join()
    browser = None
    cef.Shutdown()
