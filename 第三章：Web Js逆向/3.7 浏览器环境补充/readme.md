# 背景

## 一、什么是“补环境”？

在 JavaScript 逆向中，“补环境”指的是**在非浏览器环境中模拟或还原浏览器运行 JavaScript 所需的上下文环境**，以便能够让目标 JavaScript 脚本正常执行。

简单来说，就是**构建一个浏览器的“假环境”**，让被逆向的 JS 代码以为它是在浏览器中运行，从而可以顺利执行并输出我们需要的结果。

所以“补环境”是 WebJS 逆向中的核心技能之一，它是连接爬虫与前端加密逻辑的重要桥梁。

掌握补环境技术，不仅可以提升逆向分析能力，还能帮助开发者更好地理解浏览器机制和 JS 执行原理。

---

## 二、为什么需要“补环境”？

JavaScript 代码通常是在浏览器环境中运行的，依赖于浏览器提供的各种全局对象（如 `window`、`document`、`navigator`）和内置函数（如 `fetch`、`XMLHttpRequest`、`setTimeout`）等。

但当我们使用 Node.js、Python 的 `execjs`、`Pyppeteer`、`Playwright` 或者一些沙盒工具来执行网页中的 JS 代码时，这些环境并不具备浏览器完整的执行上下文，导致 JS 代码无法正常运行，甚至直接报错。

---

## 三、补环境的原理

JavaScript 是一种动态语言，其运行依赖于当前的执行环境。在浏览器中，JS 代码可以访问一系列全局对象和函数，比如：

*   `window`
    
*   `document`
    
*   `location`
    
*   `navigator`
    
*   `history`
    
*   `localStorage`
    
*   `sessionStorage`
    
*   `XMLHttpRequest`
    
*   `fetch`
    
*   `setTimeout` / `setInterval`
    

在非浏览器环境中，这些对象和函数可能缺失或功能不全。补环境的核心原理就是：

1.  **手动或自动模拟缺失的全局对象和函数**
    
2.  **拦截和重写关键函数，使其返回预期结果**
    
3.  **绕过环境检测机制（如 navigator.webdriver、proto 等）**
    

---

## 四、补环境的常见方法

### 1. 手动补环境

适用于小型 JS 代码或对性能要求不高的场景。

**示例：**

```javascript
// 手动补 window 和 document
var window = {};
var document = {
    cookie: "",
    createElement: function() {
        return {};
    }
};
```

### 2. 使用浏览器模拟工具（如 Puppeteer、Playwright）

这些工具启动一个无头浏览器，自动提供完整的执行环境，适合需要复杂交互的场景。

```javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const result = await page.evaluate(() => {
        return someFunction(); // 在浏览器环境中执行
    });
    console.log(result);
    await browser.close();
})();
```

### 3. 使用沙盒工具 + 环境模拟库（如 jsdom、happy-dom）

这些库可以在 Node.js 环境中模拟 DOM 和浏览器 API。

```javascript
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.window = dom.window;
global.document = dom.window.document;
```

### 4. 使用逆向工具（如 Hook、调试器）

在补环境时，可以使用调试器（如 Chrome DevTools、Frida、Hook.js）来动态分析 JS 代码，找出关键函数和环境检测点，进行模拟或绕过。

---

## 五、补环境的难点

1.  **环境检测复杂化**：网站可能使用多重检测手段，如 `Function.toString()`、`Proxy`、`WebAssembly` 等。
    
2.  **依赖浏览器特性**：某些 JS 代码依赖浏览器渲染引擎（如 Canvas、WebGL）生成特定值。
    
3.  **性能问题**：使用 Puppeteer 等完整浏览器模拟时，资源消耗较大。
    
4.  **加密代码混淆**：JS 代码被混淆后难以理解，补环境难度加大。
    
