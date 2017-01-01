(() => {

	'use strict';

	angular
	.module('app')
  .controller('CLogin', function($state, $auth, $location, toastr, FFormUtilities, FApi) {

  	let vm = this;

  	vm.showLogin = false;

  	vm.user = {
      getUpdates: true,
    }


    if(window.location.hostname == 'tiy3cdc.herokuapp.com')
    {
      window.location = "http://www.fsqlive.com/";
    }


  	// Initialize tabs
  	$('ul.tabs').tabs();

  	// Initialize modals
    $('.modal').modal();



  	const socialSetUserUpdate = function() {
  		if ($auth.isAuthenticated()) {
	      let promise = FApi.getUserDetails();
	      promise.then(response => {
	        let user = response.data;
	        let userID = response.data._id;

	        if(!user.hasOwnProperty('isGettingUpdates')) {
	          submitGetUpdates(userID, vm.user.getUpdates)
	        }
	      })
	      promise.catch(error => {
	        toastr.error(error);
	      })
	    }
  	}



  	// ------------------------------------------------------------
		// Name: submitGetUpdates
		// Submits a user's answer on getting TIY updates
		// ------------------------------------------------------------
    const submitGetUpdates = function(userID, answer) {
      
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



    // ------------------------------------------------------------
    // Name: signup
    // Client side signup form handling
    // ------------------------------------------------------------
    vm.signup = function(isValid) {
      try {
        if(!isValid) { throw new Error ('Please ensure all form fields are valid') }
        $auth.signup(vm.user)
        .then(function(response) {
          $auth.setToken(response);
          $state.go('home');
          toastr.info('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          toastr.error(response.data.message);
        });
      } catch(error) {
        toastr.error(error.message, error.name);
      }
    };



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
	        $state.go('home');
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
      	socialSetUserUpdate();
        toastr.success('You have successfully signed in with ' + provider + '!');
        $state.go('home');
      })
      .catch(function(error) {
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