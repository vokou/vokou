var moment = require("moment");
var CacheObject = Parse.Object.extend("cache");

var Cache = {
  fetch:function(hashvalue, callback){
    var d = new Date();
    var timeout = new Date(d.getDate()-1);
    var query = new Parse.Query(CacheObject);
    query.greaterThanOrEqualTo('updatedAt', timeout);
    query.equalTo("hash", hashvalue);
    query.find({
      success: function(result) {
        if(result.length == 0){
          callback("");
        }else{
          callback(result[0].get('result'));
        }
      },
      error: function(model, error) {
        callback("");
      }
    });
  },
  save:function(hashvalue, result, callback){
    var query = new Parse.Query(CacheObject);
    query.equalTo("hash", hashvalue);
    query.first({
      success: function(object) {
        if (object) {
          object.set("result", result);
          object.save();
          callback("OK");
        } else {
          var cacheObject = new CacheObject();
          cacheObject.save({
            hash: hashvalue,
            result: result,
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
      },
      error: function(error) {
        response.error("Could not validate uniqueness for this BusStop object.");
      }
    });
  }
}

module.exports  = Cache;
