'use strict';

// Managers controller
angular.module('managers').controller('ManagersController',
['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Managers',
	function($http, $scope, $stateParams, $location, Authentication, Managers) {
		$scope.authentication = Authentication;

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
			$http.get('/pubquizzes')
				.then(function(response) {
					$scope.questions = response.data;
				});
		};

		// Find existing Manager
		$scope.sendQuestion = function(question) {
			$http.post('/question', question);
		};
	}
]);