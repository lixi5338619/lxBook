本文内容是 heytap软件商店抓包案例。

---

用常规的http/https工具，比如charles、fiddler去抓包时，无法正常对heytapmobi进行抓包。

会提示客户端SSL握手失败，Received fatal alert: certificate_unknown

![在这里插入图片描述](https://img-blog.csdnimg.cn/5f2fa7e1e3104de5b9d5e88adfa9e107.png)


本以为是双向认证的原因，但是并没找到有效的客户端证书，所以开始通过其他工具进行抓包。

拿httpCanary试过，并没有拦截到。

经过一番测试发现使用NetKeeper可解决问题。

---

**NetKeeper抓包精灵** 不需要ROOT，通过抓包的结果还能抓取音频以及视频。


设置一下过滤条件，方便查看数据包。
![在这里插入图片描述](https://img-blog.csdnimg.cn/4c6080a4ddc3429b9010ac78b0a3006d.png?)

触发评论请求后，成功看到数据包。

https://api-cn.store.heytapmobi.com:443/common/v1/comment/list?appId=3700438&size=10&start=40&token=-1&type=bad

**Type类型：** hot、good、middle、bad
![在这里插入图片描述](https://img-blog.csdnimg.cn/3ea8c6729c874963aa36a60b8f171744.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6ICD5Y-k5a2m5a62bHg=,size_20,color_FFFFFF,t_70,g_se,x_16)

可以发现有加密参数sign。

抓到包后，后面的操作就不再多说了，大家自行研究。

---


我在源码中也直接搜索过comment相关api，通过hook一些类也能拿到数据接口。


