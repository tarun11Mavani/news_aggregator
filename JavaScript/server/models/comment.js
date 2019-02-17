// ID to link the comments and posts, voteing, replys missing
var mongoose = require('mongoose');

var Comment = mongoose.model('Comment', {
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports = { Comment };
