var fs = require('fs');
var stream = fs.createWriteStream(".parse.local");
var nmg = {
  "applications": {
    "Vokou": {
      "applicationId": "JUXCXuysBgoulgFgGDGzc9elQNx4q84XiaDBoYyo"
    },
    "_default": {
      "link": "Vokou"
    }
  }
}

var pro = {
  "applications": {
    "Vokou-Web-Pro": {
      "applicationId": "bHqmUA41bQ1NINPU3OISrbR0YcmitymVLONL0PYU"
    },
    "_default": {
      "link": "Vokou-Web-Pro"
    }
  }
}
stream.once('open', function(fd) {

  if(process.env.V_ENV == 'PRO'){
    stream.write(JSON.stringify(pro));
  }
  else{
    stream.write(JSON.stringify(nmg));
  }
  stream.end();
});
