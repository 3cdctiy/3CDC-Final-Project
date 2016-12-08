'use strict';

(function () {

	'use strict';

	angular.module('app').controller('CAdmin', function ($state, $stateParams, $auth, $location, FApi, FAdmin) {

		var vm = this;

		vm.pollList = [];
		vm.selectedPoll = null;
		vm.billboardPoll = FAdmin.billboardPoll;
		vm.isActivePoll = false;

		// ------------------------------------------------------------
		// Name: getAllPolls
		// Gets all polls from API
		// ------------------------------------------------------------
		var getAllPolls = function getAllPolls() {
			try {
				var promise = FApi.getAllPolls();
				promise.then(function (response) {
					var polls = response.data;

					polls.forEach(function (poll, index) {
						vm.pollList.push(poll);
					});

					FAdmin.billboardPoll = vm.pollList[0];
					vm.setSelectedPoll(vm.pollList[0]);
				});
				promise.catch(function (error) {
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		};

		vm.setSelectedPoll = function (poll) {
			vm.selectedPoll = poll;
			vm.isActivePoll = poll.isActiveQuestion;
		};

		vm.setBillboardPoll = function () {
			FAdmin.billboardPoll = vm.selectedPoll;
			$state.go('billboard');
		};

		vm.toggleIsActive = function () {
			try {
				var promise = FApi.toggleIsActive(vm.selectedPoll._id);
				promise.then(function (response) {
					if (response.hasOwnProperty('data')) {
						vm.isActivePoll = response.data.activeState;
					}
				});
				promise.catch(function (error) {
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		};

		getAllPolls();
	});
})();