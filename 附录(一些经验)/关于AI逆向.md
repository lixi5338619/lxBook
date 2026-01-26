当AI从辅助工具升级为逆向执行者，以后可能无需人工编写代码、分析汇编，即可完成静态解析+动态调试+算法复现全流程。

我们作为指挥者把控方向，要有不被AI误导的能力。


# AI逆向JS-动态前瞻

## Js-reverse-mcp

[https://github.com/zhizhuodemao/js-reverse-mcp](https://github.com/zhizhuodemao/js-reverse-mcp)

[https://blog.csdn.net/2503\_90751789/article/details/156801378](https://blog.csdn.net/2503_90751789/article/details/156801378)

一个改进自chrome-devtools-mcp，专属于js逆向的 MCP 服务器，让 AI 助手（如 Claude、Cursor、Copilot）能够断点调试和分析网页中的 JavaScript 代码。

**功能特点**

*   脚本分析: 列出所有加载的 JS 脚本，搜索代码，获取源码
    
*   断点调试: 设置/移除断点，支持条件断点，支持在压缩代码中精确定位
    
*   函数追踪: Hook 任意函数（包括模块内部函数），监控调用和返回值
    
*   执行控制: 暂停/恢复执行，单步调试（step over/into/out）
    
*   运行时检查: 在断点处求值表达式，检查作用域变量
    
*   网络分析: 查看请求发起的调用栈，设置 XHR 断点
    
*   事件监控: 监控 DOM 事件，检查存储数据
    

## AI\_JS\_DEBUGGER

[https://github.com/Valerian7/AI\_JS\_DEBUGGER](https://github.com/Valerian7/AI_JS_DEBUGGER)

[https://www.bilibili.com/video/BV1kPXGYVEkj](https://www.bilibili.com/video/BV1kPXGYVEkj)

项目是基于Chrome开发者协议(CDP)的AI自动化JavaScript逆向分析工具，通过AI自动调试前端JS，自动分析加解密算法、密钥等，自动生成分析报告以及mitmproxy脚本。

**功能特点**

*   支持固定js文件断点、XHR请求断点
    
*   XHR回溯，XHR模式下自动回溯顶层调用堆栈并自动断点
    
*   根据调用堆栈、js片段、作用域等断点调试信息自动调试
    
*   使用js hook获取AES、RSA等常见加密密钥/密文/明文
    
*   自动分析加解密算法、密钥、生成密钥方式等
    
*   生成分析报告以及mitmproxy脚本
    
*   web界面操作，多个自定义参数配置，简单高效


# AI逆向app-动态前瞻
## 关键工具（MCP生态工具链）
- 静态分析：APKLab（反编译 APK）、IDA-MCP（SO 层代码解析）；
- 动态调试：ADB-MCP（安装 APK 到设备）、FRIDA-MCP（Hook 关键函数）；
- AI 能力：自动识别调用链、解析加密逻辑、生成 Hook 脚本与请求复现代码，支持多 AI 交叉验证（如 CLAUDE CODE）。


## 执行流程
- 抓包与准备：获取接口参数，如app_sign为核心分析目标；

- Java 层调用链解析：AI 自动定位签名生成的业务通路 ——如从A.process()构造请求头，到A.appSign()发起调用，最终通过 JNI 反射调用A.gNative()（native方法）；

- So 层算法拆解：使用 IDA-MCP 分析libA.so，AI 识别关键函数（如Java_gNative），明确签名“密钥 + 盐 + 参数处理 + 算法”逻辑；

- 动态 Hook 验证：通过 FRIDA-MCP 注入脚本，获取运行时关键数据（如未登录态密钥、盐前缀），验证静态分析的不确定性（如参数排序、URL 参与形式）；

- 算法复现与请求验证：AI 根据分析结果生成 Python 脚本，实现app_sign签名的自动化生成，复现接口请求并验证通过。
