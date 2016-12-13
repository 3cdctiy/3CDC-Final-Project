'use strict';

(function () {

	'use strict';

	angular.module('app').factory('FAdmin', function ($http) {

		var billboardPollIndex = void 0,
		    billboardPoll = void 0;

		return {
			billboardPollIndex: billboardPollIndex,
			billboardPoll: billboardPoll
		};
	});
})();