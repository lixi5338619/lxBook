(TODO:之前的版本失效了，大家查看最近提交的文件，旧版可作为参考)

对RPC来讲，需要找可调用的方法入口，像头条系这种在send后重写url的，可以通过查找xmlhttprequest堆栈来定位。


![image](https://user-images.githubusercontent.com/45314745/171310204-09a84299-544e-4fd2-bc1f-bc6cd61e2284.png)


找到h.onreadystatechange,可知h就是xmlhttprequest对象.在控制台输出可以看到responseURL中生成了带签名的url。


![image](https://user-images.githubusercontent.com/45314745/171310487-323cd907-0105-4946-b9b9-f3f88e00c4f1.png)


所以我们按照书中方法，进行模拟执行即可。 （可以看视频教程有助理解）


代码中需要安装的依赖库： requests、lxpy、selenium、Crypto

Crypto库下载链接：https://pan.baidu.com/s/1xOg9qKWNsMfmWuT20Gf9FA?pwd=9999
