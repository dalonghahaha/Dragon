module.exports = {
	'json' : 'application/json',
	'js' : 'application/x-javascript',
	'css' : 'text/css',
	is_static:function(extend) {
		var static_extend= new Set(['js', 'css']);
		return static_extend.has(extend);
	}
}