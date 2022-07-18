let password = "lx123";
let key = "1234567890abcdef"
// AES加密
cfg = {
 mode: CryptoJs.mode.ECB,
 padding: CryptoJs.pad.Pkcs7
}
let encPwd = CryptoJs.AES.encrypt(password, key, cfg).toString()

// AES解密
let key = CryptoJs.enc.Utf8.parse("1234567890abcdef")
cfg = {
 mode: CryptoJs.mode.ECB,
 padding: CryptoJs.pad.Pkcs7
}
encPwd = "+4X1GzDcLdd5yb3PiZLxdw=="
decPwd = CryptoJs.AES.decrypt(encPwd, key, cfg).toString(CryptoJs.enc.Utf8) // 指定解码方式
console.log(decPwd)  // lx123