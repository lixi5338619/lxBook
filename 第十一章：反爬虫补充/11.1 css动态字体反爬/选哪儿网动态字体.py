# -*- coding: utf-8 -*-

import requests
import re

headers = {
   'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
   'origin': 'https://www.xuannaer.com',
   'referer': 'https://www.xuannaer.com/',
   'sec-fetch-dest': 'font',
   'sec-fetch-mode': 'cors',
   'sec-fetch-site': 'same-site'
}

doc = requests.get('https://www.xuannaer.com/zhaopaigua',headers=headers).text

# 这个链接会更新，注意下
woff = re.findall('https://img2.xuanzhi.com/static/new/fonts/\w{16}/font.woff\?\d{11}',doc,re.S)[0]

print(woff)
woff_bytes = requests.get(woff,headers=headers,allow_redirects=True)
with open('zhaopaigua.woff','wb') as f:
   f.write(woff_bytes.content)

from fontTools.ttLib import TTFont
font = TTFont('zhaopaigua.woff')
font.saveXML('zhaopaigua.xml')

f = open('zhaopaigua.xml','r',encoding='utf-8')
document = f.read()
f.close()
cmap = re.findall('<map code="(.*?)" name="(.*?)"/>',document,re.S)
item = {}
for node in cmap:
   item[node[1]] = chr(eval(node[0]))

GlyphID = re.findall('<GlyphID id="(\d+)" name="(.*?)"/>',document,re.S)[1:]

# 只要数字 取0-9 前10个元素
result = {}
for li in GlyphID[:10]:
   num = int(li[0])-1   # 正确的数字
   result[item[li[1]]]=num
print(result)