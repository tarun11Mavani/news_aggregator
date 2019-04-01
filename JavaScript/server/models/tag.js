var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Tag = mongoose.model('Tag', {
    tag: {
        type: String,
        required: true
    }, 
    postid: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        
    }
   
});
var Tag = mongoose.model("Tag");
module.exports = { Tag };