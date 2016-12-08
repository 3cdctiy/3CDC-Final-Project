(() => {

	'use strict';

	angular
		.module('app')
		.factory('FApi', function($http)
		{

			const domain = "http://localhost:8000/";

			

			// ------------------------------------------------------------
			// Name: getAllPolls
			// Returns all poll questions and options
			// ------------------------------------------------------------
			const getAllPolls = function()
			{
				let call = $http({
					method: 'GET',
					url: domain + `api/polls/`,
				})

				return call;
			}


			const getAllActive = function()
			{
				let call = $http({
					method: 'GET',
					url: domain + 'api/polls/active',
				})

				return call;
			}



			// ------------------------------------------------------------
			// Name: getUserUpdateStatus
			// desc...
			// ------------------------------------------------------------
			const getUserUpdateStatus = function()
			{
				let call = $http({
					method: 'GET',
					url: domain + `api/me/`,
				})

				return call;
			}



			// ------------------------------------------------------------
			// Name: setGetUpdates
			// desc...
			// ------------------------------------------------------------
			const setGetUpdates = function(data)
			{
				let call = $http({
					method: 'POST',
					data: {
						userID: data.userID,
						isGettingUpdates: data.getUpdates
					},
					url: domain + `api/me/setGetUpdates`,						// API Url
				})

				return call;
			}



			return {
				getAllPolls,
				getUserUpdateStatus,
				setGetUpdates,
				getAllActive,
			}



		})
})();
