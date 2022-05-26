var exports = undefined
  , module = undefined
  , Image = function Image() {}
  , PluginArray = function PluginArray() {}
  , indexedDB = {}
  , DOMException = function DOMException() {}
  , WebSocket = function WebSocket() {}
  , Request = function Request() {}
  , Headers = function Headers() {};
var localStorage = {
    getItem: function getItem(x) {return null},
    removeItem: function removeItem(x) {}
};
var sessionStorage = {
    getItem: function getItem(x) {return null},
    removeItem: function removeItem(x) {}
};
var MimeType = {
    description: "Native Client Executable",
    suffixes: "",
    type: "application/x-nacl"
};
MimeType[Symbol.toStringTag] = "MimeType";
var navigator = {
    plugins: {
        0: {
            0: MimeType,
            name: "Native Client",
            length: 2,
            filename: "internal-nacl-plugin",
            description: "",
            length: 1
        }
    },
    webdriver: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36",
    languages: ["zh-CN", "zh"],
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36",
    platform: "Win32"
};
navigator.plugins[0]["application/x-nacl"] = MimeType;
navigator.plugins[0].__proto__.item = function item() {
    return MimeType
};
navigator.plugins[Symbol.toStringTag] = "PluginArray";
navigator.plugins[0][Symbol.toStringTag] = "Plugin";
navigator.plugins[0][0].enabledPlugin = navigator.plugins[2];
var CanvasRenderingContext2D_ = {
    toString: function() {
        return "[object CanvasRenderingContext2D]"
    }
};
CanvasRenderingContext2D_.__proto__.fillText = function fillText() {}
;
CanvasRenderingContext2D_.__proto__.arc = function arc() {}
;
CanvasRenderingContext2D_.__proto__.stroke = function stroke() {}
;
var getContext_ = {
    toString: function() {
        return "[object WebGLRenderingContext]"
    }
};
var aaaaa=0;
var canvas = {
    toDataURL: function toDataURL() {
        if(aaaaa=0){
            aaaaa=aaaaa+1
            return "[native code]"
        }
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAACN0lEQVRIS8WWP0hWYRTGf98S5NBSm5sObgWt6RJR5uLQIGRC1OAWNEspOAWCIIR+4GYFDg1NEoEQ5tIghFNbBIlDLi5Bi/LIOXA8vu/1Q76v7nLvff+c9zzPc55zb4vT11F612vLxjTnz4Vl/3xoCHhaSsgTzQlncL0EcxV4C9xLtLSB58Af4AyAEvu+Pyf7P9S4BdwG5i2pogIl1mMJRUJ6qUCux8vAIvAeeABM24J2idm8ueaBCHYSmDJ2XgLPgO+Axt8AGnPmFF/srQM3PJFQGiUzKc5AIcYZDzQpoMAlH0jaLyGRHeAmsAI8BN4BrwIor28B2gac3S2r+wxAyY8YwL7kjaICnTCe2Rc7m3ay6rQfOAQ+AL+BpQAgAnZlYpIyqC4HKpBRPQfYaGKBcLbjs7fVOOcHaU4HvQZmgfvADHAtAfASiqAygBeAgGr8oNKgiwA82Xj30inNzVlwv+tQHb4MXDdAOigmqy2+zhMsKRCZjn7x8Ucqp2jiWhvNCkRCZNDPwKoNemI/gDWr8Qjgp3UTdZGPgeEagAzUz3bf/DqvFTb1e83tA6PAtwBAho7JRQBaNgZ8NaXOU0BqylvyQb4Ud66mQKce+ATcDZHdoLFt1hQ4KQHb26SAPDVhbblRgfwLEdkvzYn9J8BGxWTdGs7fDI87LGWyAtmosev43BVrkT7XrUQvFKfkgUvA30o0Sb0A6KfKO8+FDu7WphKAceCxfYD27Hsw" + mu_() + "AAAAAElFTkSuQmCC"
    },
    getContext: function getContext(x) {
        if (x === "2d") {
            return CanvasRenderingContext2D_
        } else {
            return getContext_
        }
    }
};
canvas[Symbol.toStringTag] = "HTMLCanvasElement";
canvas.getContext[Symbol.toStringTag] = "WebGLRenderingContext";
getContext_.__proto__.getExtension = function getExtension(x) {
    return {
        UNMASKED_RENDERER_WEBGL: 37446,
        UNMASKED_VENDOR_WEBGL: 37445
    }
}
;
getContext_.__proto__.getParameter = function getParameter(x) {
    return "Google Inc. (Intel)/ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.8681)"
}
;
var location = {
    href: "https://www.douyin.com/",
    toString: function() {
        return location.href
    },
    protocol: "https:"
};
var document = {
    createEvent: function createEvent() {},
    location: location,
    cookie: "",
    vlinkColor: "",
    referrer: "",
    fgColor: "",
    dir: "",
    addEventListener: function addEventListener(x) {},
    createElement: function createElement(x) {
        return canvas
    }
};
document.createElement[Symbol.toStringTag] = "HTMLImageElement";
var history = {
    length: 1,
    scrollRestoration: "auto",
    state: null
};
var upload = {
    onabort: null,
    onerror: null,
    onload: null,
    onloadend: null,
    onloadstart: null,
    onprogress: null,
    ontimeout: null
};
upload[Symbol.toStringTag] = "XMLHttpRequestUpload";
var XMLHttpRequest = function() {
    this.onabort = null,
    this.onerror = null,
    this.onload = null,
    this.onloadend = null,
    this.onloadstart = null,
    this.onprogress = null,
    this.onreadystatechange = null,
    this.ontimeout = null,
    this.readyState = 0,
    this.response = "",
    this.responseText = "",
    this.responseType = "",
    this.responseURL = "",
    this.responseXML = null,
    this.status = 0,
    this.statusText = "",
    this.timeout = 0,
    this.upload = upload,
    this.withCredentials = false
};
XMLHttpRequest.prototype.open = function() {
    function ee() {
        this.openArgs = arguments
    }
    function Vn(e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n)
            return e;
        var r, o, i = n.call(e), a = [];
        try {
            for (; (void 0 === t || t-- > 0) && !(r = i.next()).done; )
                a.push(r.value)
        } catch (e) {
            o = {
                error: e
            }
        } finally {
            try {
                r && !r.done && (n = i.return) && n.call(i)
            } finally {
                if (o)
                    throw o.error
            }
        }
        return a
    }
    ;function a() {
        for (var t = [], n = 0; n < arguments.length; n++)
            t[n] = arguments[n];
        var r = Vn(t, 2)
          , o = r[0]
          , i = r[1];
        return this._url = i || "",
        this._method = o && o.toLowerCase() || "",
        ee.apply(this, t)
    }
    ;for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
    return a.apply(this, e)
}
;
XMLHttpRequest.prototype.setRequestHeader = function() {
    function a() {
        for (var t = [], n = 0; n < arguments.length; n++)
            t[n] = arguments[n];
        return this._requestHeaders = this._requestHeaders || [],
        this._requestHeaders.push(t)
    }
    ;for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
    return a.apply(this, e)
}
;
XMLHttpRequest.prototype.send = function() {
    function Wn(e, t) {
        for (var n = 0, r = t.length, o = e.length; n < r; n++,
        o++)
            e[o] = t[n];
        return e
    }
    ;function Vn(e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n)
            return e;
        var r, o, i = n.call(e), a = [];
        try {
            for (; (void 0 === t || t-- > 0) && !(r = i.next()).done; )
                a.push(r.value)
        } catch (e) {
            o = {
                error: e
            }
        } finally {
            try {
                r && !r.done && (n = i.return) && n.call(i)
            } finally {
                if (o)
                    throw o.error
            }
        }
        return a
    }
    ;qr = function(e, t, n) {
        return function() {
            for (var r = [], o = 0; o < arguments.length; o++)
                r[o] = arguments[o];
            if (!e)
                return hr;
            var i = e[t]
              , a = n.apply(void 0, Wn([i], Vn(r)))
              , s = a;
            return Yn(s) && (s = function() {
                for (var e = [], t = 0; t < arguments.length; t++)
                    e[t] = arguments[t];
                try {
                    return a.apply(this, e)
                } catch (t) {
                    return Yn(i) && i.apply(this, e)
                }
            }
            ),
            e[t] = s,
            function(n) {
                n && s !== e[t] || (e[t] = i)
            }
        }
    }
    ;
    function Yn(e) {
        return "function" == typeof e
    }
    ;Jr = function(e) {
        return qr(e, "onreadystatechange", (function(t, n, r, o, i) {
            return function() {
                for (var a = [], s = 0; s < arguments.length; s++)
                    a[s] = arguments[s];
                return 4 === this.readyState && o && o({
                    name: Gr,
                    type: "get",
                    event: Wr(e, n, r, i)
                }),
                t && t.apply(this, a)
            }
        }
        ))
    }
    ;
    n = function(t) {
        r.chechIsReady() ? e.prototype.sendEvent.call(r, t) : r.preQueue.push(t)
    }
    ;
    function ew() {
        var t = this
          , n = this.openArgs
          , r = arguments
          , o = n[0] || "GET"
          , i = new URL(n[1],window.location.href);
    }
    ;function a() {
        for (var i = [], a = 0; a < arguments.length; a++)
            i[a] = arguments[a];
        return Jr(this)({}, null, n, "https://www.douyin.com/"),
        this._start = Date.now(),
        this._data = null == i ? void 0 : i[0],
        ew.apply(this, i)
    }
    ;for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
    return a.apply(this, e)
}
;
XMLHttpRequest.prototype.overrideMimeType = function overrideMimeType() {}
;
XMLHttpRequest.prototype[Symbol.toStringTag] = "XMLHttpRequest";

var window = {
    queueMicrotask: queueMicrotask,
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    TextEncoder: TextEncoder,
    URLSearchParams: URLSearchParams,
    URL: URL,
    WebAssembly: WebAssembly,
    //WeakRef: WeakRef,
    //FinalizationRegistry: FinalizationRegistry,
    Atomics: Atomics,
    SharedArrayBuffer: SharedArrayBuffer,
    isNaN: isNaN,
    isFinite: isFinite,
    eval: eval,
    unescape: unescape,
    escape: escape,
    encodeURIComponent: encodeURIComponent,
    encodeURI: encodeURI,
    decodeURIComponent: decodeURIComponent,
    decodeURI: decodeURI,
    Reflect: Reflect,
    Proxy: Proxy,
    WeakSet: WeakSet,
    WeakMap: WeakMap,
    Set: Set,
    BigInt: BigInt,
    Map: Map,
    DataView: DataView,
    BigInt64Array: BigInt64Array,
    BigUint64Array: BigUint64Array,
    Uint8ClampedArray: Uint8ClampedArray,
    Float64Array: Float64Array,
    Float32Array: Float32Array,
    Int32Array: Int32Array,
    Uint32Array: Uint32Array,
    Int16Array: Int16Array,
    Uint16Array: Uint16Array,
    Int8Array: Int8Array,
    Uint8Array: Uint8Array,
    ArrayBuffer: ArrayBuffer,
    Intl: Intl,
    Math: Math,
    JSON: JSON,
    URIError: URIError,
    TypeError: TypeError,
    SyntaxError: SyntaxError,
    ReferenceError: ReferenceError,
    RangeError: RangeError,
    EvalError: EvalError,
    Error: Error,
    Promise: Promise,
    Date: Date,
    Symbol: Symbol,
    String: String,
    Boolean: Boolean,
    undefined: undefined,
    NaN: NaN,
    Infinity: Infinity,
    parseInt: parseInt,
    parseFloat: parseFloat,
    Number: Number,
    Array: Array,
    Function: Function,
    Object: Object,
    navigator: navigator,
    location: location,
    document: document,
    history: history,
    indexedDB: indexedDB,
    localStorage: localStorage,
    sessionStorage: sessionStorage,
    RegExp: RegExp,
    XMLHttpRequest: XMLHttpRequest,
    fetch: function fetch() {return "[native code]"},
    console: console,
    HTMLElement: function HTMLElement() {},
    chrome: {
        "app": {
            "isInstalled": false,
            "InstallState": {
                "DISABLED": "disabled",
                "INSTALLED": "installed",
                "NOT_INSTALLED": "not_installed"
            },
            "RunningState": {
                "CANNOT_RUN": "cannot_run",
                "READY_TO_RUN": "ready_to_run",
                "RUNNING": "running"
            }
        },
        "runtime": {
            connect: function connect() {return "[native code]"},
            "OnInstalledReason": {
                "CHROME_UPDATE": "chrome_update",
                "INSTALL": "install",
                "SHARED_MODULE_UPDATE": "shared_module_update",
                "UPDATE": "update"
            },
            "OnRestartRequiredReason": {
                "APP_UPDATE": "app_update",
                "OS_UPDATE": "os_update",
                "PERIODIC": "periodic"
            },
            "PlatformArch": {
                "ARM": "arm",
                "ARM64": "arm64",
                "MIPS": "mips",
                "MIPS64": "mips64",
                "X86_32": "x86-32",
                "X86_64": "x86-64"
            },
            "PlatformNaclArch": {
                "ARM": "arm",
                "MIPS": "mips",
                "MIPS64": "mips64",
                "X86_32": "x86-32",
                "X86_64": "x86-64"
            },
            "PlatformOs": {
                "ANDROID": "android",
                "CROS": "cros",
                "LINUX": "linux",
                "MAC": "mac",
                "OPENBSD": "openbsd",
                "WIN": "win"
            },
            "RequestUpdateCheckStatus": {
                "NO_UPDATE": "no_update",
                "THROTTLED": "throttled",
                "UPDATE_AVAILABLE": "update_available"
            }
        }
    }
};
window[Symbol.toStringTag] = "Window";
navigator[Symbol.toStringTag] = "Navigator";
location[Symbol.toStringTag] = "Location";
document[Symbol.toStringTag] = "HTMLDocument";
history[Symbol.toStringTag] = "History";
indexedDB[Symbol.toStringTag] = "IDBFactory";
localStorage[Symbol.toStringTag] = "Storage";
sessionStorage[Symbol.toStringTag] = "Storage";
Object.prototype.constructor.getOwnPropertyNames = function(x) {
    if (toString.call(x) == "[object Navigator]") {
        return []
    } else {
        return Object.keys(x)
    }
}

function mu_() {
    var e = [];
    var a = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var b = 0; b < 28; b++) {
        e[b] = a[Math.floor(Math.random() * a.length)]
    }
    ;return e.join('')
}

Object.freeze(navigator);
Object.freeze(document);
Object.freeze(location);
Object.freeze(history);
Object.freeze(indexedDB);
Object.freeze(localStorage);
Object.freeze(sessionStorage);

