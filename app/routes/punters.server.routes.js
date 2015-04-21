'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var punters = require('../../app/controllers/punters.server.controller');

	// Punters Routes
	app.route('/punters')
		.get(punters.list)
		.post(users.requiresLogin, punters.create);

	app.route('/punters/:punterId')
		.get(punters.read)
		.put(users.requiresLogin, punters.hasAuthorization, punters.update)
		.delete(users.requiresLogin, punters.hasAuthorization, punters.delete);

	// Finish by binding the Punter middleware
	app.param('punterId', punters.punterByID);
};
