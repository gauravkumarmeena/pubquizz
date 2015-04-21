'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Punter = mongoose.model('Punter'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, punter;

/**
 * Punter routes tests
 */
describe('Punter CRUD tests', function() {
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

		// Save a user to the test db and create new Punter
		user.save(function() {
			punter = {
				name: 'Punter Name'
			};

			done();
		});
	});

	it('should be able to save Punter instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punter
				agent.post('/punters')
					.send(punter)
					.expect(200)
					.end(function(punterSaveErr, punterSaveRes) {
						// Handle Punter save error
						if (punterSaveErr) done(punterSaveErr);

						// Get a list of Punters
						agent.get('/punters')
							.end(function(puntersGetErr, puntersGetRes) {
								// Handle Punter save error
								if (puntersGetErr) done(puntersGetErr);

								// Get Punters list
								var punters = puntersGetRes.body;

								// Set assertions
								(punters[0].user._id).should.equal(userId);
								(punters[0].name).should.match('Punter Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Punter instance if not logged in', function(done) {
		agent.post('/punters')
			.send(punter)
			.expect(401)
			.end(function(punterSaveErr, punterSaveRes) {
				// Call the assertion callback
				done(punterSaveErr);
			});
	});

	it('should not be able to save Punter instance if no name is provided', function(done) {
		// Invalidate name field
		punter.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punter
				agent.post('/punters')
					.send(punter)
					.expect(400)
					.end(function(punterSaveErr, punterSaveRes) {
						// Set message assertion
						(punterSaveRes.body.message).should.match('Please fill Punter name');
						
						// Handle Punter save error
						done(punterSaveErr);
					});
			});
	});

	it('should be able to update Punter instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punter
				agent.post('/punters')
					.send(punter)
					.expect(200)
					.end(function(punterSaveErr, punterSaveRes) {
						// Handle Punter save error
						if (punterSaveErr) done(punterSaveErr);

						// Update Punter name
						punter.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Punter
						agent.put('/punters/' + punterSaveRes.body._id)
							.send(punter)
							.expect(200)
							.end(function(punterUpdateErr, punterUpdateRes) {
								// Handle Punter update error
								if (punterUpdateErr) done(punterUpdateErr);

								// Set assertions
								(punterUpdateRes.body._id).should.equal(punterSaveRes.body._id);
								(punterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Punters if not signed in', function(done) {
		// Create new Punter model instance
		var punterObj = new Punter(punter);

		// Save the Punter
		punterObj.save(function() {
			// Request Punters
			request(app).get('/punters')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Punter if not signed in', function(done) {
		// Create new Punter model instance
		var punterObj = new Punter(punter);

		// Save the Punter
		punterObj.save(function() {
			request(app).get('/punters/' + punterObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', punter.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Punter instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punter
				agent.post('/punters')
					.send(punter)
					.expect(200)
					.end(function(punterSaveErr, punterSaveRes) {
						// Handle Punter save error
						if (punterSaveErr) done(punterSaveErr);

						// Delete existing Punter
						agent.delete('/punters/' + punterSaveRes.body._id)
							.send(punter)
							.expect(200)
							.end(function(punterDeleteErr, punterDeleteRes) {
								// Handle Punter error error
								if (punterDeleteErr) done(punterDeleteErr);

								// Set assertions
								(punterDeleteRes.body._id).should.equal(punterSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Punter instance if not signed in', function(done) {
		// Set Punter user 
		punter.user = user;

		// Create new Punter model instance
		var punterObj = new Punter(punter);

		// Save the Punter
		punterObj.save(function() {
			// Try deleting Punter
			request(app).delete('/punters/' + punterObj._id)
			.expect(401)
			.end(function(punterDeleteErr, punterDeleteRes) {
				// Set message assertion
				(punterDeleteRes.body.message).should.match('User is not logged in');

				// Handle Punter error error
				done(punterDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Punter.remove().exec();
		done();
	});
});