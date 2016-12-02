'use strict';

(function () {

		'use strict';

		angular.module('app').controller('CLogin', function ($auth, $location, toastr, FFormUtilities) {

				var vm = this;

				vm.showLogin = false;

				// Initialize tabs
				$('ul.tabs').tabs();

				// ------------------------------------------------------------
				// Name: login
				// Client side login form handling
				// ------------------------------------------------------------
				vm.login = function (isValid, loginForm) {
						try {
								if (!isValid) {
										throw new Error('Invalid form fields');
								}
								$auth.login(vm.user).then(function () {
										toastr.success('You have successfully signed in!');
										$location.path('/');
								}).catch(function (error) {
										toastr.error(error.data.message, error.status);
								});
						} catch (error) {
								toastr.error(error.message, error.name);
						}
				};

				// ------------------------------------------------------------
				// Name: authenticate
				// Authentication handling
				// ------------------------------------------------------------
				vm.authenticate = function (provider) {
						$auth.authenticate(provider).then(function () {
								toastr.success('You have successfully signed in with ' + provider + '!');
								$location.path('/');
						}).catch(function (error) {
								console.log(error);
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