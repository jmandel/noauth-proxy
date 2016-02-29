var ehrPath = require("path").join(__dirname);
module.exports = require("fs").readdirSync(ehrPath).reduce(function(coll, file){
  if (!file.match(/\.json$/)) return coll;

  var epath = require("path").join(__dirname, file);
  var ejson = require(epath);
  console.log(file, "eh", ejson, ejson.oauth, ejson.server);
  ejson.oauth.server = ejson.server;
  if (ejson.basic) {
    ejson.oauth.client.basic = ejson.basic;
  }
  var keys = [ejson.server].concat(ejson.nicknames || []);
  return keys.reduce(function(coll, k){
    var newk = {};
    newk[k] = ejson;
    return Object.assign({}, coll, newk)
  }, coll);
}, {});
