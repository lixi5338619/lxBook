import requests
import execjs

class XbRank():
    def __init__(self):
        self.session=requests.session()
        self.headers = {
            'accept-language': 'zh-CN,zh;q=0.9',
            'origin': 'https://newrank.cn',
            'referer': 'https://newrank.cn/public/info/search.html?value=pythonlx&isBind=false',
            'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'cookie': 'UM_distinctid=17e67d04321599-0bb674ea32cd44-f791b31-1fa400-17e67d04322e09; CNZZDATA1253878005=868574852-1642412670-%7C1642412670',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
    }


    def getxyz(self,path):
        js = '''
                 function nonce() {
                for (var a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"], b = 0; b < 500; b++)
                    for (var c = "", d = 0; d < 9; d++) {
                        var e = Math.floor(16 * Math.random());
                        c += a[e]
                    }
                return c
            }

        function b(a) {
                function b(a) {
                    return d(c(e(a)))
                }
                function c(a) {
                    return g(h(f(a), 8 * a.length))
                }
                function d(a) {
                    for (var b, c = p ? "0123456789ABCDEF" : "0123456789abcdef", d = "", e = 0; e < a.length; e++)
                        b = a.charCodeAt(e),
                        d += c.charAt(b >>> 4 & 15) + c.charAt(15 & b);
                    return d
                }
                function e(a) {
                    for (var b, c, d = "", e = -1; ++e < a.length; )
                        b = a.charCodeAt(e),
                        c = e + 1 < a.length ? a.charCodeAt(e + 1) : 0,
                        55296 <= b && b <= 56319 && 56320 <= c && c <= 57343 && (b = 65536 + ((1023 & b) << 10) + (1023 & c),
                        e++),
                        b <= 127 ? d += String.fromCharCode(b) : b <= 2047 ? d += String.fromCharCode(192 | b >>> 6 & 31, 128 | 63 & b) : b <= 65535 ? d += String.fromCharCode(224 | b >>> 12 & 15, 128 | b >>> 6 & 63, 128 | 63 & b) : b <= 2097151 && (d += String.fromCharCode(240 | b >>> 18 & 7, 128 | b >>> 12 & 63, 128 | b >>> 6 & 63, 128 | 63 & b));
                    return d
                }
                function f(a) {
                    for (var b = Array(a.length >> 2), c = 0; c < b.length; c++)
                        b[c] = 0;
                    for (var c = 0; c < 8 * a.length; c += 8)
                        b[c >> 5] |= (255 & a.charCodeAt(c / 8)) << c % 32;
                    return b
                }
                function g(a) {
                    for (var b = "", c = 0; c < 32 * a.length; c += 8)
                        b += String.fromCharCode(a[c >> 5] >>> c % 32 & 255);
                    return b
                }
                function h(a, b) {
                    a[b >> 5] |= 128 << b % 32,
                    a[14 + (b + 64 >>> 9 << 4)] = b;
                    for (var c = 1732584193, d = -271733879, e = -1732584194, f = 271733878, g = 0; g < a.length; g += 16) {
                        var h = c
                          , i = d
                          , o = e
                          , p = f;
                        c = j(c, d, e, f, a[g + 0], 7, -680876936),
                        f = j(f, c, d, e, a[g + 1], 12, -389564586),
                        e = j(e, f, c, d, a[g + 2], 17, 606105819),
                        d = j(d, e, f, c, a[g + 3], 22, -1044525330),
                        c = j(c, d, e, f, a[g + 4], 7, -176418897),
                        f = j(f, c, d, e, a[g + 5], 12, 1200080426),
                        e = j(e, f, c, d, a[g + 6], 17, -1473231341),
                        d = j(d, e, f, c, a[g + 7], 22, -45705983),
                        c = j(c, d, e, f, a[g + 8], 7, 1770035416),
                        f = j(f, c, d, e, a[g + 9], 12, -1958414417),
                        e = j(e, f, c, d, a[g + 10], 17, -42063),
                        d = j(d, e, f, c, a[g + 11], 22, -1990404162),
                        c = j(c, d, e, f, a[g + 12], 7, 1804603682),
                        f = j(f, c, d, e, a[g + 13], 12, -40341101),
                        e = j(e, f, c, d, a[g + 14], 17, -1502002290),
                        d = j(d, e, f, c, a[g + 15], 22, 1236535329),
                        c = k(c, d, e, f, a[g + 1], 5, -165796510),
                        f = k(f, c, d, e, a[g + 6], 9, -1069501632),
                        e = k(e, f, c, d, a[g + 11], 14, 643717713),
                        d = k(d, e, f, c, a[g + 0], 20, -373897302),
                        c = k(c, d, e, f, a[g + 5], 5, -701558691),
                        f = k(f, c, d, e, a[g + 10], 9, 38016083),
                        e = k(e, f, c, d, a[g + 15], 14, -660478335),
                        d = k(d, e, f, c, a[g + 4], 20, -405537848),
                        c = k(c, d, e, f, a[g + 9], 5, 568446438),
                        f = k(f, c, d, e, a[g + 14], 9, -1019803690),
                        e = k(e, f, c, d, a[g + 3], 14, -187363961),
                        d = k(d, e, f, c, a[g + 8], 20, 1163531501),
                        c = k(c, d, e, f, a[g + 13], 5, -1444681467),
                        f = k(f, c, d, e, a[g + 2], 9, -51403784),
                        e = k(e, f, c, d, a[g + 7], 14, 1735328473),
                        d = k(d, e, f, c, a[g + 12], 20, -1926607734),
                        c = l(c, d, e, f, a[g + 5], 4, -378558),
                        f = l(f, c, d, e, a[g + 8], 11, -2022574463),
                        e = l(e, f, c, d, a[g + 11], 16, 1839030562),
                        d = l(d, e, f, c, a[g + 14], 23, -35309556),
                        c = l(c, d, e, f, a[g + 1], 4, -1530992060),
                        f = l(f, c, d, e, a[g + 4], 11, 1272893353),
                        e = l(e, f, c, d, a[g + 7], 16, -155497632),
                        d = l(d, e, f, c, a[g + 10], 23, -1094730640),
                        c = l(c, d, e, f, a[g + 13], 4, 681279174),
                        f = l(f, c, d, e, a[g + 0], 11, -358537222),
                        e = l(e, f, c, d, a[g + 3], 16, -722521979),
                        d = l(d, e, f, c, a[g + 6], 23, 76029189),
                        c = l(c, d, e, f, a[g + 9], 4, -640364487),
                        f = l(f, c, d, e, a[g + 12], 11, -421815835),
                        e = l(e, f, c, d, a[g + 15], 16, 530742520),
                        d = l(d, e, f, c, a[g + 2], 23, -995338651),
                        c = m(c, d, e, f, a[g + 0], 6, -198630844),
                        f = m(f, c, d, e, a[g + 7], 10, 1126891415),
                        e = m(e, f, c, d, a[g + 14], 15, -1416354905),
                        d = m(d, e, f, c, a[g + 5], 21, -57434055),
                        c = m(c, d, e, f, a[g + 12], 6, 1700485571),
                        f = m(f, c, d, e, a[g + 3], 10, -1894986606),
                        e = m(e, f, c, d, a[g + 10], 15, -1051523),
                        d = m(d, e, f, c, a[g + 1], 21, -2054922799),
                        c = m(c, d, e, f, a[g + 8], 6, 1873313359),
                        f = m(f, c, d, e, a[g + 15], 10, -30611744),
                        e = m(e, f, c, d, a[g + 6], 15, -1560198380),
                        d = m(d, e, f, c, a[g + 13], 21, 1309151649),
                        c = m(c, d, e, f, a[g + 4], 6, -145523070),
                        f = m(f, c, d, e, a[g + 11], 10, -1120210379),
                        e = m(e, f, c, d, a[g + 2], 15, 718787259),
                        d = m(d, e, f, c, a[g + 9], 21, -343485551),
                        c = n(c, h),
                        d = n(d, i),
                        e = n(e, o),
                        f = n(f, p)
                    }
                    return Array(c, d, e, f)
                }
                function i(a, b, c, d, e, f) {
                    return n(o(n(n(b, a), n(d, f)), e), c)
                }
                function j(a, b, c, d, e, f, g) {
                    return i(b & c | ~b & d, a, b, e, f, g)
                }
                function k(a, b, c, d, e, f, g) {
                    return i(b & d | c & ~d, a, b, e, f, g)
                }
                function l(a, b, c, d, e, f, g) {
                    return i(b ^ c ^ d, a, b, e, f, g)
                }
                function m(a, b, c, d, e, f, g) {
                    return i(c ^ (b | ~d), a, b, e, f, g)
                }
                function n(a, b) {
                    var c = (65535 & a) + (65535 & b);
                    return (a >> 16) + (b >> 16) + (c >> 16) << 16 | 65535 & c
                }
                function o(a, b) {
                    return a << b | a >>> 32 - b
                }
                var p = 0;
                return b(a)
            }
        '''
        ctx = execjs.compile(js)
        nonce=ctx.eval('nonce()')
        path = path.replace('*****',nonce)
        xyz=ctx.eval(path)
        return nonce,xyz


    def getMedia(self,page=1):
        """ 获取新榜资讯 """
        url = "https://www.newrank.cn/xdnphb/index/getMedia"
        path='b("/xdnphb/index/getMedia?AppKey=joker&keyword=&pageNumber={}&pageSize=10&nonce={}")'.format(page,'*****')
        nonce, xyz =self.getxyz(path)
        data = {
            "keyword":"",
            "pageNumber": str(page),
            "pageSize": "10",
            "nonce": nonce,
            "xyz": xyz,
        }
        res=self.session.post(url=url, headers=self.headers, data=data).text
        return res


    def getRank1(self):
        """ 微信-榜单 """
        rank_name = '百科'
        rank_name_group = '生活'
        date = '2022-01-17'
        path='b("/xdnphb/main/v1/day/rank?AppKey=joker&end={}&rank_name={}&rank_name_group={}&start={}&nonce=*****")'.format(date,rank_name,rank_name_group,date)
        nonce,xyz=self.getxyz(path)
        print(nonce,xyz)
        getRankUrl = 'https://www.newrank.cn/xdnphb/main/v1/day/rank'
        self.data={
            "end": date,
            "rank_name": rank_name,
            "rank_name_group": rank_name_group,
            "start": date,
            "nonce": nonce,
            "xyz": xyz,
        }
        res=self.session.post(url=getRankUrl,headers=self.headers,data=self.data).json()
        return res


    def getRank2(self):
        """ 视频号-榜单 """
        path='b("/xdnphb/data/weixinuser/getMainIndexRank?")'
        nonce,xyz=self.getxyz(path)
        getUrl =  f'https://www.newrank.cn/xdnphb/nr/xinshi/video/getMainIndexRank?nonce={nonce}&xyz={xyz}'
        self.data={"interval":"day",
                   "rank_date":"2021-07-11",
                   "type":"科技互联网",
                   "start":1,
                   "size":50}
        res=self.session.post(url=getUrl,headers=self.headers,json=self.data).text
        return res


    def getRank3(self):
        """ 抖音号-榜单 """
        getRankUrl = f'https://gw.newrank.cn/api/xd/xdnphb/nr/cloud/douyin/rank/mainHotAccountAllRankList'
        self.data={"size":50,"start":1,"type":"才艺","date_type":"days","date":"2021-07-10"}
        self.headers.update({'n-token': '9116298d52d64bbfb2bafa92267f74f2'})
        res=self.session.post(url=getRankUrl,headers=self.headers,json=self.data).text
        return res


    def getRank4(self):
        """ 快手号-榜单 """
        path='b("/xdnphb/nr/cloud/ks/mini/rank/accountAllRankList?")'
        nonce,xyz=self.getxyz(path)
        getRankUrl = f'https://www.newrank.cn/xdnphb/nr/cloud/ks/mini/rank/accountAllRankList?nonce={nonce}&xyz={xyz}'
        self.data={"type":"美食","rankDate":"2021-07-10","start":1,"size":100,"rankType":"realTime","sort":"newrankIndex"}
        res=self.session.post(url=getRankUrl,headers=self.headers,json=self.data).text
        return res


    def getRank5(self):
        """ bilibili-榜单 """
        path='b("/nr/bili/rank/complexMainRank?")'
        nonce,xyz=self.getxyz(path)
        getRankUrl =  f'https://www.newrank.cn/nr/bili/rank/complexMainRank?nonce={nonce}&xyz={xyz}'
        self.data={"numeric":"时尚","rankDate":"2021-07-11","start":1,"size":50,"rankType":"0","type":"0"}
        res=self.session.post(url=getRankUrl,headers=self.headers,json=self.data).text
        return res



if __name__=="__main__":
    xb = XbRank()
    print(xb.getRank2())

