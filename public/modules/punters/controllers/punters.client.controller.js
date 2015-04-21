'use strict';

// Punters controller
angular.module('punters').controller('PuntersController', ['$timeout', '$http', '$scope', '$stateParams', '$location', 'Authentication', 'Punters',
	function($timeout, $http, $scope, $stateParams, $location, Authentication, Punters) {
		$scope.authentication = Authentication;

		$scope.question = {};

		// Find a list of Punters
		$scope.init = function() {
			$scope.fetchQuestion();
		};

		$scope.fetchQuestion = function() {
			$http.get('/question')
				.then(function(response) {
					$scope.question = response.data;
				});
			$timeout(function() {
				$scope.fetchQuestion();
			}, 1000);
		};
	}
]);