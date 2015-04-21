'use strict';

// Configuring the Articles module
angular.module('punters').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Punter', 'Punters', 'punters', 'dropdown', '/punters(/create)?');
		Menus.addSubMenuItem('Punter', 'punters', 'List Punters', 'punters');
		Menus.addSubMenuItem('Punter', 'punters', 'New Punter', 'punters/create');
	}
]);