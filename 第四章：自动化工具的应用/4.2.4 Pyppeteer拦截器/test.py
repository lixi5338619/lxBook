import asyncio
from pyppeteer import launch

async def main():
    browser = await launch()
    page = await browser.newPage()
    # 设置 request 拦截器
    await page.setRequestInterception(True)
    page.on('request', lambda req: asyncio.ensure_future(intercept_request(req)))
    # 设置 response 拦截器
    page.on('response', lambda rep: asyncio.ensure_future(intercept_response(rep)))
    await page.goto('https://www.baidu.com')
    await browser.close()

# 请求拦截器
async def intercept_request(Request):
    if Request.url=='':
        # 跳转url
        await Request.continue_({"url": ""})
    elif Request.url =='':
        # 停止请求  
        await Request.abort()
    elif Request.url =='':
        # 用给定的响应内容完成请求
        await Request.respond({"status":"","body":""})
    else:
        # 保持请求
        await Request.continue_()

# 响应拦截器
async def intercept_response(Response):
    print(Response.url)
    if Response.url=="https://www.baidu.com":
        response = await Response.text()
        ...

asyncio.get_event_loop().run_until_complete(main())