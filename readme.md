《爬虫工程师进阶指南》书籍代码库


##  Unable to access ... 443: Timed out 

取消全局解决：

git config --global --unset http.proxy

git config --global --unset https.proxy

给pycharm挂上vpn再push

或者
git config --local http.proxy 127.0.0.1:4780


## Unable to access xxx OpenSSL SSL_read: Connection was reset, errno 10054

git config --global http.sslBackend "openssl"


