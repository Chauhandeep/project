require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

//BodyParser is used for parsing json requests
app.use(bodyParser.json());

//Setting register route
app.post('/register',(req,res) => {
  var body = _.pick(req.body,['username','password','firstname','lastname']);
  var user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

//Server is run at localhost port 3000
app.listen(port , () => {
  console.log(`Server is up at port ${port}`);
});
