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
		type: String,
		required: true
	},
	displayName: String, 
	facebook: String,
	twitter: String,
});



// userSchema pre-save password encryption
userSchema.pre('save', function(next) {
	console.log('user schema pre')
  var user = this;
  if (!user.isModified('password')) {
  	console.log('line 25 return')
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
  	console.log('line 29 salt')
    bcrypt.hash(user.password, salt, function(err, hash) {
    	console.log('hash: ' + hash)
      user.password = hash;
      next();
    });
  });
});



// userSchema password comparison
userSchema.methods.comparePassword = function(password, done) {
	console.log(this);
  bcrypt.compare(password, this.password, function(err, isMatch) {
  	console.log('pass: ' + password)
  	console.log('thispass: ' + this.password)
  	console.log('passMatch: ' + isMatch)
    done(err, isMatch);
  });
};



module.exports = mongoose.model('User', userSchema);
