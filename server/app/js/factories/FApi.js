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



			// ------------------------------------------------------------
			// Name: functionName
			// desc...
			// ------------------------------------------------------------
			// const functionName = function(data)
			// {
			// 	let call = $http({
			// 		method: 'POST',
			// 		data: {},						// Insert Data Here
			// 		url: ``,						// API Url
			// 	})

			// 	return call;
			// }



			return {
				getAllPolls,
			}



		})
})();
