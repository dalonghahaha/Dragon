var mongodb = module.exports = {
    'dev': {
        //主机名
        'host': '114.215.106.133',
        //端口
        'port': 27017,
        //用户名
        'user': 'dalong',
        //密码
        'password': '200111',
        //数据库名
        'database': 'blog'
    },
    'product': {
        //主机名
        'host': '114.215.106.133',
        //端口
        'port': 27017,
        //用户名
        'user': 'dalong',
        //密码
        'password': '200111',
        //数据库名
        'database': 'blog111'
    },
    get_conf: function(environment = 'dev') {
        var conf_info = "mongodb://";
        conf_info += this.environment.user;
        conf_info += ":" + this.environment.password;
        conf_info += "@" + this.environment.host;
        conf_info += ":" + this.environment.port;
        conf_info += "/" + this.environment.database;
        return conf_info;
    }
}
