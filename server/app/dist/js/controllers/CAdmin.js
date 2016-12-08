'use strict';

(function () {

	'use strict';

	angular.module('app').controller('CAdmin', function ($state, $stateParams, $auth, $location, FApi) {

		var vm = this;

		vm.pollList = [];
		vm.selectedPoll = null;

		function getAllPolls() {
			try {
				var promise = FApi.getAllPolls();
				promise.then(function (response) {
					var polls = response.data;

					polls.forEach(function (poll, index) {
						vm.pollList.push(poll);
					});

					vm.selectedPoll = vm.pollList[0];
				}).catch(function (error) {
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		}

		vm.getSelectedPoll = function (poll) {
			vm.selectedPoll = poll;
		};

		getAllPolls();
	});
})();