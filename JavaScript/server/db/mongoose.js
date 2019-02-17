// using mongoose instead of mongodb, just about preference
var mongoose = require('mongoose');

// don't think too much about promises, written just in case
mongoose.Promise = global.Promise;
// I don't know what the 2nd argument in the below code is but is solves the problem
// I don't know what the problem is either
mongoose.connect('mongodb://localhost:27017/tagEx', { useNewUrlParser: true });

// if you wan to write 3 lines of code to export
// module.exports = {
//   mongoose: mongoose
// }

// if you wanna write one line of code to export
// exports used to export functions between files
// kinda oversimplified but you get the idea
module.exports = { mongoose };
