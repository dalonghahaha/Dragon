module.exports = {
	'json' : 'application/json',
	'js' : 'application/x-javascript',
	'css' : 'text/css',
	'ico':'image/x-icon',
	'png':'image/png',
	is_static:function(extend) {
		var static_extend= new Set(['js', 'css','ico','png']);
		return static_extend.has(extend);
	},
	is_imgdata:function(extend){
		var static_extend= new Set(['ico','png']);
		return static_extend.has(extend);
	}
}