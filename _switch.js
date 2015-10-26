import versions from './versions.json';
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
  var pro = process.env.V_ENV == 'PRO' ? '-pro' : '';
  var vendorsVersion = '';
  if (process.env.V_ENV == 'PRO') {
    vendorsVersion = process.env.UV == 'T' ? process.env.TS : versions.production.vendors;
  } else {
    vendorsVersion = process.env.UV == 'T' ? process.env.TS : versions.test.vendors;
  }
  var vendor = `https://s3.amazonaws.com/vokou${pro}/vendors${vendorsVersion}.js`;
  var bundle = `https://s3.amazonaws.com/vokou${pro}/bundle${process.env.TS}.js`;

  var htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Vokou</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="https://s3.amazonaws.com/vokou/style.css">
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

  var versionStream = fs.createWriteStream("./versions.json");
  versionStream.once('open', fd => {
    if (process.env.V_ENV == 'PRO') {
      versions.production.vendors = process.env.UV == 'T' ? process.env.TS : versions.production.vendors;
      versions.production.bundle = process.env.TS;
    } else {
      versions.test.vendors = process.env.UV == 'T' ? process.env.TS : versions.test.vendors;
      versions.test.bundle = process.env.TS;
    }
    versionStream.write(JSON.stringify(versions));
    versionStream.end();
  });
});
