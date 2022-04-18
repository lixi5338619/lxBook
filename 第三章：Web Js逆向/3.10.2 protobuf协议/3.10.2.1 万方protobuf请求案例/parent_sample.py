# -*- coding: utf-8 -*-
# @Author  : lx

# 专利详情页解析示例

import requests
import s_parent_pb2 as pb
from lxpy import copy_headers_dict

parent_id ='ChJQYXRlbnROZXdTMjAyMjAzMjMSEENOMjAyMDEwNjYxNDM1LjYaCGZ6YW1hbTNw'

search_request = pb.SearchService2.CommonRequest()
search_request.resourcetype = "Patent"
search_request.id = parent_id
search_request.referer = ""
search_request.md5id = ""
search_request.transaction = ""
bytes_body = search_request.SerializeToString()
bytes_head = bytes([0, 0, 0, 0, len(bytes_body)])
data=bytes_head+bytes_body

url = 'https://d.wanfangdata.com.cn/Detail.DetailService/getDetailInFormation'
patent_headers = copy_headers_dict('''
accept: */*
accept-encoding: gzip, deflate, br
accept-language: zh-CN,zhq=0.9
cache-control: no-cache
content-type: application/grpc-web+proto
cookies: CASTGC=CASTGCSpecial=
origin: https://d.wanfangdata.com.cn
pragma: no-cache
referer: https://d.wanfangdata.com.cn/patent/ChJQYXRlbnROZXdTMjAyMjAzMjMSEENOMjAyMDEwNjYxNDM1LjYaCGZ6YW1hbTNw
sec-ch-ua: " Not ABrand"v="99", "Chromium"v="99", "Google Chrome"v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
user-agent: Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36
x-grpc-web: 1
x-user-agent: grpc-web-javascript/0.1
''')
detail_resp = requests.post(url=url,data=data,headers=patent_headers).content

from blackboxprotobuf import protobuf_to_json
import struct,json
data_len = struct.unpack(">i", detail_resp[1:5])[0]
data = json.loads(protobuf_to_json(detail_resp[5: 5 + data_len])[0])['1']['5']
print(data)