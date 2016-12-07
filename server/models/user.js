// The User model

const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const bcrypt 				= require('bcryptjs');



// userSchema structure
var userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String
	},
	displayName: {
		type: String,
		required: true
	},
	isCheckedIn: {
		type: Boolean,
		default: false
	},
	isAdministrator: {
		type: Boolean,
		default: false
	},
	facebook: String,
	twitter: String,
	_pollOptions: [{type: Schema.Types.ObjectId, ref: 'PollOption'}],
});



// userSchema pre-save password encryption
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});



// userSchema password comparison
userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};



module.exports = mongoose.model('User', userSchema);
