// Only for personal testing purposes, will be ignored later
var express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
// Import routes
const posts = require('./routes/post.js');

// separate file for the server
var { mongoose } = require('./db/mongoose.js');
// separate folder for the models being used
var { User } = require('./models/user.js');
var { Post } = require('./models/post.js');
var { Tag } = require('./models/tag.js');
var { Comment } = require('./models/comment.js');
var { Reply } = require('./models/reply.js');

// To parse the body, obv, specifically
// to get the string data from body and return as an object
var bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const helper = require('./controllers/helper.js');
// const getPost = require('./controllers/getPost.js').getPost;
const path = require("path");
var computeTF = helper.computeTF;
var computeTFIDF = helper.computeTFIDF;
var ObjectId = mongoose.Schema.Types.ObjectId;
var TagModel = mongoose.model('Tag');   //model for tag ( storing tag, postid so ten entry with same postid and diff tag )
var PostModel = mongoose.model('Post');


// controller for tag extraction
const tagExtractor = require('./controllers/tagExtractor.js').tagExtractor;

// testing the error
// tags.tagExtractor(url, (data) => {
//   console.log(data);
// });

// creating our express server
var app = express();


app.use(helmet()); // Sanitization of incoming requests
app.use(morgan('dev')); // Logging of incoming requests
app.use(express.json()); // Parse JSON encoded payloads in request
app.use(express.urlencoded({ extended: false })); // Parse URL encoded payload in requests

// Set custom HTTP response headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token',
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// bodyParser being used as the 3rd party middleware
app.use(bodyParser.json());
bodyParser = require('body-parser').json();
// creation of routs begins here

// route for posting
app.use('/posts', posts);

app.post('/comments', (req, res) => {
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
});

app.post('/replies', (req, res) => {
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
});


//routing for search
app.post('/search', (req, res) => {
  //console.log(req.body);

  var posts = [];

  text = req.body.text
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .toLowerCase()
    .split(" ");


    //getting data from db
      text.forEach(word => {
        TagModel.find({tag: word}, function (err, data1) {
        if (err) return console.error(err);
        data1.forEach(element => {
          PostModel.find({_id: element.postid}, function(err, data2){
            if (err) return console.error(err);
            data2.forEach(result => {
              console.log(result.link);
              posts.push(result);

            });
          });
        });

      });
      });

      //not working in sync if I remove setTimeOut because it is returning
      // response before above code executes try to do it without timeout if possible
      setTimeout(function () {
        console.log(posts);
        var set = new Set();
        var result = [];
        posts.forEach(element => {
          if(!set.has(String(element._id)))
          {
            set.add(String(element._id));
            result.push(element);
          }
        });
        result.sort(function(first, second) {
          return second.dateTime - first.dateTime;
        });

        console.log(set);
        res.send(result);
      }, 1000);

});

// Error Handling
app.on('uncaughtException', () => {
  app.close();
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
