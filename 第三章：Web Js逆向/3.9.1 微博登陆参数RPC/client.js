!function(){
     if (window.flagLX){}
     else{
    window.weiboLx = makeRequest;
    var ws = new WebSocket("ws://127.0.0.1:9999");
    window.flagLX =true;
    ws.open = function(evt){};
    ws.onmessage = function(evt){
        var lx = evt.data;
        var result = lx.split(",");
        var res = window.weiboLx(result[0],result[1],7,false);
        ws.send(JSON.stringify(res));
    }}
}();
