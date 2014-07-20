/* remote ajax v 0.1.1 author by XericZephyr */
var rs = "http://xztestbed1.jd-app.com/ajax";

(function($) {
    $.rajax = (function (url, obj) {
    	(typeof(url)=="object")?(obj=url):((obj==undefined)?obj={url:url}:obj.url=url);
    	var d = {"url":obj.url}; (undefined!==obj.data)?(d["data"]=obj.data):false, (undefined!==obj.headers)?(d["headers"]=JSON.stringify(obj.headers),obj.headers={}):false;
    	var r = $.extend(true, {}, obj); r.method = "POST"; r.url = rs; r.data = d;
    	return $.ajax(r);
    });
})(jQuery);