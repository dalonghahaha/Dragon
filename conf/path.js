var path = require('path');
//根目录
var root = path.dirname(__dirname);

module.exports = {
	//日志文件目录
    logPath: root + '/logs/',
    //js文件目录
    JsPath: root + '/assets/js/',
    //css文件目录
    JsPath: root + '/assets/css/',
    //图片目录
    ImagePath: root + '/assets/images/',
    //icon目录
    IconPath: root + '/assets/icon/',
}
