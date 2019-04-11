const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require("path");

const { ObjectID } = require('mongodb');

var { Post } = require('../models/post.js');
var { Comment } = require('../models/comment.js');
var { Tag } = require('../models/tag.js');

const helper = require('../controllers/helper.js');
// const getPost = require('./controllers/getPost.js').getPost;
var computeTF = helper.computeTF;
var computeTFIDF = helper.computeTFIDF;

const submitPost = (req, res) => {

  url = req.body.link;
  request(url, (error, resp, body) => {
    if (error) {
       console.log(error);
    }

    let $ =  cheerio.load(body);
    let rawdata = fs.readFileSync(path.resolve(__dirname, "../IDF_score.json"));
    let dict = JSON.parse(rawdata);
    var tf = computeTF(req.body.text + req.body.text + $.text());
    // arrays of arrays format
    tfidf_score = computeTFIDF(tf, dict);     // tfidf score in [tag, score] format

    var post = new Post({
     handle: req.body.handle,
     link: req.body.link,
     text: req.body.text,
     tags :  tfidf_score.slice(0, 10)
    });

    // Separate storage for tags with scores
    var pid = post.get( "_id" );
    tfidf_score.slice(0, 10).forEach(element => {
      Tag.create(
        { tag: element[0],
          postid: pid,
          score: element[1] },
        (errorInCreation) => {
         if (errorInCreation) {
           console.log(errorInCreation);
         } else {
           console.log('Tag Added');
         }
        }
       );
     });

     post.save().then((doc) => {
       res.send(doc);
     }, (e) => {
       res.status(400).send(e);
     });

   });
};

const viewPost = (req, res) => {

  var id = req.params.pid;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  } else {
    Post.findById(id).then((post) => {
      if (!post) {
        res.status(404).send();
      } else {
        res.status(200).send({ post });
      }
    }).catch((e) => {
      res.status(400).send();
    });
  }

};

const viewDiscussion = (req, res) => {

  var id = req.params.pid;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  } else {
    Comment.find({ 'postID': id }).then((comment) => {
      if (!comment) {
        res.status(404).send();
      } else {
        console.log(comment);
        res.status(200);
        //res.status(200).send({ comment });
      }
    }).catch((e) => {
      res.status(400).send();
    });
  }

};

const router = express.Router();
router.post('/', submitPost);
router.get('/:pid', viewPost);
router.get('/discussion/:pid', viewDiscussion);

module.exports = router;
