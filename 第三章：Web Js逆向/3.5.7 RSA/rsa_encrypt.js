window = global;
const JSEncrypt = require('jsencrypt');
publickey = '公钥';

// 加密
let jse = new JSEncrypt();
jse.setPublicKey(publickey);
var encStr = jse.encrypt('username');

// 解密
privatekey = '私钥';
jse.setPrivateKey(privatekey);
var Str = jse.decrypt(encStr);