var InviteObject = Parse.Object.extend("Invite");
var query = new Parse.Query(InviteObject);
var Invite={
  find:function(code, callback){
    // other fields can be set just like with Parse.Object
    query.equalTo("registered",false);
    query.get(code,{
      success: function(object){
        callback('ok', object);
      },
      error: function (object) {
        callback('code');
      }
    });
  },
  new:function (email, callback) {
      query.equalTo("email", email);
      query.first({
        success: function(object) {
          if (object) {
            callback("Code already Sent!");
          } else {
            var inviteObject = new InviteObject();
            inviteObject.save({
              email: email,
              cheatMode: false,
              registered: false
            }, {
              success: function(object) {
                callback("ok",object);
              },
              error: function(object, error) {
                callback("FAIL");
              }
            });
          }
        },
        error: function(error) {
          response.error("Could not validate uniqueness for this BusStop object.");
        }
      });
  }
}

module.exports  = Invite;
