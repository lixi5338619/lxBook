// 从浏览器直接扒各种参数环境的脚本,忘记当时转谁的了，请联系我增加署名

console.log(make_all()) // 使用时候解开该行注释，然后将生成的代码都放到控制台中直接执行，复制生成的字符出即可。
function get_all(){
    function generatecode4v(name_, key, v, o, be_values) {
        if (be_values.indexOf(key) == -1){
            if (typeof (v) == "object") {
                if (v == null) {
                    return `${name_}["${key}"] = null;\r\n`
                }
                if (o == v){
                    return `${name_}["${key}"] = ${name_};\r\n`
                }
                try {
                    return `${name_}["${key}"] = _vPxy(new class ${v.constructor.name}{}, "${key}");\r\n`
                } catch (error) {
                    return `${name_}["${key}"] = "----------------------------------------------------------------";\r\n`
                }
            }
            if (typeof (v) == "string") {
                if (v.indexOf('"') == -1){
                    return `${name_}["${key}"] = "${v}";\r\n`
                }else if (v.indexOf("'") == -1){
                    return `${name_}["${key}"] = '${v}';\r\n`
                }else{
                    return `${name_}["${key}"] = \`${v}\`;\r\n`
                }
            }
            if (typeof (v) == "function") {
                return `${name_}["${key}"] = function ${v.name}(){_vLog('--- func(*) --- ${v.name}');debugger;};   safefunction(${name_}["${key}"]);\r\n`
            }
        }else{
            return `${name_}["${key}"] = ${JSON.stringify(v)};\r\n`
        }
        return `${name_}["${key}"] = ${v};\r\n`
    }
    function generatecode4v1(name_, key, v, o, be_values) {
        if (be_values.indexOf(key) == -1){
            if (typeof (v) == "object") {
                if (v == null) {
                    return `${name_}.__proto__["${key}"] = null;\r\n`
                }
                try {
                    return `${name_}.__proto__["${key}"] = _vPxy(new class ${v.constructor.name}{}, "${key}");\r\n`
                } catch (error) {
                    return `${name_}.__proto__["${key}"] = "----------------------------------------------------------------";\r\n`
                }
            }
            if (typeof (v) == "string") {
                if (v.indexOf('"') == -1){
                    return `${name_}.__proto__["${key}"] = "${v}";\r\n`
                }else if (v.indexOf("'") == -1){
                    return `${name_}.__proto__["${key}"] = '${v}';\r\n`
                }else{
                    return `${name_}.__proto__["${key}"] = \`${v}\`;\r\n`
                }
            }
            if (typeof (v) == "function") {
                return `${name_}.__proto__["${key}"] = function ${v.name}(){_vLog('--- func(*) --- ${v.name}');debugger;};   safefunction(${name_}["${key}"]);\r\n`
            }
            if (name_ == 'document' && key == 'all'){
                return `${name_}.__proto__["${key}"] = undefined;\r\n`
            }
            if (name_ == 'document' && key == 'body'){
                return `${name_}.__proto__["${key}"] = _vPxy(new class HTMLBodyElement{}, "body");\r\n`
            }
        }else{
            return `${name_}.__proto__["${key}"] = ${JSON.stringify(v)};\r\n`
        }
        return `${name_}.__proto__["${key}"] = ${v};\r\n`
    }
    function generate4example(example, name_, skips, be_values) {
        var code = "";
        var protos = {}
        if (typeof (example) == "object" && example.prototype == undefined) {
            for (let key in example.__proto__) {
                protos[key] = true;
            }
            for (let key in example) {
                if (protos[key] == undefined) {
                    if (key && skips.indexOf(key) == -1){
                        try{
                           code += generatecode4v(name_, key, example[key], example, be_values);
                        }catch(e){
                            console.log('========== error ==========')
                            console.log(key)
                            console.log(e)
                        }
                    }
                }
            }
        }
        return alignment_safefunction(alignment(code));
    }
    function generate4Prototype(example, name_, skips, be_values) {
        var code = "";
        if (typeof (example) == "object" && example.prototype == undefined) {
            for (let key in example.__proto__) {
                if (skips.indexOf(key) == -1){
                    try{
                        code += generatecode4v1(name_, key, example[key], example, be_values);
                    }catch(e){
                        console.log('========== error ==========')
                        console.log(key)
                        console.log(e)
                    }
                }
            }
        }
        return alignment_safefunction(alignment(code))
    }
    function alignment(str){
        var max_protolen = 0
        if (str.trim().length == 0){
            return str
        }
        var mch = str.match(/(\["[^"]+"\]) *=/g)
        if (!(mch)){
            return str
        }
        mch.map(function(e){
            if (e.length > max_protolen){
                max_protolen = e.length
            }
        })
        return str.replace(/(\["[^"]+"\]) *=/g, function(_, e){
            return e + Array(max_protolen-e.length-1).fill(" ").join("") + '='
        })
    }
    function alignment_safefunction(str){
        var max_protolen = 0
        if (str.trim().length == 0){
            return str
        }
        var mch = str.match(/(=[^=]+); *safefunction/g)
        if (!(mch)){
            return str
        }
        mch.map(function(e){
            if (e.length > max_protolen){
                max_protolen = e.length
            }
        })
        return str.replace(/(=[^=]+;) *safefunction/g, function(_, e){
            return e + Array(max_protolen-e.length-14).fill(" ").join("") + 'safefunction'
        })
    }
    function vall(example, name_, skips, be_values){
        skips = skips || []
        be_values = be_values || []
        var protostr = generate4Prototype(example, name_, skips, be_values)
        var objectstr = generate4example(example, name_, skips, be_values)
        return protostr + objectstr
    }
    vall.generate4example = generate4example
    vall.generate4Prototype = generate4Prototype
    // placeholder1
}
function make_all(){
    var ret;
    ret = Cilame + '\r\n'
    ret += get_all + '\r\n'
    ret = ret.replace('// placeholder1', `
    console.log(
    Cilame + "\\r\\n" +
    "Cilame()\\r\\n" +
    vall(window,                 "window",               ${JSON.stringify(Cilame())}.concat(['_vLog', '_vPxy','setTimeout', 'setInterval', 'clearInterval', 'clearTimeout'])) +
    vall(document,               "document",             ['cookie', 'addEventListener', 'dispatchEvent', 'removeEventListener', "createElement", "getElementsByName"]) +
    vall(Node.prototype,         "Node.prototype",       ["location", 'addEventListener', 'dispatchEvent', 'removeEventListener']) +
    vall(navigator,              "navigator",            ['connection', 'getBattery', 'mimeTypes'],    ['languages']) +
    vall(window.location,        "window.location") +
    vall(window.localStorage,    "window.localStorage",   ["clear", "getItem", "key", "removeItem", "setItem", "length"]) +
    vall(window.sessionStorage,  "window.sessionStorage", ["clear", "getItem", "key", "removeItem", "setItem", "length"]) +
\`for (let key in navigator.__proto__) {
    navigator[key] = navigator.__proto__[key];
    if (typeof (navigator.__proto__[key]) != "function") {
        navigator.__proto__.__defineGetter__(key, function() {
            debugger ;var e = new Error();
            e.name = "TypeError";
            e.message = "Illegal invocation";
            e.stack = "VM988:1 Uncaught TypeError: Illegal invocation \\\\r\\\\n at <anonymous>:1:19";
            throw e;
        });
    }
}
window                = VmProxyB(window,                "window",               true) // 这三个暂时不打印获取的结果
window.document       = VmProxyB(window.document,       "window.document",      true) // 这三个暂时不打印获取的结果
window.navigator      = VmProxyB(window.navigator,      "window.navigator",     true) // 这三个暂时不打印获取的结果
window.location       = VmProxyB(window.location,       "window.location")
window.localStorage   = VmProxyB(window.localStorage,   "window.localStorage")
window.sessionStorage = VmProxyB(window.sessionStorage, "window.sessionStorage")
window.XMLHttpRequest = VmProxyB(window.XMLHttpRequest, "window.XMLHttpRequest")
window.indexedDB      = VmProxyB(window.indexedDB,      "window.indexedDB")

// 该处用于一些定制的挂钩处理，绕过 Function 或 eval 函数内一些检测使用的，视情况修改
function temp_hookFunc(H){
    eval(\\\`
    _v\\\${H.split('.').pop()} = \\\${H}
    window.\\\${H} = function \\\${H.split('.').pop()}(){
        if (start){
            console.log('-------------------- \\\${H}(*) --------------------')
            console.log(arguments[0])
        }
        if (arguments[0].indexOf('__dirname') != -1 || arguments[0].indexOf('__filename') != -1){
            return function (){}
        }
        return _v\\\${H.split('.').pop()}.apply(this, arguments)
    }
    safefunction(window.\\\${H})
    \\\`)
}
temp_hookFunc('Function')
// hookFunc('Function')

// 目前就使用这样的方式将 setTimeout/setInterval 钩住使用，这两个函数都有点特殊，需要特别关注
window.setTimeout = safefunction(function setTimeout(func, time){ 
    if ((time||0) < 100){  console.log('  [setTimeout] immediately.', func); func() }
    else{ console.log('  [setTimeout] not run. cos interval over 100:', time) }
})
window.setInterval = safefunction(function setInterval(func, time){
    if ((time||0) < 100){ console.log('  [setInterval] immediately (only run once).', func); func() }
    else{ console.log('  [setInterval] not run. cos interval over 100:', time) }
})
hookFunc("clearInterval")
hookFunc("clearTimeout")
hookFunc("Number")
hookFunc("parseFloat")
hookFunc("parseInt")
hookFunc("Symbol")
hookFunc("Error")
hookFunc("ArrayBuffer")
hookFunc("Uint8Array")
hookFunc("Int8Array")
hookFunc("Uint16Array")
hookFunc("Int16Array")
hookFunc("Uint32Array")
hookFunc("Int32Array")
hookFunc("Float32Array")
hookFunc("Float64Array")
hookFunc("Uint8ClampedArray")
hookFunc("BigUint64Array")
hookFunc("BigInt64Array")
hookFunc("decodeURI")
hookFunc("decodeURIComponent")
hookFunc("encodeURI")
hookFunc("encodeURIComponent")
hookFunc("escape")
hookFunc("unescape")
hookFunc("eval")
hookFunc("isFinite")
hookFunc("isNaN")
hookFunc("SharedArrayBuffer")
// 一般这种可以处理 new RegExp(*) 系列的挂钩。
// 如果是直接 /*/ 挂钩不上，不过这种是可以从代码里面明白的找到，这种无法混淆
// 正则的挂钩比较特殊，需要在实例化的时候挂钩上实例对象的函数，所以挂钩处理如下
;(function (){
    var _vRegExp = RegExp
    window.RegExp = function RegExp(){
        var ostart = start
        if (ostart){
            console.log('-------------------- RegExp(*) --------------------')
            console.log(arguments[0])
        }
        start = false
        fakeRegExpObj = _vRegExp.apply(this, arguments)
        _fakeRegExp_test = fakeRegExpObj.test
        fakeRegExpObj.test = safefunction(function test() {
            if (start){
                console.log('-------------------- RegExp.prototype.test(*) --------------------')
                console.log(this+'', '==>', arguments[0])
            }
            return _fakeRegExp_test.apply(this, arguments)
        })
        _fakeRegExp_exec = fakeRegExpObj.exec
        fakeRegExpObj.exec = safefunction(function exec() {
            if (start){
                console.log('-------------------- RegExp.prototype.exec(*) --------------------')
                console.log(this+'', '==>', arguments[0])
            }
            return _fakeRegExp_exec.apply(this, arguments)
        })
        start = ostart
        return fakeRegExpObj
    }
    safefunction(window.RegExp)
})()
// 挂钩 Object 的各种函数
hookFuncObject("Object.assign")
hookFuncObject("Object.getOwnPropertyDescriptor")
hookFuncObject("Object.getOwnPropertyDescriptors")
hookFuncObject("Object.getOwnPropertyNames")
hookFuncObject("Object.getOwnPropertySymbols")
hookFuncObject("Object.is")
hookFuncObject("Object.preventExtensions")
hookFuncObject("Object.seal")
hookFuncObject("Object.create")
hookFuncObject("Object.defineProperties")
hookFuncObject("Object.defineProperty")
hookFuncObject("Object.freeze")
hookFuncObject("Object.getPrototypeOf")
hookFuncObject("Object.setPrototypeOf")
hookFuncObject("Object.isExtensible")
hookFuncObject("Object.isFrozen")
hookFuncObject("Object.isSealed")
hookFuncObject("Object.keys")
hookFuncObject("Object.entries")
hookFuncObject("Object.values")

// 为了保证函数内部的随机函数在一定程度上固定，这里将 random hook 成一个伪随机函数，保证某些函数计算的稳定。
Math.random = (function(seed) {
    return (function random() {
        seed = (seed * 9301 + 49297) % 233280, rnd = seed / 233280.0
        console.log('  [fake Math.random]', rnd)
        return rnd
    })
})(0)
hookFunc("Date.parse")
hookFuncReturn("Date.prototype.valueOf")
hookFuncReturn("Date.prototype.getTime")

start = true  // 主要的 VmProxyB 的log开关
start1 = true // 一些未被实现的 _vPxy(new class Unknown{}) 的 Proxy 打印日志，让输出更清晰







// 这里插入浏览器给你的代码
// $placeholder_code

runloads()








// 这里往后插入你自己的代码，用于导出/编辑自己使用的函数
\`)`)
    ret += '\r\n'
    ret += 'get_all()\r\n// 将生成的代码全部拷贝到 chrome 控制台执行即可'
    return ret
}







// 以下就是就是一个补环境的简单处理，现在还不成熟，后面慢慢补

function Cilame(){
    // 生成一些重要的参数，比如 screen Screen 这种对应的系统对象
    // 这些系统对象原型结构稍微有点绕，统一成下面模式就行
    ;(function(){
        const $toString = Function.toString;
        const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
        const myToString = function() {
            return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
        };
        function set_native(func, key, value) {
            Object.defineProperty(func, key, {
                "enumerable": false,
                "configurable": true,
                "writable": true,
                "value": value
            })
        };
        delete Function.prototype['toString'];
        set_native(Function.prototype, "toString", myToString);
        set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }");
        ;(typeof global=='undefined'?window:global).safefunction = function(func){
            set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
            return func
        };(typeof global=='undefined'?window:global).safefunction_with_name = function(func,name){
            set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,name || ''}() { [native code] }`);
            return func
        };
        function make_constructor(name, Name, name_inject_objs, Name_inject_objs, proto, config){
            config = config !== undefined?config:{}
            var allow_illegal = config['allow_illegal']
            var illegalstr = (!allow_illegal)?'throw new TypeError("Illegal constructor");':''
            var evalstr = `
            var ${name}Constructor = function ${Name=="WindowProperties"?"EventTarget":Name}() { ${illegalstr} }
            safefunction(${name}Constructor);
            var ${name}Prototype = (proto!==undefined?proto:{});
            Object.defineProperties(${name}Prototype, {
                constructor: { value: ${name}Constructor, writable: true, configurable: true },
                [Symbol.toStringTag]: { value: "${Name}", configurable: true }
            });
            ${name}Constructor.prototype = ${name}Prototype;
            var ${Name} = function ${Name}() {}
            safefunction(${Name});
            var ${name} = new ${Name}();
            ${name}.__proto__ = ${name}Prototype;
            __cilame__['n']["${name}"] = ${name}
            __cilame__['N']["${Name}"] = ${Name}
            if (name_inject_objs.length){ name_inject_objs.map(function(e){ Object.defineProperty(e, "${name}", { configurable: true, writable: true, value: ${name} }); }) }
            if (Name_inject_objs.length){ Name_inject_objs.map(function(e){ Object.defineProperty(e, "${Name}", { configurable: true, writable: true, value: ${name}Constructor }); }) }
            `
            eval(evalstr)
        }
        ;(typeof global=='undefined'?window:global).make_constructor = make_constructor
        ;(typeof global=='undefined'?window:global).start = false
        ;(typeof global=='undefined'?window:global).start1 = false
        ;(typeof global=='undefined'?window:global)._vLog = function _vLog(){ if (start1){ 
            console.log.apply(console.log, [].slice.call(arguments))
        }}
        ;(typeof global=='undefined'?window:global).myparselog = function myparselog(V){
            return typeof V=='string'?
                V.length > 100?V.slice(0,100) + '... <DONSHOW MORETHAN 100 LENGTH>':V
            :
            typeof V=='number'?V:
            typeof V=='function'?V:
            typeof V=='undefined'?undefined:
            typeof V=='boolean'?V:
            `<DONTSHOW TYPE:${typeof V}>`
        }
        ;(typeof global=='undefined'?window:global)._vPxy = function(G, M){
            var _vLog = (typeof global=='undefined'?window:global)._vLog || console.log
            function LS(T, M, F){ return `  [UnProxy] ${M}[${T.constructor.name}].(Prxoy)${F} ==>>`} // 未知对象取值处理时的检查操作
            return new Proxy(G, {
                apply:                    function(T, A, L){    _vLog(LS(G, M, 'apply') );                    return Reflect.apply(T, A, L) },
                construct:                function(T, L, N){    _vLog(LS(G, M, 'construct') );                return Reflect.construct(T, L, N) },
                deleteProperty:           function(T, P){       _vLog(LS(G, M, 'deleteProperty'), P);         return Reflect.deleteProperty(T, P) },
                get:                      function(T, P, R){    _vLog(LS(G, M, 'get'), P);                    return Reflect.get(T, P, R) },
                // defineProperty:           function(T, P, A){    _vLog(LS(G, M, 'defineProperty') );           return Reflect.defineProperty(T, P, A) },
                // getOwnPropertyDescriptor: function(T, P){       _vLog(LS(G, M, 'getOwnPropertyDescriptor') ); return Reflect.getOwnPropertyDescriptor(T, P) },
                getPrototypeOf:           function(T){          _vLog(LS(G, M, 'getPrototypeOf') );           return Reflect.getPrototypeOf(T) },
                has:                      function(T, P){       _vLog(LS(G, M, 'has'), P);                    return Reflect.has(T, P) },
                isExtensible:             function(T){          _vLog(LS(G, M, 'isExtensible') );             return Reflect.isExtensible(T) },
                ownKeys:                  function(T){          _vLog(LS(G, M, 'ownKeys') );                  return Reflect.ownKeys(T) },
                preventExtensions:        function(T){          _vLog(LS(G, M, 'preventExtensions') );        return Reflect.preventExtensions(T) },
                set:                      function(T, P, V, R){ _vLog(LS(G, M, 'set'), P, myparselog(V) );    return Reflect.set(T, P, V, R) },
                setPrototypeOf:           function(T, P){       _vLog(LS(G, M, 'setPrototypeOf'), P);         return Reflect.setPrototypeOf(T, P) },
            })
        }
        function logA(tag, G_or_S, objectname, propertyname, value){
            console.table([{tag, G_or_S, objectname, propertyname,value}], ["tag","G_or_S","objectname","propertyname","value"]);
        }
        function logB(tag, GS, objectname, propertyname, value){
            var pro = `[VmProxy] ${tag} ${GS} [${objectname}] "${typeof propertyname=='symbol'?'symbol':propertyname}"`
            var emp = function (n){ return n>0?Array(n).fill('=').join('').replace(/=/g, ' '):'' };
            console.info(pro + emp(70-pro.length), value);
        }
        function VmProxy(logger, object_, titlename, dont_log_value){
            return new Proxy(object_, {
                get (target, property) { 
                    if (start){
                        logger(titlename, "Get >>", target.constructor.name, property, myparselog(target[property]));
                    }
                    return target[property];
                },
                set (target, property, value) {
                    if (start){
                        logger(titlename, "Set <<", target.constructor.name, property, myparselog(value));
                    }
                    target[property] = value;
                }
            });
        };
        var VmProxyA = function (){return VmProxy.apply(this, [logA].concat([].slice.call(arguments)))}
        var VmProxyB = function (){return VmProxy.apply(this, [logB].concat([].slice.call(arguments)))}
        ;(typeof global=='undefined'?window:global).VmProxyA = VmProxyA
        ;(typeof global=='undefined'?window:global).VmProxyB = VmProxyB
        ;(typeof global=='undefined'?window:global).hookFunc = function hookFunc(H){
            eval(`
            _v${H.split('.').pop()} = ${H}
            window.${H} = function ${H.split('.').pop()}(){
                if (start){
                    console.log('-------------------- ${H}(*) --------------------')
                    console.log(myparselog(arguments[0]))
                }
                return _v${H.split('.').pop()}.apply(this, arguments)
            }
            safefunction(window.${H})
            `)
        }
        ;(typeof global=='undefined'?window:global).hookFuncObject = function hookFuncObject(H){
            eval(`
            _v${H.split('.').pop()} = ${H}
            window.${H} = function ${H.split('.').pop()}(){
                if (start){
                    console.log('-------------------- ${H}(*) --------------------')
                    console.log(arguments)
                }
                return _v${H.split('.').pop()}.apply(this, arguments)
            }
            safefunction(window.${H})
            `)
        }
        ;(typeof global=='undefined'?window:global).hookFuncReturn = function hookFuncReturn(H){
            eval(`
            _v${H.split('.').pop()} = ${H}
            window.${H} = function ${H.split('.').pop()}(){
                var v = _v${H.split('.').pop()}.apply(this, arguments)
                if (start){
                    console.log('-------------------- ${H}(*) --------------------')
                    console.log(myparselog(v))
                }
                return v
            }
            safefunction(window.${H})
            `)
        }
    })();
    // 将核心结构初始化，也就是 window navigator document 等初始化处理好
    var __cilame__ = { 'n':{}, 'N':{}, 'c':{} } // 临时存储空间, n 为 new 对象, N 为原始方法.
    var GL = _global = (typeof global=='undefined'?window:global)
    make_constructor("eventTarget", "EventTarget", [], [GL], undefined, { allow_illegal: true })
    EventTarget.prototype.listeners = {};
    EventTarget.prototype.addEventListener = safefunction(function addEventListener(type, callback) {
        console.log('  [addEventListener]', type, callback)
        if(!(type in this.listeners)) { this.listeners[type] = []; }
        this.listeners[type].push(callback);
    })
    EventTarget.prototype.removeEventListener = safefunction(function removeEventListener(type, callback) {
        console.log('  [removeEventListener]', type, callback)
        if(!(type in this.listeners)) { return; }
        var stack = this.listeners[type];
        for(var i = 0, l = stack.length; i < l; i++) { if(stack[i] === callback){ stack.splice(i, 1); return this.removeEventListener(type, callback); } }
    })
    EventTarget.prototype.dispatchEvent = safefunction(function dispatchEvent(event) {
        console.log('  [dispatchEvent]', event)
        if(!(event.type in this.listeners)) { return; }
        var stack = this.listeners[event.type];
        event.target = this;
        for(var i = 0, l = stack.length; i < l; i++) { stack[i].call(this, event); }
    })
    make_constructor("windowProperties",    "WindowProperties", [], [], new EventTarget, { allow_illegal: true })
    make_constructor("window",              "Window", [GL], [GL],       __cilame__['n']['windowProperties']) // WindowProperties 没有注入 window 环境
    window["TEMPORARY"]  = 0;
    window["PERSISTENT"] = 1;
    window = new Proxy(window, {
        get: function(a,b,c){ return a[b] || global[b] },
        set: function(a,b,c){ return a[b] = global[b] = c }
    })
    // window 生成之后将 global 内部的常用函数直接传到 window 里面
    var Gkeys = Object.getOwnPropertyNames(global), exclude = ['global', 'process', '_global']
    for (var i = 0; i < Gkeys.length; i++) {
        if (exclude.indexOf(Gkeys[i]) == -1){ window[Gkeys[i]] = global[Gkeys[i]] }
    }
    var EN = normal_env = [window, GL]
    make_constructor("navigator",   "Navigator",    EN, EN)
    window.clientInformation = navigator
    // 处理 document 初始化
    make_constructor("_vNode",      "Node",         [], EN, new EventTarget)
    make_constructor("_vDocument",  "Document",     [], EN, __cilame__["n"]['_vNode'], { allow_illegal: true })
    make_constructor("document",    "HTMLDocument", EN, EN, __cilame__["n"]['_vDocument'])
    ;(function(){
        'use strict';
        var cookie_cache = document.cookie = "";
        Object.defineProperty(document, 'cookie', {
            get: function() {
                console.log('==>> Get Cookie', cookie_cache);
                return cookie_cache;
            },
            set: function(val) {
                console.log('<<== Set Cookie', val);
                var cookie = val.split(";")[0];
                var ncookie = cookie.split("=");
                var flag = false;
                var cache = cookie_cache.split("; ");
                cache = cache.map(function(a) {
                    if (a.split("=")[0] === ncookie[0]) {
                        flag = true;
                        return cookie;
                    }
                    return a;
                })
                cookie_cache = cache.join("; ");
                if (!flag) {
                    cookie_cache += cookie + "; ";
                }
                return cookie_cache;
            }
        });
        global.init_cookie = function init_cookie(str){
            cookie_cache = str
        }
    })();
    // 处理 location 初始化，以及绑定 document
    make_constructor("location",    "Location",     EN, EN)
    location["ancestorOrigins"] = _vPxy(new (class DOMStringList {}), "location.ancestorOrigins");
    location["assign"]          = function assign(U){  console.log("  [location] assign", U);};  safefunction(location["assign"]);
    location["reload"]          = function reload(){   console.log("  [location] reload");};     safefunction(location["reload"]);
    location["replace"]         = function replace(U){ console.log("  [location] replace", U);}; safefunction(location["replace"]);
    Object.defineProperty(location, 'href', {
        get: function(){
            return location.protocol + "//" + location.host + (location.port ? ":" + location.port : "") + location.pathname + location.search + location.hash;
        },
        set: function(href){
            var a = href.match(/([^:]+:)\/\/([^/:?#]+):?(\d+)?([^?#]*)?(\?[^#]*)?(#.*)?/);
            location.protocol = a[1] ? a[1] : "";
            location.host     = a[2] ? a[2] : "";
            location.port     = a[3] ? a[3] : "";
            location.pathname = a[4] ? a[4] : "";
            location.search   = a[5] ? a[5] : "";
            location.hash     = a[6] ? a[6] : "";
            location.hostname = location.host;
            location.origin   = location.protocol + "//" + location.host + (location.port ? ":" + location.port : "");
        }
    });
    document.location = location
    // 处理 localStorage 和 sessionStorage 的初始化
    function Storage(){}
    Storage.prototype.clear      = function clear(){            console.log('  [Storage] clear');           var self = this; Object.keys(self).forEach(function (key) { self[key] = undefined; delete self[key]; }); }
    Storage.prototype.getItem    = function getItem(key){       var r = (this.hasOwnProperty(key)?String(this[key]):null); console.log('  [Storage] getItem',key,myparselog(r)); return r}
    Storage.prototype.setItem    = function setItem(key, val){  console.log('  [Storage] setItem',key,val); this[key] = (val === undefined)?null:String(val) }
    Storage.prototype.key        = function key(i){             console.log('  [Storage] key',i);           return Object.keys(this)[i||0];} 
    Storage.prototype.removeItem = function removeItem(key){    console.log('  [Storage] removeItem',key);  delete this[key];}  
    safefunction(Storage)
    _storage_obj = new Storage
    // window.localStorage
    make_constructor("localStorage", "Storage", EN, EN, _storage_obj)
    localStorage.__proto__["clear"]      = safefunction(localStorage.__proto__["clear"]);
    localStorage.__proto__["getItem"]    = safefunction(localStorage.__proto__["getItem"]);
    localStorage.__proto__["key"]        = safefunction(localStorage.__proto__["key"]);
    localStorage.__proto__["removeItem"] = safefunction(localStorage.__proto__["removeItem"]);
    localStorage.__proto__["setItem"]    = safefunction(localStorage.__proto__["setItem"]);
    localStorage["__#classType"] = "localStorage";
    Object.defineProperty(localStorage, 'length', { get: function(){ return Object.keys(this).length }, });
    // window.sessionStorage
    make_constructor("sessionStorage", "Storage", EN, EN, _storage_obj)
    sessionStorage.__proto__["clear"]      = safefunction(sessionStorage.__proto__["clear"]);
    sessionStorage.__proto__["getItem"]    = safefunction(sessionStorage.__proto__["getItem"]);
    sessionStorage.__proto__["key"]        = safefunction(sessionStorage.__proto__["key"]);
    sessionStorage.__proto__["removeItem"] = safefunction(sessionStorage.__proto__["removeItem"]);
    sessionStorage.__proto__["setItem"]    = safefunction(sessionStorage.__proto__["setItem"]);
    Object.defineProperty(sessionStorage, 'length', { get: function(){ return Object.keys(this).length }, });
    // navigator.connection
    make_constructor("_vconnect", "NetworkInformation", EN, EN)
    navigator.connection = _vconnect
    navigator.connection.__proto__["onchange"]            = null;
    navigator.connection.__proto__["effectiveType"]       = "4g";
    navigator.connection.__proto__["rtt"]                 = 50;
    navigator.connection.__proto__["downlink"]            = 10;
    navigator.connection.__proto__["saveData"]            = false;
    // window.performance
    make_constructor("performance", "Performance", EN, EN)
    Object.assign(performance, {
        "timeOrigin": 1619098076582.469,
        "timing": {
            "connectStart": 1619098076595,
            "navigationStart": 1619098076582,
            "loadEventEnd": 1619098077273,
            "domLoading": 1619098076680,
            "secureConnectionStart": 0,
            "fetchStart": 1619098076595,
            "domContentLoadedEventStart": 1619098077192,
            "responseStart": 1619098076668,
            "responseEnd": 1619098076878,
            "domInteractive": 1619098077163,
            "domainLookupEnd": 1619098076595,
            "redirectStart": 0,
            "requestStart": 1619098076602,
            "unloadEventEnd": 1619098076678,
            "unloadEventStart": 1619098076678,
            "domComplete": 1619098077272,
            "domainLookupStart": 1619098076595,
            "loadEventStart": 1619098077272,
            "domContentLoadedEventEnd": 1619098077196,
            "redirectEnd": 0,
            "connectEnd": 1619098076595
        },
        "navigation": {
            "type": 0,
            "redirectCount": 0
        }
    })
    make_constructor("_vtiming", "PerformanceTiming", EN, EN)
    make_constructor("_vnavigation", "PerformanceNavigation", EN, EN)
    performance['timing'] = Object.assign(_vtiming, performance['timing'])
    performance['navigation'] = Object.assign(_vnavigation, performance['navigation'])
    // window.chrome
    window.chrome = {
        "app": {
            "isInstalled": false,
            "InstallState": { "DISABLED": "disabled", "INSTALLED": "installed", "NOT_INSTALLED": "not_installed" },
            "RunningState": { "CANNOT_RUN": "cannot_run", "READY_TO_RUN": "ready_to_run", "RUNNING": "running" },
            "getDetails":     safefunction(function getDetails(){     console.log("  [chrome] getDetails")}),
            "getIsInstalled": safefunction(function getIsInstalled(){ console.log("  [chrome] getIsInstalled")}),
            "installState":   safefunction(function installState(){   console.log("  [chrome] installState")}),
        },
        "runtime": {
            "OnInstalledReason":        { "CHROME_UPDATE": "chrome_update", "INSTALL": "install", "SHARED_MODULE_UPDATE": "shared_module_update", "UPDATE": "update" },
            "OnRestartRequiredReason":  { "APP_UPDATE": "app_update", "OS_UPDATE": "os_update", "PERIODIC": "periodic" },
            "PlatformArch":             { "ARM": "arm", "ARM64": "arm64", "MIPS": "mips", "MIPS64": "mips64", "X86_32": "x86-32", "X86_64": "x86-64" },
            "PlatformNaclArch":         { "ARM": "arm", "MIPS": "mips", "MIPS64": "mips64", "X86_32": "x86-32", "X86_64": "x86-64" },
            "PlatformOs":               { "ANDROID": "android", "CROS": "cros", "LINUX": "linux", "MAC": "mac", "OPENBSD": "openbsd", "WIN": "win" },
            "RequestUpdateCheckStatus": { "NO_UPDATE": "no_update", "THROTTLED": "throttled", "UPDATE_AVAILABLE": "update_available" },
            "connect":     safefunction(function connect(){     console.log("  [chrome] connect") }),
            "sendMessage": safefunction(function sendMessage(){ console.log("  [chrome] sendMessage") }),
            "id": undefined,
        }
    }
    // window.indexedDB
    make_constructor("_vDOMStringList", "DOMStringList", [], EN, undefined, { allow_illegal: true})
    make_constructor("_vIDBDatabase", "IDBDatabase", [], EN, undefined, { allow_illegal: true})
    make_constructor("_vIDBOpenDBRequest", "IDBOpenDBRequest", [], EN, undefined, { allow_illegal: true})
    make_constructor("indexedDB", "IDBFactory", EN, EN)
    window.indexedDB.__proto__["cmp"]            = function cmp(){_vLog('--- func(*) --- indexedDB.cmp');debugger;};                       safefunction(window.indexedDB["cmp"]);
    window.indexedDB.__proto__["databases"]      = function databases(){_vLog('--- func(*) --- indexedDB.databases');debugger;};           safefunction(window.indexedDB["databases"]);
    window.indexedDB.__proto__["deleteDatabase"] = function deleteDatabase(){_vLog('--- func(*) --- indexedDB.deleteDatabase');debugger;}; safefunction(window.indexedDB["deleteDatabase"]);
    window.indexedDB.__proto__["open"]           = function open(name){
        var _temp_IDBOpenDBRequest = _vPxy(new IDBOpenDBRequest, 'IDBOpenDBRequest');
        _temp_IDBOpenDBRequest.error = null
        _temp_IDBOpenDBRequest.onblocked = null
        _temp_IDBOpenDBRequest.onerror = null
        _temp_IDBOpenDBRequest.onsuccess = null
        _temp_IDBOpenDBRequest.onupgradeneeded = null
        _temp_IDBOpenDBRequest.readyState = "done"
        _temp_IDBOpenDBRequest.result = _vPxy(new IDBDatabase, 'IDBDatabase')
        _temp_IDBOpenDBRequest.result.name = name
        _temp_IDBOpenDBRequest.result.objectStoreNames = _vPxy(new DOMStringList, 'DOMStringList')
        _temp_IDBOpenDBRequest.result.objectStoreNames.length = 0
        _temp_IDBOpenDBRequest.result.onabort = null
        _temp_IDBOpenDBRequest.result.onclose = null
        _temp_IDBOpenDBRequest.result.onerror = null
        _temp_IDBOpenDBRequest.result.onversionchange = null
        _temp_IDBOpenDBRequest.result.version = 1
        _temp_IDBOpenDBRequest.source = null
        _temp_IDBOpenDBRequest.transaction = null
        return _temp_IDBOpenDBRequest
    }; safefunction(window.indexedDB["open"]);
    // window.XMLHttpRequest
    make_constructor("XMLHttpRequest", "XMLHttpRequest", EN, EN, undefined, { allow_illegal: true })
    XMLHttpRequest.prototype["UNSENT"]                = XMLHttpRequest["UNSENT"]                = 0;
    XMLHttpRequest.prototype["OPENED"]                = XMLHttpRequest["OPENED"]                = 1;
    XMLHttpRequest.prototype["HEADERS_RECEIVED"]      = XMLHttpRequest["HEADERS_RECEIVED"]      = 2;
    XMLHttpRequest.prototype["LOADING"]               = XMLHttpRequest["LOADING"]               = 3;
    XMLHttpRequest.prototype["DONE"]                  = XMLHttpRequest["DONE"]                  = 4;
    XMLHttpRequest.prototype["abort"]                 = function abort(){_vLog('--- func(*) --- XMLHttpRequest.abort');debugger;};                                  safefunction(XMLHttpRequest.prototype["abort"]);
    XMLHttpRequest.prototype["getAllResponseHeaders"] = function getAllResponseHeaders(){_vLog('--- func(*) --- XMLHttpRequest.getAllResponseHeaders');debugger;};  safefunction(XMLHttpRequest.prototype["getAllResponseHeaders"]);
    XMLHttpRequest.prototype["getResponseHeader"]     = function getResponseHeader(){_vLog('--- func(*) --- XMLHttpRequest.getResponseHeader');debugger;};          safefunction(XMLHttpRequest.prototype["getResponseHeader"]);
    XMLHttpRequest.prototype["open"]                  = function open(){_vLog('--- func(*) --- XMLHttpRequest.open');debugger;};                                    safefunction(XMLHttpRequest.prototype["open"]);
    XMLHttpRequest.prototype["overrideMimeType"]      = function overrideMimeType(){_vLog('--- func(*) --- XMLHttpRequest.overrideMimeType');debugger;};            safefunction(XMLHttpRequest.prototype["overrideMimeType"]);
    XMLHttpRequest.prototype["send"]                  = function send(){_vLog('--- func(*) --- XMLHttpRequest.send');debugger;};                                    safefunction(XMLHttpRequest.prototype["send"]);
    XMLHttpRequest.prototype["setRequestHeader"]      = function setRequestHeader(){_vLog('--- func(*) --- XMLHttpRequest.setRequestHeader');debugger;};            safefunction(XMLHttpRequest.prototype["setRequestHeader"]);
    // window.screen
    make_constructor("screen", "Screen", EN, EN)
    screen.__proto__["availWidth"]  = 1920;
    screen.__proto__["availHeight"] = 1040;
    screen.__proto__["width"]       = 1920;
    screen.__proto__["height"]      = 1080;
    screen.__proto__["colorDepth"]  = 24;
    screen.__proto__["pixelDepth"]  = 24;
    screen.__proto__["availLeft"]   = 0;
    screen.__proto__["availTop"]    = 0;
    screen.__proto__["orientation"] = new (class ScreenOrientation {});
    make_constructor("_vorientation", "ScreenOrientation", EN, EN)
    _vorientation.__proto__["angle"]               = 0;
    _vorientation.__proto__["type"]                = "landscape-primary";
    _vorientation.__proto__["onchange"]            = null;
    _vorientation.__proto__["lock"]                = function lock(){debugger;};                safefunction(_vorientation["lock"]);
    _vorientation.__proto__["unlock"]              = function unlock(){debugger;};              safefunction(_vorientation["unlock"]);
    screen["orientation"] = _vorientation
    // Element 元素上面通常存在的 style /CSSStyleDeclaration
    make_constructor("_vCSSStyleDeclaration", "CSSStyleDeclaration", EN, EN)
    function make_style() {
        var style = Object.assign(new __cilame__['N']['CSSStyleDeclaration'], {
            alignContent: "", alignItems: "", alignSelf: "", alignmentBaseline: "", all: "", animation: "", animationDelay: "", animationDirection: "", animationDuration: "", animationFillMode: "", animationIterationCount: "", animationName: "", animationPlayState: "", animationTimingFunction: "", appearance: "", ascentOverride: "", aspectRatio: "", backdropFilter: "",
            backfaceVisibility: "",
            background: "", backgroundAttachment: "", backgroundBlendMode: "", backgroundClip: "", backgroundColor: "", backgroundImage: "", backgroundOrigin: "", backgroundPosition: "", backgroundPositionX: "", backgroundPositionY: "", backgroundRepeat: "", backgroundRepeatX: "", backgroundRepeatY: "", backgroundSize: "", baselineShift: "", blockSize: "", border: "", borderBlock: "", borderBlockColor: "", borderBlockEnd: "", borderBlockEndColor: "", borderBlockEndStyle: "", borderBlockEndWidth: "", borderBlockStart: "", borderBlockStartColor: "", borderBlockStartStyle: "", borderBlockStartWidth: "", borderBlockStyle: "", borderBlockWidth: "", borderBottom: "", borderBottomColor: "", borderBottomLeftRadius: "", borderBottomRightRadius: "", borderBottomStyle: "", borderBottomWidth: "", borderCollapse: "", borderColor: "", borderEndEndRadius: "", borderEndStartRadius: "", borderImage: "", borderImageOutset: "", borderImageRepeat: "", borderImageSlice: "", borderImageSource: "", borderImageWidth: "", borderInline: "", borderInlineColor: "", borderInlineEnd: "", borderInlineEndColor: "", borderInlineEndStyle: "", borderInlineEndWidth: "", borderInlineStart: "", borderInlineStartColor: "", borderInlineStartStyle: "", borderInlineStartWidth: "", borderInlineStyle: "", borderInlineWidth: "", borderLeft: "", borderLeftColor: "", borderLeftStyle: "", borderLeftWidth: "", borderRadius: "", borderRight: "", borderRightColor: "", borderRightStyle: "", borderRightWidth: "", borderSpacing: "", borderStartEndRadius: "", borderStartStartRadius: "", borderStyle: "", borderTop: "", borderTopColor: "", borderTopLeftRadius: "", borderTopRightRadius: "", borderTopStyle: "", borderTopWidth: "", borderWidth: "", bottom: "", boxShadow: "", boxSizing: "", breakAfter: "", breakBefore: "", breakInside: "", bufferedRendering: "", captionSide: "",
            caretColor: "", clear: "", clip: "", clipPath: "", clipRule: "", color: "", colorInterpolation: "", colorInterpolationFilters: "", colorRendering: "", colorScheme: "", columnCount: "", columnFill: "", columnGap: "", columnRule: "", columnRuleColor: "", columnRuleStyle: "", columnRuleWidth: "", columnSpan: "", columnWidth: "", columns: "", contain: "", containIntrinsicSize: "", content: "", contentVisibility: "", counterIncrement: "", counterReset: "", counterSet: "", cssFloat: "", cssText: "", cursor: "", cx: "", cy: "", d: "",
            descentOverride: "", direction: "", display: "", dominantBaseline: "", emptyCells: "", fill: "", fillOpacity: "", fillRule: "", filter: "", flex: "", flexBasis: "", flexDirection: "", flexFlow: "", flexGrow: "", flexShrink: "", flexWrap: "", float: "", floodColor: "", floodOpacity: "", font: "", fontDisplay: "", fontFamily: "", fontFeatureSettings: "", fontKerning: "", fontOpticalSizing: "", fontSize: "", fontStretch: "", fontStyle: "", fontVariant: "", fontVariantCaps: "", fontVariantEastAsian: "", fontVariantLigatures: "", fontVariantNumeric: "", fontVariationSettings: "", fontWeight: "", forcedColorAdjust: "", gap: "", grid: "", gridArea: "", gridAutoColumns: "", gridAutoFlow: "", gridAutoRows: "", gridColumn: "", gridColumnEnd: "", gridColumnGap: "", gridColumnStart: "", gridGap: "", gridRow: "", gridRowEnd: "", gridRowGap: "", gridRowStart: "", gridTemplate: "", gridTemplateAreas: "", gridTemplateColumns: "", gridTemplateRows: "", height: "",
            hyphens: "", imageOrientation: "", imageRendering: "", inherits: "", initialValue: "", inlineSize: "", inset: "", insetBlock: "", insetBlockEnd: "", insetBlockStart: "", insetInline: "", insetInlineEnd: "", insetInlineStart: "", isolation: "", justifyContent: "", justifyItems: "", justifySelf: "", left: "", length: 0, letterSpacing: "", lightingColor: "", lineBreak: "", lineGapOverride: "", lineHeight: "", listStyle: "", listStyleImage: "", listStylePosition: "", listStyleType: "", margin: "", marginBlock: "", marginBlockEnd: "", marginBlockStart: "", marginBottom: "", marginInline: "", marginInlineEnd: "", marginInlineStart: "", marginLeft: "", marginRight: "", marginTop: "", marker: "", markerEnd: "", markerMid: "", markerStart: "", mask: "", maskType: "", maxBlockSize: "", maxHeight: "", maxInlineSize: "", maxWidth: "", maxZoom: "", minBlockSize: "", minHeight: "", minInlineSize: "", minWidth: "", minZoom: "", mixBlendMode: "", objectFit: "",
            objectPosition: "", offset: "", offsetDistance: "", offsetPath: "", offsetRotate: "", opacity: "", order: "", orientation: "", orphans: "", outline: "", outlineColor: "", outlineOffset: "", outlineStyle: "", outlineWidth: "", overflow: "", overflowAnchor: "", overflowWrap: "", overflowX: "", overflowY: "", overscrollBehavior: "", overscrollBehaviorBlock: "", overscrollBehaviorInline: "", overscrollBehaviorX: "", overscrollBehaviorY: "", padding: "", paddingBlock: "", paddingBlockEnd: "", paddingBlockStart: "", paddingBottom: "", paddingInline: "", paddingInlineEnd: "", paddingInlineStart: "", paddingLeft: "", paddingRight: "", paddingTop: "", page: "", pageBreakAfter: "", pageBreakBefore: "", pageBreakInside: "", pageOrientation: "", paintOrder: "", parentRule: null, perspective: "", perspectiveOrigin: "", placeContent: "", placeItems: "", placeSelf: "", pointerEvents: "", position: "", quotes: "", r: "", resize: "", right: "", rowGap: "", rubyPosition: "", rx: "", ry: "", scrollBehavior: "",
            scrollMargin: "", scrollMarginBlock: "", scrollMarginBlockEnd: "", scrollMarginBlockStart: "", scrollMarginBottom: "", scrollMarginInline: "", scrollMarginInlineEnd: "", scrollMarginInlineStart: "", scrollMarginLeft: "", scrollMarginRight: "", scrollMarginTop: "", scrollPadding: "", scrollPaddingBlock: "", scrollPaddingBlockEnd: "", scrollPaddingBlockStart: "", scrollPaddingBottom: "", scrollPaddingInline: "", scrollPaddingInlineEnd: "", scrollPaddingInlineStart: "", scrollPaddingLeft: "", scrollPaddingRight: "", scrollPaddingTop: "", scrollSnapAlign: "", scrollSnapStop: "", scrollSnapType: "", shapeImageThreshold: "", shapeMargin: "", shapeOutside: "", shapeRendering: "", size: "", speak: "", src: "", stopColor: "", stopOpacity: "", stroke: "", strokeDasharray: "", strokeDashoffset: "", strokeLinecap: "", strokeLinejoin: "", strokeMiterlimit: "", strokeOpacity: "", strokeWidth: "", syntax: "", tabSize: "", tableLayout: "", textAlign: "", textAlignLast: "", textAnchor: "", textCombineUpright: "", textDecoration: "", textDecorationColor: "", textDecorationLine: "", textDecorationSkipInk: "", textDecorationStyle: "", textDecorationThickness: "", textIndent: "", textOrientation: "", textOverflow: "", textRendering: "", textShadow: "", textSizeAdjust: "", textTransform: "", textUnderlineOffset: "", textUnderlinePosition: "", top: "", touchAction: "", transform: "", transformBox: "", transformOrigin: "", transformStyle: "", transition: "", transitionDelay: "", transitionDuration: "", transitionProperty: "", transitionTimingFunction: "", unicodeBidi: "", unicodeRange: "", userSelect: "", userZoom: "", vectorEffect: "", verticalAlign: "", visibility: "", whiteSpace: "", widows: "", width: "", willChange: "", wordBreak: "", wordSpacing: "", wordWrap: "", writingMode: "", 
            x: "",
            y: "",
            zIndex: "",
            zoom: "",
        })
        style.__proto__ = safefunction(function(){})
        return style
    }
    // document.createElement ， 这个函数很重要，需要特殊挂钩一下
    var htmlmap = {
        HTMLElement: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rp", "rt", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr"],
        HTMLAnchorElement: ["a"], HTMLAreaElement: ["area"], HTMLAudioElement: ["audio"], HTMLBaseElement: ["base"], HTMLBodyElement: ["body"], HTMLBRElement: ["br"], HTMLButtonElement: ["button"], HTMLCanvasElement: ["canvas"], HTMLDataElement: ["data"], HTMLDataListElement: ["datalist"], HTMLDetailsElement: ["details"], HTMLDialogElement: ["dialog"], HTMLDirectoryElement: ["dir"], HTMLDivElement: ["div"], HTMLDListElement: ["dl"], HTMLEmbedElement: ["embed"], HTMLFieldSetElement: ["fieldset"], HTMLFontElement: ["font"], HTMLFormElement: ["form"], HTMLFrameElement: ["frame"], HTMLFrameSetElement: ["frameset"], HTMLHeadingElement: ["h1", "h2", "h3", "h4", "h5", "h6"], HTMLHeadElement: ["head"], HTMLHRElement: ["hr"], HTMLHtmlElement: ["html"], HTMLIFrameElement: ["iframe"], HTMLImageElement: ["img"], HTMLInputElement: ["input"],
        HTMLLabelElement: ["label"], HTMLLegendElement: ["legend"], HTMLLIElement: ["li"], HTMLLinkElement: ["link"], HTMLMapElement: ["map"], HTMLMarqueeElement: ["marquee"], HTMLMediaElement: [], HTMLMenuElement: ["menu"], HTMLMetaElement: ["meta"], HTMLMeterElement: ["meter"], HTMLModElement: ["del", "ins"], HTMLObjectElement: ["object"], HTMLOListElement: ["ol"], HTMLOptGroupElement: ["optgroup"], HTMLOptionElement: ["option"], HTMLOutputElement: ["output"], HTMLParagraphElement: ["p"], HTMLParamElement: ["param"], HTMLPictureElement: ["picture"], HTMLPreElement: ["listing", "pre", "xmp"], HTMLProgressElement: ["progress"], HTMLQuoteElement: ["blockquote", "q"], HTMLScriptElement: ["script"], HTMLSelectElement: ["select"], HTMLSlotElement: ["slot"],
        HTMLSourceElement: ["source"], HTMLSpanElement: ["span"], HTMLStyleElement: ["style"], HTMLTableCaptionElement: ["caption"], HTMLTableCellElement: ["th", "td"], HTMLTableColElement: ["col", "colgroup"], HTMLTableElement: ["table"], HTMLTimeElement: ["time"], HTMLTitleElement: ["title"], HTMLTableRowElement: ["tr"], HTMLTableSectionElement: ["thead", "tbody", "tfoot"], HTMLTemplateElement: ["template"], HTMLTextAreaElement: ["textarea"], HTMLTrackElement: ["track"], HTMLUListElement: ["ul"], HTMLUnknownElement: [], HTMLVideoElement: ["video"]
    }
    // 临时的 canvas 附加，让 canvas 至少能跑通
    function attach_canvas(ele){
        ele.getContext = safefunction(function getContext(){console.log('  [document.createElement.getContext] []'); 
            var v = _vPxy(new class WebGLRenderingContext{
                createBuffer(){             console.log('    [document.createElement.WebGLRenderingContext.createBuffer]', ...arguments); return _vPxy(new class WebGLBuffer{}, 'WebGLBuffer') }
                createProgram(){            console.log('    [document.createElement.WebGLRenderingContext.createProgram]', ...arguments); return _vPxy(new class WebGLProgram{}, 'WebGLProgram') }
                createShader(){             console.log('    [document.createElement.WebGLRenderingContext.createShader]', ...arguments); return _vPxy(new class WebGLShader{}, 'WebGLShader') }
                fillText(){                 console.log('    [document.createElement.WebGLRenderingContext.fillText]', ...arguments) }
                fillRect(){                 console.log('    [document.createElement.WebGLRenderingContext.fillRect]', ...arguments) }
                bindBuffer(){               console.log('    [document.createElement.WebGLRenderingContext.bindBuffer]', ...arguments) }
                bufferData(){               console.log('    [document.createElement.WebGLRenderingContext.bufferData]', ...arguments) }
                shaderSource(){             console.log('    [document.createElement.WebGLRenderingContext.shaderSource]', ...arguments) }
                compileShader(){            console.log('    [document.createElement.WebGLRenderingContext.compileShader]', ...arguments) }
                attachShader(){             console.log('    [document.createElement.WebGLRenderingContext.attachShader]', ...arguments) }
                linkProgram(){              console.log('    [document.createElement.WebGLRenderingContext.linkProgram]', ...arguments) }
                useProgram(){               console.log('    [document.createElement.WebGLRenderingContext.useProgram]', ...arguments) }
                getAttribLocation(){        console.log('    [document.createElement.WebGLRenderingContext.getAttribLocation]', ...arguments) }
                getUniformLocation(){       console.log('    [document.createElement.WebGLRenderingContext.getUniformLocation]', ...arguments) }
                enableVertexAttribArray(){  console.log('    [document.createElement.WebGLRenderingContext.enableVertexAttribArray]', ...arguments) }
                vertexAttribPointer(){      console.log('    [document.createElement.WebGLRenderingContext.vertexAttribPointer]', ...arguments) }
                uniform2f(){                console.log('    [document.createElement.WebGLRenderingContext.uniform2f]', ...arguments) }
                drawArrays(){               console.log('    [document.createElement.WebGLRenderingContext.drawArrays]', ...arguments) }
                getSupportedExtensions(){   console.log('    [document.createElement.WebGLRenderingContext.getSupportedExtensions]', ...arguments) }
            }, "WebGLRenderingContext")
            v.ARRAY_BUFFER = 34962
            v.STATIC_DRAW = 35044
            v.VERTEX_SHADER = 35633
            v.FLOAT = 5126
            v.canvas = _vPxy(new class HTMLCanvasElement{
                toDataURL(){
                    console.log('  [document.createElement.WebGLRenderingContext.canvas.HTMLCanvasElement.toDataURL]', ...arguments)
                    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC"
                }
            }, "document.createElement.WebGLRenderingContext.canvas.HTMLCanvasElement")
            return v
        })
        ele.toDataURL = safefunction(function toDataURL(){
            return "data:image/png;base64,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"
        })
    }
    document.createElement = safefunction(function createElement(e){
        var ostart = start
        var ostart1 = start1
        if (ostart){ console.log('  [document.createElement]', e) }
        start = false
        start1 = false
        var htmlmapkeys = Object.keys(htmlmap)
        e = e.toLocaleLowerCase()
        for (var i = 0; i < htmlmapkeys.length; i++) {
            if (htmlmap[htmlmapkeys[i]].indexOf(e) != -1){
                var ele = eval(` _vPxy(new class ${htmlmapkeys[i]}{}, "${htmlmapkeys[i]}");`)
                break
            }
        }
        if (!ele){ var ele = eval(` _vPxy(new class HTMLElement{}, "HTMLElement");`) }
        ele.getAttribute           = safefunction(function getAttribute(N){              console.log('  [document.createElement.getAttribute] null',N); return null})
        ele.getAttributeNode       = safefunction(function getAttributeNode(N){          console.log('  [document.createElement.getAttributeNode] null',N); return null})
        ele.getAttributeNames      = safefunction(function getAttributeNames(N){         console.log('  [document.createElement.getAttributeNames] []',N); return []})
        ele.getElementsByClassName = safefunction(function getElementsByClassName(N){    console.log('  [document.createElement.getElementsByClassName] []',N); return []})
        ele.getElementsByTagName   = safefunction(function getElementsByTagName(N){      console.log('  [document.createElement.getElementsByTagName] []',N); return []})
        ele.getElementsByTagNameNS = safefunction(function getElementsByTagNameNS(A,B){  console.log('  [document.createElement.getElementsByTagNameNS] []',A,B); return []})
        if (e == 'canvas'){
            attach_canvas(ele)
        }
        ele.style = make_style()
        start = ostart
        start1 = ostart1
        return ele
    })
    // mimeTypes模拟
    make_constructor("_vPlugin", "Plugin", EN, EN, Array)
    make_constructor("_vMimeType", "MimeType", EN, EN)
    make_constructor("_vMimeTypeArray", "MimeTypeArray", EN, EN, Array)
    _vMimeTypeArray[0] = new __cilame__['N']['MimeType']
    _vMimeTypeArray[0].description = ""
    _vMimeTypeArray[0].enabledPlugin = new __cilame__['N']['Plugin'] 
    _vMimeTypeArray[0].enabledPlugin[0] = _vMimeTypeArray[0]
    _vMimeTypeArray[0].enabledPlugin.description = ""
    _vMimeTypeArray[0].enabledPlugin.filename = "mhjfbmdgcfjbbpaeojofohoefgiehjai"
    _vMimeTypeArray[0].enabledPlugin.length = 1
    _vMimeTypeArray[0].enabledPlugin.name = "Chrome PDF Viewer"
    _vMimeTypeArray[0].suffixes = "pdf"
    _vMimeTypeArray[0].type = "application/pdf"
    _vMimeTypeArray[_vMimeTypeArray[0].type] = _vMimeTypeArray[0]
    _vMimeTypeArray[1] = new __cilame__['N']['MimeType']
    _vMimeTypeArray[1].description = "Portable Document Format"
    _vMimeTypeArray[1].enabledPlugin = new __cilame__['N']['Plugin'] 
    _vMimeTypeArray[1].enabledPlugin[0] = _vMimeTypeArray[1]
    _vMimeTypeArray[1].enabledPlugin.description = "Portable Document Format"
    _vMimeTypeArray[1].enabledPlugin.filename = "internal-pdf-viewer"
    _vMimeTypeArray[1].enabledPlugin.length = 1
    _vMimeTypeArray[1].enabledPlugin.name = "Chrome PDF Viewer"
    _vMimeTypeArray[1].suffixes = "pdf"
    _vMimeTypeArray[1].type = "application/x-google-chrome-pdf"
    _vMimeTypeArray[_vMimeTypeArray[1].type] = _vMimeTypeArray[1]
    _vMimeTypeArray[2] = new __cilame__['N']['MimeType']
    _vMimeTypeArray[2].description = "Native Client Executable"
    _vMimeTypeArray[2].enabledPlugin = new __cilame__['N']['Plugin'] 
    _vMimeTypeArray[2].enabledPlugin[0] = _vMimeTypeArray[2]
    _vMimeTypeArray[2].enabledPlugin[1] = _vMimeTypeArray[3]
    _vMimeTypeArray[2].enabledPlugin.description = ""
    _vMimeTypeArray[2].enabledPlugin.filename = "internal-nacl-plugin"
    _vMimeTypeArray[2].enabledPlugin.length = 2
    _vMimeTypeArray[2].enabledPlugin.name = "Native Client"
    _vMimeTypeArray[2].suffixes = "pdf"
    _vMimeTypeArray[2].type = "application/x-nacl"
    _vMimeTypeArray[_vMimeTypeArray[2].type] = _vMimeTypeArray[2]
    _vMimeTypeArray[3] = new __cilame__['N']['MimeType']
    _vMimeTypeArray[3].description = "Portable Native Client Executable"
    _vMimeTypeArray[3].enabledPlugin = new __cilame__['N']['Plugin'] 
    _vMimeTypeArray[3].enabledPlugin[0] = _vMimeTypeArray[2]
    _vMimeTypeArray[3].enabledPlugin[1] = _vMimeTypeArray[3]
    _vMimeTypeArray[3].enabledPlugin.description = ""
    _vMimeTypeArray[3].enabledPlugin.filename = "internal-nacl-plugin"
    _vMimeTypeArray[3].enabledPlugin.length = 2
    _vMimeTypeArray[3].enabledPlugin.name = "Native Client"
    _vMimeTypeArray[3].suffixes = "pdf"
    _vMimeTypeArray[3].type = "application/x-pnacl"
    _vMimeTypeArray[_vMimeTypeArray[3].type] = _vMimeTypeArray[3]
    Object.defineProperty(_vMimeTypeArray, 'length', { get: function(){ return 4 } })
    navigator.mimeTypes = _vMimeTypeArray
    // 电池信息模拟
    make_constructor("_vBatteryManager", "BatteryManager", EN, EN)
    BatteryManager.prototype['charging']                = true
    BatteryManager.prototype['chargingTime']            = 0
    BatteryManager.prototype['dischargingTime']         = Infinity
    BatteryManager.prototype['level']                   = 1
    BatteryManager.prototype['onchargingchange']        = null
    BatteryManager.prototype['onchargingtimechange']    = null
    BatteryManager.prototype['ondischargingtimechange'] = null
    BatteryManager.prototype['onlevelchange']           = null
    navigator.getBattery = safefunction(function getBattery(){
        var ostart = start
        start = false
        fakePromise = new safefunction_with_name(function Promise(){}, 'Promise') // 这里不用真实的 Promise 主要就是考虑到更好的控制执行流程
        fakePromise.then = safefunction(function then(func){
            EventTarget.prototype.addEventListener('load', function(){
                return func(_vPxy(_vBatteryManager, "BatteryManager"))
            })
        })
        start = ostart
        return fakePromise
    })
    // runloads： 在你添加的js执行完之后，再执行这个用于将 load 内的函数尽数执行
    ;(typeof global=='undefined'?window:global).runloads = function runloads(reverse){
        var loadfuncs = EventTarget.prototype.listeners.load
        var T = '======================================================================='
        if (loadfuncs){
            if (reverse){
                for (var i = loadfuncs.length - 1; i >= 0; i--) { 
                    console.log(`${T} LoadFunc ${loadfuncs[i].name||'UnknownFunc'} ${T}`)
                    loadfuncs[i]() }
            }else{
                for (var i = 0; i < loadfuncs.length; i++) { 
                    console.log(`${T} LoadFunc ${loadfuncs[i].name||'UnknownFunc'} ${T}`)
                    loadfuncs[i]() 
                }
            }
        }
    }
    // 用于生成代码用，在环境中无影响，保留即可
    var nn = Object.keys(__cilame__['n'])
    var NN = Object.keys(__cilame__['N'])
    var AA = ['addEventListener', 'dispatchEvent', 'removeEventListener', 'clientInformation']
    return nn.concat(NN).concat(AA)
}
Cilame()



// console.log(localStorage)
// console.log(localStorage.length)
// console.log(localStorage.getItem("$_fb"))
// console.log(localStorage.removeItem("$_fb"))
// console.log(localStorage.getItem("$_fb"))
// console.log(localStorage)
// console.log(localStorage.setItem("$_fb", "hahaha"))
// console.log(localStorage.getItem("$_fb"))
// console.log(localStorage)







// sessionStorage.__proto__["length"]     = 2;
// sessionStorage.__proto__["clear"]      = function clear(){debugger;};      safefunction(sessionStorage.__proto__["clear"]);
// sessionStorage.__proto__["getItem"]    = function getItem(){debugger;};    safefunction(sessionStorage.__proto__["getItem"]);
// sessionStorage.__proto__["key"]        = function key(){debugger;};        safefunction(sessionStorage.__proto__["key"]);
// sessionStorage.__proto__["removeItem"] = function removeItem(){debugger;}; safefunction(sessionStorage.__proto__["removeItem"]);
// sessionStorage.__proto__["setItem"]    = function setItem(){debugger;};    safefunction(sessionStorage.__proto__["setItem"]);
// sessionStorage["$_cDro"] = "1";
// sessionStorage["$_YWTU"] = "FEQUsSBVzv0QWk6YXiwmU1rTQu5fgYnAS0QCjp2noTZ";
















// console.log(1,window)
// console.log(1,window.constructor)
// console.log(2,window.__proto__)
// console.log(2,window.__proto__.constructor)
// console.log(3,window.__proto__.__proto__)
// console.log(3,window.__proto__.__proto__.constructor)
// console.log(4,window.__proto__.__proto__.__proto__)
// console.log(4,window.__proto__.__proto__.__proto__.constructor)
// console.log()
// console.log(5,navigator)
// console.log(5,navigator.constructor)
// console.log(6,navigator.__proto__)
// console.log(6,navigator.__proto__.constructor)
// console.log(7,navigator.__proto__.__proto__)
// console.log(7,navigator.__proto__.__proto__.constructor)
// console.log()
// console.log(7,document)
// console.log(7,document.constructor)
// console.log(8,document.__proto__)
// console.log(8,document.__proto__.constructor)
// console.log(9,document.__proto__.__proto__)
// console.log(9,document.__proto__.__proto__.constructor)
// console.log(10,document.__proto__.__proto__.__proto__)
// console.log(10,document.__proto__.__proto__.__proto__.constructor)
// console.log(11,document.__proto__.__proto__.__proto__.__proto__)
// console.log(11,document.__proto__.__proto__.__proto__.__proto__.constructor)

