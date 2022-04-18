data = {
    "currentPage": 1,
    "pageSize": 20,
    "searchFilter": [0],
    "searchScope": 0,
    "searchSort": None,
    "searchType": "paper",
    "searchWord": "lxlx"
}

import s_pb2 as pb
search_request = pb.SearchService.SearchRequest()
search_request.commonrequest.searchType = "paper"
search_request.commonrequest.searchWord = 'lxlx'
search_request.commonrequest.searchScope = 0
search_request.commonrequest.currentPage = 1
search_request.commonrequest.pageSize = 20
search_request.commonrequest.searchFilter.append(0)
bytes_body = search_request.SerializeToString()
bytes_head = bytes([0, 0, 0, 0, len(bytes_body)])
print((bytes_body+bytes_head).decode())
import requests
url = 'https://s.wanfangdata.com.cn/SearchService.SearchService/search?'
headers = {
    'Content-Type': 'application/grpc-web+proto',
}
resp = requests.post(url=url,data=bytes_head+bytes_body,headers=headers)
print(resp.text)
