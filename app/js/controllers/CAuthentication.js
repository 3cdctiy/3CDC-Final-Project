(() => {

	'use strict';

	angular
		.module('app')
	  .controller('CAuthentication', function($scope, $auth, $location) {
	    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          console.log('You have successfully signed in!');
          $location.path('/');
        })
        .catch(function(error) {
          console.log(error.data.message, error.status);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          console.log('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
        	console.log(error)
          if (error.message) {
            // Satellizer promise reject error.
            console.log(error.message);
          } else if (error.data) {
            // HTTP response error from server
            console.log(error.data.message, error.status);
          } else {
            console.log(error);
          }
        });
    };

	  });

})();