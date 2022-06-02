本文案例是飞瓜APP的Sign参数分析和生成。

> 声明：文章内容仅供参考学习，如有侵权请联系作者进行删除。
> 付费订阅的是整个[《签名逆向合集》](https://blog.csdn.net/weixin_43582101/category_11192755.html)。




@[toc]

---

## 接口分析

观察后发现，同一时间请求的不同接口，Sign是相同的。
![在这里插入图片描述](https://img-blog.csdnimg.cn/bffc2f59cfbe48df86290354ac705d64.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_15,color_FFFFFF,t_70,g_se,x_16)
API："http://appapi.feigua.cn/api/v1/live/liveRealtimeRoomDataV3?page=1&pattern=2&pageSize=5"

headers:
```
{
	Platform	Android
	Imei	161174e6-6db5-42e9-8569-63f815042db1
	Version	148-1.4.8
	LoginType	
	LoginId	
	ts	1647493831
	Sign	198C5C37675D494DAEDCE494389300C6
	Host	appapi.feigua.cn
	Accept-Encoding	gzip
	User-Agent	okhttp/3.12.0
	Connection	keep-alive
}
```

---

## 参数定位

定位比较简单
![在这里插入图片描述](https://img-blog.csdnimg.cn/6850476423314c68960f0da7390d8bd5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)

点进去看看

![在这里插入图片描述](https://img-blog.csdnimg.cn/26127cba5e9341e6a2033aead464d485.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)
builder2.addHeader("Sign", HttpConstant.m22288a(hashMap, d, sb3.toString()));

先看看参数

sb3 =  System.currentTimeMillis() / 1000;

String d = SharedPreferencesUtils.m22806b(MyApplication.m22275b()).m22809d(SessionId);

再看一下 HttpConstant.m22288a
![在这里插入图片描述](https://img-blog.csdnimg.cn/d97f51f59e614caa84975abe72006bf1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)

就是把stringBuffer 各种拼接、排序处理后， md5一下。 
![在这里插入图片描述](https://img-blog.csdnimg.cn/3674c0cf44b9473dac5356ba7c99dc36.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_18,color_FFFFFF,t_70,g_se,x_16)

java代码很简单，静态分析结束，为了保险起见，hook md5看看参数吧。

---

## Hook调试
![在这里插入图片描述](https://img-blog.csdnimg.cn/4b9877f7f99542cf864de903c3893058.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)
Frida代码：
```python
# -*- coding: utf-8 -*-
# @Author  : lx
# @IDE ：PyCharm
import frida, sys
def on_message(message, data):
    print("[%s] => %s" % (message, data))

session = frida.get_usb_device().attach('com.feigua.androiddy')

js_code = '''
    Java.perform(
        function(){
                console.log("1. start hook");
                var ba = Java.use("com.feigua.androiddy.d.i");
                if (ba != undefined) {
                    console.log("2. find class");
                    ba.a.implementation = function(a1){
                        console.log("3. hook method");
                        console.log(a1);
                        var res = ba.a(a1);
                        console.log(res);
                        return res
                        }
                }
        }
    )
'''
script = session.create_script(js_code)
script.on('message', on_message)
script.load()
sys.stdin.read()


```

接着先看是不是正常的MD5，经对比一样的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8eaf4183380e4479a05e3886e28881db.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_17,color_FFFFFF,t_70,g_se,x_16)



分析完了，拿python还原一下。

---

## python还原
Imei 可以不带 ，代码如下：

```python
# -*- coding: utf-8 -*-
# @Time    : 2022/3/17 13:28
# @Author  : lx
# @IDE ：PyCharm

import requests
import time
import hashlib
headers = {
    "Platform":"Android",
    # "Imei":"161174e6-6db5-42e9-8569-63f815042db1",
    "Version":"148-1.4.8",
    "LoginType":"",
    "LoginId":"",
    "Host":"appapi.feigua.cn",
    "Accept-Encoding":"gzip",
    "User-Agent":"okhttp/3.12.0",
    "Connection":"keep-alive",
}

def get_md5(string):
    m = hashlib.md5()
    m.update(string.encode())
    return m.hexdigest()

ts = str(round(time.time()))

# 最好直接根据key从小到大 排序
item = {
    "page":"1",
    "pagesize":"5",
    "pattern":"2",
    "platform":"Android",
    "ts":ts
 }

params=sorted(item.items(),key=lambda x:x[0])
sb = "CCd35181!!6445btrrtBBertert==="
for p in params:
    sb += "&"
    sb += f'{p[0]}={p[1]}'
print(sb)
sign = get_md5(sb).upper()
print(sign)
headers.update({"ts":ts})
headers.update({"Sign":sign})
res = requests.get("http://appapi.feigua.cn/api/v1/live/liveRealtimeRoomDataV3?page=1&pattern=2&pageSize=5",headers=headers)
print(res.text)

```

好了，到这里就结束了。

