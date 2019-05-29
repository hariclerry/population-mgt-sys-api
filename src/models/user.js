const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const Schema = mongoose.Schema;

// create schema
const userSchema = Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  created: { 
    type: Date,
    default: Date.now
}
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
  return token;
} 

const User = mongoose.model('User', userSchema);
module.exports.User = User
