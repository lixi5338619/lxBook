import json
from selenium import webdriver


class Browser():
    def __init__(self, **kwargs, ):
        self.debug = kwargs.get("debug", False)
        self.proxy = kwargs.get("proxy", None)
        self.api_url = kwargs.get("api_url", None)
        self.referrer = kwargs.get("referer", "https://trendinsight.oceanengine.com/")
        # TODO： update your executablePath
        self.executablePath = kwargs.get("executablePath", r"C:\Users\lx\Desktop\driver\chromedriver.exe")

        args = kwargs.get("browser_args", [])
        options = kwargs.get("browser_options", {})

        if len(args) == 0:
            self.args = []
        else:
            self.args = args

        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("log-level=2")
        self.options = {
            #"headless": True,
            "handleSIGINT": True,
            "handleSIGTERM": True,
            "handleSIGHUP": True,
        }

        if self.proxy is not None:
            if "@" in self.proxy:
                server_prefix = self.proxy.split("://")[0]
                address = self.proxy.split("@")[1]
                self.options["proxy"] = {
                    "server": server_prefix + "://" + address,
                    "username": self.proxy.split("://")[1].split(":")[0],
                    "password": self.proxy.split("://")[1].split("@")[0].split(":")[1],
                }
            else:
                self.options["proxy"] = {"server": self.proxy}

        if self.executablePath is not None:
            self.options["executablePath"] = self.executablePath

        self.browser = webdriver.Chrome(executable_path=self.executablePath, chrome_options=options)

        self.browser.get('https://trendinsight.oceanengine.com/arithmetic-index')

        for k, v in cks.items():
            self.browser.add_cookie({"name": k, "value": v})
        self.browser.refresh()



    def signature(self, keyword, start_date, end_date):
        sign_url = self.browser.execute_script('''
                    function queryData(url) {
                       var p = new Promise(function(resolve,reject) {
                           var e={"url":"https://trendinsight.oceanengine.com/api/open/index/get_multi_keyword_hot_trend",
                                    "method":"POST",
                                    "data" : '{"keyword_list": ["%s"],"start_date": "%s","end_date": "%s","app_name": "aweme"}'};
                            var h = new XMLHttpRequest;h.open(e.method, e.url, true);
                            h.setRequestHeader("accept","application/json, text/plain, */*");  
                            h.setRequestHeader("content-type","application/json;charset=UTF-8");
                            h.setRequestHeader("tea-uid","7054893410171930123");
                            h.onreadystatechange =function() {
                                 if(h.readyState != 4) return;
                                 if(h.readyState === 4 && h.status  ===200) {
                                    resolve(h.responseText);
                                 } else {
                                  }
                            };
                            h.send(e.data);
                            });
                            return p;
                        }
                    var p1 = queryData('lx');
                    res = Promise.all([p1]).then(function(result){
                    return result
                    })
                    return res;
        ''' % (keyword, start_date, end_date))
        '''
        let e={"url":"https://trendinsight.oceanengine.com/api/open/index/get_multi_keyword_hot_trend",
                                "method":"POST",
                                "data" : '{"keyword_list":["lx"],"start_date":"20220430","end_date":"20220530","app_name":"aweme"}'};
        var h = new XMLHttpRequest;h.open(e.method, e.url, true);
        h.setRequestHeader("accept","application/json, text/plain, */*");
        h.setRequestHeader("content-type","application/json;charset=UTF-8");
        h.setRequestHeader("tea-uid","7054893410171930123");
                h.onreadystatechange=function(){
                    if (h.status===200){
                       console.log(h.responseText)
                       console.log(h.responseURL)
                    }
                }
        h.send(e.data);
        '''
        return sign_url[0]

    def decrypt(self,data):
        text = self.browser.execute_script('''
        function d(e) {
            var t = e ;
            var n = atob(t);
            var r = new Uint8Array(n.length);
            for (var i = 0; i < n.length; i++) {
                r[i] = n.charCodeAt(i);
            }
            return r;
        }
        var text = "%s";
        var key = "kbSjOqn9O7APLqUZxdCkTQ==";
        var iv = "JuhL1cOV5JH9ojzt2g2EPg==";
        
        async function decrypt(text,key,iv) {
            var t = d(key);
            var i = d(iv);
            var r = await window.crypto.subtle.importKey("raw", t, "AES-CBC", !0, ["decrypt"]);
            var result = await window.crypto.subtle.decrypt({
                name: "AES-CBC",
                iv: i
            }, r, d(text));
            result = (new TextDecoder()).decode(result)
            return result
        }
        function getResult(){
            var p = decrypt(text,key,iv);
            return Promise.all([p]).then(data=>{
                console.log(data)
                return data[0]
            })
        }

        var p1 = getResult();
        res = Promise.all([p1]).then(function(result){
            return result
        })
       return res
        '''%data)
        return text[0]


    def responseText(self, keyword, start_date, end_date):
        doc = self.browser.execute_script('''
                    function queryData(url) {
                       var p = new Promise(function(resolve,reject) {
                           var e={"url":"https://trendinsight.oceanengine.com/api/open/index/get_multi_keyword_hot_trend",
                                    "method":"POST",
                                    "data" : '{"keyword_list": ["%s"],"start_date": "%s","end_date": "%s","app_name": "aweme"}'};
                            var h = new XMLHttpRequest;h.open(e.method, e.url, true);
                            h.setRequestHeader("accept","application/json, text/plain, */*");  
                            h.setRequestHeader("content-type","application/json;charset=UTF-8");
                            h.setRequestHeader("tea-uid","7054893410171930123");
                            h.onreadystatechange =function() {
                                 if(h.readyState != 4) return;
                                 if(h.readyState === 4 && h.status  ===200) {
                                    resolve(h.responseText);
                                 } else {
                                  }
                            };
                            h.send(e.data);
                            });
                            return p;
                        }
                    var p1 = queryData('lx');
                    res = Promise.all([p1]).then(function(result){
                    return result
                    })
                    return res;
        ''' % (keyword, start_date, end_date))
        return doc[0]

    def close(self):
        self.browser.close()
        self.browser.quit()


def get_data(keyword, start_date, end_date):
    text = browser.signature(keyword=keyword, start_date=start_date, end_date=end_date)
    data = json.loads(text)['data']
    doc = browser.decrypt(data)
    return doc



if __name__ == '__main__':
    cookies = ""  # "把你登录后的cookie复制到这里"
    cks = {}
    for k in cookies.split(';'):
        c = k.split('=')
        cks[c[0].replace(' ','')] = c[1]

    browser = Browser()
    print(get_data(keyword='lx', start_date="20231106", end_date="20231107"))
    print(get_data(keyword='鞠婧祎', start_date="20231106", end_date="20231107"))
    browser.close()
