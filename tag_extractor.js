
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const os = require('os');

var url = 'https://www.hindustantimes.com/cricket/india-vs-australia-3-world-cup-certainties-who-could-be-rested-for-the-odi-series/story-wN6ONZtnhpTVcfk9THXJBK.html';

let rawdata = fs.readFileSync('scr.json');  
let dict = JSON.parse(rawdata);  

 request(url, function(err, resp, body) {
    if (err)
        throw err;
    $ = cheerio.load(body);

    var tf = computeTF($.text());
    var tfidf_score = computeTFIDF(tf, dict);
    
    console.log(tfidf_score.slice(1, 10));
});



function computeTF(text){
    
    var index = {},
            words = text
                    .replace(/\s+/g, " ")
                    .replace(/[^a-zA-Z0-9 ]/g, " ")
                    .toLowerCase()
                    .split(" ");
      
          words.forEach(function (word) {
              if (!(index.hasOwnProperty(word))) {
                  index[word] = 0;
              }
              index[word]++;
          });
          var n = words.length;
          for(word in index){
              index[word] /= n;
          }

          return index;
}



function computeTFIDF(tf, dict){

    var tfidf_score = {};
    for(var word in tf){
        if((dict.hasOwnProperty(word)) )
        {

            if( dict[word] < 10)
                tfidf_score[word] = tf[word] * dict[word];
            else 
            {
                if(word.length > 4)
                {
                    tfidf_score[word] = tf[word] * dict[word];
                }  
            }  
        }
    }
    
    var items = Object.keys(tfidf_score).map(function(key) {
        return [key, tfidf_score[key]];
      });
      
      items.sort(function(first, second) {
        return second[1] - first[1];
      });

    return items;

}


