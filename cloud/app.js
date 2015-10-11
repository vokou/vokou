
// These two lines are required to initialize Express in Cloud Code.
var crypto = require('crypto'),
Cache = require("cloud/cache.js");
Invite = require("cloud/invite.js");
Mail = require("cloud/mail.js");
http = require('http');
User = require("cloud/users.js");
var convert = require('cloud/convert.js');
var _ = require('underscore');
parseExpressHttpsRedirect = require('parse-express-https-redirect');
parseExpressCookieSession = require('parse-express-cookie-session');
express = require('express');
app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.
algorithm = 'aes-256-ctr',
password = 'We are fucking SPG';
app.use(express.cookieParser('We are fucking SPG'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));

app.use(cors);

function cors(req, res,next){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader("Access-Control-Allow-Credentials","true");
  next();
}

function redirectUnmatched(req, res) {
  res.render("index");
}


function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.post('/cache/:hashvalue', function(req, res){
  if(req.body.result && req.params.hashvalue){
    Cache.save(req.params.hashvalue, req.body.result, function(result){
      if(result != "OK"){
        res.status(500).send("FAIL");
      }else{
        res.send("OK");
      }
    });
  }else{
    res.status(500).send("Lack of hashvalue or result");
  }
});


app.get('/nmg/:city', function(req, res){
  if( req.params.city ){
    Cache.fetch(req.params.hashvalue,  function(result){
      if(result == ""){
        res.status(500).send("FAIL");
      }else{
        res.send(result);
      }
    });
  }else{
    res.status(500).send("Lack of hashvalue or result");
  }
});

app.get('/cache/:hashvalue', function(req, res){
  if( req.params.hashvalue ){
    Cache.fetch(req.params.hashvalue,  function(result){
      if(result == ""){
        res.status(500).send("FAIL");
      }else{
        res.send(result);
      }
    });
  }else{
    res.status(500).send("Lack of hashvalue or result hash get");
  }
});


app.post('/apply', function(req, res){
  if(req.body.email){
    Invite.new(req.body.email,function (result, object) {
      if(result == 'ok'){
        result = {"status":"ok"};
        Mail.send(req.body.email,object.id);
        res.json(result);
      }else{
        //Code 0 for already registered
        result = {"error": 0}
        res.status(403).json(result);
      }
    });
  }else{
    res.status(403).send("Lack of parameters apply post!");
  }
});

app.post('/users', function(req, res) {
  if(req.body.email && req.body.password && req.body.code){
    if(req.body.code){
      Invite.find(req.body.code, function (result,object) {
        if(result == 'ok'){
          User.register(req.body.email, req.body.password, function(result, object){
            if(result != "ok"){
              res.status(403).send(result);
            }else{
              delete object["id"];
              delete object["password"];
              delete object["createdAt"];
              delete object["updatedAt"];
              res.json(object);
              object.destroy({});
            }
          });
        }
        else{
          res.status(403).send(result);
        }
      });
    }
    else{
      User.register(req.body.email, req.body.password, function(result){
        if(result != "ok"){
          res.status(403).send(result);
        }else{
          res.send('OK');
        }
      });
    }
  }else{
    if(!req.body.email){
      res.status(500).send("Lack of parameters post mail!");
    }
    else if(!req.body.password){
      res.status(500).send("Lack of parameters post pw=d!");
    }
    else if(!req.body.code){
      res.status(500).send("Lack of parameters post code!");
    }
  }
});



app.get('/users', function(req, res) {
  if(req.query.email && req.query.password){
    User.login(req.query.email, req.query.password, function(result, object){
      if(result != "ok"){
        res.status(403).send('not match');
      }else {
        delete object["id"];
        delete object["password"];
        delete object["createdAt"];
        delete object["updatedAt"];
        res.json(object);
      }
    });
  }else{
    res.status(403).send("Lack of parameters get!");
  }
});


app.get('/users/logout', function(req, res) {
  var currentUser = Parse.User.current();
  if(currentUser){
    User.logout();
  }
  res.redirect('/');
});


app.get('/search',function(req,res){
  //Date format: mm/dd/yyyy
  if( !req.query.checkin ){
    return res.status(500).send("checkin Wrong");
  }else if( !req.query.checkout ){
    return res.status(500).send("checkout Wrong");
  }else if( !req.query.city){
    return res.status(500).send("city Wrong");
  }else if( !req.query.source){
    return res.status(500).send("source Wrong");
  }

  // var currentUser = Parse.User.current();
  // if(!currentUser){
  //   return res.status(403).send("You didn't login");
  // }

  country = '';
  if(req.query.country){
    req.query.country = req.query.country.toLowerCase();
    req.query.country = convert[req.query.country];
    if (req.query.country == undefined){
      return res.status(500).send("Country wrong")
    }
    country = req.query.country;
  }

  state = '';
  if(country == 'us'){
    if( !req.query.state){
      return res.status(500).send("state Wrong");
    }
    state = req.query.state.toLowerCase();
    state = convert[state];
  }
  arrivalDate = req.query.checkin;
  departureDate = req.query.checkout;
  city = req.query.city.replace(' ', '+');
  var source = req.query.source;
  if(source == 'spg'){
    if(country != ''){
      source = "http://www.starwoodhotels.com/preferredguest/search/results/grid.html?localeCode=en_US&city=" + city + "&stateCode=" + state + "&countryCode=" + country + "&searchType=location&hotelName=&"+"currencyCode=USD&arrivalDate=" + arrivalDate + "&departureDate=" + departureDate + "&numberOfRooms=1&numberOfAdults=1&numberOfChildren=0&iataNumber=";
    }
    else{
      source = "http://www.starwoodhotels.com/preferredguest/search/results/grid.html?departureDate="+departureDate+ "&searchType=&complexSearchField="+ city+"&propertyIds=&arrivalDate="+arrivalDate+"&localeCode=en_US&numberOfRooms=1&numberOfAdults=1&skinCode=SPG&iATANumber=&numberOfChildren=0&currencyCode=USD"
      // source = "http://www.starwoodhotels.com/preferredguest/search/results/grid.html?localeCode=en_US&complexSearchField=" + city + "&searchType=location&hotelName=&"+"currencyCode=USD&arrivalDate=" + arrivalDate + "&departureDate=" + departureDate + "&numberOfRooms=1&numberOfAdults=1&numberOfChildren=0&iataNumber=";
    }
  }
  else{
    source = ''
  }

  if(source == ''){
    return res.status(500).end('Wrong source');
  }
  res.end(encrypt(source));
});
// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.use(redirectUnmatched);
app.listen();
