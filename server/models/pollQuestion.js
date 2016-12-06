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
		type: Number,
		unique: true,
	},
	isActiveQuestion: {
		type: Boolean,
		required: true
	},
	_pollOptions: [{type: Schema.Types.ObjectId, ref: 'PollOption'}],
});



module.exports = mongoose.model('PollQuestion', pollQuestionSchema);
