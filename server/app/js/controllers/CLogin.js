(() => {

	'use strict';

	angular
	.module('app')
  .controller('CLogin', function($auth, $location, toastr, FFormUtilities, FApi) {

  	let vm = this;
  	let userID;

  	vm.showLogin = false;

  	// Initialize tabs
  	$('ul.tabs').tabs();

  	// Initialize modals
    $('.modal').modal();



  	const checkOpenModal = function() {
  		if ($auth.isAuthenticated()) {
	      let payload = $auth.getPayload();
	      console.log(payload);
	      let promise = FApi.getUserUpdateStatus();
	      promise.then(response => {
	      	console.log(response);
	        let user = response.data;
	        userID = response.data._id;

	        if(!user.hasOwnProperty('isGettingUpdates')) {
	          // Open getUpdates modal
	          $('#getUpdates').modal('open');
	        }
	      })
	      promise.catch(error => {
	        toastr.error(response.data.message);
	      })
	    }
  	}



  	// ------------------------------------------------------------
		// Name: login
		// Client side login form handling
		// ------------------------------------------------------------
    vm.isLoggedIn = function(isValid, loginForm) {
	    try {
	    	if($auth.isAuthenticated()) {
	    		return true;
	    	} else {
	    		return false;
	    	}
	    } catch(error) {
	    	toastr.error(error.message, error.name);
	    }
	  };



		// ------------------------------------------------------------
		// Name: login
		// Client side login form handling
		// ------------------------------------------------------------
    vm.login = function(isValid, loginForm) {
	    try {
	    	if(!isValid) { throw new Error('Invalid form fields'); }
	    	$auth.login(vm.user)
	      .then(function() {
	        toastr.success('You have successfully signed in!');
	        $location.path('/');
	      })
	      .catch(function(error) {
	        toastr.error(error.data.message, error.status);
	      })
	    } catch(error) {
	    	toastr.error(error.message, error.name);
	    }
	  };



	  // ------------------------------------------------------------
		// Name: authenticate
		// Authentication handling
		// ------------------------------------------------------------
	  vm.authenticate = function(provider) {
	    $auth.authenticate(provider)
      .then(function() {
      	checkOpenModal();
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



	  // ------------------------------------------------------------
		// Name: submitGetUpdates
		// Submits a user's answer on getting TIY updates
		// ------------------------------------------------------------
    vm.submitGetUpdates = function(answer) {
      
      let data = {
        userID: userID,
        getUpdates: answer
      }

      let promise = FApi.setGetUpdates(data);
      promise.then(response => {
        console.log('setting successfully saved: ' + answer)
      })
      promise.catch(error => {
        toastr.error(response.data.message);
      })
    }

  });

})();