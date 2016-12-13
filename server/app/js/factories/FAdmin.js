(() => {

	'use strict';

	angular
		.module('app')
		.factory('FAdmin', function($http)
		{

			let billboardPollIndex,
					billboardPoll;


			return {
				billboardPollIndex,
				billboardPoll,
			}


		})
})();
