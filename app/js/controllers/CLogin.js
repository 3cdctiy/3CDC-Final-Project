(() => {

	'use strict';

	angular
		.module('app')
	  .controller('CLogin', function($scope, $auth, $location, toastr) {

	  	let vm = this;

	    vm.login = function() {
      $auth.login(vm.user)
        .then(function() {
          toastr.success('You have successfully signed in!');
          $location.path('/');
        })
        .catch(function(error) {
        	console.log(error);
          toastr.error(error.data.message, error.status);
        });
    };
    vm.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          toastr.success('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
        	console.log(error)
          if (error.message) {
            // Satellizer promise reject error.
            toastr.error(error.message);
          } else if (error.data) {
            // HTTP response error from server
            toastr.error(error.data.message, error.status);
          } else {
            toastr.error(error);
          }
        });
    };

	  });

})();