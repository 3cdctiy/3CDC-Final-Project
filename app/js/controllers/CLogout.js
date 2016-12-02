(() => {

  'use strict';

  angular
  .module('app')
  .controller('CLogout', function($location, $auth) {
    
    let vm = this;



    // ------------------------------------------------------------
		// Name: logout
		// Logs user out, and redirects to login page
		// ------------------------------------------------------------
    vm.logout = function() {
			$auth.logout();
			$location.path('/login');
		}
  })

})();