(() => {

	'use strict';

	angular
	.module('app')
	.controller('CAdmin', function($state, $stateParams, $auth, $location, FApi, FAdmin)
	{

		let vm = this;

		vm.pollList = [];
		vm.selectedPoll = null;
		vm.billboardPoll = FAdmin.billboardPoll;
		vm.isActivePoll = false;


		// ------------------------------------------------------------
		// Name: getAllPolls
		// Gets all polls from API
		// ------------------------------------------------------------
		const getAllPolls = function() {
			try {
				let promise = FApi.getAllPolls();
				promise.then((response) => {
					let polls = response.data;

					polls.forEach((poll, index) => {
						vm.pollList.push(poll);
					})

					FAdmin.billboardPoll = vm.pollList[0];
					vm.setSelectedPoll(vm.pollList[0]);
				})
				promise.catch((error) => {
					throw new Error(error);
				})
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		}

		vm.setSelectedPoll = function(poll) {
			vm.selectedPoll = poll;
			vm.isActivePoll = poll.isActiveQuestion;
		}

		vm.setBillboardPoll = function() {
			FAdmin.billboardPoll = vm.selectedPoll;
			$state.go('billboard');
		}

		vm.toggleIsActive = function() {
			try {
				let promise = FApi.toggleIsActive(vm.selectedPoll._id)
				promise.then(response => {
					if(response.hasOwnProperty('data')) {
						vm.isActivePoll = response.data.activeState;
					}
				}) 
				promise.catch((error) => {
					throw new Error(error);
				})
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		} 

		getAllPolls();
		

	})

})();
