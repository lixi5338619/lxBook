"""
数美滑块验证码验证
"""

import base64
import json
import random
import re
import time
from io import BytesIO
import cv2
import numpy as np
import requests
from pyDes import des, ECB

CAPTCHA_DISPLAY_WIDTH = 310
CAPTCHA_DISPLAY_HEIGHT = 155

p = {}


def pad(b):
    """
    块填充
    """
    block_size = 8
    while len(b) % block_size:
        b += b'\0'
    return b


def split_args(s):
    """
    分割js参数
    """
    r = []
    a = ''
    i = 0
    while i < len(s):
        c = s[i]
        if c == ',' and (a[0] != '\'' or len(a) >= 2 and a[-1] == '\''):
            r.append(a)
            a = ''
        elif c:
            a += c
        i += 1
    r.append(a)
    return r


def find_arg_names(script):
    """
    通过js解析出参数名
    """
    names = {}
    a = []
    for r in re.findall(r'function\((.*?)\)', script):
        if len(r.split(',')) > 100:
            a = split_args(r)
            break

    r = re.search(r';\)(.*?)\(}', script[::-1]).group(1)
    v = split_args(r[::-1])

    d = r'{%s}' % ''.join([((',' if i else '') + '\'k{}\':([_x0-9a-z]*)'.format(i + 1)) for i in range(15)])

    k = []
    r = re.search(d, script)
    for i in range(15):
        k.append(r.group(i + 1))

    n = int(v[a.index(re.search(r'arguments;.*?,(.*?)\);', script).group(1))], base=16)

    for i in range(n // 2):
        v[i], v[n - 1 - i] = v[n - 1 - i], v[i]

    for i, b in enumerate(k):
        t = v[a.index(b)].strip('\'')
        names['k{}'.format(i + 1)] = t if len(t) > 2 else t[::-1]

    return names


def get_encrypt_content(message, key, flag):
    """
    接口参数的加密、解密
    """
    des_obj = des(key.encode(), mode=ECB)
    if flag:
        content = pad(str(message).replace(' ', '').encode())
        return base64.b64encode(des_obj.encrypt(content)).decode('utf-8')
    else:
        return des_obj.decrypt(base64.b64decode(message)).decode('utf-8')


def get_random_ge(distance):
    """
    生成随机的轨迹
    """
    ge = []

    y = 0
    v = 0
    t = 1
    current = 0
    mid = distance * 3 / 4
    exceed = 20
    z = t

    ge.append([0, 0, 1])

    while current < (distance + exceed):
        if current < mid / 2:
            a = 15
        elif current < mid:
            a = 20
        else:
            a = -30
        a /= 2
        v0 = v
        s = v0 * t + 0.5 * a * (t * t)
        current += int(s)
        v = v0 + a * t

        y += random.randint(-5, 5)
        z += 100 + random.randint(0, 10)

        ge.append([min(current, (distance + exceed)), y, z])

    while exceed > 0:
        exceed -= random.randint(0, 5)
        y += random.randint(-5, 5)
        z += 100 + random.randint(0, 10)
        ge.append([min(current, (distance + exceed)), y, z])

    return ge


def make_mouse_action_args(distance):
    """
    生成鼠标行为相关的参数
    """
    ge = get_random_ge(distance)
    args = {
        p['k']['k5']: round(distance / CAPTCHA_DISPLAY_WIDTH, 2),
        p['k']['k6']: get_random_ge(distance),
        p['k']['k7']: ge[-1][-1] + random.randint(0, 100),
        p['k']['k8']: CAPTCHA_DISPLAY_WIDTH,
        p['k']['k9']: CAPTCHA_DISPLAY_HEIGHT,
        p['k']['k11']: 1,
        p['k']['k12']: 0,
        p['k']['k13']: -1,
        'act.os': 'android'
    }
    return args


def get_distance(fg, bg):
    """
    计算滑动距离
    """
    target = cv2.imdecode(np.asarray(bytearray(fg.read()), dtype=np.uint8), 0)
    template = cv2.imdecode(np.asarray(bytearray(bg.read()), dtype=np.uint8), 0)
    result = cv2.matchTemplate(target, template, cv2.TM_CCORR_NORMED)
    _, distance = np.unravel_index(result.argmax(), result.shape)
    return distance


def update_protocol(protocol_num, js_uri):
    """
    更新协议
    """
    global p
    r = requests.get(js_uri, verify=False)
    names = find_arg_names(r.text)
    p = {
        'i': protocol_num,
        'k': names
    }


def conf_captcha(organization):
    """
    获取验证码设置
    """
    url = 'https://captcha.fengkongcloud.com/ca/v1/conf'

    args = {
        'organization': organization,
        'model': 'slide',
        'sdkver': '1.1.3',
        'rversion': '1.0.3',
        'appId': 'default',
        'lang': 'zh-cn',
        'channel': 'YingYongBao',
        'callback': 'sm_{}'.format(int(time.time() * 1000))
    }

    r = requests.get(url, params=args, verify=False)
    resp = json.loads(re.search(r'{}\((.*)\)'.format(args['callback']), r.text).group(1))
    return resp


def register_captcha(organization):
    """
    注册验证码
    """
    url = 'https://captcha.fengkongcloud.com/ca/v1/register'

    args = {
        'organization': organization,
        'channel': 'YingYongBao',
        'lang': 'zh-cn',
        'model': 'slide',
        'appId': 'default',
        'sdkver': '1.1.3',
        'data': '{}',
        'rversion': '1.0.3',
        'callback': 'sm_{}'.format(int(time.time() * 1000))
    }

    r = requests.get(url, params=args, verify=False)
    resp = json.loads(re.search(r'{}\((.*)\)'.format(args['callback']), r.text).group(1))

    return resp


def verify_captcha(organization, rid, key, distance):
    """
    提交验证
    """
    url = 'https://captcha.fengkongcloud.com/ca/v2/fverify'
    args = {
        'organization': organization,
        p['k']['k1']: 'default',
        p['k']['k2']: 'YingYongBao',
        p['k']['k3']: 'zh-cn',
        'rid': rid,
        'rversion': '1.0.3',
        'sdkver': '1.1.3',
        'protocol': p['i'],
        'ostype': 'web',
        'callback': 'sm_{}'.format(int(time.time() * 1000))
    }

    args.update(make_mouse_action_args(distance))

    key = get_encrypt_content(key, 'sshummei', 0)

    for k, v in args.items():
        if len(k) == 2:
            args[k] = get_encrypt_content(v, key, 1)
    print(args)
    r = requests.get(url, params=args, verify=False)
    resp = json.loads(re.search(r'{}\((.*)\)'.format(args['callback']), r.text).group(1))

    return resp


def get_verify(organization):
    """
    进行验证
    """
    resp = conf_captcha(organization)
    protocol_num = re.search(r'build/v1.0.3-(.*?)/captcha-sdk.min.js', resp['detail']['js']).group(1)

    if not p.get('id') or protocol_num != p['i']:
        update_protocol(protocol_num, ''.join(['https://', resp['detail']['domains'][0], resp['detail']['js']]))

    resp = register_captcha(organization)

    rid = resp['detail']['rid']
    key = resp['detail']['k']

    domain = resp['detail']['domains'][0]
    fg_uri = resp['detail']['fg']
    bg_uri = resp['detail']['bg']

    fg_url = ''.join(['http://', domain, fg_uri])
    bg_url = ''.join(['http://', domain, bg_uri])

    r = requests.get(fg_url, verify=False)
    fg = BytesIO(r.content)

    r = requests.get(bg_url, verify=False)
    bg = BytesIO(r.content)

    distance = get_distance(fg, bg)
    print(distance)
    r = verify_captcha(organization, rid, key, int(distance / 600 * 310))

    return rid, r


def test():
    # 表示小红书
    organization = 'eR46sBuqF0fdw7KWFLYa'

    # rid是验证过程中响应的标示，r是最后提交验证返回的响应
    rid, r = get_verify(organization)
    print(rid, r)

    # riskLevel为PASS说明验证通过
    if r['riskLevel'] == 'PASS':
        # 这里需要提交rid
        # 具体可抓包查看，接口：/api/sns/v1/system_service/slide_captcha_check
        pass


if __name__ == '__main__':
    test()

