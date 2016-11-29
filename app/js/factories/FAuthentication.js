(() => {

	'use strict';

	angular
		.module('app')
		.factory('FAuthentication', function($auth, $location)
		{



			// ------------------------------------------------------------
			// Name: logoutUser
			// Abstract: Logs user out of site
			// ------------------------------------------------------------
			const logoutUser = function()
			{
				$auth.logout();
				$location.path('/login');
			}



			return {
				logoutUser,
			}



		})
})();
