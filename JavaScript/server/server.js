// Only for personal testing purposes, will be ignored later
var express = require('express');
var mongoose = require('mongoose');

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

// bodyParser being used as the 3rd party middleware
app.use(bodyParser.json());
bodyParser = require('body-parser').json();
// creation of routs begins here

// route for posting
app.post('/posts', (req, res) => {
   //console.log(req.body);
 
   url = req.body.link;
   request(
     url,
     (error, resp, body) => {
       if (error) {
         // throw err;
          console.log(error);
         //  callback({
        //    error: error
        //  });
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
        tags :  tfidf_score.slice(0, 12)
        
      });



      var tmp = post.get( "_id" );
      var cnt  = 0;
      tfidf_score.slice(0, 10).forEach(element => {
        // console.log(element[0]+" "+element[1]);
        var tag = new Tag({
          tag: element[0],
          postid: tmp,
          score: element[1]
        });
        tag.save();

      });

      post.save().then((doc) => {
        res.send(doc);
      }, (e) => {
        res.status(400).send(e);
      });
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



app.on('uncaughtException', () => {
  app.close();
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
