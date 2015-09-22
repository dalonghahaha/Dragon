var index = module.exports = {
    index: function(dragon) {
        return new Promise(function(resolve, reject) {
            var model = require('../model/category');
            var orm_category = new model();
            orm_category.find({}).then(function(data) {
                resolve(dragon.json(data));
            });
        });
    }
}
