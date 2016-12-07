(() => {

	'use strict';

	angular
		.module('app')
		.factory('FApi', function($http)
		{

			const domain = "http://localhost:8000/";


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
				getUserUpdateStatus,
				setGetUpdates,
			}



		})
})();
