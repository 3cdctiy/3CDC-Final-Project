(() => {

	'use strict';

	angular
		.module('app')
		.factory('FApi', function($http)
		{

			const domain = window.location.origin + "/";

			

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


			const getAllActive = function(userId)
			{
				let call = $http({
					method: 'GET',
					url: domain + `api/polls/active/${userId}`,
				})

				return call;
			}



			// ------------------------------------------------------------
			// Name: getUserDetails
			// desc...
			// ------------------------------------------------------------
			const getUserDetails = function()
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

			const toggleIsActive = function(data)
			{
				let call = $http({
					method: 'POST',
					data: {
						pollQuestionID: data
					},
					url: domain + `api/poll/toggle`,						// API Url
				})

				return call;
			}




			return {
				getAllPolls,
				getUserDetails,
				setGetUpdates,
				toggleIsActive,
				getAllActive,
			}



		})
})();
