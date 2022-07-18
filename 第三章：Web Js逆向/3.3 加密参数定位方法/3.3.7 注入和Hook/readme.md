参数定位工具的下载地址在代码库中。

下载地址：https://pan.baidu.com/s/1OmMiE4rJrTNwarw3EJbz0A?pwd=thyl

---

下面是一些常用的Js Hook代码。

## Hook setInterval
```js
let _setInterval=setInterval;
        setInterval=function(a,b){
            if(a.toString().indexOf("debugger")!=-1){
                return null;
            }
            _setInterval(a,b);
}        
```


## Hook header
```js
var header_old = window.XMLHttpRequest.prototype.setRequestHeader;
window.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
    if (key=='k'){
        console.log(key, value)
        debugger;
    }
    if (key=='token'){
        console.log(key, value)
        debugger;
    }
    
    return header_old.apply(this, arguments);
}
```


## Hook Cookie Info


```javascript
var cookie_cache = document.cookie;
        Object.defineProperty(document, 'cookie', {
            get: function() {
                console.log('Getting cookie');
                return cookie_cache;
            },
            set: function(val) {
                console.log('Setting cookie', val);
                var cookie = val.split(";")[0];
                var ncookie = cookie.split("=");
                var flag = false;
                var cache = cookie_cache.split("; ");
                cache = cache.map(function(a){
                    if (a.split("=")[0] === ncookie[0]){
                        flag = true;
                        return cookie;
                    }
                    return a;
                })
                cookie_cache = cache.join("; ");
                if (!flag){
                    cookie_cache += cookie + "; ";
                }
                this._value = val;
                return cookie_cache;
            },
        });
        
```


## Hook Json Info

```javascript
var my_stringify = JSON.stringify;
        JSON.stringify = function (params){
            console.log("json_stringify:", params);
            return json_stringify(params);
        };

        var my_parse = JSON.parse;
        JSON.parse = function (params){
            console.log("json_parse:", params);
            return json_parse(params);
        };
        
```

## Hook WebSocket Info
```javascript
WebSocket.prototype.senda = WebSocket.prototype.send;
        WebSocket.prototype.send = function (data){
         console.info("Hook WebSocket", data);
         return this.senda(data)
        }
        
```

## Hook Cookie
```js
(function() {
    'use strict';
    var cookie_cache = document.cookie;
    Object.defineProperty(document, 'cookie', {
        get: function() {
            // console.log(cookie_cache);
            return cookie_cache;
        },
        set: function(val) {
            if (val.indexOf('gdxidpyhxdE') != -1){
                console.log('cookie',val)   
                debugger;
            }
            var cookie = val.split(";")[0];
            var ncookie = cookie.split("=");
            var flag = false;
            var cache = cookie_cache.split(";");
            cache = cache.map(function(a){
                if (a.split("=")[0] === ncookie[0]){
                    flag = true;
                    return cookie;
                }
                return a;
            })
            cookie_cache = cache.join(";");
            if (!flag){
                cookie_cache += cookie + ";";
            }
        },
    });

})();

```

## Hook XHR

```javascript
// 代码作者：掘金tager
// xhr中的方法拦截，eg: open、send etc.
function hookFunction(funcName, config) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    // 将open参数存入xhr, 在其它事件回调中可以获取到。
    if (funcName === 'open') {
      this.xhr.open_args = args
    }
    if (config[funcName]) {
      console.log(this, 'this')
      // 配置的函数执行结果返回为true时终止调用
      var result = config[funcName].call(this, args, this.xhr)
      if (result) return result;
    }
    return this.xhr[funcName].apply(this.xhr, arguments);
  }
}

// xhr中的属性和事件的拦截
function getterFactory(attr, config) {
  return function () {
    var value = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
    var getterHook = (config[attr] || {})["getter"]
    return getterHook && getterHook(value, this) || value
  }
}
// 在赋值时触发该工厂函数（如onload等事件）
function setterFactory(attr, config) {
  return function (value) {
    var _this = this;
    var xhr = this.xhr;
    var hook = config[attr]; // 方法或对象
    this[attr + "_"] = value;
    if (/^on/.test(attr)) {
      // note：间接的在真实的xhr上给事件绑定函数
      xhr[attr] = function (e) {
        // e = configEvent(e, _this)
        var result = hook && config[attr].call(_this, xhr, e)
        result || value.call(_this, e);
      }
    } else {
      var attrSetterHook = (hook || {})["setter"]
      value = attrSetterHook && attrSetterHook(value, _this) || value
      try {
        // 并非xhr的所有属性都是可写的
        xhr[attr] = value;
      } catch (e) {
        console.warn('xhr的' + attr + '属性不可写')
      }
    }
  }
}

// 核心拦截的handler
function xhrHook(config) {
  // 存储真实的xhr构造器, 在取消hook时，可恢复
  window.realXhr = window.realXhr || XMLHttpRequest
  // 重写XMLHttpRequest构造函数
  XMLHttpRequest = function () {
    var xhr = new window.realXhr()
    // 真实的xhr实例存储到自定义的xhr属性中
    this.xhr = xhr
    // note: 遍历实例及其原型上的属性（实例和原型链上有相同属性时，取实例属性）
    for (var attr in xhr) {
      if (Object.prototype.toString.call(xhr[attr]) === '[object Function]') {
        this[attr] = hookFunction(attr, config); // 接管xhr function
      } else {
        // attention: 如果重写XMLHttpRequest，必须要全部重写，否则在ajax中不会触发success、error（原因是3.x版本是在load事件中执行success）
        Object.defineProperty(this, attr, { // 接管xhr attr、event
          get: getterFactory(attr, config),
          set: setterFactory(attr, config),
          enumerable: true
        })
      }
    }
  }
  return window.realXhr
}

// 解除xhr拦截，归还xhr管理权
function unXhrHook() {
  if (window[realXhr]) XMLHttpRequest = window[realXhr];
  window[realXhr] = undefined;
}

// 执行部分
xhrHook({
  open: function (args, xhr) {
    console.log("open called!", args, xhr)
     // return true // 返回true将终止请求，这个就是常规拦截的精髓了
  },
  setRequestHeader: function (args, xhr) {
    console.log("setRequestHeader called!", args, xhr)
         },
  onload: function (xhr) {
    // 对响应结果做处理
    this.responseText += ' tager'
  }
})

```
