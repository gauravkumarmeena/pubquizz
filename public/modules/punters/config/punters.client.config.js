'use strict';

// Configuring the Articles module
angular.module('punters').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Punters', 'punters', 'dropdown', '/punters(/create)?');
		Menus.addSubMenuItem('topbar', 'punters', 'List Punters', 'punters');
		Menus.addSubMenuItem('topbar', 'punters', 'New Punter', 'punters/create');
	}
]);