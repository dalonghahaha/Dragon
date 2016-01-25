var path = require('path');
var root = path.dirname(__dirname);
var application = module.exports = {

    'debug':true,

    //端口号
    'port':3000,

	//运行环境
    'environment': 'dev',

    //模板后缀名
    'tpl_ext': 'html',

    //根目录
    'root': root,

    //日志文件根目录
    'logs_root': path.join(path.dirname(root),'logs'),

    //静态资源根目录
    'assets_root': path.join(root,'assets'),

    //控制器根目录
    'controller_root': path.join(root,'controller'),

    //模型根目录
    'model_root': path.join(root,'model'),

    //视图根目录
    'views_root': path.join(root,'views'),

    //mongodb配置文件位置
    'mongodb_configuration': path.join(root,'conf','mongodb'),

    //mysql配置文件位置
    'mysql_configuration': path.join(root,'conf','mysql'),

    //memcached配置文件位置
    'memcached_configuration': path.join(root,'conf','memcached'),

    //redis配置文件位置
    'redis_configuration': path.join(root,'conf','redis'),

    //是否启用缓存
    'cached':true,

    //缓存类别
    'cache_type':'memcached'
}
