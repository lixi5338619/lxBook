var lx;
!function (e){
    var report = {};
    function o(n){
        if (report[n])
            return report[n].exports;
        var t = report[n] = {
            i:n,
            l:!1,
            exports:{}
        };
        return e[n].call(t.exports,t,t.exports,o),
        t.l = !0,
        t.exports
    }
    lx = o;
}({
    // 添加webpack模块
    // "method":function(e){}
});
// 调用模块函数
// var t = lx("method");