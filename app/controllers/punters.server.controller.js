'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Punter = mongoose.model('Punter'),
	_ = require('lodash');

/**
 * Create a Punter
 */
exports.create = function(req, res) {
	var punter = new Punter(req.body);
	punter.user = req.user;

	punter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(punter);
		}
	});
};

/**
 * Show the current Punter
 */
exports.read = function(req, res) {
	res.jsonp(req.punter);
};

/**
 * Update a Punter
 */
exports.update = function(req, res) {
	var punter = req.punter ;

	punter = _.extend(punter , req.body);

	punter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(punter);
		}
	});
};

/**
 * Delete an Punter
 */
exports.delete = function(req, res) {
	var punter = req.punter ;

	punter.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(punter);
		}
	});
};

/**
 * List of Punters
 */
exports.list = function(req, res) { 
	Punter.find().sort('-created').populate('user', 'displayName').exec(function(err, punters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(punters);
		}
	});
};

/**
 * Punter middleware
 */
exports.punterByID = function(req, res, next, id) { 
	Punter.findById(id).populate('user', 'displayName').exec(function(err, punter) {
		if (err) return next(err);
		if (! punter) return next(new Error('Failed to load Punter ' + id));
		req.punter = punter ;
		next();
	});
};

/**
 * Punter authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.punter.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
