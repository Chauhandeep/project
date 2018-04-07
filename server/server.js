require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {BlogPost} = require('./models/blogpost');
var {authenticate} = require('./middleware/authenticate.js')

var app = express();
const port = process.env.PORT;

//BodyParser is used for parsing json requests
app.use(bodyParser.json());

//Setting register route
app.post('/register',(req,res) => {
  var body = _.pick(req.body,['username','password','firstname','lastname','blogurl']);
  var user = new User(body);

  user.save().then(()=>{
    //once user account is created an authentication token is returned
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

//setting login route
app.post('/login',(req,res)=>{
  var body = _.pick(req.body,['username','password']);
  User.findByCredentials(body.username,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

//Setting up blogpost route
app.post('/blogpost',authenticate,(req,res)=>{
  var body = _.pick(req.body,['title','content']);
  body.postedAt = new Date().getTime();
  body._id = req.user._id;
  var newPost = new BlogPost(
    {
      title : body.title,
      content : body.content,
      postedAt : body.postedAt,
      _author : body._id
    });
    newPost.save().then((post)=>{
      res.send(post);
    },(e)=>{
      res.status(400).send(e);
    });
});

//Setting up follow route
app.put('/follow/:username',authenticate,(req,res)=>{
  var username = req.params.username;
  User.findUserToBeFollowed(username,req.user.username).then((user)=>{
    res.send('Followed');
  }).catch((e)=>{
    res.status(400).send(e);
  })
});

//Server is run at localhost port 3000
app.listen(port , () => {
  console.log(`Server is up at port ${port}`);
});
