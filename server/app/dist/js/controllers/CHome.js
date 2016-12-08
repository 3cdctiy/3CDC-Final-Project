'use strict';

(function () {

	'use strict';

	angular.module('app').controller('CHome', function ($state, $stateParams, toastr, $auth, $location, FApi) {

		// initialize collapsable
		$('.collapsible').collapsible();

		// initialize carousel
		$('.carousel.carousel-slider').carousel({ full_width: true });

		var vm = this;

		vm.pollList = [];
		vm.openPolls = [];

		function getAllPolls() {
			try {
				var promise = FApi.getAllPolls();
				promise.then(function (response) {
					var polls = response.data;

					polls.forEach(function (poll, index) {
						vm.pollList.push(poll);
					});

					vm.selectedPoll = vm.pollList[0];

					console.log(vm.pollList);
				}).catch(function (error) {
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
		}

		function getOpenPolls() {
			try {
				var promise = FApi.getAllActive();
				promise.then(function (response) {
					var openPolls = response.data;

					openPolls.forEach(function (poll, index) {
						vm.openPolls.push(poll);
					});

					vm.selectedPoll = vm.pollList[0];

					console.log(vm.openPolls);
				}).catch(function (error) {
					throw new Error(error);
				});
			} catch (error) {
				toastr.error(error.message, error.name);
			}
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
	});
})();