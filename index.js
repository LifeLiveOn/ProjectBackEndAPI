// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const requestIp = require('request-ip');
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/",function (req, res) {
  let dataObject = new Date();
  res.json({unix:dataObject.valueOf(), utc: dataObject.toUTCString()});
})

app.get("/api/whoami",function(req,res){
  let header = req.headers
  let lang = req.headers['accept-language']
  let software = req.headers['user-agent']
  const clientIp = requestIp.getClientIp(req);
  res.json({ipaddress:clientIp,lang:lang, software:software})
})

// your first API endpoint... 
app.get("/api/:date_string", (req, res) => {
  let dateString = req.params.date_string;

  //A 4 digit number is a valid ISO-8601 for the beginning of that year
  //5 digits or more must be a unix time, until we reach a year 10,000 problem
  if (/\d{5,}/.test(dateString)) {
    let dateInt = parseInt(dateString);
    //Date regards numbers as unix timestamps, strings are processed differently
    res.json({ unix: parseInt(dateString), utc: new Date(dateInt).toUTCString() });
  } else {
    let dateObject = new Date(dateString);

    if (dateObject.toString() === "Invalid Date") {
      res.json({ error: "Invalid Date" });
    } else {
      res.json({ unix: parseInt(dateObject.valueOf()), utc: dateObject.toUTCString() });
    }
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
