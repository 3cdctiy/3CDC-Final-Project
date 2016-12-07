'use strict';

(function () {

  'use strict';

  angular.module('app').controller('CGetUpdates', function ($auth, $location, toastr, FApi) {

    var vm = this;
    var userID = void 0;

    vm.isAuthenticated = $auth.isAuthenticated();
  });
})();