var express = require('express');
// To parse the body, obv, specifically
// to get the string data from body and return as an object
var bodyParser = require('body-parser');

// separate file for the server
var { mongoose } = require('./db/mongoose.js');

// separate folder for the models being used
var { User } = require('./models/user.js');
var { Post } = require('./models/post.js');
var { Comment } = require('./models/comment.js');

// creating our express server
var app = express();

// bodyParser being used as the 3rd party middleware
app.use(bodyParser.json());

// creation of routs begins here

// route for posting
app.post('/posts', (req, res) => {
  // console.log(req.body);
  var post = new Post({
    handle: req.body.handle,
    link: req.body.link,
    text: req.body.text
  });

  post.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
