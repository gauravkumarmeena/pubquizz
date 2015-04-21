'use strict';

// Managers controller
angular.module('managers').controller('ManagersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Managers',
	function($scope, $stateParams, $location, Authentication, Managers) {
		$scope.authentication = Authentication;

		// Create new Manager
		$scope.create = function() {
			// Create new Manager object
			var manager = new Managers ({
				name: this.name
			});

			// Redirect after save
			manager.$save(function(response) {
				$location.path('managers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Manager
		$scope.remove = function(manager) {
			if ( manager ) { 
				manager.$remove();

				for (var i in $scope.managers) {
					if ($scope.managers [i] === manager) {
						$scope.managers.splice(i, 1);
					}
				}
			} else {
				$scope.manager.$remove(function() {
					$location.path('managers');
				});
			}
		};

		// Update existing Manager
		$scope.update = function() {
			var manager = $scope.manager;

			manager.$update(function() {
				$location.path('managers/' + manager._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Managers
		$scope.find = function() {
			$scope.managers = Managers.query();
		};

		// Find existing Manager
		$scope.findOne = function() {
			$scope.manager = Managers.get({ 
				managerId: $stateParams.managerId
			});
		};
	}
]);