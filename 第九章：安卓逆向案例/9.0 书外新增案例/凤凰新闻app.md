# 凤凰新闻app 

# 版本7.38.0

## 接口

nine.ifeng.com/wemediacontentlist

## 脱壳

腾讯加固：com.tencent.StubShell.TxAppEntry

通过反射大师，断网脱壳，导出dex。（用别的也行）

## sn参数

一些字符串拼接后MD5，盐值在so中： "acF%#\*{\_b1mQt@..ifvy"

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybKdPMebqwZ/img/8d363b51-75d7-4474-b7df-e177a17313b1.png)

## sn生成代码

```js
import random
import time
import hashlib
v = "7.38.0"
proid = "ifengnews"
publishid = "2899"
deviceid = "v001iVTYiFTMlBjM2IWM0EGM40QYgfr3r340gf"
so = "acF%#*{_b1mQt@..ifvy"
r = int((random.random() * 8999) + 1000)
timec = str(int(time.time()))
st = f"{timec}{r}"
sn_str = f'{v}{proid}{publishid}{deviceid}{st}{so}'
sn = hashlib.md5(sn_str.encode(encoding='utf-8')).hexdigest()
print(st)
print(sn)
```