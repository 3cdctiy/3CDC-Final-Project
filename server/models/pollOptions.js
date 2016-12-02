// The Poll Options model

const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const bcrypt 				= require('bcryptjs');



// userSchema structure
var pollOptionSchema = new Schema({
	pollOption: {
		type: String,
		required: true,
	},
	pollOptionSelectCount: {
		type: Int,
		required: true,
	},
	pollOptionSortOrder: {
		type: Int,
		required: true,
	},
	_pollQuestions: {type: Schema.Types.ObjectId, ref: 'PollQuestion'}
});



module.exports = mongoose.model('PollOption', userSchema);
