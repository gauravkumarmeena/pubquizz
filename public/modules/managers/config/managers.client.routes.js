'use strict';

//Setting up route
angular.module('managers').config(['$stateProvider',
	function($stateProvider) {
		// Managers state routing
		$stateProvider.
		state('listManagers', {
			url: '/managers',
			templateUrl: 'modules/managers/views/list-managers.client.view.html'
		}).
		state('createManager', {
			url: '/managers/create',
			templateUrl: 'modules/managers/views/create-manager.client.view.html'
		}).
		state('viewManager', {
			url: '/managers/:managerId',
			templateUrl: 'modules/managers/views/view-manager.client.view.html'
		}).
		state('editManager', {
			url: '/managers/:managerId/edit',
			templateUrl: 'modules/managers/views/edit-manager.client.view.html'
		});
	}
]);