var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({'done': true});
});

router.get('/open/intersys/*', function(req, res, next){
  AuthService.getTokenIntersys().then(function(token){
    res.json({'path': req.path,'token': token, 'q': req.query});
  })
})

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
  getTokenIntersys: function(){
    var ret;

    var client = webdriverio.remote(options);

    return client
    .init()
    .url('http://localhost:8000/fhir-app/launch.html#intersys')
    .waitForExist("#Username", 30000)
    .click("#Username")
    .keys("ARGONAUT")
    .click("#Password")
    .keys("TESTING")
    .click("#btnLogin")
    .waitForExist("#btnAccept")
    .click("#btnAccept")
    .waitUntil(function(){
      return client.execute(function(){
        return window['smart'] && window['smart']['tokenResponse'];
      }).then(function(r){
        return !!r.value
      })
    })
    .execute(function(){
      return window.smart.tokenResponse
    })
    .then(function(res) {
      ret = res.value;
    }).catch(function(e){
      console.log('caught', e);
    })
    .end()
    .then(function(){
      return ret;
    });
  },
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
