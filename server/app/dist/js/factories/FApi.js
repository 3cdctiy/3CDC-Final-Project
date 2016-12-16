'use strict';

(function () {

	'use strict';

	angular.module('app').factory('FApi', function ($http) {

		var domain = window.location.origin + "/";

		// ------------------------------------------------------------
		// Name: getUserUpdateStatus
		// desc...
		// ------------------------------------------------------------
		var getUserUpdateStatus = function getUserUpdateStatus() {
			var call = $http({
				method: 'GET',
				url: domain + 'api/me/'
			});

			return call;
		};

		// ------------------------------------------------------------
		// Name: setGetUpdates
		// desc...
		// ------------------------------------------------------------
		var setGetUpdates = function setGetUpdates(data) {
			var call = $http({
				method: 'POST',
				data: {
					userID: data.userID,
					isGettingUpdates: data.getUpdates
				},
				url: domain + 'api/me/setGetUpdates' });

			return call;
		};

		return {
			getUserUpdateStatus: getUserUpdateStatus,
			setGetUpdates: setGetUpdates
		};
	});
})();