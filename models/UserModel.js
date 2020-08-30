const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
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
const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
  }
module.exports = {
    ROLE: ROLE,
    users: [
      { id: 1, name: 'Kyle', ROLE: ROLE.ADMIN },
      { id: 2, name: 'Sally', ROLE: ROLE.BASIC },
      { id: 3, name: 'Joe', ROLE: ROLE.BASIC }
    ],
    projects: [
      { id: 1, name: "Kyle's Project", userId: 1 },
      { id: 2, name: "Sally's Project", userId: 2 },
      { id: 3, name: "Joe's Project", userId: 3 }
    ]
  }
const User = mongoose.model('user', UserSchema);