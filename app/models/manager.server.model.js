'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Manager Schema
 */
var ManagerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Manager name',
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

mongoose.model('Manager', ManagerSchema);