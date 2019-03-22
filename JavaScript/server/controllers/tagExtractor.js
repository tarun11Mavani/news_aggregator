const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const helper = require('./helper.js');

var computeTF = helper.computeTF;
var computeTFIDF = helper.computeTFIDF;

exports.tagExtractor = (url, callback) => {
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
      let rawdata = fs.readFileSync('IDF_score.json');
      let dict = JSON.parse(rawdata);
      var tf = computeTF($.text());
      // arrays of arrays format
      tfidf_score = computeTFIDF(tf, dict);     // tfidf score in [tag, score] format
      // console.log(tfidf_score.slice(1, 10));    // prints top 10 tags

      callback(tfidf_score.slice(1, 10));       // returns top 10
  });
}
