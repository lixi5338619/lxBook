import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)

jscode_hook = """
Java.perform(
    function(){
            console.log("1. start hook");
            var ba = Java.use("com.douban.frodo.utils.crypto.HMACHash1");
            if (ba != undefined) {
                console.log("2. find class");
                ba.a.overload('java.lang.String', 'java.lang.String').implementation = function (a1,a2) {
                    console.log("3. find function");
                    console.log(a1);
                    console.log(a2);
                    var res = ba.a(a1,a2);
                    console.log("计算result:" + res);
                    return res;
                }
            }
    }
)
"""

process = frida.get_usb_device().attach('com.douban.frodo')
script = process.create_script(jscode_hook)
script.on('message', on_message)
print('[*] Hook Start Running')
script.load()
sys.stdin.read()