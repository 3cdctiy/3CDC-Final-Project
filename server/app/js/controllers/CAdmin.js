(() => {

	'use strict';

	angular
	.module('app')
	.controller('CAdmin', function($scope, $state, $stateParams, $auth, $location, toastr, FApi, FAdmin)
	{

		const socket = io.connect(window.location.host);
		const $pollResultChart = $('#pollResultChart');

		let vm = this;

		vm.pollList = [];
		vm.billboardPollIndex = FAdmin.billboardPollIndex;
		vm.billboardPoll = FAdmin.billboardPoll;
		vm.isActivePoll = false;
		vm.voteTotal = 0;
		vm.connections = 0;



		// ------------------------------------------------------------
		// Name: denyEntry
		// User is not administrator... deal with them!
		// ------------------------------------------------------------
		const denyEntry = function() {
			// Deny thy entry!!!
    	$state.go('landing');
    	toastr.error('You must be an administrator to access this page!');
		}



		// ------------------------------------------------------------
		// Name: adminCheck
		// Verify the user is an administrator
		// ------------------------------------------------------------
		const adminCheck = function() {
			try {	
				if($auth.isAuthenticated()) {
					let promise = FApi.getUserDetails();

					// Upon successful return...
		      promise.then(response => {
		        let user 		= response.data,
		        		isAdmin = false;

		        // Is user administrator?
		        if(!user.isAdministrator) {
		        	denyEntry();
		        } else {
		        	$('#adminCheck').hide();
		        }
		      })
	      	// Upon unsuccessful return...
					promise.catch((error) => {
						// Throw error
						throw new Error(error);
					})
				} else {
					denyEntry();
				}
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		}



		// Very user is admin before moving forward
		adminCheck();



		// ------------------------------------------------------------
		// Name: setSelectedPoll
		// Sets selected and isActivePoll boolean. Called on sidebar select
		// ------------------------------------------------------------
		vm.setSelectedPoll = function(poll) {
			if(!poll) { poll = vm.pollList[0] };

			// Load variables with select poll states.
			let index = vm.pollList.indexOf(poll);

			// Update local and factory stored data
			vm.billboardPollIndex 		= index;
			vm.billboardPoll 					= poll;
			vm.isActivePoll 					= poll.isActiveQuestion;
			FAdmin.billboardPollIndex = vm.billboardPollIndex;

			// Update chart data
			updateChartData();
		}



		// ------------------------------------------------------------
		// Name: setBillboardPoll
		// Sets billboardPoll as selected poll. Changes state to billboard
		// ------------------------------------------------------------
		vm.setBillboardPoll = function() {

			// Go to billboard view (fullscreen)
			$state.go('billboard');

		}


		socket.on('connections', (data) => {
      if(data.data) {
      	vm.connections = data.data;
      	$scope.$digest();
      }
    });


		// Get live results of user votes
		socket.on('getLiveResults', (data) => {

			// Data returned?
      if(data.data) {

      	// Yes, load data into pollList
      	vm.pollList = data.data;

    		// Set billboardPoll with fresh data at index stored in FAdmin
    		vm.setSelectedPoll(vm.pollList[FAdmin.billboardPollIndex]);

      	// Update the chart data
      	updateChartData();

      	// Reload view
      	$scope.$digest();

      } else {
      	// No, return error to user
      	toastr.error(data.error);
      }
    });


		const updateChartData = function() {

			// Ensure our jQuery divs are ready to go
			$(document).ready(() => {

				// Get array of required data for ChartsJS
				// let billboardOptions = vm.billboardPoll._pollOptions.map(option => option.pollOption);
				// let billboardResults = vm.billboardPoll._pollOptions.map(option => option.pollOptionSelectCount);

				// Reset vote total
				let voteTotal = 0;

				// Get vote total to calculate average
				vm.billboardPoll._pollOptions.forEach(option => {
					voteTotal += option.pollOptionSelectCount;
				})

				// Perform calculations on this go around
				vm.billboardPoll._pollOptions.forEach(option => {
					
					// Capture option's div
					let $option = $('#option' + option.pollOptionSortOrder);

					// Calculate average for option
					let average = ((option.pollOptionSelectCount / voteTotal) * 100).toFixed(2);

					// If there are no votes default all averages to 0
					if(voteTotal < 1) { average = 0 };

					// Load data into view
					$option.width(average + '%');
					$option.siblings('.option-percentage').text(average + '%');
				})

				// Update vote total
				vm.voteTotal = voteTotal;

				// Reload view
      	$scope.$digest();

		  //   var data = {
		  //   labels: billboardOptions,
		  //   datasets: [
		  //       {
		  //         backgroundColor: [
		  //             'rgba(255, 99, 132, 0.2)',
		  //             'rgba(54, 162, 235, 0.2)',
		  //             'rgba(255, 206, 86, 0.2)',
		  //             'rgba(75, 192, 192, 0.2)',
		  //             'rgba(153, 102, 255, 0.2)',
		  //             'rgba(255, 159, 64, 0.2)'
		  //         ],
		  //         borderColor: [
		  //             'rgba(255,99,132,1)',
		  //             'rgba(54, 162, 235, 1)',
		  //             'rgba(255, 206, 86, 1)',
		  //             'rgba(75, 192, 192, 1)',
		  //             'rgba(153, 102, 255, 1)',
		  //             'rgba(255, 159, 64, 1)'
		  //         ],
		  //         borderWidth: 1,
		  //         data: billboardResults,
		  //       }
		  //   	]
				// };

				// var myBarChart = new Chart($pollResultChart, {
			 //    type: 'horizontalBar',
			 //    data: data,
			 //    options: {
			 //    	responsive: true
			 //  	}
				// });
			})
		}



		// ------------------------------------------------------------
		// Name: toggleIsActive
		// Toggles poll's active boolean on database and locally
		// ------------------------------------------------------------
		vm.toggleIsActive = function() {
			try {

				// Send isActive toggle request to server
				let promise = FApi.toggleIsActive(vm.pollList[vm.selectedPollIndex]._id)

				// Upon successful return...
				promise.then(response => {

					// Does response have data property?
					if(response.hasOwnProperty('data')) {

						// Yes, load data's activeState
						vm.isActivePoll = response.data.activeState;

					}
				}) 

				// Upon unsuccessful return...
				promise.catch((error) => {

					// Throw error
					throw new Error(error);

				})
			} catch(error) {
				toastr.error(error.message, error.name);
			}
		} 
		

	})

})();
