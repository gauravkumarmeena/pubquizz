'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var managers = require('../../app/controllers/managers.server.controller');

	app.route('/pubquizzes')
		.get(managers.listPubQuizzes)

	// Managers Routes
	app.route('/managers')
		.get(managers.list)
		.post(users.requiresLogin, managers.create);

	app.route('/managers/:managerId')
		.get(managers.read)
		.put(users.requiresLogin, managers.hasAuthorization, managers.update)
		.delete(users.requiresLogin, managers.hasAuthorization, managers.delete);

	// Finish by binding the Manager middleware
	app.param('managerId', managers.managerByID);
};
