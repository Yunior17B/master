const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
 
//Create Schema
const UserSchema = new Schema({
  
 email: {
  type: String,
  required: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  default: 'basic',
  enum: ["basic", "admin"]
 },
 accessToken: {
  type: String
 }
});
UserSchema.methods.verifyPassword = function(password, callback) {
    callback(err, bcrypt.compareSync(password, this.password));
  };
var User = mongoose.model('User', UserSchema);
module.exports =  { User }


