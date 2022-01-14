# -*- coding: utf-8 -*-
import os
from selenium import webdriver

ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...'
PRO_DIR = os.path.dirname(os.path.abspath(__file__))

s1 = """
    <!DOCTYPE html>
    <html style="font-size: 50px;">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <title>signature-hook</title>
    </head>
    <body></body>

    <script type="text/javascript">
    """
s2 = """
    </script>
    </html>
    """

def driver_sig(html_file):
    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    option.add_argument('--no-sandbox')
    option.add_argument('--user-agent={}'.format(ua))
    driver = webdriver.Chrome(chrome_options=option)
    driver.get('file:///'+ PRO_DIR + html_file)
    sig = driver.title
    driver.quit()
    return sig

sign_js = '''
window.navigator = {
    userAgent: ''
    };
function get_sign() {
        ... //此处省略N行代码
        return sign
    }
var signature = get_sign();
document.clear();
document.write(signature);
'''

if __name__ == '__main__':
    doc = sign_js.replace("userAgent: ''","userAgent: '{}'".format(ua))
    html_file = 'get_sign.html'
    with open(html_file, 'w', encoding='utf-8') as fw:
        fw.write(s1 + doc + s2)
    sig = driver_sig(html_file)
    print(sig)