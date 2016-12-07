'use strict';

(function () {

		'use strict';

		angular.module('app').controller('CLogin', function ($auth, $location, toastr, FFormUtilities, FApi) {

				var vm = this;
				var userID = void 0;

				vm.showLogin = false;

				// Initialize tabs
				$('ul.tabs').tabs();

				// Initialize modals
				$('.modal').modal();

				var checkOpenModal = function checkOpenModal() {
						if ($auth.isAuthenticated()) {
								var promise = FApi.getUserUpdateStatus();
								promise.then(function (response) {
										var user = response.data;
										userID = response.data._id;

										if (!user.hasOwnProperty('isGettingUpdates')) {
												// Open getUpdates modal
												$('#getUpdates').modal('open');
										}
								});
								promise.catch(function (error) {
										toastr.error(response.data.message);
								});
						}
				};

				// ------------------------------------------------------------
				// Name: login
				// Client side login form handling
				// ------------------------------------------------------------
				vm.isLoggedIn = function (isValid, loginForm) {
						try {
								if ($auth.isAuthenticated()) {
										return true;
								} else {
										return false;
								}
						} catch (error) {
								toastr.error(error.message, error.name);
						}
				};

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
								checkOpenModal();
								toastr.success('You have successfully signed in with ' + provider + '!');
								$location.path('/');
						}).catch(function (error) {
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
				vm.submitGetUpdates = function (answer) {

						var data = {
								userID: userID,
								getUpdates: answer
						};

						var promise = FApi.setGetUpdates(data);
						promise.then(function (response) {
								console.log('setting successfully saved: ' + answer);
						});
						promise.catch(function (error) {
								toastr.error(response.data.message);
						});
				};

				checkOpenModal();
		});
})();