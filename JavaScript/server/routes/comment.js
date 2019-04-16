const express = require('express');
const { ObjectID } = require('mongodb');

var { Comment } = require('../models/comment.js');

const submitComment = (req, res) => {
  var comment = new Comment({
    handle: req.body.handle,
    postID: req.params.pid,
    text: req.body.text
  });

  comment.save().then((doc) => {
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
        res.status(200).send({ reply });
      }
    }).catch((e) => {
      res.status(400).send();
    });
  }

};

const router = express.Router();
router.post('/:pid', submitComment);
router.get('/discussion/:cid', viewDiscussion);

module.exports = router;
