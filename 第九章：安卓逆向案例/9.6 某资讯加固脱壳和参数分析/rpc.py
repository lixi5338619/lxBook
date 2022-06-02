import frida


def on_message(message, data):
    print("[%s] => %s" % (message, data))


def start_hook():
    session = frida.get_usb_device().attach('com.hipu.yidian')
    print("[*] start hook")

    js_code = '''
    rpc.exports = {
        "a": function (params) {
                var ret = {};
                Java.perform(function(){
                    console.log("1. start hook");
                    var ba = Java.use("com.yidian.news.util.sign.SignUtil");

                    var current_application = Java.use('android.app.ActivityThread').currentApplication();
                    var a1 = current_application.getApplicationContext();

                    if (ba != undefined) {
                        console.log("2. find class");
                        var a2 = params;
                        var res = ba.signInternal(a1,a2);
                        console.log("计算Sign:" + res);
                        console.log(res)
                        ret["result"]=res;
                        console.log(ret)
                        }
                    }
               )
            return ret;
            }
        }
    '''
    script = session.create_script(js_code)
    script.on('message', on_message)
    script.load()
    return script


import time

stimec = str(int(time.time() * 1000))
params = f'yidian6.0.4.41kbylz0sj_{stimec}_207030300'
result = start_hook().exports.a(params)
print(result)