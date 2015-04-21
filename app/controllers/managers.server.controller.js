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
        {   'id':'1',
            'test': 'Which pop duo was the first western band to play in The Peoples Republic of China?',
            'choices':[{'id':'1','value':'Wham'},{'id':'2','value':'Simon and Garfunkel'},{'id':'3','value':'Chas and Dave'},{'id':'4','value':'Right Said Fred'}]
		},
		{'id':'2',
                    'test': 'Timber selected from how many fully grown oak trees were needed to build a large 3 decker Royal Navy battle ship in the 18th century?',
                    'choices':[{'id':'1','value':'50'},{'id':'2','value':'500'},{'id':'3','value':'1,500'},{'id':'4','value':'3,500'}]
        },
        {'id':'3',
                    'test': 'Speed skating originated in which country?',
                    'choices':[{'id':'1','value':'Russia '},{'id':'2','value':'Netherlands'},{'id':'3','value':'Canada'},{'id':'4','value':'Norway'}]
        },
        {'id':'4',
                    'test': 'Off the coast of which country did the Amoco Cadiz sink?',
                     'choices':[{'id':'1','value':'South Africa '},{'id':'2','value':'France'},{'id':'3','value':'USA'},{'id':'4','value':'Spain'}]
        },
        {'id':'5',
                            'test': 'The song &#039;An Englishman in New York&#039; was about which man?',
                             'choices':[{'id':'1','value':'Quentin Crisp'},{'id':'2','value':'Sting'},{'id':'3','value':'John Lennon'},{'id':'4','value':'Gordon Sumner '}]
        }
		];
	res.json(pubQuizzes);
};

var question = {};

exports.getQuestion = function(req, res) {
	res.json(question);
};

exports.postQuestion = function(req, res) {
	question = req.body;
	res.json({});
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
