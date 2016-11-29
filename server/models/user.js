// The User model

const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const findOrCreate  = require('mongoose-findorcreate');

var userSchema = Schema({
  name: String,
  token: String,
  facebookID: String,
  twitterID: String
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
