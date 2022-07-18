以头条系某短视频（dy）web页面搜索为例，通过RPC的逻辑实现数据采集。

目前方案通用于头条系web页面。因为其当前产品大都基于XMLHttpRequest的send方法做一些校验，我们可以自启一个浏览器去完成XMLHttpRequest请求，直接获取返回的responseText。

话虽如此，此方案仅是为了配合书中的教程供大家学习，并不代表是最优选择，主要是给大家提供一种思路和方法。

代码逻辑很简单，只有50行代码，有不懂的问题可私信或留言。

更多精彩内容：[《爬虫逆向进阶实战》](http://t.csdn.cn/mEa64)



---

## 调试分析

因受版权影响，我会避开关键词。

先找一下其发送逻辑，堆栈第一个点进去。
![在这里插入图片描述](https://img-blog.csdnimg.cn/cf1f35c4f31d41caa0f475c007b6812f.png)

断点后调试，可看到t即是XMLHttpRequest。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4e5018337a0449a0a9de97abe79ecc28.png)

查看t对象。

![在这里插入图片描述](https://img-blog.csdnimg.cn/0036cd99a8e746d7af74c8c5fa5a35ea.png)


在浏览器中调试。

![在这里插入图片描述](https://img-blog.csdnimg.cn/32124b7fa3764128900c9b454c8947d2.png)


查看响应。 当前已经返回了responseText和带了签名的responseURL。

![在这里插入图片描述](https://img-blog.csdnimg.cn/85026da13f6545a19db303a781b23a49.png)


---

## Python实现
注意：url要换成自己浏览器上的。
```python
# -*- coding: utf-8 -*-
# @UpdataTime : 2022/6/1 16:00
# @Author  : lx

from selenium import webdriver

class Browser():
    def __init__(self, **kwargs):
        # TODO： update your executablePath
        executablePath = r"chromedriver.exe"
        self.executablePath = kwargs.get("executablePath",executablePath )
        options = webdriver.ChromeOptions()
        self.browser = webdriver.Chrome(executable_path=self.executablePath, chrome_options=options)
        self.browser.get('https://www.douyin.com')

    def search_item(self, keyword):
        doc = self.browser.execute_script('''
            function queryData(url) {
               var p = new Promise(function(resolve,reject) {
                   var e={
                           "url":"https://www.douyin.com/aweme/v1/web/search/item/?device_platform=webapp&aid=6383&channel=channel_pc_web&search_channel=aweme_video_web&sort_type=0&publish_time=0&keyword=%s&search_source=normal_search&query_correct_type=1&is_filter_search=0&from_group_id=&offset=0&count=10&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Chrome&browser_version=102.0.5005.63&browser_online=true&engine_name=Blink&engine_version=102.0.5005.63&os_name=Windows&os_version=10&cpu_core_num=8&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50&webid=7097114192884565534",
                           "method":"GET"
                         };
                    var h = new XMLHttpRequest;
                    h.open(e.method, e.url, true);
                    h.setRequestHeader("accept","application/json, text/plain, */*");  
                    h.setRequestHeader("salute-by","lx");  
                    h.setRequestHeader("content-type","application/json;charset=UTF-8");
                    h.onreadystatechange =function() {
                         if(h.readyState === 4 && h.status  ===200) {
                             resolve(h.responseText);
                         } else {}
                    };
                    h.send(null);
                    });
                    return p;
                }
            var p1 = queryData('lx');
            res = Promise.all([p1]).then(function(result){
                    return result
            })
            return res
        ''' % (keyword))
        return doc[0]

    def close(self):
        self.browser.close()
        self.browser.quit()


browser = Browser()
# 注意：如果没打印内容，把url换成自己浏览器上的。还不行就在控制台上执行js看是否有误。
# 版本 102.0.5005.63（正式版本） （64 位）
print(browser.search_item('爬虫逆向进阶实战'))
print(browser.search_item('RPC'))
print(browser.search_item('案例'))
print(browser.search_item('教程'))
print(browser.search_item('公众号'))
print(browser.search_item('pythonlx'))
browser.close()
```

---

## 执行结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/f7602589b1334435a6c0b2a7df2d502c.png)


