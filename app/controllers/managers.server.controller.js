'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Manager = mongoose.model('Manager'),
	_ = require('lodash');

exports.listPubQuizzes = function(req, res) {
	var pubQuizzes = [
		{}
		];
	res.json(pubQuizzes);
};

/**
 * Create a Manager
 */
exports.create = function(req, res) {
	var manager = new Manager(req.body);
	manager.user = req.user;

	manager.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manager);
		}
	});
};

/**
 * Show the current Manager
 */
exports.read = function(req, res) {
	res.jsonp(req.manager);
};

/**
 * Update a Manager
 */
exports.update = function(req, res) {
	var manager = req.manager ;

	manager = _.extend(manager , req.body);

	manager.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manager);
		}
	});
};

/**
 * Delete an Manager
 */
exports.delete = function(req, res) {
	var manager = req.manager ;

	manager.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manager);
		}
	});
};

/**
 * List of Managers
 */
exports.list = function(req, res) { 
	Manager.find().sort('-created').populate('user', 'displayName').exec(function(err, managers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(managers);
		}
	});
};

/**
 * Manager middleware
 */
exports.managerByID = function(req, res, next, id) { 
	Manager.findById(id).populate('user', 'displayName').exec(function(err, manager) {
		if (err) return next(err);
		if (! manager) return next(new Error('Failed to load Manager ' + id));
		req.manager = manager ;
		next();
	});
};

/**
 * Manager authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.manager.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
