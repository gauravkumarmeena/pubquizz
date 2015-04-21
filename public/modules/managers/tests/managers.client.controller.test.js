'use strict';

(function() {
	// Managers Controller Spec
	describe('Managers Controller Tests', function() {
		// Initialize global variables
		var ManagersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Managers controller.
			ManagersController = $controller('ManagersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Manager object fetched from XHR', inject(function(Managers) {
			// Create sample Manager using the Managers service
			var sampleManager = new Managers({
				name: 'New Manager'
			});

			// Create a sample Managers array that includes the new Manager
			var sampleManagers = [sampleManager];

			// Set GET response
			$httpBackend.expectGET('managers').respond(sampleManagers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.managers).toEqualData(sampleManagers);
		}));

		it('$scope.findOne() should create an array with one Manager object fetched from XHR using a managerId URL parameter', inject(function(Managers) {
			// Define a sample Manager object
			var sampleManager = new Managers({
				name: 'New Manager'
			});

			// Set the URL parameter
			$stateParams.managerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/managers\/([0-9a-fA-F]{24})$/).respond(sampleManager);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manager).toEqualData(sampleManager);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Managers) {
			// Create a sample Manager object
			var sampleManagerPostData = new Managers({
				name: 'New Manager'
			});

			// Create a sample Manager response
			var sampleManagerResponse = new Managers({
				_id: '525cf20451979dea2c000001',
				name: 'New Manager'
			});

			// Fixture mock form input values
			scope.name = 'New Manager';

			// Set POST response
			$httpBackend.expectPOST('managers', sampleManagerPostData).respond(sampleManagerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Manager was created
			expect($location.path()).toBe('/managers/' + sampleManagerResponse._id);
		}));

		it('$scope.update() should update a valid Manager', inject(function(Managers) {
			// Define a sample Manager put data
			var sampleManagerPutData = new Managers({
				_id: '525cf20451979dea2c000001',
				name: 'New Manager'
			});

			// Mock Manager in scope
			scope.manager = sampleManagerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/managers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/managers/' + sampleManagerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid managerId and remove the Manager from the scope', inject(function(Managers) {
			// Create new Manager object
			var sampleManager = new Managers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Managers array and include the Manager
			scope.managers = [sampleManager];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/managers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleManager);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.managers.length).toBe(0);
		}));
	});
}());