import requests,time
from urllib.parse import quote,urlparse
import hashlib,base64,hmac

headers = {"User-Agent": "api-client/1 com.douban.frodo/7.18.0(230) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi  udid/bba04d59bdf9c91ef59ff80573c4480c1a661a70  platform/mobile nd/1"}

def bd_request():
    url = ""
    ts = str(round(time.time()))
    params ={
        'count':'30',
        'tag':'追剧',
        'os_rom':'miui6',
        'apikey':'0dad551ec0f84ed02907ff5c42e8ec70',
        'channel':'Baidu_Market',
        'udid':'bba04d59bdf9c91ef59ff80573c4480c1a661a70',
        'timezone':'Asia/Shanghai',
        "_sig": get_sig(url=url, ts=ts),
        "_ts": ts,
    }
    data = requests.get(url, params=params, headers=headers).text
    return data

def get_sig(url,ts):
    urlpath = urlparse(url).path
    sign = '&'.join(['GET', quote(urlpath,safe=''), ts])
    sig = hmac.new("bf7dddc7c9cfe6f7".encode(), sign.encode(), hashlib.sha1).digest()
    _sig = base64.b64encode(sig).decode()
    return _sig

print(bd_request())