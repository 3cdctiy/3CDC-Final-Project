'use strict';

(function () {

	'use strict';

	angular.module('app').controller('CAdmin', function ($state, $stateParams, $auth, $location, FApi) {

		var vm = this;

		vm.pollList = [];
		vm.selectedPoll = null;
		vm.billboardPoll = null;
		vm.isBillboardPoll = false;

		function getAllPolls() {
			try {
				var promise = FApi.getAllPolls();
				promise.then(function (response) {
					var polls = response.data;

					polls.forEach(function (poll, index) {
						vm.pollList.push(poll);
					});

					vm.billboardPoll = vm.pollList[0];
					vm.setSelectedPoll(vm.pollList[0]);
				}).catch(function (error) {
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		}

		vm.setSelectedPoll = function (poll) {
			vm.selectedPoll = poll;

			if (poll._id === vm.billboardPoll._id) {
				vm.isBillboardPoll = true;
			} else {
				vm.isBillboardPoll = false;
			}
		};

		vm.setBillboardPoll = function (poll) {
			vm.billboardPoll = poll;
		};

		getAllPolls();
	});
})();