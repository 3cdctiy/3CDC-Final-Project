(() => {

  'use strict';

  angular
  .module('app')
  .controller('CLogout', function($scope, $location, $auth) {
    
    let vm = this;

    vm.logout = function() {
			$auth.logout();
			$location.path('/login');
		}
  })

})();