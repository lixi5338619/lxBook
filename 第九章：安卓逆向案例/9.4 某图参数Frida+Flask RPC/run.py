import frida
from flask import Flask, jsonify, request

app = Flask(__name__)

def on_message(message, data):
    print("[%s] => %s" % (message, data))


def start_hook():
    session = frida.get_usb_device().attach('com.mt.mtxx.mtxx')
    js_code = '''
    rpc.exports = {
        "a": function (kw) {
            var ret = {};
            Java.perform(function(){
                    var SigEntity = Java.use("com.meitu.secret.SigEntity");
                    var BaseApplication = Java.use('com.meitu.library.application.BaseApplication');
                        var str1 = "search/feeds.json";
                        var str3 = "6184556633574670337";
                        var content = BaseApplication.getApplication();
                    var result = SigEntity.generatorSig(str1, kw, str3, content);
                    ret["result"]=result.sig.value;
                    console.log("[*] Sig:",result.sig.value);
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


@app.route("/hook")
def search():
    kw = request.args.get("kw")
# 因参数过长，此处代码中的params不完整
    params = ['1639127762948', 'CMCC', 'GMT+8',kw, ...]
    result = start_hook().exports.a(params)
    return jsonify({'result':result})


if __name__ == '__main__':
    app.run()