# -*- coding: UTF-8 -*-
# 代码引用自 guyezhou51

import frida
import sys


def on_message(message, data):
    if message['type'] == 'send':
        ss = "[*]{0}".format(message['payload'])
        file_handle = open('log.txt', mode='a+')
        file_handle.write('%s \r\n' % (ss))
        file_handle.close()
    else:
        print(message)


def get_js():
    htmlstr = '''
var N_ENCRYPT_MODE = 1;
var N_DECRYPT_MODE = 2;

function showStacks() {
    var Exception = Java.use("java.lang.Exception");
    var ins = Exception.$new("Exception");
    var straces = ins.getStackTrace();

    if (undefined == straces || null == straces) {
        return;
    }

    mylog("===================== Stack strat=======================","","",0);    

    for (var i = 0; i < straces.length; i++) {
        var str = "   " + straces[i].toString();
        mylog(str,"","",0);
    }


    mylog("====================== Stack end=======================","","",0);
    Exception.$dispose();
};

//工具相关函数 
var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));

function bytesToHex(arr) {
    var str = '';
    arr = new Uint8Array(arr);
    var k, j;
    for (var i = 0; i < arr.length; i++) {
        k = arr[i];
        j = k;
        if (k < 0) {
            j = k + 256;
        }
        if (j < 16) {
            str += "0";
        }
        str += j.toString(16);
    }
    return str;
};
//将byte[]转成String的方法
function bytesToString(arr) {
    var str = '';
    arr = new Uint8Array(arr);
    for (var i in arr) {
        str += String.fromCharCode(arr[i]);
    }
    return str;
};
function bytesToBase64(e) {
    e = new Uint8Array(e);
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break;
        }
        if (o = e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break;
        }
        t = e[a++],
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t);
    }
    return r;
};

//stringToBase64 stringToHex stringToBytes
//base64ToString base64ToHex base64ToBytes
//               hexToBase64  hexToBytes    
// bytesToBase64 bytesToHex bytesToString
function mylog(s,code,s2,ii){
    if(ii==1){ 

        //输出hex类型
        var str =  bytesToHex(code)+s2;
        console.log(s+" |HEX :"+str);
        send(s+" |HEX :"+str);
        //输出base64
        str = bytesToBase64(code)+s2;
        console.log( s+" |BASE64 :"+str);
        send(s+" |BASE64 :"+str);

        //输出string类型
        str =  bytesToString(code)+s2;
        console.log(s+" |str :"+str);
        send(s+" |str :"+str);
    }else{
        console.log("print: "+s);
        send("print: "+s);
    }

};

Java.perform(function () {
    var secretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');
    var AE算法名称 = null;
    secretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function (a, b) {
        showStacks();
        var result = this.$init(a, b);
        mylog("======================================","","",0);
        mylog("算法名：" + b + "| 密钥" , a,"",1);   
        AE算法名称=b;    
        return result;
    };

    secretKeySpec.$init.overload('[B', 'int','int','java.lang.String').implementation = function (a,i1,i2, b) {
        showStacks();
        var result = this.$init(a,i1,i2,b);
        mylog("======================================","","",0);
        mylog("算法名：" + b + "| 密钥" , a,"    |开始取的位置"+i1+"取长度:"+i2,1);   
        AE算法名称=b;    
        return result;
    };

    var DESKeySpec = Java.use('javax.crypto.spec.DESKeySpec');
    DESKeySpec.$init.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.$init(a);
        mylog("======================================","","",0);
        var bytes_key_des = this.getKey();
        mylog("des密钥 " ,bytes_key_des,"",1);        
        return result;
    };

    DESKeySpec.$init.overload('[B', 'int').implementation = function (a, b) {
        showStacks();
        var result = this.$init(a, b);
        mylog("======================================","","",0);
        var bytes_key_des = this.getKey();
        mylog("des密钥 " , bytes_key_des,"",1);      
        return result;
    };
    //3des
    var DESedeKeySpec = Java.use('javax.crypto.spec.DESedeKeySpec');
    DESedeKeySpec.$init.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.$init(a);
        mylog("======================================","","",0);
        var bytes_key_des = this.getKey();
        mylog("des密钥 " ,bytes_key_des,"",1);        
        return result;
    };

    DESedeKeySpec.$init.overload('[B', 'int').implementation = function (a, b) {
        showStacks();
        var result = this.$init(a, b);
        mylog("======================================","","",0);
        var bytes_key_des = this.getKey();
        mylog("des密钥 " , bytes_key_des,"",1);      
        return result;
    };


    var mac = Java.use('javax.crypto.Mac');
    var MAC算法名称=null;
    mac.getInstance.overload('java.lang.String').implementation = function (a) {
        showStacks();
        var result = this.getInstance(a);
        mylog("======================================","","",0);
        mylog("Mac算法名：" + a,"","",0);
        MAC算法名称 =a;
        return result;
    };
    mac.update.overload('[B').implementation = function (a) {
        showStacks();
        this.update(a);
        mylog("======================================","","",0);
        mylog(MAC算法名称+"update:" ,a,"",1);

    };
    mac.update.overload('[B', 'int', 'int').implementation = function (a, b, c) {
        showStacks();
        this.update(a, b, c);
        mylog("======================================","","",0);
        mylog(MAC算法名称+"update:" , a , "|" + b + "|" + c,1);      
    };
    mac.update.overload('java.nio.ByteBuffer').implementation = function (a) {
        showStacks();
        this.update(a);
        mylog("======================================","","",0);
        mylog(MAC算法名称+"update:" ,a.array() , "",1);      
    };
    mac.doFinal.overload().implementation = function () {
        showStacks();
        var result = this.doFinal();
        mylog("======================================","","",0);
        mylog(MAC算法名称+"doFinal结果:", result,"",1);
        return result;
    };
    mac.doFinal.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.doFinal(a);
        mylog("======================================","","",0);
        mylog(MAC算法名称+"doFinal参数:",a,"",1);
        return result;
    };
    mac.doFinal.overload('[B','int').implementation = function (a,b) {
        showStacks();
        var result = this.doFinal(a,b);
        mylog("======================================","","",0);
        mylog(MAC算法名称+"doFinal参数:",a,"  |  "+b,1);
        return result;
    };

    var md = Java.use('java.security.MessageDigest');
    var HX算法名称=null;
    md.getInstance.overload('java.lang.String', 'java.lang.String').implementation = function (a, b) {
        showStacks();
        mylog("======================================","","",0);
        mylog("算法名：" + a,"","",0);
        HX算法名称 = a;
        return this.getInstance(a, b);
    };
    md.getInstance.overload('java.lang.String', 'java.security.Provider').implementation = function (a, b) {
        showStacks();
        mylog("======================================","","",0);
        mylog("算法名：" + a,"","",0);
        HX算法名称 = a;
        return this.getInstance(a, b);
    };
    md.getInstance.overload('java.lang.String').implementation = function (a) {
        showStacks();
        mylog("======================================","","",0);
        mylog("算法名：" + a,"","",0);
        HX算法名称 = a;
        return this.getInstance(a);
    };
    md.update.overload('[B').implementation = function (a) {
        showStacks();
        mylog("======================================","","",0);
        mylog(HX算法名称+"_update:" , a,"",1);     
        return this.update(a);
    };
    md.update.overload('[B', 'int', 'int').implementation = function (a, b, c) {
        showStacks();
        mylog("======================================","","",0);
        mylog(HX算法名称+"_update:" , a , "|" + b + "|" + c,1);       
        return this.update(a, b, c);
    };
    md.update.overload('java.nio.ByteBuffer').implementation = function (a) {
        showStacks();
        this.update(a);
        mylog("======================================","","",0);
        mylog(HX算法名称+"update:" ,a.array() , "",1);      
    };
    md.digest.overload().implementation = function () {
        showStacks();
        mylog("======================================","","",0);
        var result = this.digest();
        mylog(HX算法名称+"_digest结果:" , result,"",1);        
        return result;
    };
    md.digest.overload('[B').implementation = function (a) {
        showStacks();
        mylog("======================================","","",0);
        mylog(HX算法名称+"_digest参数:" , a,"",1);
        var result = this.digest(a);
        mylog(HX算法名称+"_digest结果:" , result,"",1);        
        return result;
    } ; 
    md.digest.overload('[B','int','int').implementation = function (a,b,c) {
        showStacks();
        mylog("======================================","","",0);
        mylog(HX算法名称+"_digest参数:" , a,"   |"+b+"|"+c,1);
        var result = this.digest(a,b,c);
        mylog(HX算法名称+"_digest结果:" , result,"",1);        
        return result;
    };

    var ivParameterSpec = Java.use('javax.crypto.spec.IvParameterSpec');
    ivParameterSpec.$init.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.$init(a);
        mylog("======================================","","",0);
        mylog("iv向量: " ,a,"",1);
        return result;
    };
    var ivParameterSpec = Java.use('javax.crypto.spec.IvParameterSpec');
    ivParameterSpec.$init.overload('[B','int','int').implementation = function (a,b,c) {
        showStacks();
        var result = this.$init(a,b,c);
        mylog("======================================","","",0);
        mylog("iv向量: " ,a,"   |"+b+"|"+c,1);
        return result;
    };

    var cipher = Java.use('javax.crypto.Cipher');
    cipher.getInstance.overload('java.lang.String').implementation = function (a) {
        showStacks();
        var result = this.getInstance(a);
        mylog("======================================","","",0);
        mylog(AE算法名称+"_模式填充:" + a,"","",0);
        return result;
    };
    cipher.init.overload('int', 'java.security.Key').implementation = function (a, b) {
        showStacks();
        var result = this.init(a, b);
        mylog("======================================","","",0);
        if (N_ENCRYPT_MODE == a) 
        {
            mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        };

        var bytes_key = b.getEncoded();
        mylog(AE算法名称+"_init key:" + "|密钥" , bytes_key,"",1);       
        return result;
    };
    cipher.init.overload('int', 'java.security.cert.Certificate').implementation = function (a, b) {
        showStacks();
        var result = this.init(a, b);
        mylog("======================================","","",0);

        if (N_ENCRYPT_MODE == a) 
        {
            mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        };

        return result;
    };
    cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec').implementation = function (a, b, c) {
        showStacks();
        var result = this.init(a, b, c);
        mylog("======================================","","",0);

        if (N_ENCRYPT_MODE == a) 
        {
            mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        };

        var bytes_key = b.getEncoded();
        mylog(AE算法名称+"_init key:" + "|密钥" ,bytes_key,"",1); 
        return result;
    };
    cipher.init.overload('int', 'java.security.cert.Certificate', 'java.security.SecureRandom').implementation = function (a, b, c) {
        showStacks();
        var result = this.init(a, b, c);
        if (N_ENCRYPT_MODE == a) 
        {
            mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        };
        return result;
    };
    cipher.init.overload('int', 'java.security.Key', 'java.security.SecureRandom').implementation = function (a, b, c) {
        showStacks();
        var result = this.init(a, b, c);
        if (N_ENCRYPT_MODE == a) 
        {
            mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        };

         var bytes_key = b.getEncoded();
        mylog(AE算法名称+"_init key:" + "密钥:" , bytes_key,"",1);       
        return result;
    };
    cipher.init.overload('int', 'java.security.Key', 'java.security.AlgorithmParameters').implementation = function (a, b, c) {
        showStacks();
        var result = this.init(a, b, c);
        if (N_ENCRYPT_MODE == a) 
        {
           mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        };

        var bytes_key = b.getEncoded();
        mylog(AE算法名称+"_init key:" + "密钥:" , bytes_key,"",1);

        return result;
    };
    cipher.init.overload('int', 'java.security.Key', 'java.security.AlgorithmParameters', 'java.security.SecureRandom').implementation = function (a, b, c, d) {
        showStacks();
        var result = this.init(a, b, c, d);
        if (N_ENCRYPT_MODE == a) 
        {
            mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        }

        var bytes_key = b.getEncoded();
        mylog(AE算法名称+"_init key:" + "密钥:" , bytes_key,"",1);        
        return result;
    };
    cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec', 'java.security.SecureRandom').implementation = function (a, b, c, d) {
        showStacks();
        var result = this.update(a, b, c, d);
        if (N_ENCRYPT_MODE == a) 
        {
            mylog(AE算法名称+"_init  | 加密模式","","",0);    
        }
        else if(N_DECRYPT_MODE == a)
        {
            mylog(AE算法名称+"_init  | 解密模式","","",0);    
        };

         var bytes_key = b.getEncoded();
        mylog(AE算法名称+"_init key:" + "|密钥:" ,bytes_key,"",1);       
        return result;
    };

    cipher.update.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.update(a);
        mylog("======================================","","",0);
        mylog(AE算法名称+"_update:" , a,"",1);  
        return result;
    };
    cipher.update.overload('[B', 'int', 'int').implementation = function (a, b, c) {
        showStacks();
        var result = this.update(a, b, c);
        mylog("======================================","","",0);
        mylog(AE算法名称+"_update: " , a , "|" + b + "|" + c,1);
        return result;
    };
    cipher.update.overload('[B', 'int', 'int','[B').implementation = function (a, b, c,d) {
        showStacks();
        var result = this.update(a, b, c, d);
        mylog("======================================","","",0);
        mylog(AE算法名称+"_update: " , a , "|" + b + "|" + c,1);
        mylog(AE算法名称+"_update:结果: " , d , "|" + b + "|" + c,1);
        return result;
    };
    cipher.update.overload('[B', 'int', 'int','[B','int').implementation = function (a, b, c,d,e) {
        showStacks();
        var result = this.update(a, b, c, d,e);
        mylog("======================================","","",0);
        mylog(AE算法名称+"_update: " , a , "|" + b + "|" + c + "|" + e,1);
        mylog(AE算法名称+"_update:结果: " , d , "|" + b + "|" + c+ "|" + e,1);
        return result;
    }  ;  
    cipher.update.overload('java.nio.ByteBuffer', 'java.nio.ByteBuffer').implementation = function (a, b) {
        showStacks();
        var result = this.update(a,b);        
        mylog("======================================","","",0);
        mylog(AE算法名称+"(ByteBuffer)_update: " , a.array() ,"",1);
        mylog(AE算法名称+"(ByteBuffer)_update:结果: " , b.array(), "" ,1);
        return result;
    };
    cipher.doFinal.overload().implementation = function () {
        showStacks();
        var result = this.doFinal();
        mylog("======================================","","",0);
        mylog(AE算法名称+"_doFinal结果: ",result,"",1);
        return result;
    };
    cipher.doFinal.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.doFinal(a);
        mylog("======================================","","",0);
        mylog(AE算法名称+"_doFinal参数: " ,a,"",1);
        mylog(AE算法名称+"_doFinal结果: ",result,"",1);

        return result;
    };
    cipher.doFinal.overload('[B','int').implementation = function (a,b) {
        showStacks();
        var result = this.doFinal(a,b);
        mylog("======================================","","",0);        
        mylog(AE算法名称+"_doFinal结果: ", a,"   |"+b,1);

        return result;
    };

    cipher.doFinal.overload('[B','int','int').implementation = function (a,b,c) {
        showStacks();
        var result = this.doFinal(a,b,c);
        mylog("======================================","","",0);        
        mylog(AE算法名称+"_doFinal参数: " ,a,"   |"+b+"|"+c,1);
        mylog(AE算法名称+"_doFinal结果: ",result,"",1);
        return result;
    };

    cipher.doFinal.overload('[B','int','int','[B','int').implementation = function (a,b,c,d,e) {
        showStacks();
        var result = this.doFinal(a,b,c,d,e);
        mylog("======================================","","",0);        
        mylog(AE算法名称+"_doFinal参数: " ,a,"   |"+b+"|"+c,1);
        mylog(AE算法名称+"_doFinal结果: ",d,"  |"+e,1);
        return result;
    };
    cipher.doFinal.overload('[B','int','int','[B').implementation = function (a,b,c,d) {
        showStacks();
        var result = this.doFinal(a,b,c,d);
        mylog("======================================","","",0);        
        mylog(AE算法名称+"_doFinal参数: " ,a,"   |"+b+"|"+c,1);
        mylog(AE算法名称+"_doFinal结果: ",d,"",1);
        return result;
    };

    var x509EncodedKeySpec = Java.use('java.security.spec.X509EncodedKeySpec');
    x509EncodedKeySpec.$init.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.$init(a);
        mylog("======================================","","",0);
        mylog("RSA密钥:" + bytesToBase64(a),"","",0);
        return result;
    };

    var rSAPublicKeySpec = Java.use('java.security.spec.RSAPublicKeySpec');
    rSAPublicKeySpec.$init.overload('java.math.BigInteger', 'java.math.BigInteger').implementation = function (a, b) {
        showStacks();
        var result = this.$init(a, b);
        mylog("======================================","","",0);
        //console.log("RSA密钥:" + bytesToBase64(a));
        mylog("RSA密钥N:" + a.toString(16),"","",0);
        mylog("RSA密钥E:" + b.toString(16),"","",0);
        return result;
    };

    var KeyPairGenerator = Java.use('java.security.KeyPairGenerator');
    KeyPairGenerator.generateKeyPair.implementation = function () 
    {
        showStacks();
        var result = this.generateKeyPair();
        mylog("======================================","","",0);

        var str_private = result.getPrivate().getEncoded();
        var str_public = result.getPublic().getEncoded();
        mylog("公钥 |hex:" + bytesToHex(str_public),"","",0);
        mylog("私钥 |hex:" + bytesToHex(str_private),"","",0);

        return result;
    };

    KeyPairGenerator.genKeyPair.implementation = function () 
    {
        showStacks();
        var result = this.genKeyPair();
        mylog("======================================","","",0);

        var str_private = result.getPrivate().getEncoded();
        var str_public = result.getPublic().getEncoded();
        mylog("公钥 |hex:" + bytesToHex(str_public),"","",0);
        mylog("私钥 |hex:" + bytesToHex(str_private),"","",0);
        return result;
    };

        //返回输出流
        var OutStream = Java.use('java.io.OutputStream');
        OutStream['write'].overload('[B').implementation = function(data) {   
            showStacks();
            var ret = this.write(data);
            mylog("======================================","","",0);
            mylog("TCP接收 输出流:",data,"" ,1);
            return ret;
        };
        //返回输出流
        OutStream['write'].overload('[B','int','int').implementation = function(data,a,b) {   
            showStacks();
            var ret = this.write(data,a,b);
            mylog("======================================","","",0);
            mylog("TCP接收 输出流:",data,"  |"+a+"|"+b  ,1);
            return ret;
        };
         //返回输入流
    var Stream = Java.use('java.io.InputStream');
    Java.use("java.net.Socket").getInputStream.overload().implementation=function(){
        showStacks();
        mylog("tcp 输入流======================================","","",0);
        var rets = this.getInputStream()     
        return rets;
    };


    Stream['read'].overload('[B').implementation = function(data) {   
        mylog("tcp 输入流======================================","","",0);
            showStacks();
            var ret = this.read(data);
            mylog("======================================","","",0);
            mylog("tcp 输入流:",data,"" ,1);
            return ret;
        };
            //返回输入流
    Stream['read'].overload('[B','int','int').implementation = function(data,a,b) {  
        mylog("tcp 输入流======================================","","",0); 
        showStacks();
        var ret = this.read(data,a,b);
        mylog("======================================","","",0);
        mylog("tcp 输入流:",data,"  |"+a+"|"+b ,1);
        return ret;
    };
});



    '''
    return htmlstr


def mians(pakname):
    print(pakname)
    jscod = get_js()
    process = frida.get_remote_device().attach(pakname)
    script = process.create_script(jscod)
    script.on("message", on_message)
    script.load()
    sys.stdin.read()






