from google.protobuf.json_format import MessageToDict
from s_pb2 import *
import base64

def on_message(data):
    danmu_resp = test()
    danmu_resp.ParseFromString(data)
    Message = MessageToDict(danmu_resp, preserving_proto_field_name=True)
    for message in Message["message"]:
        method = message["method"]
        payload = bytes(base64.b64decode(message["payload"].encode()))
        if method == "WebcastMemberMessage":
            menber_message = WebcastMemberMessage()
            menber_message.ParseFromString(payload)
            mes= MessageToDict(menber_message, preserving_proto_field_name=True)
            print(mes)
        elif method == "WebcastLikeMessage":
            menber_message = WebcastLikeMessage()
            menber_message.ParseFromString(payload)
            mes = MessageToDict(menber_message, preserving_proto_field_name=True)
            print(mes)

with open('s.txt','rb') as f:
    data = f.read()
on_message(data)