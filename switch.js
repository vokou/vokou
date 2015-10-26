'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _versionsJson = require('./versions.json');

var _versionsJson2 = _interopRequireDefault(_versionsJson);

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

parseStream.once('open', function (fd) {

  if (process.env.V_ENV == 'PRO') {
    parseStream.write(JSON.stringify(pro));
  } else {
    parseStream.write(JSON.stringify(nmg));
  }
  parseStream.end();
});

var indexStream = fs.createWriteStream("./public/index.html");

indexStream.once('open', function (fd) {
  var pro = process.env.V_ENV == 'PRO' ? '-pro' : '';
  var vendorsVersion = '';
  if (process.env.V_ENV == 'PRO') {
    vendorsVersion = process.env.UV == 'T' ? process.env.TS : _versionsJson2['default'].production.vendors;
  } else {
    vendorsVersion = process.env.UV == 'T' ? process.env.TS : _versionsJson2['default'].test.vendors;
  }
  var vendor = 'https://s3.amazonaws.com/vokou' + pro + '/vendors' + vendorsVersion + '.js';
  var bundle = 'https://s3.amazonaws.com/vokou' + pro + '/bundle' + process.env.TS + '.js';

  var htmlTemplate = '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>Vokou</title>\n    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">\n    <link href=\'https://fonts.googleapis.com/css?family=Roboto:400,300,500\' rel=\'stylesheet\' type=\'text/css\'>\n    <link rel="stylesheet" href="https://s3.amazonaws.com/vokou/style.css">\n    <script src="http://code.jquery.com/jquery-latest.min.js"></script>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script src="' + vendor + '"></script>\n    <script src="' + bundle + '"></script>\n  </body>\n</html>\n';
  indexStream.write(htmlTemplate);
  indexStream.end();

  var versionStream = fs.createWriteStream("./versions.json");
  versionStream.once('open', function (fd) {
    if (process.env.V_ENV == 'PRO') {
      _versionsJson2['default'].production.vendors = process.env.UV == 'T' ? process.env.TS : _versionsJson2['default'].production.vendors;
      _versionsJson2['default'].production.bundle = process.env.TS;
    } else {
      _versionsJson2['default'].test.vendors = process.env.UV == 'T' ? process.env.TS : _versionsJson2['default'].test.vendors;
      _versionsJson2['default'].test.bundle = process.env.TS;
    }
    versionStream.write(JSON.stringify(_versionsJson2['default']));
    versionStream.end();
  });
});

