// The User model

const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const findOrCreate  = require('mongoose-findorcreate');
const bcrypt = require('bcryptjs');

var userSchema = new Schema({
	displayName: String, 
	email: String,
  facebook: String,
});

// userSchema.pre('save', function(next) {
// 	console.log('user schema pre')
//   var user = this;
//   if (!user.isModified('password')) {
//   	console.log('line 25 return')
//     return next();
//   }
//   bcrypt.genSalt(10, function(err, salt) {
//   	console.log('line 29 salt')
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       user.password = hash;
//       next();
//     });
//   });
// });

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
