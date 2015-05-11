'use strict';

var mongoose = require('mongoose'),
		moment = require('moment'),
    Schema = mongoose.Schema;

var BuslineSchema = new Schema({
	//_id : Number,
	name : {
		type : String,
		trim : true,
		required: 'Please fill in a name'
	},
	driver : {
		//name : String,
		//phone : String,
	},
	// mon, tue, wed, thu, fri, sat, sun
	week : [String],
	// 완행, 직행
	local : {
		type : Boolean,
		default : true
	},
	stations : [{
		_id : Number,
		times : [],
		coords : {},
		name : String
	}],
	routes : [],
	parts : {
		numbers : {
			type : Number,
			default : 1
		},
		names : [String]
	},
	created : Number
});

/**
 * Pre-save hook
 */
BuslineSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();
    this.created = moment().valueOf();
    next();
  });

module.exports = mongoose.model('Busline', BuslineSchema);