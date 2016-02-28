var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
  res.json({'done': true});
});

router.get('/open/:issuer/*', function(req, res, next){
  AuthService
  .getTokenFor(req.params.issuer)
  .then(function(token){
    console.log("authservice gave'd a token", token)

    var options = {
      method: req.method,
      headers: Object.assign({}, req.headers, {
        host: undefined,
        accept: req.headers.accept.match(/^text\/html/) ? 'application/json+fhir' : req.headers.accept,
        authorization: 'Bearer ' + token.access_token}),
        url: req.params.issuer + '/' + req.params[0],
    };

    console.log("Getting the thing", options)
    var pipe = request(options)
    pipe.pipe(res)

  })
})

router.get('/smart-sandbox/*', function(req, res, next){
  AuthService.getToken(req.query.where||'http://google.com').then(function(token){
    res.json({'path': req.path,'token': token, 'q': req.query});
  })
})

var webdriverio = require('webdriverio');

var webdriverOptions = {
  desiredCapabilities: {
    browserName: 'chrome'
  }
};


function now(){
  return new Date().getTime();
}

function isValid(entry){
  if (!entry) return false;
  return (entry.timestamp + entry.response.expires_in * 1000) > now();
}

var _db = {}

var AuthService = {
  getTokenFor: function(issuer){

    if (isValid(_db[issuer])){
      return Promise.resolve(_db[issuer].response);
    }

    var ret,
    client = webdriverio.remote(webdriverOptions);

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
    }, 5000)
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
      _db[issuer] = {
        timestamp: now(),
        response: ret
      }
      console.log("browsere'd a token", ret)
      return ret;
    });
  }
}

module.exports = router;
