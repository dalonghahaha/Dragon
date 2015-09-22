var log4js = require('log4js');
var path = require('../conf/path');
var app = require('../conf/application');

log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'dateFile',
        filename: path.logPath,
        pattern: "debug/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logDebug'
    }, {
        type: 'dateFile',
        filename: path.logPath,
        pattern: "info/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logInfo'
    }, {
        type: 'dateFile',
        filename: path.logPath,
        pattern: "warn/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logWarn'
    }, {
        type: 'dateFile',
        filename: path.logPath,
        pattern: "err/yyyyMMdd.txt",
        maxLogSize: 1024,
        alwaysIncludePattern: true,
        backups: 4,
        category: 'logErr'
    }, {
        type: 'dateFile',
        filename: path.logPath,
        pattern: "trace/yyyyMMdd.txt",
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
        if (app['debug']) {
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
        if (app['debug']) {
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
        if (app['trace']) {
            log4js.getLogger('logTrace').debug(msg);
        }
    }
};
