常被检测的环境中，有windows、location、navigate、document、native、canvas等。

除了这些属性外，还有针对于自动化的检测、node环境的检测、以及浏览器指纹检测、TLS指纹校验等。

所谓的补环境是指在Node环境中去运行浏览器的代码，因为Node环境和浏览器环境是不同的，比如DOM渲染和浏览器内置方法，而经常需要补的内容也是这些。

笔者总结的补环境有两种方式，一是在本地Node中扣代码补环境，二是通过驱动开启一个浏览器环境去执行代码，但是需要记得补驱动的特征。

不过最优的方法还是在本地补，所以这里简单分享一些补的方法和代码。

---

3.7.0 中给出的几个文件是笔者准备的一些工具类，笔者自己写的和收集于网络的都贴上来。

由于这块内容不太好总结，环境并不是通用的。用文字来描述的话，要么贴已经补过的代码，要么贴一键hook的脚本。

虽然每次补之前直接把各种环境堆上去碰运气也是一种方法，但是碰到独特的检测点等于直接从0开始。

毕竟刚开始都是打着debugger缺啥补啥，大家先掌握那些基本的语法。


---

所以先知道怎么补之后，再来决定用什么方法获取对象的属性或方法。

```js
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
```


比如给document补一些方法

```js
var document = {
    createEvent: function createEvent() {},
    addEventListener: function addEventListener(x) {},
    createElement: function createElement(x) {
        if(x===""){} else {}
    }
};
```

比如给 getLX_method 对象增加方法。
```js
var getLX_method = {};
getLX_method.__proto__.getExtension = function getExtension(x) {
    return {}
}
getLX_method.__proto__.getParameter = function getParameter(x) {
    return ""
}
```

比如补 canvas 的话，我们只需要看它调用的方法和返回的结果，然后去一次性绘制图片，取出base64值放到toDataURL()中即可。

```js
document = {
	createElement: function createElement(x) {
		return canvas
	}
};

canvas = {
	toDataURL: function toDataURL() {
		return "data:image/png;base64,i.....ggg=="
	},
	getContext: function getContext(x) {
        if (x === "xxx") {
            return 
        } else {
            return CanvasContext 
        }
	}
};

CanvasContext = {
	arc: function arc() {},
	stroke: function stroke() {},
	fillText: function fillText() {},
	toString: function() {
        return "[object]"
    }
};

canvas[Symbol.toStringTag] = "HTMLCanvasElement";
```

重写String的查找方法
```js
	var _indexOf = String.prototype.indexOf;
	String.prototype.indexOf = function (searchValue, fromIndex) {
	if (searchValue == 'lx') {
		return-1;
}
	return _indexOf.apply(this, [searchValue, fromIndex]);
}
```

重写toString方法：
```js
var newString = Function.prototype.toString;
	Function.prototype.toString = function () {
		if (this == Window || this == Location || this == Function.prototype.toString) {
		return"function Window() { [native code] }";
	}
	return newString.apply(this);
};
```



再给大家分享一些补环境经验：

1、检测环境记心里，指纹信息重获取。

2、dom操作记一记，Jsdom多练习。

3、不可变对象记得Object.freeze()

4、多用debugger巧用proxy

5、内置方法防重写

6、形成框架方便二次修改







---

**大家把目录中的Js文件熟悉之后，可以找我领一份JS环境框架**
- 1、文件太多，上传很麻烦
- 2、框架只提供给《爬虫逆向进阶实战》的读者
- 3、微信、QQ、私信找我都可以
