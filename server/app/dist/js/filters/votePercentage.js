'use strict';

(function () {

	'use strict';

	angular.module('app').filter('booleanToYesNo', function () {
		return function (input) {
			// True?
			if (input) {
				// Yes, display 'Yes'
				return 'Yes';
			} else {
				// No, display 'No'
				return 'No';
			}
		};
	});
})();