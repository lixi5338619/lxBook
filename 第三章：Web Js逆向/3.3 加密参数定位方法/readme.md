目前主流的定位方法如下

## 全局搜索
适用于：参数名是固定字符串（如`sign`、`token`、`timestamp`、`nonce`），且未被混淆的场景。

**操作步骤**：

1.  打开浏览器开发者工具（F12）→ 切换到`Sources`面板 → 点击左侧搜索图标（Ctrl+Shift+F）；
    
2.  输入目标参数名（如`sign`），选择 “Search in all files”；
    
3.  分析搜索结果：
    
    *   优先看`=` 、`:` 、`push`、`append`等赋值 / 拼接逻辑（如`data.sign = xxx`、`params['sign'] = xxx`）；
        
    *   排除纯注释、日志打印、无关引用的结果；
        
    
4.  实战技巧：
    
    *   若参数名被混淆（如`s`、`_0x123`），可先搜索参数值的特征（比如参数值是 32 位 md5，可搜`md5`、`hash`、`hex`）；
        
    *   搜索时加通配符，如`sign*=`、`*sign:`，缩小范围。
        
    *   加解密可以搜 encrypt、decrypt等关键字。


## XHR追踪
仅适用于：参数出现在 AJAX 请求（XHR/Fetch）中，想知道请求发送前参数是怎么组装的。

## 堆栈调试
适用于：参数由函数调用生成（如sign = generateSign()），想找到generateSign的定义。

## Hook拦截
见hook脚本

## DOM断点

在特定场景下极其好用的方法 —— 尤其当参数生成和**DOM 操作（点击、输入、元素变化）**强相关时，Elements 断点能精准捕捉到触发参数生成的交互逻辑。

### 适用场景

Elements 断点不是通用型方法，但在以下场景中能解决其他方法搞不定的问题：

*   参数由 DOM 交互触发生成（比如点击 “登录” 按钮、输入验证码后生成`sign`参数）；
    
*   参数生成逻辑绑定在 DOM 事件上（如`onclick`、`onchange`、`onsubmit`）；
    
*   页面通过动态修改 DOM（如添加 / 删除节点、修改属性）触发参数组装；
    
*   想找到 “点击按钮后→参数生成→发送请求” 的完整链路。
    

### 断点类型

**Break on subtree modifications:** 目标元素的子节点被添加 / 删除 / 修改时触发

**Break on attribute modifications:** 目标元素的属性（如`value`、`data-sign`、`class`）被修改时触发

**Break on node removal:** 目标元素被从 DOM 树中移除时触发

### 避坑点

1.  **避免过度使用**：仅在参数和 DOM 交互相关时使用，否则会触发大量无关断点（比如页面频繁渲染 DOM）；
    
2.  **区分事件类型**：点击按钮优先看`click`事件，输入内容优先看`input`/`change`事件；
    
3.  **处理异步逻辑**：若参数在事件回调的异步函数中生成（如`setTimeout`、`Promise`），断住后需在调用栈中找异步回调的入口；
    
4.  **注意影子 DOM**：部分页面使用 Shadow DOM（如 Vue/React 的组件），需在 Elements 面板开启 “Show user agent shadow DOM”（设置→Preferences→Elements），才能看到完整 DOM 结构。
    

## 进阶技巧

技巧 1：结合 Event Listeners 面板

断住后，在 Elements 面板右侧找到`Event Listeners`（事件监听器）：

*   筛选目标元素绑定的事件（如`click`、`change`）；
    
*   点击事件后的 “↗” 箭头，直接跳转到事件处理函数的定义位置，快速定位参数生成逻辑。
    

技巧 2：处理动态绑定的事件

若事件是通过`addEventListener`动态绑定（而非`onclick`属性）：

1.  添加 Elements 断点断住后；
    
2.  在调用栈中找`dispatchEvent`、`addEventListener`相关的函数；
    
3.  向上回溯，找到事件回调函数，即为参数生成的入口。
    

技巧 3：配合条件过滤

若 DOM 频繁变化导致断点触发过多：

1.  右键断点→`Edit condition`；
    
2.  输入条件（如`attrName === 'data-sign'`），仅当修改`data-sign`属性时才断住，减少无效断点。


## 内存定位


### 内存漫游助手 ast-hook-for-js-RE

聚焦「执行前 AST 语法树」: https://github.com/JSREI/ast-hook-for-js-RE

ast-hook-for-js-RE（AST 钩子工具）是基于抽象语法树（AST）拦截 的 JS 逆向工具，核心逻辑是：在 JS 代码被 V8 引擎编译执行前，先解析成 AST 语法树，通过修改 / 挂钩 AST 节点（如函数调用、变量赋值、加密 API 调用），实现对加密逻辑的拦截、篡改或还原。

它的核心依赖是 `esprima`（AST 解析）、`estraverse`（AST 遍历）、`escodegen`（AST 还原代码），以及 `frida`（跨平台挂钩），是 JS 逆向中「静态 + 动态结合」的典型工具。

**关键特点**：

*   「前置拦截」：代码还没执行，就先修改语法树，比如把`CryptoJS.encrypt`替换成自定义函数，执行时直接拿到明文参数；
    
*   「后置读取」：代码已经执行，内存中已有完整的执行上下文，只能读取数据，无法修改已执行的逻辑；
    

*   「数据提取」：核心目标是拿到运行时的真实数据（比如混淆代码执行后内存中的密钥），而非修改逻辑；
    

### 推理算法助手 help\_tool

[https://gitcode.com/gh\_mirrors/he/help\_tool](https://gitcode.com/gh_mirrors/he/help_tool)

一款专为加密分析设计的工具，能够帮助用户快速识别和推测出使用的加密算法类型，并尝试解密出明文。

推理算法助手（help\_tool）的核心实现原理围绕**加密算法特征识别、进程内存分析、模型辅助推理**三大核心逻辑展开，结合逆向工程实战场景需求，实现加密算法自动识别与明文还原。

工具内置了主流加密算法（哈希、对称加密、非对称加密）的**特征规则库**，通过分析输入密文的格式、长度、编码特征，初步筛选候选算法。通过**预训练的特征模型**捕捉加密算法的深层特征（而非仅依赖规则），尤其适用于密文格式不标准、部分参数未知（如密钥、IV）的场景。

![image.png](https://i-blog.csdnimg.cn/img_convert/5eb21b2203d04fb474f8fc84a8691eae.png)


### 通俗化理解（友好版）

1.  **推理算法助手**：像「密码破译专家」—— 你给它密文，它通过特征库匹配、扒进程内存，告诉你 “这是 AES 加密，明文是 XXX”，核心是「从密文倒推算法和明文」，不干涉代码执行，只看最终结果。
    
2.  **ast-hook-for-js-RE**：像「代码执行前的安检员」——JS 代码还没跑起来，先把代码拆成 AST 语法树，你可以挂钩加密函数、篡改参数，甚至让加密逻辑失效，核心是「主动控制代码怎么执行」。
