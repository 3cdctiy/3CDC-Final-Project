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
	facebook: String,
	twitter: String,
	_pollQuestions: [{type: Schema.Types.ObjectId, ref: 'PollQuestion'}],
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
