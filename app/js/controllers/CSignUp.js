(() => {

  'use strict';

  angular
  .module('app')
  .controller('CSignUp', function($scope, $auth, $location, toastr)
  {

    let vm = this;



    // ------------------------------------------------------------
    // Name: signup
    // Client side signup form handling
    // ------------------------------------------------------------
    vm.signup = function() {
      $auth.signup(vm.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          toastr.info('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          toastr.error(response.data.message);
        });
    };

  })

})();