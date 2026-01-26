# 快手app抓包

快手app版本8+往后使用的quic协议。QUIC 基于 UDP 传输、多数代理工具不支持，且快手用 Aegon 库强制 QUIC、同时叠加证书校验与代理绕过机制，导致常规代理抓包失效。

最常用的解决方法是将app的quic协议降级成http/https协议。

## 背景

快手的 QUIC 逻辑全部封装在自研的 `Aegon` 网络库中。

1.  把快手 APK 拖入 Jadx-Gui，等待反编译完成；
    
2.  在 Jadx 的搜索框（快捷键 Ctrl+Shift+F）输入关键词 `Aegon`，会看到大量以 `com.kuaishou.aegon` 为包名的类；
    
3.  优先查看 `Aegon` 主类（即 `com.kuaishou.aegon.Aegon`），这是网络库的入口类。
    
4.  在 Aegon 类中找 QUIC 相关方法。打开 包含 `quic` 关键词的方法 / 字段；，包含 `config`（配置）、`update`（更新）的方法（因为 QUIC 的开启 / 关闭是通过配置更新实现的）。
    

很快能看到 `nativeUpdateConfig` 这个方法 —— 名字里的 `native` 说明是 Native 层方法，`UpdateConfig` 说明是更新网络配置，这正是修改 QUIC 开关的核心入口；

查看该方法的参数：通常是一个 String 类型的 JSON 字符串，点进方法引用（右键→Find Usages），能看到调用处传入的 JSON 里包含 `enable_quic` 字段（值为 true/false），坐实这是控制 QUIC 的关键方法。

用 Frida Hook 该方法，然后结合Postern抓包。

Hook 禁用 QUIC 后，为什么还需要结合 Postern 抓包？

核心原因是：Hook 只解决了 QUIC 协议降级的问题，但手机 App 的流量默认不会主动转发到电脑的抓包工具（如 Charles/mitmproxy），Postern 的核心作用是做「系统级流量转发」，让降级后的 HTTP/HTTPS 流量能被抓包工具捕获。

## hook代码

frida 16.0.19  
frida-tools 12.1.2  
夜神 安卓7(32位)  
快手APP 9.2  
Postern 3.1.2

```javascript
import frida, sys
jscode = """
Java.perform(
    function () {
        var Aegon = Java.use('com.kuaishou.aegon.Aegon');
        Aegon.nativeUpdateConfig.implementation = function (a,b) {
                    a = '{"enable_quic":false,"preconnect_num_streams":2,"quic_idle_timeout_sec":180,"quic_use_bbr":true,"altsvc_broken_time_max":600,"altsvc_broken_time_base":60,"proxy_host_blacklist":[]}';
                    return this.nativeUpdateConfig(a,b);
        }
    }
);
"""
def on_message(message, data):
    if message['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)
process = frida.get_remote_device()

#pid = process.spawn(['com.kuaishou.nebula']) #  极速
pid = process.spawn(['com.smile.gifmaker']) #   app
session = process.attach(pid)
script = session.create_script(jscode) 
script.on('message',on_message) 
script.load()
process.resume(pid)

```

## Postern

配置代理，代理类型用**socks**  
![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3jV9K6EyOXo/img/ae73d0a7-75b5-4402-961c-a58e1a30e363.png)

配置规则  
![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3jV9K6EyOXo/img/5b136a98-b884-49cb-a19b-0de5bee431ea.png)

---

## 示例

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3jV9K6EyOXo/img/4094fc45-2d9d-4bc5-ad54-da3419d253ac.png)