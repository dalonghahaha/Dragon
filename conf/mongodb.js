var mongodb = module.exports = {
	host : '114.215.106.133',
	user : 'dalong',
	password : '200111',
	database : 'blog',
	port : 27017,
	get_conf:function() {
		var conf_info = "mongodb://";
			conf_info += this.user;
			conf_info += ":" + this.password;
			conf_info += "@" + this.host;
			conf_info += ":" + this.port;
			conf_info += "/" + this.database;
		return conf_info;
	}
}