'use strict';

(function () {

	'use strict';

	angular.module('app').factory('FLocalStorage', function () {

		// ------------------------------------------------------------
		// Name: set
		// Handling function to save to localStorage
		// ------------------------------------------------------------
		var set = function set(name, data) {
			// Is the data bad?
			if (data === undefined || data === null) {
				// Yes, notify of a warning
				alert('WARNING: The data you were trying to save in localStorage is not complete, and your data was not saved. If this problem persists, please contact support');
			} else {
				// No, save it to localStorage
				localStorage.setItem(name, JSON.stringify(data));
			}
		};

		// ------------------------------------------------------------
		// Name: get
		// Handling function to get from localStorage
		// ------------------------------------------------------------
		var get = function get(name) {
			return JSON.parse(localStorage.getItem(name));
		};

		return {
			set: set,
			get: get
		};
	});
})();