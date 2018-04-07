var {User} = require('./../models/user');

var follow = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    var username = req.params.username;
    console.log(username);
    user.updateFollowing(username).then((following)=>{
      res.send(following);
    }).catch((e)=>{
      res.status(400).send(e);
    })
    next();
  }).catch((e) => {
    res.status(401).send(); //unautorised
  });
};

module.exports = {follow};
