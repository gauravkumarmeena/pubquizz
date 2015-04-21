'use strict';

(function() {
	// Punters Controller Spec
	describe('Punters Controller Tests', function() {
		// Initialize global variables
		var PuntersController,
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

			// Initialize the Punters controller.
			PuntersController = $controller('PuntersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Punter object fetched from XHR', inject(function(Punters) {
			// Create sample Punter using the Punters service
			var samplePunter = new Punters({
				name: 'New Punter'
			});

			// Create a sample Punters array that includes the new Punter
			var samplePunters = [samplePunter];

			// Set GET response
			$httpBackend.expectGET('punters').respond(samplePunters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.punters).toEqualData(samplePunters);
		}));

		it('$scope.findOne() should create an array with one Punter object fetched from XHR using a punterId URL parameter', inject(function(Punters) {
			// Define a sample Punter object
			var samplePunter = new Punters({
				name: 'New Punter'
			});

			// Set the URL parameter
			$stateParams.punterId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/punters\/([0-9a-fA-F]{24})$/).respond(samplePunter);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.punter).toEqualData(samplePunter);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Punters) {
			// Create a sample Punter object
			var samplePunterPostData = new Punters({
				name: 'New Punter'
			});

			// Create a sample Punter response
			var samplePunterResponse = new Punters({
				_id: '525cf20451979dea2c000001',
				name: 'New Punter'
			});

			// Fixture mock form input values
			scope.name = 'New Punter';

			// Set POST response
			$httpBackend.expectPOST('punters', samplePunterPostData).respond(samplePunterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Punter was created
			expect($location.path()).toBe('/punters/' + samplePunterResponse._id);
		}));

		it('$scope.update() should update a valid Punter', inject(function(Punters) {
			// Define a sample Punter put data
			var samplePunterPutData = new Punters({
				_id: '525cf20451979dea2c000001',
				name: 'New Punter'
			});

			// Mock Punter in scope
			scope.punter = samplePunterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/punters\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/punters/' + samplePunterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid punterId and remove the Punter from the scope', inject(function(Punters) {
			// Create new Punter object
			var samplePunter = new Punters({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Punters array and include the Punter
			scope.punters = [samplePunter];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/punters\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePunter);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.punters.length).toBe(0);
		}));
	});
}());