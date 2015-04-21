'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Manager = mongoose.model('Manager'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, manager;

/**
 * Manager routes tests
 */
describe('Manager CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Manager
		user.save(function() {
			manager = {
				name: 'Manager Name'
			};

			done();
		});
	});

	it('should be able to save Manager instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manager
				agent.post('/managers')
					.send(manager)
					.expect(200)
					.end(function(managerSaveErr, managerSaveRes) {
						// Handle Manager save error
						if (managerSaveErr) done(managerSaveErr);

						// Get a list of Managers
						agent.get('/managers')
							.end(function(managersGetErr, managersGetRes) {
								// Handle Manager save error
								if (managersGetErr) done(managersGetErr);

								// Get Managers list
								var managers = managersGetRes.body;

								// Set assertions
								(managers[0].user._id).should.equal(userId);
								(managers[0].name).should.match('Manager Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Manager instance if not logged in', function(done) {
		agent.post('/managers')
			.send(manager)
			.expect(401)
			.end(function(managerSaveErr, managerSaveRes) {
				// Call the assertion callback
				done(managerSaveErr);
			});
	});

	it('should not be able to save Manager instance if no name is provided', function(done) {
		// Invalidate name field
		manager.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manager
				agent.post('/managers')
					.send(manager)
					.expect(400)
					.end(function(managerSaveErr, managerSaveRes) {
						// Set message assertion
						(managerSaveRes.body.message).should.match('Please fill Manager name');
						
						// Handle Manager save error
						done(managerSaveErr);
					});
			});
	});

	it('should be able to update Manager instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manager
				agent.post('/managers')
					.send(manager)
					.expect(200)
					.end(function(managerSaveErr, managerSaveRes) {
						// Handle Manager save error
						if (managerSaveErr) done(managerSaveErr);

						// Update Manager name
						manager.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Manager
						agent.put('/managers/' + managerSaveRes.body._id)
							.send(manager)
							.expect(200)
							.end(function(managerUpdateErr, managerUpdateRes) {
								// Handle Manager update error
								if (managerUpdateErr) done(managerUpdateErr);

								// Set assertions
								(managerUpdateRes.body._id).should.equal(managerSaveRes.body._id);
								(managerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Managers if not signed in', function(done) {
		// Create new Manager model instance
		var managerObj = new Manager(manager);

		// Save the Manager
		managerObj.save(function() {
			// Request Managers
			request(app).get('/managers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Manager if not signed in', function(done) {
		// Create new Manager model instance
		var managerObj = new Manager(manager);

		// Save the Manager
		managerObj.save(function() {
			request(app).get('/managers/' + managerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', manager.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Manager instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manager
				agent.post('/managers')
					.send(manager)
					.expect(200)
					.end(function(managerSaveErr, managerSaveRes) {
						// Handle Manager save error
						if (managerSaveErr) done(managerSaveErr);

						// Delete existing Manager
						agent.delete('/managers/' + managerSaveRes.body._id)
							.send(manager)
							.expect(200)
							.end(function(managerDeleteErr, managerDeleteRes) {
								// Handle Manager error error
								if (managerDeleteErr) done(managerDeleteErr);

								// Set assertions
								(managerDeleteRes.body._id).should.equal(managerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Manager instance if not signed in', function(done) {
		// Set Manager user 
		manager.user = user;

		// Create new Manager model instance
		var managerObj = new Manager(manager);

		// Save the Manager
		managerObj.save(function() {
			// Try deleting Manager
			request(app).delete('/managers/' + managerObj._id)
			.expect(401)
			.end(function(managerDeleteErr, managerDeleteRes) {
				// Set message assertion
				(managerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Manager error error
				done(managerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Manager.remove().exec();
		done();
	});
});