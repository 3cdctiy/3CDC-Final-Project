(() => {

	'use strict';

	angular
	.module('app')
	.controller('CHome', function($state, $stateParams, toastr, $auth, $location, FApi)
	{

		// initialize collapsable
		$('.collapsible').collapsible();

		// initialize carousel
		$('.carousel.carousel-slider').carousel({full_width: true});
  		

		let vm = this;

		vm.pollList = [];
		vm.openPolls = [];


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

					console.log(vm.pollList)
				})
				.catch((error) => {
					throw new Error(error);
				})
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		}

		function getOpenPolls() {
			try {
				let promise = FApi.getAllActive();
				promise
				.then((response) => {
					let openPolls = response.data;

					openPolls.forEach((poll, index) => {
						vm.openPolls.push(poll);
					})

					vm.selectedPoll = vm.pollList[0];

					console.log(vm.openPolls)
				})
				.catch((error) => {
					throw new Error(error);
				})
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		}

		vm.vote = function(pollId,optionId){
			// alert(pollId);
			// alert(optionId);
		}

		

		// vm.openPoll = function(poll) {
		// 	poll.forEach(function(item){
		// 		if(poll.item.isActiveQuestion === true){
		// 			vm.openPoll.push(item);
		// 		};
		// 	});

		// 	console.log(vm.openPoll)
		// }

		getAllPolls();
		getOpenPolls();

		

	})

})();
