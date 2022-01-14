# -*- coding: utf-8 -*-
# @Time    : 2021/8/12 10:12
# @Author  : lx
# @IDE ：PyCharm

from google.protobuf.json_format import MessageToDict
import base64
from test_pb2 import *


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
            obj1 = MessageToDict(menber_message, preserving_proto_field_name=True)
            print(obj1)

        elif method == "WebcastGiftMessage":
            menber_message3 = WebcastGiftMessage()
            menber_message3.ParseFromString(payload)
            obj3 = MessageToDict(menber_message3, preserving_proto_field_name=True)
            print(obj3)

        elif method == "WebcastLikeMessage":
            menber_message4 = WebcastLikeMessage()
            menber_message4.ParseFromString(payload)
            obj4 = MessageToDict(menber_message4, preserving_proto_field_name=True)
            print(obj4)

        elif method == "WebcastChatMessage":
            menber_message5 = WebcastChatMessage()
            menber_message5.ParseFromString(payload)
            obj5 = MessageToDict(menber_message5, preserving_proto_field_name=True)
            print(obj5)

with open('danmu.txt','rb') as f:
    resp = f.read()

on_message(resp)
