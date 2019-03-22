var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 18
  },
  handle: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 20
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30
  },
  age: {
    type: Date,
    required: true
  },
  // Array of strings from here on out
  followers: [{
    type: String
  }],
  following: [{
    type: String
  }],
  interest: [{
    type: String
  }]
});

module.exports = { User };
