'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Punter Schema
 */
var PunterSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Punter name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Punter', PunterSchema);