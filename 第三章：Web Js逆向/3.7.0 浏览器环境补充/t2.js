// jsdom
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello Lx</p>`);
window = global;
var document = dom.window.document;
var params = {
    location:{
        hash: "",
        host: "",
        hostname: "",
        href: "",
        protocol: "",
        search: "",
    },
    navigator:{
        appCodeName: "Mozilla",
        appName: "Netscape",
        appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
        cookieEnabled: true,
        deviceMemory: 8,
        hardwareConcurrency: 4,
        language: "zh-CN",
        onLine: true,
        platform: "MacIntel",
        product: "Gecko",
        productSub: "20030107",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
        vendor: "Google Inc."
    },
    screen:{
        availHeight: 728,
        availLeft: 0,
        availTop: 0,
        availWidth: 1366,
        colorDepth: 24,
        height: 768,
        pixelDepth: 24,
        width: 1366
    }
};
Object.assign(window,params);

window.document = document;

// Js代码位置

function get_signature(url) {
    _signature = "";
    return _signature
}

   
console.log(get_signature(url));
