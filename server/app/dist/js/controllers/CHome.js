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

    // initialize typedJS
    $(function () {
      $("#funFacts").typed({
        strings: ["Fountain Square Ice Rink voted one of the Top 10 Ice Rinks in the Nation by USA Today.", "The Genius of Water (originally built for King Ludwig of Germany) Statue is famous from opening credits of WKRP in Cincinnati.", "The Cincinnati Red Stockings, now known as the Cincinnati Reds, were the first professional baseball team started in 1869.", "William Howard Taft was one of 5 Cincinnati natives to be elected president, and in 1910, became the first president to throw out the first pitch on Opening Day.", "There are more than 140 chili restaurants in Cincinnati. Cincinnati-ans consume more than 2,000,000 pounds of chili each year and 850,000 pounds of shredded cheese.", "Over the Rhine, a once-bustling community of German beer brewers and pork packers built the nation's largest collection of 19th-century Italianate architecture.", "In 2014, The Eagle, Salazar, Taft's Ale House (located in a once-condemned German church in Over the Rhine, built in 1850).", "The Roebling Suspension Bridge was the longest worldwide and was later the prototype for the Brooklyxn Bridge after it was completed in 1867.", "Cincinnati hosted the first night baseball game played under lights in 1935.", "Local Cincinnatian's developed the American Cornhole Organization and Cincinnati is also the capital of the game.", "The University of Cincinnati was the first school in the United States to introduce a co-op program.", "The famous Oktoberfest-Zincinnati USA is found to be the largest Oktoberfest in the country and second largest in the world.", "Cincinnati's own Neil Armstrong was the first man to walk on the moon.", "Carmen Electra was born in Cincinnati and attended Princeton High School.", "Zagat Survey named the Cincinnati Zoo and Botancical Garden one of the top zoos in the nation.", "Cincinnati was the first city to deliver airmail July 4, 1835 (by hot air balloon).", "Kings Island is the largest amusement and waterpark in the Midwest.", "Nick Lachey was born in Cincinnati and graduated from School for the Creative and Performing Arts.", "Cincinnati is the first and only city to own their own Railroad (Cincinnati Southern 1880).", "Cincinnati was the first city in America to hold a songfest(1849).", "For the past 8 elections, Cincinnati's Busken Bakery has sold cookies featuring the candidates, and the sales have been very accurate in predicting the elections.", "The Cincinnati Zoo and Botanical Garden is the second oldest zoo in the U.S. after opening in 1875.", "Rock musician Peter Frampton married his third wife, Tina Elfers, in Cincinnati in 1996, and lived in an Indian Hill mansion from 2000 to 2012.", "The Beast is longest wooden roller coaster in country at 7,400 feet and ranked No. 7 best wooden roller coaster in the world by Amusement Today (2011).", "Glier's Goetta is primarily composed of ground meat and steel-cut oats, this dish originated with German settlers who immigrated to the Cincinnati area in the 19th century.", "Glier's Goetta, the largest commercial producer of goetta, produces more than 1,000,000 pounds annually, around 99 percent of which is consumed.", "Named the Best Walking City in Ohio and ranked 20th in the nation, according to Prevention magazine and the American Podiatric Medical Association.", "USA Today listed Cincinnati as one of the 10 great beer festivals” in the summer, Okotberfest-Zinzinnati is recognized as the world’s second-largest authentic Oktoberfest.", "Cincinnati Playhouse in the Park is the only two-time Tony Award winner outside of New York City (Regional Theatre Tony Award in 2004 and Best Revival of a Musical in 2007).", "Cincinnati Museum Center at Union Terminal received the National Medal for Museum and Library Service. The nation's highest honor for museums and libraries that make extraordinary civic, educational, economic, environmental and social contributions.", "Cincinnati USA is home to TEN Fortune 500 Companies."],
        typeSpeed: 0,
        // time before typing starts
        startDelay: 5000,
        // backspacing speed
        backSpeed: -400,
        // shuffle the strings
        shuffle: true,
        // time before backspacing
        backDelay: 3000,
        // loop
        loop: true
      });
    });

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

    // ------------------------------------------------------------
    // Name: filterPollResults
    // Limits poll results to questions users have answered
    // ------------------------------------------------------------
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
    //  poll.forEach(function(item){
    //    if(poll.item.isActiveQuestion === true){
    //      vm.openPoll.push(item);
    //    };
    //  });

    //  console.log(vm.openPoll)
    // }

    getAllPolls();
    getOpenPolls();
  });
})();