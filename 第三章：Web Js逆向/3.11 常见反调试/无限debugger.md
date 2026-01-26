# 无限debugger

`debugger` 是JavaScript中的一个关键字，用于在代码中设置断点。当浏览器的开发者工具开启时，遇到 `debugger` 语句会暂停代码执行，等待用户操作。

**无限** `**debugger**` **的表现：**

*   控制台频繁弹出断点提示
    
*   页面无法正常加载或执行
    
*   手动跳过断点后又立即再次触发
    

**示例代码：**

```javascript
setInterval(function() {
    debugger;
}, 1000);
```

或者更隐蔽的方式：

```javascript
function loopDebug() {
    while (true) {
        debugger;
    }
}
loopDebug();
```

---

## 三、绕过无限 `debugger` 的方法

### 方法一：禁用所有断点

**Chrome / Edge / Firefox 浏览器：**

1.  打开开发者工具（F12）
    
2.  在“Sources”或“Debugger”面板中找到“Deactivate breakpoints”按钮（通常是一个断点图标或“暂停”图标）
    
3.  点击按钮（或使用快捷键 `Ctrl + F8` / `Cmd + F8`），禁用所有断点
    

> 此方法可以临时跳过所有断点，包括 `debugger` 语句。

---

### 方法二：覆盖 `debugger` 语句（控制台注入代码）

由于 `debugger` 是语言关键字，不能直接覆盖。但可以尝试使用调试器忽略断点执行：

1.  打开开发者工具
    
2.  在“Sources”面板找到触发 `debugger` 的脚本
    
3.  在 `debugger` 行号左侧点击，取消该行的断点
    
4.  或者右键选择“Never pause here”（Chrome）
    

---

### 方法三：使用“黑盒脚本”功能（Blackboxing）

**Chrome / Edge 支持此功能：**

1.  打开开发者工具
    
2.  点击右上角“三个点”菜单 > “Settings”
    
3.  进入 “Debugger” 或 “Blackboxing” 选项卡
    
4.  添加你想忽略调试的脚本文件或使用正则匹配
    
5.  浏览器将不再在这些文件中暂停（包括 `debugger`）
    

> 适用于已知触发无限 `debugger` 的脚本文件路径。

---

### 方法四：使用浏览器扩展绕过

可以使用浏览器插件来自动屏蔽某些脚本或修改网页行为：

*   **Tampermonkey:** 自定义hook脚本
    

*   **uBlock Origin：**屏蔽特定脚本加载
    
*   **Debugger Auto Continue**：自动跳过断点
    
*   **AntiBebug Breaker**: 绕过无限Debugger
    

**示例：使用 Tampermonkey 脚本跳过** `**debugger**`

```javascript
// ==UserScript==
// @name         Skip Debugger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  跳过无限 debugger
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 覆盖 setInterval（可选）
    const origSetInterval = window.setInterval;
    window.setInterval = function(func, delay) {
        if (func.toString().includes("debugger")) {
            console.log("Blocked setInterval with debugger");
            return null;
        }
        return origSetInterval.apply(this, arguments);
    };

    // 其他绕过方式可继续添加
})();
```
---

**示例：hook Function 原型构造函数， 修改debugger** 

```javascript

Function.prototype.temp_constructor= Function.prototype.constructor;
Function.prototype.constructor=function(){
    if (arguments && typeof arguments[0]==="string"){
        if (arguments[0]==="debugger")
        return ""
    }
    return Function.prototype.temp_constructor.apply(this, arguments);
};

// hook setInterval 定时器函数 替换debugger
_setInterval = setInterval
setInterval = function setInterval(code, time){
    console.log(code, time)
    code = code.toString().replace(/debugger/, "").replace(/function ()/, "function xxx")
    return _setInterval(new Function(code) , time)
}
_setTimeout = setTimeout
setTimeout = function setTimeout(code, time){
    console.log(code, time)
    code = code.toString().replace(/debugger/, "").replace(/function ()/, "function xxx")
    return _setTimeout(new Function(code), time)
}

```
---

### 方法五：使用火狐浏览器（推荐）

使用新版firefox浏览器，选中debugger代码行，取消勾选【在调试语句上暂停】

---

## 五、总结

| 方法 | 说明 | 适用场景 |
| --- | --- | --- |
| 禁用所有断点 | 快速跳过所有断点 | 临时调试 |
| 黑盒脚本 | 忽略特定文件的调试行为 | 精确控制 |
| 使用插件 | 自动屏蔽或跳过 | 高级用户 |
| 注入脚本 | 定制化绕过逻辑 | Tampermonkey 用户 |
| 火狐浏览器 | 在调试语句上暂停 | all in |

---