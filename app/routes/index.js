var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({'done': true});
});

router.get('/smart-sandbox/*', function(req, res, next){
  AuthService.getToken(req.query.where||'http://google.com').then(function(token){
    res.json({'path': req.path,'token': token, 'q': req.query});
  })
})

var webdriverio = require('webdriverio');
var options = {
  desiredCapabilities: {
    browserName: 'chrome'
  }
};

var AuthService = {
  getToken: function(where){
    var ret = "No value";
    return webdriverio.remote(options)
    .init()
    .url(where)
    .title().then(function(res) {
      console.log('Title was: ' + res.value);
      ret = res.value;
    }).catch(function(e){
      console.log('caight', e);
    })
    .end()
    .then(function(){
      return ret;
    });
  }
}

module.exports = router;
