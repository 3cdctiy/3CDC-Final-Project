'use strict';

(function () {

	'use strict';

	angular.module('app').controller('CAdmin', function ($scope, $state, $stateParams, $auth, $location, toastr, FApi, FAdmin) {

		var socket = io.connect(window.location.host);
		var $pollResultChart = $('#pollResultChart');

		var vm = this;

		vm.pollList = [];
		vm.selectedPollIndex = null;
		vm.selectedPoll = null;
		vm.billboardPollIndex = FAdmin.billboardPollIndex;
		vm.billboardPoll = FAdmin.billboardPoll;
		vm.isActivePoll = false;

		// ------------------------------------------------------------
		// Name: denyEntry
		// User is not administrator... deal with them!
		// ------------------------------------------------------------
		var denyEntry = function denyEntry() {
			// Deny thy entry!!!
			$state.go('landing');
			toastr.error('You must be an administrator to access this page!');
		};

		// ------------------------------------------------------------
		// Name: adminCheck
		// Verify the user is an administrator
		// ------------------------------------------------------------
		var adminCheck = function adminCheck() {
			try {
				if ($auth.isAuthenticated()) {
					var promise = FApi.getUserDetails();

					// Upon successful return...
					promise.then(function (response) {
						var user = response.data,
						    isAdmin = false;

						// Is user administrator?
						if (!user.isAdministrator) {
							denyEntry();
						} else {
							$('#adminCheck').hide();
						}
					});
					// Upon unsuccessful return...
					promise.catch(function (error) {
						// Throw error
						throw new Error(error);
					});
				} else {
					denyEntry();
				}
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		};

		// Very user is admin before moving forward
		adminCheck();

		// ------------------------------------------------------------
		// Name: setSelectedPoll
		// Sets selected and isActivePoll boolean. Called on sidebar select
		// ------------------------------------------------------------
		vm.setSelectedPoll = function (poll) {
			// Load variables with select poll states.
			var index = vm.pollList.indexOf(poll);

			vm.selectedPollIndex = index;
			vm.selectedPoll = poll;
			vm.isActivePoll = poll.isActiveQuestion;

			vm.updateBillboardPoll();
		};

		// ------------------------------------------------------------
		// Name: updateBillboardPoll
		// Sets billboardPoll as selected poll. Changes state to billboard
		// ------------------------------------------------------------
		vm.updateBillboardPoll = function () {
			// Load currently selected poll as billboard poll
			FAdmin.billboardPollIndex = vm.selectedPollIndex;
			vm.billboardPoll = vm.pollList[vm.selectedPollIndex];
			FAdmin.billboardPoll = vm.billboardPoll;

			updateChartData();
		};

		// ------------------------------------------------------------
		// Name: setBillboardPoll
		// Sets billboardPoll as selected poll. Changes state to billboard
		// ------------------------------------------------------------
		vm.setBillboardPoll = function () {
			vm.updateBillboardPoll();

			// Go to billboard view (fullscreen)
			$state.go('billboard');
		};

		// ------------------------------------------------------------
		// Name: toggleIsActive
		// Toggles poll's active boolean on database and locally
		// ------------------------------------------------------------
		vm.toggleIsActive = function () {
			try {
				// Send isActive toggle request to server
				var promise = FApi.toggleIsActive(vm.pollList[vm.selectedPollIndex]._id);

				// Upon successful return...
				promise.then(function (response) {
					// Does response have data property?
					if (response.hasOwnProperty('data')) {
						// Yes, load data's activeState
						vm.isActivePoll = response.data.activeState;
					}
				});
				// Upon unsuccessful return...
				promise.catch(function (error) {
					// Throw error
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		};

		// Get live results of user votes
		socket.on('getLiveResults', function (data) {
			// Data returned?
			if (data.data) {

				// Yes, load data into pollList
				vm.pollList = data.data;

				// selectedPoll set?							 No, load defaults
				if (vm.selectedPollIndex == null) {
					vm.setSelectedPoll(vm.pollList[0]);
				};

				vm.updateBillboardPoll();
				updateChartData();

				// Reload view
				$scope.$digest();
			} else {
				// No, return error to user
				toastr.error(data.error);
			}
		});

		var updateChartData = function updateChartData() {
			var billboardOptions = vm.billboardPoll._pollOptions.map(function (option) {
				return option.pollOption;
			});
			var billboardResults = vm.billboardPoll._pollOptions.map(function (option) {
				return option.pollOptionSelectCount;
			});

			var data = {
				labels: billboardOptions,
				datasets: [{
					backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
					borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
					borderWidth: 1,
					data: billboardResults
				}]
			};

			var myBarChart = new Chart($pollResultChart, {
				type: 'horizontalBar',
				data: data,
				options: {
					responsive: true
				}
			});
		};
	});
})();