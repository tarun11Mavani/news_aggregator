const Post = require('../models/post'); // Import model
const Tag = require('../models/tag'); // Import model
const express = require('express');
var { mongoose } = require('../db/mongoose.js');
var TagModel = mongoose.model('Tag');

function getPost(word){
    var result = [];
    TagModel.find({tag: word}, function (err, data) {
    if (err) return console.error(err);
     
    }
   );
//    return result;
};


module.exports = {
    getPost
}
