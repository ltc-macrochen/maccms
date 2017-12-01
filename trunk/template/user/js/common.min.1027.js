function changeButtn() {
	if (navigator.userAgent.match(/android/i)) {
		var node = $('p.pBottom');
		if (node.attr('noplay')) {
			node.html('<span class="sBtn"><a href="http://app.2345.cn/appmovie/2345ysxq.apk" class="downloadBtn">客户端观看</a></span>')
		}
	}
}
changeButtn();
function showDownLoad() {
	if ($.cookie == undefined) {
		return
	}
	var sign = $.cookie('showdownload');
	if (sign) {
		return false
	}
	var url = window.location.href;
	if (url.match(/from=daohang/i) || url.match(/\/\d+(\.html)?/i) || url.match(/zy_\d+/i) || url.match(/juqing/i) || url.match(/feedback/i) || url.match(/search\.php/i) || url.match(/\/login/i)) {
		return false
	}
	if (navigator.userAgent.match(/android/i)) {
		$.ajax({
			'url': 'http://dianying.v.lyaoyu.cn/moviecore/server/mversion/index.php?ctl=guide&callId=?'
		})
	}
}
showDownLoad();
function setGuideInfo(_url, _img, _color) {
	if (!$('.downLoadPopB')[0]) {
		return
	}
	if (_url) {
		$('.downLoadPopB .blueBtn').attr('href', _url)
	}
	if (_img) {
		$('.downLoadPopB').css('background-image', 'url(http://img.lyaoyu.cn' + _img + ')')
	}
	if (_color) {
		$('.downLoadPopB').css('background-color', _color)
	}
	$('.downLoadPopB').show();
	$('body').css('overflow', 'hidden');
	$.cookie('showdownload', 1, {
		path: '/',
		domain: 'v.lyaoyu.cn',
		secure: false
	})
}
function forget(e) {
	if ($(e).hasClass('iCheckedIcon')) {
		$(e).removeClass('iCheckedIcon');
		var date = new Date();
		date.setTime(date.getTime() - 1);
		$.cookie('showdownload', '', {
			expires: date,
			path: '/',
			domain: 'v.lyaoyu.cn'
		})
	} else {
		$(e).addClass('iCheckedIcon');
		$.cookie('showdownload', 1, {
			path: '/',
			domain: 'v.lyaoyu.cn',
			secure: false
		})
	}
}
function jump() {
	closeDownLoad()
}
function closeDownLoad() {
	$('.downLoadPopB').hide().remove();
	$('body').scroll(0, 0);
	$('body').css('overflow', '')
}
function toggleIntro() {
	var showintro = $(".pIntroTxt").html();
	$(".pIntroTxt").html($("#hidden_intro").val());
	$("#hidden_intro").val(showintro)
}
var userLogedFav = false;
var PLAYHREF = '';
var shoucang = {
	opt: {},
	init: function(_channel, _id, _title) {
		document.domain = "v.lyaoyu.cn";
		var that = this;
		that.opt._channel = _channel;
		that.opt._id = _id;
		that.opt._title = escape(_title);
		that.bindFavBtn();
		if (_channel && _id) {
			that.dealFav('readFav')
		}
	},
	showTips: function() {
		if (!$('.aCollectBtn .emTips')[0]) {
			return
		}
		if (!$.cookie('shoucang_tips_hide')) {
			$('.aCollectBtn .emTips').show();
			var options = [];
			options.expires = 365;
			options.path = '/';
			options.domain = 'v.lyaoyu.cn';
			$.cookie('shoucang_tips_hide', '1', options);
			return
		}
		$('.aCollectBtn .emTips').hide()
	},
	bindAddToplayFav: function() {
		var self = this;
		$('.aPlayBtn').click(function() {
			self.dealPlayFav(this)
		})
	},
	bindAddEpisodePlayFav: function() {
		var self = this;
		$('.ulNumList li a').each(function(k, e) {
			$(e).click(function() {
				self.dealPlayFav(e)
			})
		})
	},
	dealPlayFav: function(_obj) {
		PLAYHREF = $(_obj).attr('data-href');
		if (!$.cookie('uid') || !$.cookie('passid')) {
			if (PLAYHREF) {
				location.href = PLAYHREF
			}
			return
		}
		if (!$(_obj).attr('data-id') || !$(_obj).attr('data-api') || !$(_obj).attr('data-type')) {
			if (PLAYHREF) {
				location.href = PLAYHREF
			}
			return
		}
		var _id = $(_obj).attr('data-id');
		var _api = $(_obj).attr('data-api');
		var _type = $(_obj).attr('data-type');
		var _episode = $(_obj).attr('data-episode');
		$.ajax({
			'url': 'http://v.lyaoyu.cn/moviecore/server/mversion/user/index.php?act=addHistory&callId=?',
			'data': {
				'id': _id,
				'type': _type,
				'api': _api,
				'epiId': _episode,
				'callback': 'shoucang.playFavCallback'
			}
		});
		return false
	},
	playFavCallback: function(_json) {
		if (PLAYHREF) {
			location.href = PLAYHREF
		}
		return true
	},
	dealUserFav: function(_act) {
		var self = this;
		switch (_act) {
		case 'clickFav':
			self.opt._act = 'addCollect';
			break;
		case 'cancelFav':
			self.opt._act = 'delCollect';
			break;
		case 'readFav':
			self.opt._act = 'isCollect';
			break
		}
		var self = this;
		var _type = self.opt._channel ? self.opt._channel: 0;
		if (!_type) {
			return
		}
		if (_act == 'clickFav' || _act == 'cancelFav') {
			_dct_('m_detail_' + _type + '_shoucang')
		}
		switch (_type) {
		case 'dy':
			_type = 1;
			break;
		case 'tv':
			_type = 2;
			break;
		case 'dm':
			_type = 3;
			break;
		case 'zy':
			_type = 4;
			break
		}
		$.ajax({
			'url': 'http://v.lyaoyu.cn/moviecore/server/mversion/user/index.php?channel=collect&act=' + self.opt._act + '&callId=?',
			'data': {
				'id': self.opt._id,
				'type': _type,
				'callback': 'shoucang.favCallback'
			}
		})
	},
	favCallback: function(_json) {
		if (!_json) {
			return alert('服务器暂时未响应，请稍后重试')
		}
		if (parseInt(_json.code) === 1) {
			var favBtn = 'collectBtn',
			favBtnClass = 'collectBtnCur';
			if (!$('.' + favBtn)[0]) {
				favBtn = 'favoriteBtn';
				favBtnClass = 'cur'
			}
			switch (this.opt._act) {
			case 'addCollect':
				$('.' + favBtn).addClass(favBtnClass);
				$('.' + favBtn).html('<i class="iIcon"></i>已收藏');
				break;
			case 'delCollect':
				$('.' + favBtn).removeClass(favBtnClass);
				$('.' + favBtn).html('<i class="iIcon"></i>收藏');
				break;
			case 'isCollect':
				$('.' + favBtn).addClass(favBtnClass);
				$('.' + favBtn).html('<i class="iIcon"></i>已收藏');
				break
			}
		} else if (parseInt(_json.code) === 2 && this.opt._act !== 'isCollect') {
			alert('操作失败，请稍后重试')
		}
	},
	dealFav: function(_act, isClick) {
		var _channel = this.opt._channel || arguments[1];
		var _types = 'dy,tv,zy,dm';
		var _acts = 'clickFav,cancelFav,readFav';
		if (isClick && !$.cookie('name_ie')) {
			if ($('.loginPop')[0] && !navigator.userAgent.match(/android 2\.3/i) && !navigator.userAgent.match(/android\/2\.3/i)) {
				this.showLogin()
			} else {
				if (confirm('您还未登录，是否马上登录？')) {
					location.href = 'm.v.lyaoyu.cnlogin/'
				}
			}
			return
		}
		if ($.cookie('name_ie') && _types.indexOf(_channel) !== -1 && _acts.indexOf(_act) !== -1) {
			return this.dealUserFav(_act)
		}
		var _id = this.opt._id || arguments[2];
		var _title = this.opt._title || arguments[3];
		var src = this.opt._src || '';
		var iframe = $('#favIframe');
		if (!iframe[0]) {
			$('<iframe id="favIframe">').appendTo(document.head).hide();
			iframe = $('#favIframe')
		}
		if (!src) {
			var src = 'm.v.lyaoyu.cnstorageHead.html?';
			if (_act) {
				src += 'action=' + _act
			}
			if (_channel && _id) {
				src += '&key=' + _channel + '_' + _id;
				src += '&fav=' + _channel + '_' + _id
			}
			if (_title) {
				src += '&title=' + _title
			}
		}
		iframe.attr({
			'src': src
		});
		if (_act) {
			iframe.ready(function() {
				setTimeout(function() {
					iframe[0].parentNode.removeChild(iframe[0])
				},
				500)
			})
		}
	},
	showLogin: function() {
		isCrossLogin = true;
		muser.showMsg('', '');
		window.scroll(0, 0);
		$('#mask_box').show();
		$('.loginPop').show()
	},
	bindFavBtn: function() {
		var that = this;
		var favBtn = 'collectBtn';
		if (!$('.' + favBtn)[0]) {
			favBtn = 'favoriteBtn'
		}
		$('.' + favBtn).click(function() {
			var type = $(this).attr("type");
			var cur = $(this).attr("class");
			if (type) {
				if (!cur.match(/cur/) && !cur.match(/collectBtnCur/)) {
					that.dealFav('clickFav', true)
				} else {
					that.dealFav('cancelFav', true)
				}
			}
		})
	}
};
$(".tabNav").delegate("li", "click",
function(e) {
	$(".tabNav li").find("span").removeClass("cur");
	$(this).find('span').addClass('cur');
	var num = $(this).index();
	$('div.tabCon').hide().eq(num).show()
});
if ($('#juji')[0]) {
	var width = $('#juji').width() + 30;
	$('#juji2 .conBox ').css({
		'width': width
	});
	var indexMenu2 = new iScroll('juji2', {
		hScroll: true,
		vScroll: false,
		bounce: false,
		momentum: true
	});
	$(window).on('resize',
	function() {
		$('#juji2 .conBox ').css({
			'width': ''
		});
		var width = $('#juji').width() + 30;
		$('#juji2 .conBox ').css({
			'width': width
		});
		indexMenu2.refresh();
		isShow()
	});
	function isShow() {
		var width1 = $('#juji').width();
		var width2 = document.documentElement.clientWidth;
		if (width2 < width1) {
			$('#juji2').removeClass('numListWid');
			$('#juji2').addClass('numListWid')
		} else {
			$('#juji2').removeClass('numListWid')
		}
	}
	isShow();
	$(function() {
		$(window).scroll(function() {
			var sign = $('.numListBox').offset().top;
			var x = $(this).scrollTop();
			if (x > sign && !$('#juji2').hasClass('fixBox')) {
				$('#juji2').addClass('fixBox')
			} else if (x < sign && $('#juji2').hasClass('fixBox')) {
				$('#juji2').removeClass('fixBox')
			}
		})
	})
}
function clickCur(obj) {
	$(obj).removeClass("cur");
	$(obj).parent().siblings().find("a").addClass("cur")
}
function historyBack() {
	var refererCookie = getDelCookie();
	if (refererCookie) {
		window.location.href = refererCookie;
		return
	}
	var lastUrl = document.referrer;
	if (lastUrl && (lastUrl.indexOf('action') == 0 || lastUrl.indexOf('.v.lyaoyu.cn/m/'))) {
		history.back()
	} else {
		window.location.href = 'm.v.lyaoyu.cn'
	}
}
getDelCookie();
function getDelCookie() {
	var refererCookie = '',
	search = 'm_list_referer=';
	if (document.cookie.length > 0) {
		var offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			var end = document.cookie.indexOf(';', offset);
			if (end == -1) {
				end = document.cookie.length
			}
			refererCookie = unescape(document.cookie.substring(offset, end))
		}
	}
	var referer = document.referrer;
	var location = window.location.href;
	if (location.indexOf('/m/detail/') === -1 && location.indexOf('/m/zy_') === -1 && location.indexOf('/m/dm/') === -1) {
		var date = new Date();
		date.setTime(date.getTime() - 10000);
		document.cookie = "m_list_referer=0;expires=" + date.toGMTString() + ";path=/;domain=.v.lyaoyu.cn;"
	}
	return refererCookie
}
function _dct_(vUrl) {
	var url = 'http://union2.50bang.org/web/ajax35?uId2=SPTNPQRLSX&r=';
	url += encodeURIComponent(document.referrer);
	url += '&fBL=' + screen.width + '*' + screen.height;
	url += '&lO=' + encodeURIComponent(vUrl);
	$.ajax({
		type: 'get',
		url: url
	});
	return true
}
function resizeImgCommon() {
	var arg = arguments[0] || 'resize_list';
	var width = $('#' + arg).width();
	height = $('#' + arg).height();
	width = parseInt(width * 0.31999);
	height = parseInt(260 * (width / 195));
	$('#' + arg + ' img').css({
		'width': width,
		'height': height
	});
	arg == 'resize_list' && $('#' + arg + ' a').css({
		'width': width,
		'height': height
	})
}
if ($('#resize_list').length) {
	resizeImgCommon();
	$(window).on('resize',
	function() {
		resizeImgCommon()
	})
}
if ($('#nav_menu')[0]) {
	var width = $('.subNav p').width() + 30;
	$('#nav_menu .con').css({
		'width': width
	});
	var indexMenu = new iScroll('nav_menu', {
		hScroll: true,
		vScroll: false,
		bounce: true,
		momentum: true
	});
	$(window).on('resize',
	function() {
		$('#nav_menu .con').css({
			'width': ''
		});
		var width = $('.subNav p').width() + 30;
		$('#nav_menu .con').css({
			'width': width
		});
		indexMenu.refresh()
	});
	if ($('#nav_menu a.cur')[0]) {
		var screenWidth = $('.header').width();
		var left = $('#nav_menu a.cur').offset().left;
		var scrollLeft = parseInt(screenWidth - left);
		if (scrollLeft < 30) {
			indexMenu.scrollTo( - screenWidth)
		}
	}
}
$('.aSearch')[0] && $('.aSearch').click(function(e) {
	$('#index_menu_box').hide();
	$('.index_menu_top').hide();
	$('.ulHotList').hide();
	$('.loginPop').hide();
	$('.headRight a').removeClass('cur');
	if ($('#search_box').css('display') == 'none') {
		$('html,body').css({
			'overflow-y': 'hidden'
		});
		$('.aSearch').addClass('cur');
		$('#mask_box').show();
		$('#search_box').show();
		$('#hot_word_box').show();
		$('.searchTxt').focus()
	} else {
		searchM.addCurClass();
		$('html,body').css({
			'overflow-y': ''
		});
		$('#hot_word_box').hide();
		$('#search_box').hide();
		$('#mask_box').hide()
	}
});
$('.aNav')[0] && $('.aNav').click(function() {
	if (!$('.searchForm')[0]) {
		$('#search_box').hide()
	}
	$('.ulHotList')[0] && $('.ulHotList').hide();
	$('.loginPop').hide();
	$('.headRight a').removeClass('cur');
	if ($('.index_menu_top')[0]) {
		$('#mask_box').hide();
		if ($('.index_menu_top').css('display') == 'none') {
			$('.index_menu_top').show();
			$('#nav_menu .con').css({
				'width': ''
			});
			var width = $('.subNav p').width() + 30;
			$('#nav_menu .con').css({
				'width': width
			});
			indexMenu.refresh()
		} else {
			searchM.addCurClass();
			$('.index_menu_top').hide()
		}
	} else {
		if ($('#index_menu_box').css('display') == 'none') {
			$('html,body').css({
				'overflow-y': 'hidden'
			});
			$('.aNav').addClass('cur');
			$('#mask_box').show();
			$('#index_menu_box').show()
		} else {
			searchM.addCurClass();
			$('html,body').css({
				'overflow-y': 'auto'
			});
			$('#index_menu_box').hide();
			$('#mask_box').hide()
		}
	}
});
if ($('#search_menu')[0]) {
	var width = $('.searchNav p').width() + 30;
	$('#search_menu .con').css({
		'width': width
	});
	var searchMenu = new iScroll('search_menu', {
		hScroll: true,
		vScroll: false,
		bounce: true,
		momentum: true
	});
	$(window).on('resize',
	function() {
		$('#search_menu .con').css({
			'width': ''
		});
		var width = $('.searchNav p').width() + 30;
		$('#search_menu .con').css({
			'width': width
		});
		searchMenu.refresh()
	});
	if ($('#search_menu a.cur')[0]) {
		var screenWidth = $('.header').width();
		var leftWidth = $('#search_menu a.cur').offset().left;
		var aWidth = $('#search_menu a.cur').width();
		var scrollLeft = parseInt(screenWidth - leftWidth - aWidth);
		if (scrollLeft < 5) {
			searchMenu.scrollTo( - screenWidth)
		}
	}
}
var searchM = {
	isScrolled: 0,
	curIndex: false,
	init: function() {
		if (!$('#search_box')) {
			return
		}
		var that = this;
		that.getHotWord();
		that.getHistory();
		that.dealInput();
		that.searchPage();
		that.addHistory();
		that.getCurIndex();
		that.hideAll();
		$('.searchBtn')[0] && $('.searchBtn').click(function() {
			that.submitSearch()
		})
	},
	getCurIndex: function() {
		var that = this;
		if ($('.headRight')[0]) {
			$('.headRight a').each(function() {
				if ($(this).attr('class').indexOf('cur') !== -1) {
					that.curIndex = $(this).index()
				}
			})
		}
	},
	addCurClass: function() {
		this.curIndex && $($('.headRight a')[this.curIndex]).addClass('cur')
	},
	hideAll: function() {
		var that = this;
		$('#search_main')[0] && $(document).click(function(e) {
			if (e.target.id != 'search_box' && e.target.id != 'search_form' && e.target.className != 'searchTxt' && e.target.parentNode.className != 'clearSearchBtn') {
				$('#search_history_list').hide()
			}
		});
		$('#mask_box').click(function() {
			$('.headRight a').removeClass('cur');
			$('#hot_word_box').hide(); ! $('#search_main')[0] && $('#search_box').hide();
			$('#mask_box').hide();
			$('.loginPop').hide();
			$('#index_menu_box').hide();
			$('.index_menu_top').hide();
			$('html,body').css({
				'overflow-y': ''
			});
			that.addCurClass()
		})
	},
	submitSearch: function() {
		var keyword = $('.searchTxt').val();
		if (keyword.replace(/\s*/g, '') != '' && keyword != '请输入影片或演员...') {
			$('#search_form').submit();
			return true
		}
		return false
	},
	dealInput: function() {
		var that = this;
		var searchTxt = $('.searchTxt');
		if (searchTxt.val() != '') {
			if (searchTxt.val() == '请输入影片或演员...') {
				searchTxt.addClass('searchTxtBlur')
			} else {
				$('.clearSearchBtn').show()
			}
		}
		searchTxt.focus(function() {
			if (searchTxt.val() == '请输入影片或演员...') {
				$(this).val('');
				$(this).removeClass('searchTxtBlur');
				$('.clearSearchBtn').hide()
			}
			if ($('.ulHotList').html() != '') {
				$('#hot_word_box').hide();
				$('.ulHotList').show()
			}
		}).blur(function() {
			if (searchTxt.val() == '') {
				$(this).val('请输入影片或演员...');
				$(this).addClass('searchTxtBlur')
			}
		});
		$(window).keyup(function() {
			if (searchTxt.val() != '') {
				$('.clearSearchBtn').show()
			} else {
				$('.clearSearchBtn').hide()
			}
		});
		$('.clearSearchBtn').click(function() {
			$('.searchTxt').val('');
			$(this).hide();
			$('.searchTxt').focus()
		})
	},
	dealHistory: function(_action, _key, _keyword) {
		var iframeId = 'historyIframe_' + _action;
		var iframe = $('#' + iframeId);
		if (!iframe[0]) {
			$('<iframe id="' + iframeId + '">').appendTo(document.head);
			iframe = $('#' + iframeId)
		}
		var src = 'm.v.lyaoyu.cnstorageHead.html?action=search_' + _action;
		_key && (src += '&key=' + _key);
		_keyword && (src += '&keyword=' + escape(_keyword));
		iframe.attr({
			'src': src
		});
		iframe.ready(function() {
			setTimeout(function() {
				iframe[0].parentNode.removeChild(iframe[0])
			},
			500)
		})
	},
	addHistory: function() {
		if (!$('.searchTxt')[0]) {
			return
		}
		var keyword = $('.searchTxt').val();
		if (keyword.replace(/\s*/g, '') != '' && keyword != '请输入影片或演员...') {
			var timer = new Date().getTime();
			keyword = this.html2Escape(keyword);
			this.dealHistory('add', timer, keyword)
		}
	},
	getHistory: function() {
		var that = this;
		document.domain = 'v.lyaoyu.cn';
		that.dealHistory('list')
	},
	bindHistoryEvent: function() {
		$("#search_history_list a").click(function() {
			if ($(this).attr('class') != 'aClearBtn' && $(this).attr('class') != 'aCloseBtn') {
				$('.searchTxt').removeClass('searchTxtBlur');
				$('.searchTxt').val($(this).attr('data-keyword'));
				$('#search_form').submit()
			}
			$('.ulHotList').hide()
		});
		$('.aCloseBtn').click(function() {
			$('.ulHotList').hide();
			$('#hot_word_box')[0] && $('#hot_word_box').show()
		});
		$('.aClearBtn').click(function() {
			$('.ulHotList').hide();
			$('.ulHotList').html('');
			searchM.dealHistory('clear')
		})
	},
	getHotWord: function() {
		if ($('.searchForm')[0] || typeof(hotword_mobile) == "undefined") {
			return
		}
		if (hotword_mobile && hotword_mobile.length) {
			if ($('#hot_word_box').html() == '') {
				var html = ['<span class="sTit">热搜词</span>'];
				for (var i in hotword_mobile) {
					html.push('<a href="' + hotword_mobile[i]['url'] + '" target="_blank" title="' + hotword_mobile[i]['title'] + '" style="color:' + hotword_mobile[i]['color'] + ';">' + hotword_mobile[i]['title'] + '</a>')
				}
				$('#hot_word_box').html(html.join(''))
			}
			$('#hot_word_box').show()
		} else {
			$('#hot_word_box').hide()
		}
	},
	searchPage: function() {
		if (!$('#search_main')[0]) {
			return
		}
		this.bindScroll()
	},
	bindScroll: function() {
		var that = this;
		$(window).scroll(function() {
			var pageTotal = parseInt($('#page_more').attr('data-total'));
			var pageNow = parseInt($('#page_more').attr('data-page'));
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $('.wrapper').height() - scrollTop - $(document).height();
			if (scrollHeight <= 30 && !that.isScrolled && pageTotal >= pageNow) {
				that.nextPage()
			}
		});
		return
	},
	nextPage: function(ele) {
		var ele = $('#page_more'),
		that = this;
		that.isScrolled = 1;
		var _page = $(ele).attr('data-page');
		if (!_page) {
			return false
		}
		$('#loading_more').show();
		var url = ele.attr('data-url');
		$.ajax({
			'url': url,
			'data': {
				'page': _page,
				'is_ajax': 1
			},
			'type': 'get',
			'charset': 'gb2312',
			'success': function(json) {
				if (json) {
					var _json = eval('(' + json + ')');
					var _html = that.createHtml(_json['list']);
					var pageTotal = _json['page_num'];
					$('#loading_more').hide();
					$('#data_list').append(_html);
					var pageNext = parseInt(_page) + 1;
					if (pageNext <= pageTotal) {
						$(ele).attr('data-page', pageNext);
						that.isScrolled = 0
					}
				}
			}
		})
	},
	createHtml: function(_json) {
		if (!_json) {
			return
		}
		var that = this;
		var _html = new Array();
		for (var i in _json) {
			var clickCode = 'm_so_pic_';
			_html.push('<li><div class="pic">');
			if (_json[i]['cntype'] == '电视剧') {
				clickCode += 'tv'
			} else if (_json[i]['cntype'] == '电影') {
				clickCode += 'dy'
			} else if (_json[i]['cntype'] == '综艺节目') {
				clickCode += 'zy'
			} else if (_json[i]['cntype'] == '动漫') {
				clickCode += 'dm'
			}
			_html.push('<a href="' + _json[i]['detail_surl'] + '" onclick="_dct_(\'' + clickCode + '\');" target="_self" rel="nofollow">');
			_html.push('<img src="' + _json[i]['img'] + '" onerror="nofind(this);" alt="">');
			_html.push('<span class="sStyle">' + _json[i]['cntype'].replace('节目', '') + '</span>');
			if (_json[i]['cntype'] == '电影') {
				_html.push('<span class="sDes">' + _json[i]['duration'] + '</span>')
			}
			_html.push('</a></div>');
			_html.push('<div class="txt');
			if (!_json[i]['play_link'] || !_json[i]['play_link']['list']) {
				_html.push(' txtHeight')
			}
			_html.push('"><span class="sTit">' + _json[i]['title2'] + '</span>');
			if (_json[i]['cntype'] == '电视剧') {
				_html.push(that.tvHtml(_json, i))
			} else if (_json[i]['cntype'] == '电影') {
				_html.push(that.dyHtml(_json, i))
			} else if (_json[i]['cntype'] == '综艺节目') {
				_html.push(that.zyHtml(_json, i))
			} else if (_json[i]['cntype'] == '动漫') {
				_html.push(that.dmHtml(_json, i))
			}
			_html.push('</div></li>')
		}
		return _html.join('')
	},
	tvHtml: function(_json, i) {
		var _html = [];
		if (_json[i]['actor']) {
			_html.push('<span class="sDes"><em class="emTit">主演：</em>' + _json[i]['actor'] + '</span>')
		}
		_html.push('<span class="sDes">' + _json[i]['latests'] + '</span>\r\n');
		if (_json[i]['play_link'] && _json[i]['play_link']['list']) {
			_html.push('<p class="playList clearfix">');
			var play_list = _json[i]['play_link']['list'];
			for (var ii in play_list) {
				_html.push('<span><a href="' + play_list[ii] + '"');
				if (_json[i]['play_link']['num'] > 7 && ii == 3) {
					_html.push(' onclick="_dct_(\'m_so_all_tv\');" ');
					_html.push(' target="_self"')
				} else {
					if (_json[i]['click_code']) {
						if (_json[i]['click_from']) {
							_html.push(' onclick="_dct_(\'' + _json[i]['click_code'] + '_' + (parseInt(ii) + 1) + '\');_dct_(\'' + _json[i]['click_from'] + '\');"')
						} else {
							_html.push(' onclick="_dct_(\'' + _json[i]['click_code'] + '_' + (parseInt(ii) + 1) + '\');"')
						}
					}
					_html.push(' target="_blank"')
				}
				_html.push(' rel="nofollow">');
				if (_json[i]['play_link']['num'] > 7 && ii == 3) {
					_html.push('...')
				} else {
					_html.push(parseInt(ii) + 1)
				}
				if (parseInt(_json[i]['play_link']['count']) - 1 == ii) {
					_html.push('<i class="iNew"></i>')
				}
				_html.push('</a></span>')
			}
			if (_json[i]['play_link']['num'] > 7) {
				_html.push('<span><a href="' + _json[i]['detail_surl'] + '" onclick="_dct_(\'m_so_all_tv\');" target="_self">全部</a></span>')
			}
			_html.push('</p>')
		} else {
			_html.push('<p class="pBottom"><span class="sBtn"><a href="javascript:void(0);" class="aPlayBtn noPlayBtn" rel="nofollow">暂无播放源</a></span></p>')
		}
		return _html.join('')
	},
	dyHtml: function(_json, i) {
		var _html = [];
		if (_json[i]['actor']) {
			_html.push('<span class="sDes"><em class="emTit">主演：</em>' + _json[i]['actor'] + '</span>')
		}
		if (_json[i]['score']) {
			_html.push('<span class="sDes"><em class="emTit">评分：</em>' + _json[i]['score'] + '分</span>')
		}
		_html.push('<p class="pBottom">');
		_html.push('<span class="sBtn">');
		_html.push('<a ');
		if (!_json[i]['play_link']) {
			_html.push('href="javascript:void(0);" ')
		} else {
			_html.push('href="' + _json[i]['play_link'].replace('Attp://', 'http://') + '" ');
			if (_json[i]['click_code']) {
				if (_json[i]['click_from']) {
					_html.push('onclick="_dct_(\'' + _json[i]['click_code'] + '\');_dct_(\'' + _json[i]['click_from'] + '\');" ')
				} else {
					_html.push('onclick="_dct_(\'' + _json[i]['click_code'] + '\');" ')
				}
			}
		}
		_html.push('target="_self" ');
		if (!_json[i]['play_link']) {
			_html.push('class="aPlayBtn noPlayBtn" ')
		} else if (_json[i]['is_preview']) {
			_html.push('class="aPlayBtn comingBtn" ')
		} else {
			_html.push('class="aPlayBtn" ')
		}
		_html.push('rel="nofollow">');
		if (!_json[i]['play_link']) {
			_html.push('暂无播放源')
		} else {
			if (_json[i]['is_preview']) {
				_html.push('预告片')
			} else {
				_html.push('立即播放')
			}
		}
		_html.push('</a></span></p>');
		return _html.join('')
	},
	zyHtml: function(_json, i) {
		var _html = [];
		_html.push('<span class="sDes">更新至' + _json[i]['latests'] + '</span>');
		if (_json[i]['play_link'] && _json[i]['play_link']['list']) {
			_html.push('<p class="playList playListTwo clearfix">');
			var play_list = _json[i]['play_link']['list'];
			for (var ii in play_list) {
				_html.push('<span><a href="' + play_list[ii]['url'] + '"');
				if (_json[i]['click_code']) {
					if (_json[i]['click_from']) {
						_html.push(' onclick="_dct_(\'' + _json[i]['click_code'] + '_' + (parseInt(ii) + 1) + '\');_dct_(\'' + _json[i]['click_from'] + '\');"')
					} else {
						_html.push(' onclick="_dct_(\'' + _json[i]['click_code'] + '_' + (parseInt(ii) + 1) + '\');"')
					}
				}
				_html.push(' target="_blank" rel="nofollow">');
				_html.push(play_list[ii]['issue']);
				if (play_list[ii]['is_new']) {
					_html.push('<i class="iNew"></i>')
				}
				_html.push('</a></span>')
			}
			if (_json[i]['play_link']['num'] > 3) {
				_html.push('<span><a href="' + _json[i]['detail_surl'] + '" onclick="_dct_(\'m_so_all_zy\');" target="_self">全部</a></span>')
			}
			_html.push('</p>')
		} else {
			_html.push('<p class="pBottom"><span class="sBtn"><a href="javascript:void(0);" class="aPlayBtn noPlayBtn" rel="nofollow">暂无播放源</a></span></p>')
		}
		return _html.join('')
	},
	dmHtml: function(_json, i) {
		var _html = [];
		_html.push('<span class="sDes">' + _json[i]['latests'] + '</span>');
		if (_json[i]['play_link'] && _json[i]['play_link']['list']) {
			_html.push('<p class="playList clearfix">');
			var play_list = _json[i]['play_link']['list'];
			for (var ii in play_list) {
				_html.push('<span><a href="' + play_list[ii] + '"');
				var playAll = 0;
				if (_json[i]['play_link']['num'] > 7 && ii == 3) {
					playAll = 1
				}
				if (_json[i]['click_code']) {
					if (playAll) {
						_html.push(' onclick="_dct_(\'m_so_all_dm\');" ')
					} else {
						if (_json[i]['click_from']) {
							_html.push(' onclick="_dct_(\'' + _json[i]['click_code'] + '_' + (parseInt(ii) + 1) + '\');_dct_(\'' + _json[i]['click_from'] + '\');"')
						} else {
							_html.push(' onclick="_dct_(\'' + _json[i]['click_code'] + '_' + (parseInt(ii) + 1) + '\');"')
						}
					}
				}
				_html.push(' target="_blank" rel="nofollow">');
				if (playAll) {
					_html.push('...')
				} else {
					_html.push(parseInt(ii) + 1)
				}
				_html.push('</a></span>')
			}
			if (_json[i]['play_link']['num'] > 7) {
				_html.push('<span><a href="' + _json[i]['detail_surl'] + '" onclick="_dct_(\'m_so_all_dm\');" target="_self">全部</a></span>')
			}
			_html.push('</p>')
		} else {
			_html.push('<p class="pBottom"><span class="sBtn"><a href="javascript:void(0);" class="aPlayBtn noPlayBtn" rel="nofollow">暂无播放源</a></span></p>')
		}
		return _html.join('')
	},
	html2Escape: function(sHtml) {
		return sHtml.replace(/[<>&"]/g,
		function(c) {
			return {
				'<': '&lt;',
				'>': '&gt;',
				'&': '&amp;',
				'"': '&quot;'
			} [c]
		})
	}
};
searchM.init();
$(window).scroll(function() {
	var num = $(this).scrollTop();
	if (num > 100) {
		$('.fixedBtnList').show()
	} else {
		$('.fixedBtnList').hide()
	}
});
$('.aFeedBack').click(function() {
	var param = escape(window.location.href);
	var url = $(this).attr('href') + '?from=' + param;
	$(this).attr('href', url)
});
var topDownload = {
	init: function() {
		if (!navigator.userAgent.match(/android/i)) {
			return
		}
		$('.appDownLoad').show();
		this.bindClose()
	},
	bindClose: function() {
		$('#closeTopDownload').click(function() {
			$('.appDownLoad').hide()
		})
	}
};
$('.appDownLoad')[0] && topDownload.init();