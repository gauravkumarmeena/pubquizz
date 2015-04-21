'use strict';

// Punters controller
angular.module('punters').controller('PuntersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Punters',
	function($scope, $stateParams, $location, Authentication, Punters) {
		$scope.authentication = Authentication;

		// Create new Punter
		$scope.create = function() {
			// Create new Punter object
			var punter = new Punters ({
				name: this.name
			});

			// Redirect after save
			punter.$save(function(response) {
				$location.path('punters/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Punter
		$scope.remove = function(punter) {
			if ( punter ) { 
				punter.$remove();

				for (var i in $scope.punters) {
					if ($scope.punters [i] === punter) {
						$scope.punters.splice(i, 1);
					}
				}
			} else {
				$scope.punter.$remove(function() {
					$location.path('punters');
				});
			}
		};

		// Update existing Punter
		$scope.update = function() {
			var punter = $scope.punter;

			punter.$update(function() {
				$location.path('punters/' + punter._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Punters
		$scope.find = function() {
			$scope.punters = Punters.query();
		};

		// Find existing Punter
		$scope.findOne = function() {
			$scope.punter = Punters.get({ 
				punterId: $stateParams.punterId
			});
		};
	}
]);