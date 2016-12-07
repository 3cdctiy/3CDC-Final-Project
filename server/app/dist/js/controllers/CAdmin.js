'use strict';

(function () {

	'use strict';

	angular.module('app').controller('CAdmin', function ($state, $stateParams, $auth, $location, FApi) {

		var vm = this;

		vm.pollList = [];

		function getAllPolls() {
			try {
				var promise = FApi.getAllPolls();
				promise.then(function (response) {
					var polls = response.data;

					polls.forEach(function (poll, index) {
						vm.pollList.push(poll);
						console.log(poll);
					});
				}).catch(function (error) {
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		}

		vm.getSelectedPoll = function (poll) {
			vm.openPollQuestion = poll.pollQuestion;
			vm.openPollOptions = poll._pollOptions;
		};

		getAllPolls();
	});
})();