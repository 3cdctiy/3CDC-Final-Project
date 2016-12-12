(() => {

	'use strict';

	angular
	.module('app')
	.controller('CAdmin', function($scope, $state, $stateParams, $auth, $location, toastr, FApi, FAdmin)
	{

		const socket = io.connect(window.location.host);
		const $resultsChart = $('#resultsChart');

		let vm = this;

		vm.pollList = [];
		vm.selectedPoll = null;
		vm.billboardPoll = FAdmin.billboardPoll;
		vm.isActivePoll = false;



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
			// Load variables with select poll states.
			vm.selectedPoll = poll;
			vm.isActivePoll = poll.isActiveQuestion;
		}



		// ------------------------------------------------------------
		// Name: setBillboardPoll
		// Sets billboardPoll as selected poll. Changes state to billboard
		// ------------------------------------------------------------
		vm.setBillboardPoll = function() {
			// Load currently selected poll as billboard poll
			FAdmin.billboardPoll = vm.selectedPoll;
			// Go to billboard view (fullscreen)
			$state.go('billboard');
		}



		// ------------------------------------------------------------
		// Name: toggleIsActive
		// Toggles poll's active boolean on database and locally
		// ------------------------------------------------------------
		vm.toggleIsActive = function() {
			try {
				// Send isActive toggle request to server
				let promise = FApi.toggleIsActive(vm.selectedPoll._id)

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



		// ------------------------------------------------------------
		// Name: loadBillboardChart
		// Loads billboard chart with data and options
		// ------------------------------------------------------------
		const loadBillboardChart = function() {
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


		// Get live results of user votes
		socket.on('getLiveResults', (data) => {
			// Data returned?
      if(data.data) {

      	// Yes, load data into pollList
      	vm.pollList = data.data;

      	// selectedPoll set?					No, load defaults
      	if(vm.selectedPoll == null) { vm.setSelectedPoll(vm.pollList[0]) };
      	
      	// Reload view
      	$scope.$digest();

      } else {
      	// No, return error to user
      	toastr.error(data.error);
      }
    });

		// loadBillboardChart();
		

	})

})();
