var log4js = require('log4js');
var path = require('path');
var root = path.dirname(__dirname);
var application = require('../conf/application');

log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'dateFile',
        filename: path.join(root,application['logs_root']),
        pattern: "/debug/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logDebug'
    }, {
        type: 'dateFile',
        filename: path.join(root,application['logs_root']),
        pattern: "/info/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logInfo'
    }, {
        type: 'dateFile',
        filename: path.join(root,application['logs_root']),
        pattern: "/warn/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logWarn'
    }, {
        type: 'dateFile',
        filename: path.join(root,application['logs_root']),
        pattern: "/err/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logErr'
    }, {
        type: 'dateFile',
        filename: path.join(root,application['logs_root']),
        pattern: "/trace/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logTrace'
    }],
    replaceConsole: false
});

var logger = module.exports = {
    debug: function(msg) {
        if (msg == null) {
            msg = "";
        }
        if (application['debug']) {
            log4js.getLogger('logDebug').debug(msg);
        }
    },
    info: function(msg) {
        if (msg == null) {
            msg = "";
        }
        log4js.getLogger('logInfo').info(msg);
    },
    warn: function(msg) {
        if (msg == null) {
            msg = "";
        }
        if (application['debug']) {
            log4js.getLogger('logWarn').debug(msg);
        }
    },
    error: function(msg) {
        if (msg == null) {
            msg = "";
        }
        log4js.getLogger('logErr').error(msg);
    },
    trace:function(msg){
        if (msg == null) {
            msg = "";
        }
        if (application['trace']) {
            log4js.getLogger('logTrace').debug(msg);
        }
    }
};
