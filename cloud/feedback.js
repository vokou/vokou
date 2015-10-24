var FeedbackObject = Parse.Object.extend("feedback");
var Feedback = {
  save:function(browser, url, note, img, html, callback){
    var feedbackObject = new FeedbackObject();
    feedbackObject.save({
      browser: browser,
      url: url,
      note: note,
      img: img,
      html: html,
      cheatMode: false
    }, {
      success: function(object) {
        callback("OK");
      },
      error: function(object, error) {
        callback("FAIL");
      }
    });
  }

}


module.exports  = Feedback;
