夜神安卓7系统的charles证书导入。由于用户安装的外部证书不被信任，所以需要把SSL证书安装到安卓系统证书目录里。

---

## 一：下载证书
开启本地代理，在浏览器输入 chls.pro/ssl 下载证书到本地。

把证书原名charles-proxy-ssl-proxying-certificate.pem 先修改为 charles.pem

---

## 二：打印证书

通过openssl输出证书内容，自行安装openssl

下载地址：[https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)

安装后通过 openssl command 打开command。
![在这里插入图片描述](https://img-blog.csdnimg.cn/d4abf24ca70044fb9e277ae9da79b83b.png)

输入 `openssl x509 -inform PEM -subject_hash_old -in charles.pem`

执行后打印的结果中，第一行的90e59ded复制一下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f5f9c2e095fc49519ded35f9e4201ffd.png)

此处把证书名修改为 90e59ded.0   。 注意格式，你修改为 xxx.0


---

## 三：导入设备

不管啥方法，把证书传进设备的 /sdcard/ 文件下。

可以通过adb push，命令： `adb push xxx.0 /sdcard/`

然后进入adb shell中，adb shell 连接手机，不是root的通过命令 su 切换下，然后cd到 /sdcard/中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c3163457f4904b40a1c7e68bc62f6a0f.png)

没问题的话将证书移动到 /system/etc/security/cacerts/ 路径下。
命令： `mv xxx.0 /system/etc/security/cacerts/`

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e127a9157be41ae861fad05223fd2c7.png)

有可能会执行失败，说只读之类的Read-only file system 
可以先执行命令：`mount -o rw,remount /system`
或者执行命令：`mount -o rw,remount /`
然后再mv移动。


---


## 四：证书授权

给证书权限的执行命令：`chmod 777 /system/etc/security/cacerts/xxx.0`

重启手机：`reboot`

证书导入完成，配置下wifi代理就可以正常抓包了。

