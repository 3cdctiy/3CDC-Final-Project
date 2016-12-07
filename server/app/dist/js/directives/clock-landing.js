'use strict';

angular.module('app').directive('clocklanding', function () {
  return {
    restrict: 'E',
    templateUrl: 'partials/clock-landing.html',
    scope: {
      location: '@'
    },
    link: function link(vm, element, attrs) {
      var deadline = 'January 1 2017'; //set end date, in this case New Year's Day
      var expirationTime = 1483160400000; //epoch time of expiration date (Dec 31, 00:00:00)
      var currentTime = Date.now(); //get current time

      function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date()); //get the differenc between the end time and the current time
        var d = new Date();
        var seconds = Math.floor(t / 1000 % 60); //converts returned milliseconds to seconds 
        var minutes = Math.floor(t / 1000 / 60 % 60); //converts returned milliseconds to minutes
        var hours = Math.floor(t / (1000 * 60 * 60) % 24); //converts returned milliseconds to hours
        var days = Math.floor(t / (1000 * 60 * 60 * 24)); //converts returned milliseconds to days
        return { //build date object
          'total': t,
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
        };
      }

      function startClock(id, endtime) {
        //function to start clock and pass in id of elements to be updated as well as endtime
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector('#days'); //select days ID and store it
        var hoursSpan = clock.querySelector('#hours'); //select hours ID and store it 
        var minutesSpan = clock.querySelector('#minutes'); //select minutes ID and store it
        var secondsSpan = clock.querySelector('#seconds'); //select secinds ID and store it


        function updateClock() {
          //function to update clock and put updated time on the page
          var t = getTimeRemaining(endtime); //call getTimeRemaining 

          daysSpan.innerHTML = t.days; //update days ID with new time value 
          hoursSpan.innerHTML = ('0' + t.hours).slice(-2); //update days ID with new time value, add leading 0 and trim to 2 digits
          minutesSpan.innerHTML = ('0' + t.minutes).slice(-2); //update days ID with new time value, add leading 0 and trim to 2 digits
          secondsSpan.innerHTML = ('0' + t.seconds).slice(-2); //update days ID with new time value, add leading 0 and trim to 2 digits

          if (t.total <= 0) {
            //
            clearInterval(timeinterval);
          }

          if (currentTime >= expirationTime) {
            //hide days ID when time reaches expirationDate
            document.getElementById("days").style.display = 'none';
          }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000); //update the clock ever second
      }

      startClock('clockdivlanding', deadline); //start the clock and pass in the ID of the HTML element and the deadline time
    }
  };
});