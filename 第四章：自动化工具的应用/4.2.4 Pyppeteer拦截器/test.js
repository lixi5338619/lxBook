var request = require('request');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

var apage;
var message_js = "js content";
puppeteer.launch({
     userDataDir: "data",
     ignoreDefaultArgs: ["--enable-automation"],
     headless: false,
}).then(browser => {
    browser.newPage().then((page) => {
        apage = page;
        page.setRequestInterception(true).then(() => {
            page.on('request',async (req) => {
                if (req.url().indexOf("https://www.lx.js") != -1) {
                    req.respond({
                            status:200,
                            headers:{},
                            body:message_js
                        })
                }
                else if (req.url().indexOf("https://www.lx.png") != -1) {
                    req.abort()
                }
                page.on('response', async response => {
                    if (response.url().indexOf("https://www.lx.json/") != -1) {
                        let message = response.text();
                            message.then(res =>{
                                   console.log(res)
                            })
                            .catch(err =>{
                                console.log(err)
                            })
                    }
                })
                req.continue();
          });
        })
        page.goto("https://www.lx.com")

    }, {waitUntil: "networkidle0"}).then(() => {
    })
});