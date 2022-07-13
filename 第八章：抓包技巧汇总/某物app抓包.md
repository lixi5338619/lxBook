
## 环境准备
模拟器夜神安卓7版本。配合charles的抓包步骤：[http://t.csdn.cn/lpNaV](http://t.csdn.cn/lpNaV)

模拟器需要是64位的，在商店下载推荐版本时会提示更新。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3339e3d37e9147399616e08c19e3d8fe.png)

安装后，创建64位的模拟器，从商店下载app

![在这里插入图片描述](https://img-blog.csdnimg.cn/30fbb6bb2dfd474b9661eb8e7fcf0d0f.png)

打开后再按要求更新一下，即可成功进入APP。

![在这里插入图片描述](https://img-blog.csdnimg.cn/29547b9260d646e6880c39b2740712a1.png)
更新后的版本：4.95.1.10


---


## No_PROXY抓包

发现搜索后没抓到有用的数据包，但是有其他包，可能这个APP采用了 NO_PROXY 的方式拒绝代理。

![在这里插入图片描述](https://img-blog.csdnimg.cn/bb59ee050f02483f94d3e16c185a14ef.png)

那我们可以采用VPN转发的方式进行测试，如果还不行就需要分析源码进行Hook 或者更换其他类型的抓包工具。

我用 drony 转发并没有成功，所以来分析源码。

![在这里插入图片描述](https://img-blog.csdnimg.cn/6e772c61b28545258f11f51649c2f734.png)
com.shizhuang.duapp.common.net.DuHttpConfig.a

![在这里插入图片描述](https://img-blog.csdnimg.cn/603a420ca40743efaf13674237315a99.png)

在本地进行hook：
```python
import frida, sys

def on_message(message, data):
    print("[%s] => %s" % (message, data))

# dewu  4.95.1.10
session = frida.get_remote_device().attach('com.shizhuang.duapp')

# okhttp3拦截器
js_code2 = """
Java.perform(function(){
    console.log("1 start hook");
    var ba = Java.use('okhttp3.internal.http.RealInterceptorChain');
    if (ba){
        console.log("2 find class");
        ba.proceed.overload('okhttp3.Request').implementation = function(a1){
            console.log("3 find method");
            console.log(a1);
            return ba.proceed(a1)
        }
    }
})
"""

js_code1 = """
Java.perform(function(){
    console.log("1 start hook");
    var ba = Java.use('com.shizhuang.duapp.common.helper.net.interceptor.HttpRequestInterceptor').$new();
    if (ba){
        console.log("2 find class");
        ba.intercept.implementation = function(a1){
            console.log("3 find method");
            console.log(a1);
            return ba.intercept(a1)
        }
    }
})
"""



script = session.create_script(js_code1)
script.on('message', on_message)
script.load()
sys.stdin.read()
```

找到 com.shizhuang.duapp.modules.mall_search.api.ProductService.searchProductNew()
![在这里插入图片描述](https://img-blog.csdnimg.cn/106d31369bae4d949e23e3adb85cc39b.png)

