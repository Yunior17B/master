const mongoose = require('mongoose');
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
  enum: ["basic", "supervisor", "admin"]
 },
 accessToken: {
  type: String
 }
});
var User = mongoose.model('user', UserSchema);
module.exports =  { User }


