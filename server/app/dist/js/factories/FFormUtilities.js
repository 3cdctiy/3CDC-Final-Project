'use strict';

(function () {

	'use strict';

	angular.module('app').factory('FFormUtilities', function () {

		// ------------------------------------------------------------
		// Name: resetForm
		// Resets form data and angular states
		// ------------------------------------------------------------
		var resetForm = function resetForm(form) {
			// Reset angular states
			form.$setPristine();
			form.$setUntouched();

			// Returns empty object (to be set equal to form data object)
			return {};
		};

		return {
			resetForm: resetForm
		};
	});
})();