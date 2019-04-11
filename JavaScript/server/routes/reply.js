const express = require('express');
const { ObjectID } = require('mongodb');

var { Comment } = require('../models/comment.js');

const submitReply = (req, res) => {
  var reply = new Reply({
    handle: req.body.handle,
    commentID: req.body.commentID,
    text: req.body.text
  });

  reply.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
};

const router = express.Router();
router.post('/', submitReply);

module.exports = router;
