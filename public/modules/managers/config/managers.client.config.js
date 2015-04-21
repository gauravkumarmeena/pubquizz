'use strict';

// Configuring the Articles module
angular.module('managers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Manager', 'Managers', 'managers', 'dropdown', '/managers(/create)?');
		Menus.addSubMenuItem('Manager', 'managers', 'List Managers', 'managers');
		Menus.addSubMenuItem('Manager', 'managers', 'New Manager', 'managers/create');
	}
]);