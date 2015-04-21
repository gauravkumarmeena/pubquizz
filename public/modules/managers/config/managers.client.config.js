'use strict';

// Configuring the Articles module
angular.module('managers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Managers', 'managers', 'dropdown', '/managers(/create)?');
		Menus.addSubMenuItem('topbar', 'Managers', 'List Managers', 'managers');
		Menus.addSubMenuItem('topbar', 'Managers', 'New Manager', 'managers/create');
	}
]);