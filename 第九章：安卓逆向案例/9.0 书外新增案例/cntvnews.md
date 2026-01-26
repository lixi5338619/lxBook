base64:  5aSu6KeG5paw6Ze7YXBw

# 版本9.2.0

标准HMACSHA256加密，算法助手pro即可分析。

## x-emas-gw-sign参数

`emas_gw_utdid`：aVaQIP4xdkADAGQcvpa5LIuC

`emas_gw_ttid`：1618388776598@CCNews\_Android\_10.11.0

`fe`：先对params按key排序，&拼接键值对，生成md5哈希值。

`c` ：c = str(round(time.time()))

hmac msg:  `f'{emas_gw_utdid}&&&20000008&{fe}&{c}&emas.feed.iflow.server.getchannelitems&1.0.0&&{emas_gw_ttid}&&&27'`

hmac key：3df8017cb9367f5997ab9e4b19c1e028