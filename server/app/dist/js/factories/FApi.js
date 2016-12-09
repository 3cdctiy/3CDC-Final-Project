'use strict';

(function () {

	'use strict';

	angular.module('app').factory('FApi', function ($http) {

		var domain = "http://localhost:8000/";

		// ------------------------------------------------------------
		// Name: getAllPolls
		// Returns all poll questions and options
		// ------------------------------------------------------------
		var getAllPolls = function getAllPolls() {
			var call = $http({
				method: 'GET',
				url: domain + 'api/polls/'
			});

			return call;
		};

		var getAllActive = function getAllActive() {
			var call = $http({
				method: 'GET',
				url: domain + 'api/polls/active'
			});

			return call;
		};

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

		var toggleIsActive = function toggleIsActive(data) {
			var call = $http({
				method: 'POST',
				data: {
					pollQuestionID: data
				},
				url: domain + 'api/poll/toggle' });

			return call;
		};

		return {
			getAllPolls: getAllPolls,
			getUserUpdateStatus: getUserUpdateStatus,
			setGetUpdates: setGetUpdates,
			toggleIsActive: toggleIsActive,
			getAllActive: getAllActive
		};
	});
})();