
// These two lines are required to initialize Express in Cloud Code.
User = require("cloud/users.js");
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
app.use(express.cookieParser('We are fucking SPG'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));


// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/',function(req,res){
  res.send('/mainpage');
});

app.post('/apis/users', function(req, res) {
  if(req.body.email && req.body.password){
    User.register(req.body.email, req.body.password, function(result){
      if(result != "ok"){
        res.status(500).send(result);
      }else{
        res.redirect('/me');
      }
    });
  }else{
    res.status(500).send("Lack of parameter!");
  }
});


app.get('/register', function(req, res) {
  var currentUser = Parse.User.current();
  if(currentUser){
    res.redirect('/me');
  }
  //should be else branch here
  res.render('register.ejs');
});

app.get('/apis/users', function(req, res) {
  if(req.query.email && req.query.password){
    User.login(req.query.email, req.query.password, function(result){
      if(result != "ok"){
        res.redirect('/mainpage');
      }else {
        res.redirect('/me');
      }
    });
  }else{
    res.status(500).send("Lack of parameter!");
  }
});


app.get('/apis/users/logout', function(req, res) {
  var currentUser = Parse.User.current();
  if(currentUser){
    User.logout();
  }
  res.redirect('/mainpage');
});


app.get('/me', function(req, res) {
  var currentUser = Parse.User.current();
  if (currentUser) {
    res.send("This is me");
  } else {
    res.redirect('/mainpage');
  }
});


app.get('/mainpage', function(req, res) {
  var currentUser = Parse.User.current();
  if (currentUser) {
    res.redirect('/me');
  } else {
    res.send('This is main page');
  }
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
app.listen();
