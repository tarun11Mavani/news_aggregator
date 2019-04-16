const express = require('express');
const { ObjectID } = require('mongodb');

var { Reply } = require('../models/reply.js');

const submitReply = (req, res) => {
  var reply = new Reply({
    handle: req.body.handle,
    commentID: req.params.cid,
    text: req.body.text
  });

  reply.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
};

const router = express.Router();
router.post('/:cid', submitReply);

module.exports = router;
