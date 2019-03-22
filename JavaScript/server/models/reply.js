var mongoose = require('mongoose');

var Reply = mongoose.model('Reply', {
  handle: {
    type: String,
    required: true
  },
  commentID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  upVotes: {
    type: Number,
    default: 0
  },
  downVotes: {
    type: Number,
    default: 0
  },
  reports: {
    type: Number,
    default: 0
  }
});

module.exports = { Reply };
