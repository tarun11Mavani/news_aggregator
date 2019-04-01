const Post = require('../models/post'); // Import model
const Tag = require('../models/tag'); // Import model

function getPost(word){
    Tag.find({tag: word}, function (err, adminLogins) {
  if (err) return console.error(err);
    console.log(adminLogins);
}
module.exports = {
    getPost
};
