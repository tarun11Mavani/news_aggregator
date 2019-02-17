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
  }
});

module.exports = { User };
