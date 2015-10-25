var fs = require('fs');
var parseStream = fs.createWriteStream(".parse.local");

var nmg = {
  "applications": {
    "Vokou": {
      "applicationId": "JUXCXuysBgoulgFgGDGzc9elQNx4q84XiaDBoYyo"
    },
    "_default": {
      "link": "Vokou"
    }
  }
};

var pro = {
  "applications": {
    "Vokou-Web-Pro": {
      "applicationId": "bHqmUA41bQ1NINPU3OISrbR0YcmitymVLONL0PYU"
    },
    "_default": {
      "link": "Vokou-Web-Pro"
    }
  }
};

parseStream.once('open', function(fd) {

  if(process.env.V_ENV == 'PRO'){
    parseStream.write(JSON.stringify(pro));
  } else{
    parseStream.write(JSON.stringify(nmg));
  }
  parseStream.end();
});

var indexStream = fs.createWriteStream("./public/index.html");

indexStream.once('open', fd => {
  var vendor = '';
  var bundle = '';
  if(process.env.V_ENV == 'PRO') {
    vendor = 'https://s3.amazonaws.com/vokou-pro/vendors.js';
    bundle = 'https://s3.amazonaws.com/vokou-pro/bundle.js';
  } else{
    vendor = 'https://s3.amazonaws.com/vokou/vendors.js';
    bundle = 'https://s3.amazonaws.com/vokou/bundle.js';
  }
  var htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Vokou</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="./style.css">
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script src="${vendor}"></script>
    <script src="${bundle}"></script>
  </body>
</html>
`;
  indexStream.write(htmlTemplate);
  indexStream.end();
});
