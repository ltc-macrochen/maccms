var system ={win : false,mac : false,xll : false};
var p = navigator.platform;
system.win = p.indexOf("Win") == 0;
system.mac = p.indexOf("Mac") == 0;
system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
if(system.win||system.mac||system.xll){
// pc广告代码    html代码要转换成js代码才可以
}
else{
// 手机广告代    html代码要转换成js代码才可以
}

//-------------------------------------------    上面一种大概只适合 安卓与pc   ---------------------------------------------------------

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
    //alert(navigator.userAgent);  
    window.location.href ="iPhone.html";
} else if (/(Android)/i.test(navigator.userAgent)) {   //判断Android
    //alert(navigator.userAgent); 
    window.location.href ="Android.html";
} else {  //pc
    window.location.href ="pc.html";
};