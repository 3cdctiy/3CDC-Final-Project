// The Poll Question model

const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const bcrypt 				= require('bcryptjs');



// userSchema structure
var pollQuestionSchema = new Schema({
	pollQuestion: {
		type: String,
		unique: true,
		required: true,
	},
	pollQuestionSortOrder: {
		type: Int,
		unique: true,
		required: true,
	},
	_pollOptions: [{type: Schema.Types.ObjectId, ref: 'PollOptions'}],
	_pollUser: {type: Schema.Types.ObjectId, ref: 'User'}
});



module.exports = mongoose.model('PollQuestion', userSchema);
