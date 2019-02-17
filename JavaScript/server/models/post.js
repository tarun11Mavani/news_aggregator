// ID to link post and comment, voting missing
var mongoose = require('mongoose');

var Post = mongoose.model('Post', {
  handle: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 120
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 600
  }
});

module.exports = { Post };
