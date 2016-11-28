// The User model

const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const findOrCreate  = require('mongoose-findorcreate');

var userSchema = Schema({
  name    : String,
  posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  facebookID: String
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
