var Mailgun = require('mailgun');
var api_key = 'key-fbdd2e17246967a5a70a066669e9fafd';
var domain = 'mail.vokou.com';
var from_who = 'apply@vokou.com';

Mailgun.initialize(domain, api_key);
var Mail = {
  send: function (to, code) {
    var html = 'Welcome,\n Use this code: ' + code + ' to register on <a href="https://www.vokou.com"> Vokou </a>.\n Now you can start make a big save on your next trip and Enjoy it!';
    // var data = {
    //   from: from_who,
    //   to: to,
    //   subject: 'Congraduations! You recieve the Alpha test invitation code to save on your next trip!',
    //   html: 'Hello,\n Use this code: ' + code + ' to register on <a href="https://www.vokou.com"> Vokou </a>'
    // }


    Mailgun.sendEmail({
      to: to,
      from: "Vokou Team <apply@vokou.com>",
      subject: "Congraduations! You recieve the Alpha test invitation code from Vokou!",
      html: html
    }, {
      success: function(httpResponse) {
        console.log(httpResponse);
        console.log("Email sent to " + emails[0]);
      },
      error: function(httpResponse) {
        console.error(httpResponse);
        console.error("Uh oh, something went wrong");
      }
    });
    //
    // mailgun.messages().send(data, function (err, body) {
    //   //If there is an error, render the error page
    //   if (err) {
    //     res.render('error', { error : err});
    //     console.log("got an error: ", err);
    //   }
    //   //Else we can greet    and leave
    //   else {
    //     console.log(body);
    //   }
    // });
  }
}

module.exports  = Mail;
