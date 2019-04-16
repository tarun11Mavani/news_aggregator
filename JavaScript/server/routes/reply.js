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

const viewDiscussion = (req, res) => {

  var id = req.params.pid;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  } else {
    Reply.find({ 'commentID': id }).then((reply) => {
      if (!comment) {
        res.status(404).send();
      } else {
        console.log(comment);
        res.status(200);
        res.status(200).send({ reply });
      }
    }).catch((e) => {
      res.status(400).send();
    });
  }

};

const router = express.Router();
router.post('/:cid', submitReply);
router.get('/discussion/:cid', viewDiscussion);

module.exports = router;
