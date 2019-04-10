var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    maxlength: 240
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 600
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
  },
  tags: [[]]
});
var Post = mongoose.model("Post");
module.exports = { Post };
