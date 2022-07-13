本文是大众点评APP的分析记录。

> 声明：文章内容仅供参考学习，如有侵权请联系作者进行删除。

案例环境：夜神安卓5，APP版本10.45.7。 
工具：Frida、Charles。
![在这里插入图片描述](https://img-blog.csdnimg.cn/bbb2c875aef54cf1b5bee513e1b03b14.png)

点评看不到http/https数据包，它走了自己的CIP协议，网上的抓包方案有降级或者VPN转发。 

本文通过hook的方式来抓http/https数据包。


用super-Jadx时内存溢出，我删除了一些无用文件，将dex分批反编译，这块就不再说了。

---


@[toc]

---

##  Hook 抓包
Hook代码：
![在这里插入图片描述](https://img-blog.csdnimg.cn/4540d1a4f36144f99ded43b373154a3b.png)
执行hook脚本后，成功抓到包。
![在这里插入图片描述](https://img-blog.csdnimg.cn/c673c61550f247678b231ea64e569af7.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)

---

## Hook http/https请求信息
Hook代码：
![在这里插入图片描述](https://img-blog.csdnimg.cn/941b3e9fdc4a4706aab31cea068679a4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)
查看执行结果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/042226b04d8d4e799893a19354f181c8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)



---

## Hook 明文响应内容
Hook代码：
![在这里插入图片描述](https://img-blog.csdnimg.cn/f2058ba38d7e4f49a403a84c500fb5e1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)
查看执行结果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/89e0486d8b704a10a7d10a9887af5d4f.png)
格式化后和设备页面信息对比，发现内容一致。
![在这里插入图片描述](https://img-blog.csdnimg.cn/caa6bc5bd73241c1b6114ab3032576e3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)

---

## Hook 代码整理
```python
import frida, sys
def on_message(message, data):
    print("[%s] => %s" % (message, data))

session = frida.get_usb_device().attach('com.dianping.v1')

js_code = """
Java.perform(function(){
    
    Java.openClassFile("/data/local/tmp/r0gson.dex").load();
    const gson = Java.use('com.r0ysue.gson.Gson');
    
    var c1 = Java.use("com.dianping.nvnetwork.tunnel2.a");
        c1.isSocketConnected.implementation = function () {
        return false;
    }
    
    
    var bb = Java.use("com.dianping.dataservice.mapi.b");
    bb.b.overload('java.lang.String', 'com.dianping.dataservice.mapi.c').implementation = function(a1, a2){
        //console.log("**************************** http start");
        console.log(a1);
        // console.log('a2:', a2);
        var res = this.b(a1, a2);
        // console.log(res);
        //console.log("**************************** http end");
        return res;
    }
    
    var d = Java.use("com.dianping.dataservice.mapi.impl.d")
    d.a.overload('java.lang.String', 'java.lang.String').implementation = function(a1, a2){
        //console.log("**************************** https start");
        var res = this.a(a1, a2);
        console.log(res);
        //console.log("**************************** https end");
        return res;
    };
    
    
    var c3 = Java.use("com.dianping.picassocontroller.jse.c");
	c3.a.overload('com.dianping.picassocontroller.vc.e', 'java.lang.String', '[Ljava.lang.Object;').implementation = function (a,b,c) {
		console.log('a: ', a);
		console.log('b: ', b);
		console.log('c: ', c);
		var v = this.a(a,b,c)
		console.log(v.string())
	    return v;
	}
	
    //// hook decryptData
    var ByteString = Java.use("com.android.okhttp.okio.ByteString");
    var SocketSecureManager = Java.use("com.dianping.nvnetwork.tunnel.Encrypt.SocketSecureManager");
    SocketSecureManager.decryptData.implementation = function(bstr, str){
       console.log('bstr: ', bstr);
       console.log('bstr-tojson:',gson.$new().toJson(bstr));
       console.log('bstr-hex: ', ByteString.of(bstr).hex());
       console.log('str: ', str);
       var ret = this.decryptData(bstr, str);
       // console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
       console.log('decryptData Results: ', ByteString.of(ret).hex());
       return ret;
    }
    
    
    // var AESUtils = Java.use("com.meituan.android.common.unionid.oneid.util.AESUtils");
    // AESUtils.decrypt.implementation = function(str){
    //     console.log('decrypt is called');
    //     str = "RNtYlL8BsMe4EOqz-X0a1WAw3FwHsr1fdXSOBRnPEF_MiYYvJ1GSqvIIA1NwwTUxuoNWGGueSBRl50pmkidrgdQmVUUScNhW4FpBl1ZFPSyJAz4Zo0PpDNStJnb5JCf8fEe8oDXOCAsptjpuGpRJGClsKeIqe9ph6gAyvYfOk2XafwXbHf4VlsjATDVI7r4f-2s6QQ5Mfc6jvRMyqNdLJNtLwg5XDEmL4Leu7fCnHJbJ46O8hy8MFuN38avBqh6N-2s6QQ5Mfc6jvRMyqNdLJLVj6r8HF-qtkeIznxOc2qXKVyQ4dzMLEBQjCADd9vGF"
    //     var ret = this.decrypt(str);
    //     console.log('decrypt ret value is ' + ret);
    //     return ret;
    // };
  
})
"""

script = session.create_script(js_code)
script.on('message', on_message)
script.load()
sys.stdin.read()

```




