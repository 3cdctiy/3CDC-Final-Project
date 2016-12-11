(() => {

  'use strict';

  angular
    .module('app')
    .controller('CHome', function($state, $stateParams, $scope, toastr, $auth, $location, FApi) {

    	const socket = io.connect(window.location.host); // Pulls in socket into controller

      // initialize collapsable
      $('.collapsible').collapsible();

      // initialize carousel
      $('.carousel.carousel-slider').carousel({ full_width: true });


      let vm = this;
      let userId = $auth.getPayload().sub; // Using payload to get user id

      vm.pollList = [];
      vm.openPolls = [];
      vm.pollResults = [];


      // Get live results of user votes
      socket.on('getLiveResults', (data) => {
      	// Data returned?
        if(data.data) {

        	// Yes, collect data
        	vm.pollResults = data.data;
        	
        	// Reload view
        	$scope.$digest();
        	
        } else {
        	// No, display error to user
        	toastr.error(data.error);
        }
      });


      // On user vote return
      socket.on(userId, (data) => {
      	// Data returned?
      	if(data.data) {
      		// Notify user of data
      		toastr.success(data.data);
      	} else {
      		// Notify user of error
      		toastr.error(data.error);
      	}
      });


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
        } catch (error) {
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
        } catch (error) {
          toastr.error(error.message, error.name);
        }
      }

      // ------------------------------------------------------------
      // Name: vote
      // New vote sent to server using poll ID and option (answer) ID
      // ------------------------------------------------------------
      vm.vote = function(pollId, optionId) {
        socket.emit('newPollVote', { userId, pollId, optionId });
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
