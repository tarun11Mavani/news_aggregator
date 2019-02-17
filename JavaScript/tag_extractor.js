const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const os = require('os');
const lodash = require('lodash')

var url = 'https://www.ndtv.com/india-news/pulwama-attack-as-soldiers-bodies-arrive-ministers-rahul-gandhi-pay-tribute-at-delhi-airport-1994332';
var tfidf_score = {};
let rawdata = fs.readFileSync('IDF_score.json');
let dict = JSON.parse(rawdata);





request(url, function(err, resp, body) {
    if (err)
    throw err;
    $ = cheerio.load(body);
    var tf = computeTF($.text());
    tfidf_score = computeTFIDF(tf, dict);
    //console.log(tfidf_score.slice(1, 10));
    insert_post(tfidf_score);
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





//updating database


function insert_post(tfidf_score){

    var MongoClient = require('mongodb').MongoClient;
    var dburl = "mongodb://localhost:27017/";

    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
          dbo.collection("post").drop(function(err, delOK) {
                if (err) throw err;
                if (delOK) console.log("Collection deleted");
                db.close();
              });

          //console.log(tfidf_score);

            var myobj = JSON.parse(JSON.stringify(tfidf_score.slice(0, 10)));
            i = 1;
            for(var entry in tfidf_score.slice(0, 10) ){
                console.log(entry.key);
                var myobj = { tag: entry.key, id:i, score: entry.value}
                dbo.collection("post").insertOne(myobj, function(err, result) {
                    if (err) throw err;
                    db.close();

                });

            }




            console.log(myobj);

        dbo.collection("post").find({}).toArray( function(err, result) {
        if (err) throw err;
            console.log(result);
        });

    db.close();
    });

}
