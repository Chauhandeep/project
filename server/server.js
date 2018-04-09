require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {BlogPost} = require('./models/blogpost');
var {authenticate} = require('./middleware/authenticate.js');
var {follow} = require('./middleware/follow.js');

var app = express();
const port = process.env.PORT;

//BodyParser is used for parsing json requests
app.use(bodyParser.json());

//Setting register route
app.post('/register',(req,res) => {
  var body = _.pick(req.body,['username','password','firstname','lastname','blogurl']);
  var user = new User(body);
  User.registerHelper(body.username).then((person)=>{
    if(person==null)
    {
      user.save().then(()=>{
        //once user account is created an authentication token is returned
        return user.generateAuthToken();
      }).then((token) => {
        res.header('x-auth',token).send(user);
      }).catch((e)=>{
        res.status(400).send(e);
      });
    }
    else {
      var object = {
        'error' : 'username already in use.'
      }
      res.send(object);
    }
  }).catch((e)=>{
    console.log(user);
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
  body.username= req.user.username;
  var newPost = new BlogPost(
    {
      title : body.title,
      content : body.content,
      postedAt : body.postedAt,
      _author : body.username
    });
    newPost.save().then((post)=>{
      res.send(post);
    },(e)=>{
      res.status(400).send(e);
    });
});

//Setting up follow route
app.put('/follow/:username',follow,(req,res)=>{
});

//Setting up feed request
app.get('/feed',authenticate,(req,res)=>{
  following = req.user.following;
  var posts = [];
  following.map((row) => {
    var username = row.person;
    BlogPost.find({
      '_author': username
    }).then((blogpost)=>{
        if(blogpost != null)
        {
        posts.unshift(blogpost);
        }
    }).catch((e)=>{
      return NULL;
    });
  });
  setTimeout(()=>{
      res.send(posts);
  },1000);
});

app.delete('/logout',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  },()=>{
    res.status(400).send();
  });
});

//Server is run at localhost port 3000
app.listen(port , () => {
  console.log(`Server is up at port ${port}`);
});
