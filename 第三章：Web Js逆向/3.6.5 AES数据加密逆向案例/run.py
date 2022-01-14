import requests
import base64,json,re
from Crypto.Cipher import AES

def decrypt(info: str) -> list:
    key = '3sd&d24h@$udD2s*'.encode(encoding='utf-8')
    cipher = AES.new(key, mode=AES.MODE_ECB)
    json_str = str(cipher.decrypt(base64.b64decode(info)), encoding='utf-8')
    data = re.sub('[\x00-\x09|\x0b-\x0c|\x0e-\x1f]', '', json_str)
    return json.loads(data)

headers = {}# 需要把你的header复制进去

url = "https://api.hanghangcha.com/hhc/tag"  # 产业图谱接口
res = requests.get(url,headers=headers)
payload = json.loads(res.content)['data']
data = decrypt(payload)
print(data)