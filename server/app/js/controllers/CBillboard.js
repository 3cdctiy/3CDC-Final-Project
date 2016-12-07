(() => {

	'use strict';

	angular
	.module('app')
	.controller('CBillboard', function($state, $stateParams, $auth, $location, FApi)
	{

		let vm = this;

		vm.pollList = [];


		function getAllPolls() {
			try {
				let promise = FApi.getAllPolls();
				promise
				.then((response) => {
					let polls = response.data;

					polls.forEach((poll, index) => {
						vm.pollList.push(poll);
						console.log(poll);
					})
				})
				.catch((error) => {
					throw new Error(error);
				})
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		}

		vm.getSelectedPoll = function(poll) {
			vm.openPollQuestion = poll.pollQuestion;
			vm.openPollOptions = poll._pollOptions;
		}

		getAllPolls();
		

	})

})();
