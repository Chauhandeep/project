var mongoose = require('mongoose');

var BlogPost = mongoose.model('blogpost', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  content: {
    type: String,
    required : true,
    minlength: 1,
    trim: true
  },
  postedAt: {
    type: Number
  },
  _author : {
    type : String,
    required : true,
  }
});


module.exports = {BlogPost};
