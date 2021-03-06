import frida, sys
def on_message(message, data):
    print("[%s] => %s" % (message, data))

session = frida.get_usb_device().attach('cn.dahebao')

jscode_hook = """
    Java.perform(
        function(){
                console.log("1. start hook");
                var ba = Java.use("com.dingduan.lib_network.interceptor.CommonParamInterceptor").$new();
                if (ba != undefined) {
                    console.log("2. find class");
                    ba.md5.implementation = function (a1) {
                        console.log("3. find function");
                        console.log(a1);
                        var res = ba.md5(a1);
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