'use strict';

(function () {

  'use strict';

  angular.module('app').controller('CHome', function ($state, $stateParams, $scope, toastr, $auth, $location, FApi) {

    var socket = io.connect(window.location.host); // Pulls in socket into controller

    // initialize collapsable
    $('.collapsible').collapsible();

    // initialize modal
    $('.modal').modal();

    // initialize carousel
    $('.carousel.carousel-slider').carousel({ full_width: true });

    var vm = this;
    var userId = $auth.getPayload().sub; // Using payload to get user id

    vm.pollList = [];
    vm.openPolls = [];
    vm.pollResults = [];
    vm.activePollIndex = 0;
    vm.selectedVoteOption = null;

    // ------------------------------------------------------------
    // Name: updateChartData
    // Updates the data used to measure chart option vote percentage
    // ------------------------------------------------------------
    vm.updateChartData = function (poll) {

      // Ensure our jQuery divs are ready to go
      $(document).ready(function () {

        // Reset vote total
        var voteTotal = 0;

        // Get vote total to calculate average
        poll._pollOptions.forEach(function (option) {
          voteTotal += option.pollOptionSelectCount;
        });

        // Perform calculations on this go around
        poll._pollOptions.forEach(function (option) {

          // Capture option's div
          var $option = $('#question' + poll.pollQuestionSortOrder + 'option' + option.pollOptionSortOrder);

          // Calculate average for option
          var average = (option.pollOptionSelectCount / voteTotal * 100).toFixed(2);

          // If there are no votes default all averages to 0
          if (voteTotal < 1) {
            average = 0;
          };

          // Load data into view
          $option.width(average + '%');
          $option.siblings('.option-percentage').text(average + '%');
        });

        // Update vote total
        vm.voteTotal = voteTotal;

        // Reload view
        $scope.$digest();
      });
    };

    // Get live results of user votes
    socket.on('getLiveResults', function (data) {
      // Data returned?
      if (data.data) {

        // Yes, collect data
        filterPollResults(data.data);

        // Reload view
        $scope.$digest();
      } else {
        // No, display error to user
        toastr.error(data.error);
      }
    });

    // On user vote return
    socket.on(userId, function (data) {
      // Data returned?
      if (data.data) {
        // Notify user of data
        toastr.success(data.data);
      } else {
        // Notify user of error
        toastr.error(data.error);
      }
    });

    function getAllPolls() {
      try {
        var promise = FApi.getAllPolls();
        promise.then(function (response) {
          var polls = response.data;

          polls.forEach(function (poll, index) {
            vm.pollList.push(poll);
          });

          vm.selectedPoll = vm.pollList[0];
        }).catch(function (error) {
          throw new Error(error);
        });
      } catch (error) {
        toastr.error(error.message, error.name);
      }
    }

    function getOpenPolls() {
      try {
        var promise = FApi.getAllActive(userId);
        promise.then(function (response) {
          var openPolls = response.data;

          openPolls.forEach(function (poll, index) {
            poll.index = index;
            vm.openPolls.push(poll);
          });

          vm.selectedPoll = vm.pollList[0];
        });
        promise.catch(function (error) {
          throw new Error(error);
        });
      } catch (error) {
        toastr.error(error.message, error.name);
      }
    }

    // ------------------------------------------------------------
    // Name: confirmVote
    // opens modal to get confirmation
    // ------------------------------------------------------------
    vm.confirmVote = function (option) {
      vm.selectedVoteOption = option;
      $('#confirmVote').modal('open');
    };

    // ------------------------------------------------------------
    // Name: vote
    // New vote sent to server using poll ID and option (answer) ID
    // ------------------------------------------------------------
    vm.vote = function (option) {
      var postId = option._pollQuestion,
          optionId = option._id;

      socket.emit('newPollVote', { userId: userId, postId: postId, optionId: optionId });
      vm.activePollIndex += 1;
    };

    var filterPollResults = function filterPollResults(data) {
      var promise = FApi.getUserDetails();

      // Upon successful return...
      promise.then(function (response) {
        var user = response.data;
        var userPollOptions = user._pollOptions;
        var userQuestions = [];

        data.forEach(function (pollQuestion) {
          pollQuestion._pollOptions.forEach(function (pollOption) {
            userPollOptions.forEach(function (userOption) {
              if (pollOption._id === userOption) {
                userQuestions.push(pollQuestion);
              }
            });
          });
        });

        vm.pollResults = userQuestions;
      });
      // Upon unsuccessful return...
      promise.catch(function (error) {
        // Throw error
        toastr.error(error);
      });
    };

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