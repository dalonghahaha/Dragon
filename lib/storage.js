var logger = require('./logger');
var fs = require("fs");

var storage = module.exports = {};

io.SaveFile = function(data, savepath, name, callback) {
    var deferred = Q.defer();
    var domain = D.create();
    domain.on('error', function(err) {
        deferred.reject(err);
        logger.error(err);
    });
    domain.run(function() {
        if (!fs.existsSync(savepath)) {
            fs.mkdirSync(savepath);
        }
        fs.writeFile(savepath + name, data, function(err) {
            if (err) {
                throw(err);
            }
            deferred.resolve(true);
        });
    });
    return deferred.promise.nodeify(callback);
}

io.SaveImage = function(imgData, savepath, name, callback) {
    var deferred = Q.defer();
    var domain = D.create();
    domain.on('error', function(err) {
        deferred.reject(err);
        logger.error(err.message);
    });
    domain.run(function() {
        if (!fs.existsSync(savepath)) {
            fs.mkdirSync(savepath);
        }
        fs.writeFile(savepath + name, imgData, "binary", function(err) {
            if (err) {
                throw(err);
            }
            deferred.resolve(true);
        });
    });
    return deferred.promise.nodeify(callback);
}