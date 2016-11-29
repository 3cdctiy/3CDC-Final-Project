(() => {

	'use strict';

	angular
		.module('app')
		.controller('CMain', function($state, $stateParams, $auth, $location, FAuthentication)
		{

			let vm = this;

			vm.logout = function() {
				FAuthentication.logoutUser();
				$location.path('/login');
			}

		})

})();
