const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const helper = require('./helper.js');
const path = require("path");
var computeTF = helper.computeTF;
var computeTFIDF = helper.computeTFIDF;
var insertTag = require('./insertDB').insertTag;

function tagExtractor(req){
  url = req.body.link;
  request(
    url,
    (error, resp, body) => {
      if (error) {
        // throw err;
        callback({
          error: error
        });
      }
      let $ = cheerio.load(body);
      let rawdata = fs.readFileSync(path.resolve(__dirname, "../IDF_score.json"));
      let dict = JSON.parse(rawdata);
      var tf = computeTF($.text());
      // arrays of arrays format
      tfidf_score = computeTFIDF(tf, dict);     // tfidf score in [tag, score] format
      console.log('--');
      flag = true;
      return tfidf_score.slice(0, 10);
    //  insertTag(req, tfidf_score.slice(0, 10));
     // console.log(tfidf_score.slice(1, 10));    // prints top 10 tags
      //insertDB(tfidf_score.slice(1, 10));       // returns top 10
  });
}

module.exports = { tagExtractor };
