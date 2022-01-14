window.dataLx = r;                                                                                                                               
!function(){
   var res = window.dataLx;
   if (window.flagLX){
          window.wsLX.send(JSON.stringify(res));
   }
   else{
          var ws = new WebSocket("ws://127.0.0.1:9999");
          window.wsLX = ws;
          window.flagLX =true;
          ws.open = function(evt){};
          ws.onmessage = function(evt){
              ws.send(JSON.stringify(res));
 }}
}();