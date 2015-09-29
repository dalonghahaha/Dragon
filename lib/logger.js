"use strict";
class logger {

    constructor(application) {
        this.application = application;
        this.log4js = require('log4js');
        var configuration = require(this.application.logs_configuration);
        this.log4js.configure(configuration);
    }

    debug(msg) {
        if (msg == null) {
            msg = "";
        }
        if (this.application['debug']) {
            this.log4js.getLogger('logDebug').debug(msg);
        }
    }

    info(msg) {
        if (msg == null) {
            msg = "";
        }
        this.log4js.getLogger('logInfo').info(msg);
    }

    warn(msg) {
        if (msg == null) {
            msg = "";
        }
        if (this.application['debug']) {
            this.log4js.getLogger('logWarn').debug(msg);
        }
    }

    error(msg) {
        if (msg == null) {
            msg = "";
        }
        this.log4js.getLogger('logErr').error(msg);
    }
}

module.exports = logger;
