const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose')

var app = express();
const port = 3000;

//BodyParser is used for parsing json requests
app.use(bodyParser.json());

//Server is run at localhost port 3000
app.listen(port , () => {
  console.log(`Server is up at port ${port}`);
});
