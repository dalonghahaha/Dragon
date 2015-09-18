var helper =module.exports= {};
var log4js = require('log4js');
var Path = require('../conf/path');
log4js.configure({
    appenders: [
        { 
            type: 'console' 
        }, 
        {
            type: 'dateFile',
            filename: Path.logPath,
            pattern: "debug/yyyyMMdd.txt",
            maxLogSize: 1024,
            alwaysIncludePattern: true,
            backups: 4,
            category: 'logDebug'
        },
        {
            type: 'dateFile',
            filename: Path.logPath,
            pattern: "info/yyyyMMdd.txt",
            maxLogSize: 1024,
            alwaysIncludePattern: true,
            backups: 4,
            category: 'logInfo'
        },
        {
            type: 'dateFile',
            filename: Path.logPath,
            pattern: "warn/yyyyMMdd.txt",
            maxLogSize: 1024,
            alwaysIncludePattern: true,
            backups: 4,
            category: 'logWarn'
        },
        {
            type: 'dateFile',
            filename: Path.logPath,
            pattern: "err/yyyyMMdd.txt",
            maxLogSize: 1024,
            alwaysIncludePattern: true,
            backups: 4,
            category: 'logErr'
        }
    ],
    replaceConsole: false
});
var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
var logWarn = log4js.getLogger('logWarn');
var logErr = log4js.getLogger('logErr');

helper.debug = function(msg){
    if(msg == null)
        msg = "";
    logDebug.debug(msg);
};

helper.info = function(msg){
    if(msg == null)
        msg = "";
    logInfo.info(msg);
};

helper.warn = function(msg){
    if(msg == null)
        msg = "";
    logWarn.warn(msg);
};

helper.error = function(msg, exp){
    if(msg == null)
        msg = "";
    if(exp != null)
        msg += "\r\n" + exp;
    logErr.error(msg);
};
