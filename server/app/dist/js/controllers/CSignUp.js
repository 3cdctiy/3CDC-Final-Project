'use strict';

(function () {

  'use strict';

  angular.module('app').controller('CSignUp', function ($auth, $location, toastr) {

    var vm = this;

    vm.user = {
      getUpdates: true
    };

    // ------------------------------------------------------------
    // Name: signup
    // Client side signup form handling
    // ------------------------------------------------------------
    vm.signup = function (isValid) {
      try {
        if (!isValid) {
          throw new Error('Please ensure all form fields are valid');
        }
        $auth.signup(vm.user).then(function (response) {
          $auth.setToken(response);
          $location.path('/');
          toastr.info('You have successfully created a new account and have been signed-in');
        }).catch(function (response) {
          toastr.error(response.data.message);
        });
      } catch (error) {
        toastr.error(error.message, error.name);
      }
    };
  });
})();