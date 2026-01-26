# 抖音app抓包

核心逻辑：Hook 抖音网络库 libsscronet.so，修改 QUIC 配置使其降级为 HTTPS。

```javascript
Java.perform(function() {
    const CronetEngine = Java.use("org.chromium.net.CronetEngine");
    // Hook配置构建器，禁用QUIC
    CronetEngine.Builder.prototype.enableQuic.implementation = function(enable) {
        console.log("禁用QUIC: enableQuic(false)");
        return this.enableQuic(false);
    };
    // 备选：Hook native层更新配置
    const Aegon = Java.use("com.bytedance.aegon.Aegon");
    if (Aegon) {
        Aegon.nativeUpdateConfig.implementation = function(configStr) {
            const newConfig = configStr.replace(/"enable_quic":true/, '"enable_quic":false');
            console.log("修改QUIC配置:", newConfig);
            return this.nativeUpdateConfig(newConfig);
        };
    }
});
```