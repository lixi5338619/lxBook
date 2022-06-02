import frida, sys
def on_message(message, data):
    print("[%s] => %s" % (message, data))

session = frida.get_usb_device().attach('com.hipu.yidian')

jscode_hook = """
    Java.perform(
        function(){
                console.log("1. start hook");
                var ba = Java.use("com.yidian.news.util.sign.SignUtil");
                if (ba != undefined) {
                    console.log("2. find class");
                    ba.signInternal.implementation = function (a1,a2) {
                        console.log("3. find function");
                        console.log(a1);
                        console.log(a2);
                        var res = ba.signInternal(a1,a2);
                        console.log("计算Sign:" + res);
                        return res;
                }
            }
        }
)
"""

script = session.create_script(jscode_hook)
script.on('message', on_message)
script.load()
sys.stdin.read()