



## 基本命令
|命令  | 简介 |
|--|--|
|adb devices  |列出设备  |
|adb connect 127.0.0.1:62001	|连接设备(注意端口)|
|adb shell	|进入shell|
|adb kill-server	|关闭服务|
|adb start-server	|启动服务|
|adb reboot	|重启设备|
|adb forward tcp:27042 tcp:27042	|端口转发|
|adb shell dumpsys activity top	|查看apk包名|
|frida-ls-devices	|列出所有连接到电脑上的设备|
|frida-ps -U	|列出正在运行的进程|
|frida-ps -Uai	|列出安装的程序|
|frida-ps -Ua	|列出运行中的程序|
|frida-ps -D "设备id"	|连接frida到个指定的设备|
|frida-trace -U -f Name -i "函数名"|	跟踪某个函数|
|frida-trace -U -f Name -m "方法名"	|跟踪某个方法|
|frida -U -l *.js "进程ID"	|加载Js脚本|
|frida-discover -n Name	|发现程序内部函数|
|frida-discover -p pid	|发现程序内部函数|
|frida-kill -U | "进程ID"	|结束进程|


## Hook 一般函数

```javascript
var MyClass = Java.use('xx.xx.MainActivity');
MyClass.myMethod.implementation = function (arg) {
    var ret = this.myMethod(arg);
    console.log('Done:' + arg);
    return ret;
}
```


## Hook 重载函数
```javascript
myClass.myMethod.overload("java.lang.String").implementation = function(param1){
console.log(param1);
}

myClass.myMethod.overload("[B","[B").implementation = function(param1,param2) {
const p1 = Java.use("java.lang.String").$new(param1);
const p2 = Java.use("java.lang.String").$new(param2);
}

myClass.myMethod.overload("android.context.Context", "boolean").implementation = function(param1, param2){
   //do something 
}
```


## Hook 构造函数

```javascript
const StringBuilder = Java.use('java.lang.StringBuilder');
StringBuilder.$init.overload('java.lang.String').implementation = function (arg) {
    var partial = "";
    var result = this.$init(arg);
    if (arg !== null) {
         partial = arg.toString().slice(0,10);
    }
    console.log('new StringBuilder("' + partial + '");');
    return result;
};


StringBuilder.$init.overload('[B', 'int').implementation = function (arg1,arg2,) {
  //do something 
}
```


## Hook 成员方法
```javascript
Java.perform(
    function(){
            var ba = Java.use("com.xx.xx.xx").$new();
            if (ba != undefined) {
                ba.mdthod.implementation = function (a1) {
                //do something 
            }
        }
    }
)
```

## Hook 内部类

```javascript
var inInnerClass = Java.use('ese.xposedtest.MainActivity$inInnerClass');
// 类路径$内部类名
inInnerClass.methodInclass.implementation = function(arguments){
    var arg0 = arguments[0];
    var arg1 = arguments[1];
    send("params1: "+ arg0 +" params2: " + arg1);
    return this.formInclass(1,"Frida");
}
```


## Hook native函数
```javascript
function hookNativeFun(callback, funName, moduleName) {
    var time = 1000;
    var address = Module.findExportByName(moduleName, funName);
    if (address == null) {
        setTimeout(hookNativeFun, time, callback, funName, moduleName);
} 
else {
        console.log(funName + "hook result")
        var nativePointer = new NativePointer(address);
        Interceptor.attach(nativePointer, callback);
    }
}
```


## 从内存中主动调用Java方法
```javascript
Java.perform(
    function(){
        Java.choose("com.xx.xx.xx", {
        onMatch: function (x) {
            ba.signInternal.implementation = function(a1,a2) {
            result= x.method(a1,a2);
            },
        onComplete: function () {
            }
        })
    }
)
```


## 获取所有已加载的类名

```javascript
Java.perform(function(){
    Java.enumerateLoadedClasses({
        onMatch: function(className) {
            send(className);},
        onComplete:function(){
            send("done");
        }
    });
});
```


## 获取方法名

```javascript
function getMethodName() {
    var ret;
    Java.perform(function() {
        var Thread = Java.use("java.lang.Thread")
        ret = Thread.currentThread().getStackTrace()[2].getMethodName();
    });
    return ret;
}
```


## 打印堆栈信息

```javascript
function showStacks() {
    Java.perform(function() {
        console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
    });
}
```

## 打印类所有方法名

```javascript
function enumMethods(targetClass) {
    var ret;
    Java.perform(function() {
            var hook = Java.use(targetClass);
            var ret = hook.class.getDeclaredMethods();
            ret.forEach(function(s) {
                console.log(s);
            })
    })
    return ret;
}
```


## 构造 context

```js
var current_application = Java.use('android.app.ActivityThread').currentApplication();
var context = current_application.getApplicationContext();

```


## Hook NO_Proxy
```js
Java.perform(function(){
    console.log("1 start hook");
    try {
        var URL = Java.use('java.net.URL')
        URL.openConnection.overload('java.net.Proxy').implementation = function (arg1){
            return this.openConnection()
        }
    } catch (e) {
        console.log('' + e)
    }
    try {
        var Builder = Java.use('okhttp3.OkHttpClient$Builder')
        var mybuilder = Builder.$new()
        Builder.proxy.overload('java.net.Proxy').implementation = function (arg1) {
            return mybuilder
        }
    }   catch (e) {
        console.log('' + e)
    }
```




## Hook HashMap-put

```javascript
var hashMap = Java.use("java.util.HashMap");
hashMap.put.implementation = function (a, b) {
    // 不行可换 a.equals("username")
    if (a=="username") {
     console.log("hashMap.put: ", a, b);
        printStacks();
 }
 return this.put(a, b);
}
```

## Hook ArrayList-add

```javascript
var arrayList = Java.use("java.util.ArrayList");
arrayList.add.overload('java.lang.Object').implementation = function (a) {
    if (a == "username") {
        console.log("arrayList.add: ", a);
        showStacks();  // 打印堆栈信息
    }
    //console.log("arrayList.add: ", a);
    return this.add(a);
}
arrayList.add.overload('int', 'java.lang.Object').implementation = function (a, b) {
    console.log("arrayList.add: ", a, b);
    return this.add(a, b);
}
```

## Hook TextUtils-isEmpty

```javascript
// 判断输入框是否为空
var textUtils = Java.use("android.text.TextUtils");
textUtils.isEmpty.implementation = function (a) {
    if (a == "TURJNk1EQTZNREE2TURBNk1EQTZNREE9") {
        console.log("textUtils.isEmpty: ", a);
        printStacks();

    }
    //console.log("textUtils.isEmpty: ", a);
    return this.isEmpty(a);
}
```

## hook Base64-encodeToString

```javascript
var base64 = Java.use("android.util.Base64");
base64.encodeToString.overload('[B', 'int').implementation = function (a, b) {
    console.log("base64.encodeToString: ", JSON.stringify(a));
    var result = this.encodeToString(a, b);
    console.log("base64.encodeToString result: ", result)
    printStacks();
    return result;
}
```



## okhttp3 rpc
```javascript
rpc.exports = {
    request_url: function (url) {
        return new Promise(function(resolve, reject) {
            Java.perform(function () {
                var OkHttpClient=Java.use("okhttp3.OkHttpClient");
                var Builder=Java.use("okhttp3.Request$Builder");
                var client = OkHttpClient.$new()
                var request = Builder.$new().get().url(url).build()
                var response = client.newCall(request).execute()
                resolve(response.body().string())
            });
        });
    }
};


```

## okhttp3 GET
```javascript
function okhttp3_get(url, headers_str){
    let body = null;
    Java.perform(() => {
        const BuilderClazz = Java.use('okhttp3.Request$Builder');
        const OkHttpClientClazz = Java.use('okhttp3.OkHttpClient');
        try{
            let builder = BuilderClazz.$new();
            builder = builder.url(url);
            if(headers_str != null && headers_str != ''){
                let headers = JSON.parse(headers_str);
                for(let key in headers){
                    builder = builder.addHeader(key, headers[key]);
                }
            }
            let request = builder.build();
            if(!okhttp3_client){
                okhttp3_client = OkHttpClientClazz.$new();
            }
            let call = okhttp3_client.newCall(request);
            let response = call.execute();
            body = response.body().string();
        }catch(e){
            console.error(e);
        }
    });
    return body;
}

```

## okhttp3 POST

```javascript
function okhttp3_post(url, headers_str, media_type, body){
    let ret = null;
    Java.perform(() => {
        const BuilderClazz = Java.use('okhttp3.Request$Builder');
        const OkHttpClientClazz = Java.use('okhttp3.OkHttpClient');
        const MediaTypeClazz = Java.use('okhttp3.MediaType');
        const RequestBodyClazz = Java.use('okhttp3.RequestBody');
        try{
            let builder = BuilderClazz.$new();
            builder = builder.url(url);
            if(headers_str != null && headers_str != ''){
                let headers = JSON.parse(headers_str);
                for(let key in headers){
                    builder = builder.addHeader(key, headers[key]);
                }
            }
            let m_type = MediaTypeClazz.parse(media_type);
            let request_body = RequestBodyClazz.create(m_type, body);
            builder = builder.post(request_body);
            let request = builder.build();
            if(!okhttp3_client){
                okhttp3_client = OkHttpClientClazz.$new();
            }
            let call = okhttp3_client.newCall(request);
            let response = call.execute();
            ret = response.body().string();
        }catch(e){
            console.error(e);
        }
    });
    return ret;
}

```

