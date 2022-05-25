// 最基础的
var glb;
var window = global;
window.document = {referrer: ""};
window.location = {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "/",
    port: "",
    protocol: "https:",
    search: ""
};
window.navigator = {
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    cookieEnabled: true,
    deviceMemory: 8,
    doNotTrack: null,
    hardwareConcurrency: 4,
    language: "zh-CN",
    languages: ["zh-CN", "zh"],
    maxTouchPoints: 0,
    onLine: true,
    platform: "Win32",
    product: "Gecko",
    productSub: "20030107",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    vendor: "Google Inc.",
    vendorSub: "",
};

function get_signature(url) {
    _signature = "";
    return _signature;
}

// Js代码位置
url = '';
console.log(get_signature(url));
