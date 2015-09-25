var path = require('path');
var fs = require("fs");
var cli = module.exports = {
    app_root: path.dirname(__dirname),
    init: function(dir, options) {
        console.log('begin init ......');
        cli.init_framwork(dir);
        if (options.demo) {
            console.log('begin init demo code......');
            cli.init_demo_code();
        }
        console.log('begin finish !');
    },
    build: function(category, name) {
        console.log('begin build ......');
    },
    init_framwork: function(dir){
      //设置应用根目录
      if (dir) {
          cli.app_root = path.join(cli.app_root, dir);
          if (!fs.existsSync(cli.app_root)) {
              console.log("mkdir " + cli.app_root);
              fs.mkdirSync(cli.app_root, 0755);
          }
      }
      //初始化根目录
      var root_dir_list = ['conf', 'controller', 'schema', 'model', 'views', 'logs', 'assets'];
      cli.init_dir(root_dir_list);

      //初始化日志文件目录
      var log_list = ['logs/debug', 'logs/err', 'logs/info', 'logs/trace', 'logs/warn'];
      cli.init_dir(log_list);

      //初始化app.js
      var app_path = path.join(cli.app_root, 'app.js');
      if (!fs.existsSync(app_path)) {
          console.log("mkdir " + app_path);
          fs.writeFileSync(app_path, '');
      }
    },
    init_demo_code:function(){

    },
    init_dir: function(list) {
        for (p in list) {
            var _path = path.join(cli.app_root, list[p]);
            console.log("mkdir " + _path);
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path, 0755);
            }
        }
    }
}
