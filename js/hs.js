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
		},
		timeout:2e4
	});
}

function buildPager(total, cpn) {
	cpn = parseInt(cpn);
	total = parseInt(total);
	var rn = $(".pagination");
	rn.empty();
	var maxPage = Math.ceil(total/20);
	maxPage = (maxPage > 10)?10:maxPage;
	for (var i=0; i < maxPage; i++) {
		rn.append($('<li data-pn="'+(i*20)+'"><a href="#">'+(i+1)+'</a></li>'));
	}
	$('li[data-pn="'+cpn+'"]').addClass('active');
	$('li[data-pn!="'+cpn+'"]').click(function (e) {
		var tpn = $(e.currentTarget).attr('data-pn');
		search(tpn);
	});
}

function buildResultDOM(results) {
	var rn = $(".searchresult");
	rn.empty();
	for (i in results) {
		result = results[i];
		en = $('<a class="list-group-item searchentry" data-index="'+i+'"></a>');
		en.append('<strong class="title">'+result['title']+'</strong>');
		tn = $('<span class="status"> ['+result['status']+'] </span>');tn.addClass("text-"+((result['status']=="完结")?"success":"danger"));en.append(tn);
		en.append('<span class="author">  @'+result['author']+'</span>');
		en.append('<blockquote class="summary">'+result['summary']+'</blockquote>');
		rn.append(en);
	}
	$(".searchentry").click(function (e) {
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
					$('a#download').removeClass("disabled");
				} else {
					$('a#download').removeAttr('href');
					$('a#download').text('下载暂不可用');
					$('a#download').addClass("disabled");
				}
				$('a#download').show();
			}
		});
		$.remodal.lookup[$('[data-remodal-id=reader]').data('remodal')].open();
	});
}