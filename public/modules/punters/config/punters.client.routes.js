'use strict';

//Setting up route
angular.module('punters').config(['$stateProvider',
	function($stateProvider) {
		// Punters state routing
		$stateProvider.
		state('listPunters', {
			url: '/punters',
			templateUrl: 'modules/punters/views/list-punters.client.view.html'
		}).
		state('createPunter', {
			url: '/punters/create',
			templateUrl: 'modules/punters/views/create-punter.client.view.html'
		}).
		state('viewPunter', {
			url: '/punters/:punterId',
			templateUrl: 'modules/punters/views/view-punter.client.view.html'
		}).
		state('editPunter', {
			url: '/punters/:punterId/edit',
			templateUrl: 'modules/punters/views/edit-punter.client.view.html'
		});
	}
]);