常被检测的环境中，有windows、location、navigate、document、native、canvas等。

除了这些属性外，还有针对于自动化的检测、node环境的检测、以及浏览器指纹检测、TLS指纹校验等。


---

3.7.0 中给出的几个文件等于自己准备的一些工具类。我把自己写的和收集于网络的都贴上来。

这块内容不太好总结，环境并不是通用的。用文字来描述，要么贴已经补过的代码，要么贴一键hook的脚本。

虽然每次补之前直接把各种环境堆上去碰运气也是一种方法，但是碰到独特的检测点等于直接从0开始。

毕竟刚开始都是打着debugger缺啥补啥，大家先掌握那些基本的语法。

document = {
    createElement:function(x){
        return {}
    }
}

var _getXxx = {
    toString: function() {
        return ""
    }
};

_getXxx.__proto__.getA = function getA(x) {
    return {}
};

先知道怎么补之后，再来决定用什么方法获取对象的属性或方法。

