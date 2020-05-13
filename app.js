//require first
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require('https');
// create app instance
const app = express();
// use body parser for easy form data access
app.use(bodyParser.urlencoded({extended: true}));
// use static files in public folder
app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/hireme.html');
});

app.post('/', function (req, res){
  // 1# get the values from the form
  const name = req.body.name;
  const company = req.body.company;
  const telephone = req.body.telephone;
  const email = req.body.email;
  const typeOfWork = req.body.typeOfWork;

  // validationForm();  todo
  console.log(isEmail(email));

  // 2# initialise object with values
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: // fields to populate our mailchimp database
        {
          NAME: name,
          COMPANY: company,
          PHONE: telephone,
          WORK: JSON.stringify(typeOfWork)
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = 'https://us18.api.mailchimp.com/3.0/lists/7c6d3c8841';
  const options = {
    method: 'POST',
    auth: 'anystring:e9a1846e3e75e217fbc8179bb5a5e133-us18'
  }
  const request = https.request(url, options, function (response){
    // response from mailchimp server
    response.on('data', function (data){
      // console.log(JSON.parse(data));
      // Handle Errors
      if( response.statusCode === 200 ){ // OK
        if( response.errorCode === 'ERROR_GENERIC'){
          console.log(response.error);
        }
        res.sendFile(__dirname + '/success.html');
        // console.log(JSON.parse(data));
      }
      else if (response.statusCode === 404){ // Error
        resolve.sendFile(__dirname + '/failure.html');
      }
      else{
        console.log('error code = ' + response.statusCode);
        // console.log(data);
      }
    })
  });
  // send the jsonData to mailchimp via the https request api
  request.write(jsonData);
  request.end();

});

app.post('/tryagain', function (req, res){
  res.redirect('/');
});

app.listen(3000, function(){
  console.log('server started on port 3000');
});


function dataIsValid(email, telephone){
  return isEmail(email) && isTelephone(telephone);
}

function isTelephone(tele){
  return
}
/*
Validations email address based in mailReg regex
 */
 function isEmail(email){
 	return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
 }
