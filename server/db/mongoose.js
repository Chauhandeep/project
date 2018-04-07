var mongoose = require('mongoose');

//Mongoose queries return promises and to enable handling those promises this line is used
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
