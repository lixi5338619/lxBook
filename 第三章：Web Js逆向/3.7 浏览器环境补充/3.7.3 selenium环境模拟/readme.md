##  补不了就用浏览器

补环境是指用于在**非浏览器环境**下模拟浏览器运行 JavaScript 的工具。但是实在补不出来也不能一直耗着浪费时间，那就不补了，直接用浏览器环境执行代码。

常用方式 playwright+express+核心JS文件，部署一个持久运行的浏览器实例服务，供远程调用执行JS代码。

例如：

```js
/* eslint-disable */
import { createCipheriv } from 'crypto';
import { devices, chromium } from 'playwright-chromium';
const iPhone11 = devices['iPhone 11 Pro'];

import path from 'path';
import { fileURLToPath } from 'url';

function getRandomInt(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const diff = max - min + 1;
  return min + Math.floor(Math.random() * Math.floor(diff));
}

class Signer {
  static instance = null;
  userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  args = [
    '--disable-blink-features',
    '--disable-blink-features=AutomationControlled',
    '--disable-infobars',
    '--window-size=1920,1080',
    '--start-maximized',
  ];
  // Default TikTok loading page
  default_url = 'https://www.tiktok.com/@aisarkhaledd';

  // Password for xttparams AES encryption
  password = 'webapp1.0+202106';

  constructor(default_url, userAgent, browser) {
    if (default_url) {
      this.default_url = default_url;
    }
    if (userAgent) {
      this.userAgent = userAgent;
    }

    if (browser) {
      this.browser = browser;
      this.isExternalBrowser = true;
    }

    this.args.push(`--user-agent='${this.userAgent}'`);

    this.options = {
      headless: true,
      args: this.args,
      ignoreDefaultArgs: ['--mute-audio', '--hide-scrollbars'],
      ignoreHTTPSErrors: true
    };

    this.isInitialized = false;
  }

  static async getInstance() {
    if (!Signer.instance) {
      Signer.instance = new Signer();
      await Signer.instance.init();
    }
    return Signer.instance;
  }

  static async close() {
    if (Signer.instance) {
      await Signer.instance.close();
      Signer.instance = null;
    }
  }

  async init() {
    if (this.isInitialized) {
      return;
    }
    
    // Get the directory name of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    if (!this.browser) {
      this.browser = await chromium.launch(this.options);
    }

    let emulateTemplate = {
      ...iPhone11,
      locale: 'en-US',
      deviceScaleFactor: getRandomInt(1, 3),
      isMobile: Math.random() > 0.5,
      hasTouch: Math.random() > 0.5,
      userAgent: this.userAgent,
    };
    emulateTemplate.viewport.width = getRandomInt(320, 1920);
    emulateTemplate.viewport.height = getRandomInt(320, 1920);

    this.context = await this.browser.newContext({
      bypassCSP: true,
      ...emulateTemplate,
    });

    this.page = await this.context.newPage();

    await this.page.route('**/*', (route) => {
      return route.request().resourceType() === 'script'
        ? route.abort()
        : route.continue();
    });

    await this.page.goto(this.default_url, {
      waitUntil: 'networkidle',
    });

    let LOAD_SCRIPTS = ['webmssdk_5.1.3.js',];

    LOAD_SCRIPTS.forEach(async (script) => {
      await this.page.addScriptTag({
        path: path.resolve(__dirname, script),
      });
      console.log('[+] ' + script + ' loaded');
    });

     await this.page.evaluate(() => {
      window.generateXBogus = function generateXBogus(query, undf) {
        if (typeof window.__tsign.u[970].v !== 'function') {
          throw 'No X-Bogus function found';
        }

        return window.__tsign.u[970].v(query, undf);
      };

      window.generateXGnarly = function generateXGnarly(query, strBody,baseUrl) {
        if (typeof window.__tsign.u[971].v !== 'function') {
          throw 'No X-Gnarly function found';
        }
        const p4 = {
          "totalXHRRequests": 70,
          "totalFetchRequests": 25,
          "interceptedXHRRequests": 8,
          "interceptedFetchRequests": 6
        }
        return window.__tsign.u[971].v(query, strBody,baseUrl,p4);
      };

      return this;
    });

    this.isInitialized = true;
    console.log('[+] Signer initialized successfully');
  }

  async navigator() {
    // Get the 'viewport' of the page, as reported by the page.
    const info = await this.page.evaluate(() => {
      return {
        deviceScaleFactor: window.devicePixelRatio,
        userAgent: window.navigator.userAgent,
        browser_language: window.navigator.language,
        browser_platform: window.navigator.platform,
        browser_name: window.navigator.appCodeName,
        browser_version: window.navigator.appVersion,
      };
    });
    return info;
  }

  async Sign({ url, body = '' }) {
     //console.log('Sign', { e: url, t: body });

    const params = new URL(url).search.slice(1); // removes the "?" from the start

    const xGnarly = await this.page.evaluate(`generateXGnarly('${params}', ${body || 'null'},'${url}')`);

    const xBogus = await this.page.evaluate(`generateXBogus('${params}', ${null})`);

    return { signedUrl:`${url}&X-Bogus=${xBogus}&X-Gnarly=${xGnarly}`, xBogus, xGnarly }
  }


  xttparams(query_str) {
    query_str += '&is_encryption=1';

    // Encrypt query string using aes-128-cbc
    const cipher = createCipheriv('aes-128-cbc', this.password, this.password);
    return Buffer.concat([cipher.update(query_str), cipher.final()]).toString(
      'base64'
    );
  }

  async healthCheck() {
    if (!this.isInitialized || !this.page) {
      return false;
    }
    
    try {
      await this.page.evaluate(() => {
        return typeof window.generateXBogus === 'function' && typeof window.generateXGnarly === 'function';
      });
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async close() {
    if (this.browser && !this.isExternalBrowser) {
      await this.browser.close();
      this.browser = null;
    }
    if (this.page) {
      this.page = null;
    }
    this.isInitialized = false;
  }
}

export default Signer;

// Export singleton functions for easier use
export const getSigner = () => Signer.getInstance();
export const closeSigner = () => Signer.close();
```

用python库来开发也可以，但是在部署在linux中时往往会有依赖问题，不如playwright官方提供的mcr.microsoft.com/playwright:v1.50.0-noble ，可快速部署。

| 框架名称 | 描述 | 是否支持 DOM | 是否支持浏览器 API | 是否支持 WebAssembly | 是否支持动态执行 |
| --- | --- | --- | --- | --- | --- |
| [Node.js + JSDOM](https://github.com/jsdom/jsdom) | 在 Node.js 中模拟浏览器环境 | ✅ | ❌（部分支持） | ❌ | ✅ |
| \[Node.js + CJS / ESM 模块模拟\] | 手动补环境（最常用） | ❌ | ❌ | ❌ | ✅ |
| [Puppeteer](https://pptr.dev/) | 基于 Chrome DevTools 的控制工具 | ✅ | ✅ | ✅ | ✅ |
| [Playwright](https://playwright.dev/) | 多浏览器自动化工具（支持 Chromium/Firefox/Webkit） | ✅ | ✅ | ✅ | ✅ |
| [Selenium](https://www.selenium.dev/) | 经典的浏览器自动化框架 | ✅ | ✅ | ✅ | ✅ |