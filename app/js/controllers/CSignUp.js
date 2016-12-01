(() => {

  'use strict';

  angular
  .module('app')
  .controller('CSignUp', function($scope, $auth, $location, toastr, FGremlin)
  {

    let vm = this;

    FGremlin.unleash();

    // ------------------------------------------------------------
    // Name: signup
    // Client side signup form handling
    // ------------------------------------------------------------
    vm.signup = function(isValid) {
      if(isValid) {
        $auth.signup(vm.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          toastr.info('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          toastr.error(response.data.message);
        });
      } else {
        toastr.error('Please ensure all form fields are valid', 'Invalid Form Fields');
      }
    };

  })

})();