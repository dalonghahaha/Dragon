var category = module.exports {
    get_all: function(dragon) {
        return new Promise(function(resolve, reject) {
        	var model = require('../model/category');
            var model_category = new model();
            model_category.find({}).then(function(data) {
                resolve(dragon.json(data));
            }).catch(reject);
        });
    }
    getbyname: function(dragon) {
        var name = dragon._request.params.get.name;
        return new Promise(function(resolve, reject) {
            var model = require('../model/category');
            var model_category = new model();
            model_category.find({
                'name': name
            }).then(function(data) {
                resolve(dragon.json(data));
            }).catch(reject);
        });
    }
}
