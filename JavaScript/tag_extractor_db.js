const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
// const os = require('os');
// const _ = require('lodash')
const helper = require('./helper.js');

var computeTF = helper.computeTF;
var computeTFIDF = helper.computeTFIDF;


var url = 'https://www.ndtv.com/india-news/pulwama-attack-as-soldiers-bodies-arrive-ministers-rahul-gandhi-pay-tribute-at-delhi-airport-1994332';
var tfidf_score = {};
let rawdata = fs.readFileSync('IDF_score.json');
let dict = JSON.parse(rawdata);




//reading article text from url

request(url, function(err, resp, body) {
    if (err)
    throw err;
    $ = cheerio.load(body);
    var tf = computeTF($.text());
    // its array of arrays
    tfidf_score = computeTFIDF(tf, dict);     // tfidf score in [tag, score] format
    console.log(tfidf_score.slice(1, 10));    // prints top 10 tags

    // insert_post(tfidf_score);              //function call to insert in database
});

//helper functions to compute tfidf score

// function computeTF(text){
//
//     var index = {},
//     words = text
//     .replace(/\s+/g, " ")
//     .replace(/[^a-zA-Z0-9 ]/g, " ")
//     .toLowerCase()
//     .split(" ");
//
//     words.forEach(function (word) {
//         if (!(index.hasOwnProperty(word))) {
//             index[word] = 0;
//         }
//         index[word]++;
//     });
//     var n = words.length;
//     for(word in index){
//         index[word] /= n;
//     }
//
//     return index;
// }
//
//
//
// function computeTFIDF(tf, dict){
//
//     var tfidf_score = {};
//     for(var word in tf){
//         if((dict.hasOwnProperty(word)) )
//         {
//
//             if( dict[word] < 10)
//             tfidf_score[word] = tf[word] * dict[word];
//             else
//             {
//                 if(word.length > 4)
//                 {
//                     tfidf_score[word] = tf[word] * dict[word];
//                 }
//             }
//         }
//     }
//
//     var items = Object.keys(tfidf_score).map(function(key) {
//         return [key, tfidf_score[key]];
//     });
//
//     items.sort(function(first, second) {
//         return second[1] - first[1];
//     });
//
//     return items;
//
// }





//updateing database (ignore this part)
// // two types of entry in db
//     1)  unique id assigned by mongo(_id), url
//     2)  tag, _id, score     (like   { tag: 'India', _id: ID,  score: 7.845421})




// function insert_post(tfidf_score){
//
//     var MongoClient = require('mongodb').MongoClient;
//     var dburl = "mongodb://localhost:27017/";
//
//     MongoClient.connect(dburl, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("mydb");
//           dbo.collection("post").drop(function(err, delOK) {
//                 if (err) throw err;
//                 if (delOK) console.log("Collection deleted");
//                 db.close();
//               });
//
//
//     db.close();
//     });
//
// }
