//require first
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

// create app instance
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function(){
  console.log("server started on port 3000");
});
