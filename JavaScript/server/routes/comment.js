const express = require('express');
const { ObjectID } = require('mongodb');

var { Comment } = require('../models/comment.js');

const submitComment = (req, res) => {
  var comment = new Comment({
    handle: req.body.handle,
    postID: req.body.postID,
    text: req.body.text
  });

  comment.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
};

const router = express.Router();
router.post('/', submitComment);

module.exports = router;
