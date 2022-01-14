app.launchApp('微信');

//跳转到首页
function goToHomePage(){
    let k = 0;
    while(k < 30){
        k = k + 1;
        if(text("微信").depth(10).exists()){
            toast('到首页');
            break;
        }else{
            back();
            sleep(1000*0.2);
        }
    }
}

//跳转到指数页面
function goToZhiShuPage(){
    var it = className("android.widget.ImageView").depth(17).findOne();
    var b = it.bounds();
    click(b.centerX(), b.centerY());
    sleep(1500);

    //跳转到 微信指数 小程序
    id('m7').findOne().setText('微信指数');
    sleep(1000);

    var wxzs = text('微信指数').depth(14).findOne();
    var bb = wxzs.bounds();
    click(bb.centerX(), bb.centerY());
}

//根据关键字查询
function getZhiShuForKey(tkey){
    sleep(1000*1.5);
    var wxzs = text('搜索').findOne();
    var bb = wxzs.bounds();
    click(bb.centerX(), bb.centerY());

    className('android.widget.EditText').findOne().setText(tkey);
    sleep(1000);

    //点击键盘上面的'搜索'按钮
    click(device.width - 16, device.height - 16);
    sleep(1000*2);

    //获取关键字和指数
    let findData = {keyword:tkey, //关键字
        dataKey:'',     //时间戳，显示在界面上的时间
         zhishu:''      //指数值
        };

    try {
        findData.dataKey = className('android.view.View').findOne().text();
    } catch (error) {
        toast(error);
        exit();
    }
    toast('日期' + findData.dataKey + ', 指数' + findData.zhishu);
}

// “微信指数”
if(1){
    goToHomePage();
    goToZhiShuPage();
    getZhiShuForKey('Lx');
    sleep(1000);
}