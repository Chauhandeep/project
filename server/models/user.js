const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  firstname: {
    type:String,
    required:true,
    trim:true,
    minlength:1
  },
  lastname: {
    type:String,
    required:true,
    trim:true,
    minlength:1
  },
  blogurl: {
    type:String,
    required: true,
    unique: true
  },
  following: [{
    person: {
      type: String,
      required : true,
    }
  }],
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//when a login request is sent this method is called after saving
//details in database which returns an access token to the client
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.unshift({access, token});

  return user.save().then(() => {
    return token;
  });
};

//hashing password before storing into database
//using bcrypt
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//function to update the following list of a user
UserSchema.methods.updateFollowing = function(person) {
  var user = this;

  user.following.unshift({person});
  return user.save().then(()=>{
    return user.following;
  });
}


//function to basically find whether a particular user is registered
// or not
//if the user is found then a promise is returned containing the user details
UserSchema.statics.findByCredentials = function(username,password){
  var User = this;

  return User.findOne({username}).then((user)=>{
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,res)=>{
        if(res){
          resolve(user);
        }
        else {
          reject();
        }
      });
    });
  });
};

//function to authenticate user when he/she sends a request to create blogpost
//it user auth token provided by the user
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};
 //function to check whether the user to be followed exists or not
UserSchema.statics.findUserToBeFollowed = function(username,current_user){
  var User = this;

  return User.findOne({username}).then((user)=>{
    if(!user || user.username === current_user)
    {
      return Promise.reject();
    }
    return Promise.resolve(user);
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User}
