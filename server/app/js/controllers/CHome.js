(() => {

	'use strict';

	angular
	.module('app')
	.controller('CHome', function($state, $stateParams, $auth, $location, FApi)
	{

		// initialize collapsable
		$('.collapsible').collapsible();
  		

		let vm = this;

		vm.pollList = [];
		vm.selectedPoll = null;


		function getAllPolls() {
			try {
				let promise = FApi.getAllPolls();
				promise
				.then((response) => {
					let polls = response.data;

					polls.forEach((poll, index) => {
						vm.pollList.push(poll);
					})

					vm.selectedPoll = vm.pollList[0];
				})
				.catch((error) => {
					throw new Error(error);
				})
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		}

		vm.getSelectedPoll = function(poll) {
			vm.selectedPoll = poll;
		}

		getAllPolls();
		

	})

})();
