$(function(){
	reset();
	window.onresize=reset();
	$("#searchOpen").click(function(){$("#search").show()});
	$("#navOpen").click(function(){
		var navPopup = $("#navPopup");
		if(navPopup.is(":visible")){
			navPopup.hide();
		}else{
			if($(navPopup).find('a').length <= 0){
				var nav = $('#nav');
				var alist = $(nav).find('a');
				var len = alist.length;
				var fragment = document.createDocumentFragment();
				for(var i = 5;i < len;i++){
					fragment.appendChild(alist[i]);
				}
				$('#navPopup').append(fragment);
			}
			navPopup.show();
		}
		
		});
	$("#searchClose").click(function(){$("#search").hide()});
	$("#userOpen").click(function(){
		if($("#userPopup").is(":visible")){
			$("#userOpen").removeClass("on");
			$("#userPopup").hide();
		}else{
			$("#userOpen").addClass("on");
			$("#userPopup").show();
		}
		
	});
	var navWidht=0;
	$("#nav .nav-item").each(function(){
		navWidht=navWidht+$(this).outerWidth()+5;
	});
	$("#nav").width(navWidht);
	$('.v-top').click(function(){
		$(window).scrollTop(0);
	});
});
function reset(){
	var bWidth=document.body.clientWidth;//获取 屏幕的宽度
	//bWidth = bWidth>640 ? 640 : bWidth;//如果宽度大于640那么就给他复制为640
	var size=bWidth/320*20;
	document.getElementsByTagName('html')[0].style.fontSize=size+'px';
}