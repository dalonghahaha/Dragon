"use strict"
var date = require('./date');
var path = require('path');
var fs = require('fs');

class log {
	constructor(config) {
    	this.log_root = config['logs_root'];
        this.is_debug = config['debug'];
    	this.console = true;
  	}

  	get_log_path() {
  		var date_dir = date.format("yyyyMMdd");
  		return path.join(this.log_root,date_dir);
  	}

  	format_message(message,tag){
  		if(!message){
    		message = '';
    	}
    	message = "[" + date.format("yyyy-MM-dd hh:mm:ss S") + "][" + tag + "] - " + message;
    	return message;
  	}

  	debug(message) {
        if(!this.is_debug){
            return;
        }
        this.write(this.get_log_path(),message,"debug");
    }

    info(message) {
        this.write(this.get_log_path(),message,"info");
    }

    warn(message) {
        this.write(this.get_log_path(),message,"warn");
    }

    error(message) {
        this.write(this.get_log_path(),message,"error");
    }

    write(log_path,message,tag){
        message = this.format_message(message,tag);
        if(console){
            console.info(message);
        }
    	if (!fs.existsSync(log_path)) {
            fs.mkdirSync(log_path);
        }
        fs.appendFileSync(path.join(log_path,tag + ".txt"), message + "\r\n",{
        	encoding: 'utf-8'
        });
    }
}

module.exports = log;