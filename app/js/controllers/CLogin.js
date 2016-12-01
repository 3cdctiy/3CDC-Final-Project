(() => {

	'use strict';

	angular
	.module('app')
  .controller('CLogin', function($scope, $auth, $location, toastr, FFormUtilities) {

  	let vm = this;

  	vm.showLogin = false;


		// ------------------------------------------------------------
		// Name: login
		// Client side login form handling
		// ------------------------------------------------------------
    vm.login = function(isValid, loginForm) {
	    if(isValid) {
	    	$auth.login(vm.user)
	      .then(function() {
	        toastr.success('You have successfully signed in!');
	        $location.path('/');
	      })
	      .catch(function(error) {
	        toastr.error(error.data.message, error.status);
	      });
	    } else {
	    	toastr.error('Please ensure you\'ve entered a valid email and password', 'Invalid Form Fields');
	    }
	  };



	  // ------------------------------------------------------------
		// Name: authenticate
		// Authentication handling
		// ------------------------------------------------------------
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