'use strict';

//Punters service used to communicate Punters REST endpoints
angular.module('punters').factory('Punters', ['$resource',
	function($resource) {
		return $resource('punters/:punterId', { punterId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);