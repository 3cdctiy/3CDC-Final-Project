(() => {

  'use strict';

  angular
    .module('app')
    .controller('CHome', function($state, $stateParams, toastr, $auth, $location, FApi) {

    	const socket = io.connect(window.location.host); // Pulls in socket into controller

      // initialize collapsable
      $('.collapsible').collapsible();

      // initialize carousel
      $('.carousel.carousel-slider').carousel({ full_width: true });


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
      // New vote sent to server using poll ID and option (answer) ID
      // ------------------------------------------------------------
      vm.vote = function(pollId, optionId) {

        let user = $auth.getPayload(); // Using payload to get user id
        let userId = user.sub;
                // console.log(userId);

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
