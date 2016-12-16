const User = require('../models/user');
const PollQuestion = require('../models/pollQuestion');
const PollOption = require('../models/pollOption');



// ------------------------------------------------------------
// Name: getAll
// Returns all poll questions
// ------------------------------------------------------------
exports.getAll = ((req, res) => {
  PollQuestion
    .find()
    .populate('_pollOptions')
    .sort({ pollQuestionSortOrder: 1 })
    .exec((err, response) => {
      if (err) return res.send(err);
      res.json(response);
    })
})



// ------------------------------------------------------------
// Name: getAllActive
// Returns all active poll questions
// ------------------------------------------------------------
exports.getAllActive = ((req, res) => {

	let userId 		= req.params.userId;

  User
  	.findById(userId)
  	.populate('_pollOptions')
  	.exec((err, response) => {
  		if (err) return res.send(err);

  		if(response != null || response != undefined) {

  			let userQuestionIDs = [];

	  		let userOptionIDs = response._pollOptions;
	  		userOptionIDs.forEach(option => {
	  			userQuestionIDs.push(option._pollQuestion);
	  		})

	  		PollQuestion
			    .find( {_id : { $nin : userQuestionIDs } } )
			    .populate('_pollOptions')
			    .where('isActiveQuestion').equals(true)
			    .sort({ pollQuestionSortOrder: 1 })
			    .exec((err, response) => {
			      if (err) return res.send(err);
			      res.json(response);
			    })
  		}
  	})
})



// ------------------------------------------------------------
// Name: postQuestion
// Adds a new question and it's options to the database
// ------------------------------------------------------------
exports.postQuestion = ((req, res) => {

  // --------------------
  // Step 1: Save Poll Question
  // --------------------
  PollQuestion
    .findOne({})
    .sort('-pollQuestionSortOrder') // give me the max
    .exec(function(err, response) {
      if (err) return res.send(err);

      // Initiate newSortIndex as 1
      let newSortIndex = 1;

      // Was anything found?
      if (response !== null) {
        // Yes, did response come back with number?
        if (typeof response.pollQuestionSortOrder === 'number') {
          // Yes, add response number to newSortIndex
          newSortIndex = response.pollQuestionSortOrder + 1;
        }
      }

      // Build pollQuestion object
      let pollQuestion = {
        pollQuestion: req.body.pollQuestion,
        pollQuestionSortOrder: newSortIndex,
        isActiveQuestion: false,
        _pollOptions: []
      };

      // Insert pollQuestion
      PollQuestion.collection.insert(pollQuestion, callback)

      // Callback response
      function callback(err, docs) {
        if (err) {
          res.send({ error: err })
        } else {

          // --------------------
          // Step 2: Save Poll Options
          // --------------------
          let pollQuestionID = docs.ops[0]._id;
          let pollOptions = JSON.parse(req.body.pollOptions);
          let pollOptionList = [];

          pollOptions.forEach((option, index) => {
            // Load new PollQuestion object
            let pollOption = {
              pollOption: pollOptions[index].pollOption,
              pollOptionSelectCount: 0, // Initially set to zero
              pollOptionSortOrder: index + 1,
              _pollQuestion: pollQuestionID
            };

            // Push into array
            pollOptionList.push(pollOption);
          })

          // Insert array to PollOption collection
          PollOption.collection.insert(pollOptionList, callback);

          function callback(err, docs) {
            if (err) {
              res.send({ error: err })
            } else {
              // Save option's ObjectID in PollQuestion for referencing
              PollQuestion
                .findById(pollQuestionID)
                .populate('_pollOptions')
                .exec((err, question) => {
                  question._pollOptions = docs.ops;
                  question.save(function(err, response) {
                    if (err) {
                      res.send({ error: err });
                      return;
                    };

                    res.send({ success: "Poll options successfully added" })
                  });
                })
            }
          }
        }
      }
    });
})



// ------------------------------------------------------------
// Name: voteQuestion
// Increments an options vote count by 1
// data = userId, pollId, optionId
// ------------------------------------------------------------
exports.newPollVote = (data => {

  PollOption
    .findById(data.userId)
    .exec((err, option) => {
      // if (err) return err;

      // Increment poll option select count
      option.pollOptionSelectCount += 1;

      // Initiate save to database
      option.save(function(err, response) {
        if (err) return { error: err };

        User
          .findById(data.userId)
          .exec((err, user) => {
            // Add option selection to user account
            user._pollOptions.push(response);

            // Save option selection to database
            user.save(function(err, response) {
              if (err) return { error: err };
              return { success: "Vote successfully counted" };
            })
          })
      });
    })
})



// ------------------------------------------------------------
// Name: toggleIsActive
// Toggles a question's isActiveQuestion state
// ------------------------------------------------------------
exports.toggleIsActive = ((req, res) => {

  PollQuestion
    .findById(req.body.pollQuestionID)
    .exec((err, question) => {

      let toggleStatus = false;

      question.isActiveQuestion ? toggleStatus = false : toggleStatus = true;
      question.isActiveQuestion = toggleStatus;

      // Initiate save to database
      question.save(function(err, response) {
        if (err) {
          res.send({ error: err });
          return;
        };

        res.send({ activeState: toggleStatus })
      });
    })
})
