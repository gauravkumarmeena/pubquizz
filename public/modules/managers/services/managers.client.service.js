'use strict';

//Managers service used to communicate Managers REST endpoints
angular.module('managers').factory('Managers', ['$resource',
	function($resource) {
		return $resource('managers/:managerId', { managerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);