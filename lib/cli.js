var path = require('path');
var fs = require("fs");
var cli = module.exports = {
    root: path.dirname(__dirname),
    app_root: path.dirname(__dirname),
    init: function(dir, options) {

        console.log('begin init ......');

        //初始化目录
        cli.init_framework(dir);

        //初始化配置文件
        cli.init_config_file();

        //初始化启动文件
        cli.init_index_file();

        if (options.demo) {
            console.log('begin init demo code ......');
            cli.init_demo_code();
        }

        console.log('init finish !');
    },
    model: function(name,options) {
        if(!name){
          console.log('command error : please input a model name');
          return;
        }
        var pwd = process.cwd();
        var schema_path = path.join(pwd,'schema',name + ".js");
        if (!fs.existsSync(schema_path)) {
          console.log('command error : please init model schema first');
          return;
        }
        else{
            console.log('begin build code ......');
            var tpl_model = fs.readFileSync(path.join(cli.root,'lib','template','tpl_model'), {encoding :"utf-8"});
            model = tpl_model.replace(/{model_name}/g, name);
            var model_path = path.join(pwd, 'model', name + '.js');
            fs.writeFileSync(model_path,model);
            console.log('build finish !');
        }
    },
    init_framework: function(dir) {

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
        var tpl_app = fs.readFileSync(path.join(cli.root,'lib','template','tpl_app'), {encoding :"utf-8"});
        var app_path = path.join(cli.app_root, 'app.js');
        console.log("init " + app_path);
        fs.writeFileSync(app_path, tpl_app);
    },
    init_config_file: function() {

      //初始化应用配置文件
      var tpl_config_application = fs.readFileSync(path.join(cli.root,'lib','template','tpl_config_application'), {encoding :"utf-8"});
      var application_path = path.join(cli.app_root, 'conf', 'application.js');
      console.log('init ' + application_path);
      fs.writeFileSync(application_path,tpl_config_application);

      //初始化mongodb数据库配置文件
      var tpl_config_mongodb = fs.readFileSync(path.join(cli.root,'lib','template','tpl_config_mongodb'), {encoding :"utf-8"});
      var mongodb_path = path.join(cli.app_root, 'conf', 'mongodb.js');
      console.log('init ' + mongodb_path);
      fs.writeFileSync(mongodb_path,tpl_config_mongodb);

      //初始化日志配置文件
      var tpl_config_log = fs.readFileSync(path.join(cli.root,'lib','template','tpl_config_log'), {encoding :"utf-8"});
      var log_path = path.join(cli.app_root, 'conf', 'log.js');
      console.log('init ' + log_path);
      fs.writeFileSync(log_path,tpl_config_log);
    },
    init_index_file: function(){

      //初始化index
      var tpl_index = fs.readFileSync(path.join(cli.root,'lib','template','tpl_index'), {encoding :"utf-8"});
      var index_path = path.join(cli.app_root, 'controller','index.js');
      console.log("init " + index_path);
      fs.writeFileSync(index_path, tpl_index);

    },
    init_demo_code: function() {

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
