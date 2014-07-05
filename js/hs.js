/*UI*/

var defaultHeader = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"};
$("#searchbutton").click(function (e) {search();});
$("#searchkeyword").keypress(function (e) {
	if ( e.which == 13 ) {
	     e.preventDefault();
	     search();
	  }
});

function search(pn) {
	(pn==undefined)?pn=0:false;
	var keyword = $("#searchkeyword").val();
	var url = "http://m.baidu.com/s?st=11n041&tn=xse&word="+encodeURIComponent(keyword)+"&pn="+pn;
	$.rajax({
		url:url,
		headers:defaultHeader,
		success:function (data , textStatus ,jqXHR) {
			var dobj=JSON.parse(data);
			if (dobj['errno'] == 0) 
				if (parseInt(dobj['total']) > 0) {
					buildPager(dobj['total'], pn);
					buildResultDOM(dobj['result']['search']);
				}
		}
	});
}

function buildPager(total, cpn) {
	cpn = parseInt(cpn);
	total = parseInt(total);
	var rn = $(".pager");
	rn.empty();
	for (var i=0; i < Math.ceil(total/20); i++) {
		rn.append($('<span data-pn="'+(i*20)+'" class="page"> '+(i+1)+' </span>'));
	}
	$('[data-pn="'+cpn+'"]').attr('class', 'current_page');
	$("span.current_page").off('click');
	$("span.page").on('click', function (e) {
		var tpn = $(e.currentTarget).attr('data-pn');
		search(tpn);
	});
}

function buildResultDOM(results) {
	var rn = $(".searchresult");
	rn.empty();
	for (i in results) {
		result = results[i];
		en = $('<div class="searchentry" data-index="'+i+'"></div>');
		en.append('<div class="title">'+result['title']+'</div>');
		en.append('<div class="author">'+result['author']+'</div>');
		en.append('<div class="summary">'+result['summary']+'</div>');
		rn.append(en);
	}
	$(".searchentry").on("click", function (e) {
		var i = $(e.currentTarget).attr('data-index');
		result = results[i];
		gid = result['gid'];
		$('a#download').hide();
		$('a#online_read').attr('href', 'http://m.baidu.com/tc?appui=alaxs&srd=1&gid='+gid);
		$.rajax({
			url: 'http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid='+gid,
			success: function (d, t, j) {
				var dobj=JSON.parse(d);
				if (!dobj['status'] && dobj['data']['hasCache']) {
					var gid = dobj['data']['gid'];
					$('a#download').attr('href', 'http://npacking.baidu.com/novel/packing?gid='+gid);
					$('a#download').text('下载TXT');
					$('a#download').show();
				} else {
					$('a#download').removeAttr('href');
					$('a#download').text('下载暂不可用');
					$('a#download').show();
				}
			}
		});
		$.remodal.lookup[$('[data-remodal-id=reader]').data('remodal')].open();
	});
}