(() => {

	'use strict';

	angular
	.module('app')
	.controller('CAdmin', function($state, $stateParams, $auth, $location, FApi, FAdmin)
	{

		let vm = this;
		let $resultsChart = $('#resultsChart');

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



		// ------------------------------------------------------------
		// Name: setSelectedPoll
		// Sets selected and isActivePoll boolean. Called on sidebar select
		// ------------------------------------------------------------
		vm.setSelectedPoll = function(poll) {
			vm.selectedPoll = poll;
			vm.isActivePoll = poll.isActiveQuestion;
		}



		// ------------------------------------------------------------
		// Name: setBillboardPoll
		// Sets billboardPoll as selected poll. Changes state to billboard
		// ------------------------------------------------------------
		vm.setBillboardPoll = function() {
			FAdmin.billboardPoll = vm.selectedPoll;
			$state.go('billboard');
		}



		// ------------------------------------------------------------
		// Name: toggleIsActive
		// Toggles poll's active boolean on database and locally
		// ------------------------------------------------------------
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



		const loadBillboardChart = function() {
			const $resultsChart = $('#resultsChart');

			var data = {
			    labels: ["January", "February", "March", "April", "May", "June", "July"],
			    datasets: [
			        {
			            label: "My First dataset",
			            backgroundColor: [
			                'rgba(255, 99, 132, 0.2)',
			                'rgba(54, 162, 235, 0.2)',
			                'rgba(255, 206, 86, 0.2)',
			                'rgba(75, 192, 192, 0.2)',
			                'rgba(153, 102, 255, 0.2)',
			                'rgba(255, 159, 64, 0.2)'
			            ],
			            borderColor: [
			                'rgba(255,99,132,1)',
			                'rgba(54, 162, 235, 1)',
			                'rgba(255, 206, 86, 1)',
			                'rgba(75, 192, 192, 1)',
			                'rgba(153, 102, 255, 1)',
			                'rgba(255, 159, 64, 1)'
			            ],
			            borderWidth: 1,
			            data: [65, 59, 80, 81, 56, 55, 40],
			        }
			    ]
			};


			var myBarChart = new Chart($resultsChart, {
			    type: 'horizontalBar',
			    data: data,
			    // options: options
			});
		}

		getAllPolls();
		// loadBillboardChart();
		

	})

})();
