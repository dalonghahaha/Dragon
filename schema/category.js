var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var area_schema = module.exports ={
	'id':{
		type:Schema.Types.ObjectId
	},
	'name':{
        type:'String',
        required:true
    },
	'slug':{
        type:'String',
        required:true
    },
	'description':{
        type:'String',
        required:false
    },
    'order':{
        type:'Number',
        required:true
    },
    'ispublish':{
        type:'Number',
        required:true
    }
}