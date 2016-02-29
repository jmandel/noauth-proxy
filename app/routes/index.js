var express = require('express');
var router = express.Router();
var request = require('request');
var ehrs = require('../ehr');

router.get('/', function(req, res, next) {
  res.json({'done': true});
});

var ehrJs = "window.ehrs = " + JSON.stringify(ehrs, null, 2) + ";";
router.get('/ehrs.js', function(req, res, next) {
  res.setHeader('content-type', 'text/javascript');
  res.send(ehrJs);
});

router.get('/open/:server/*', function(req, res, next){
  var server = ehrs[req.params.server].server;
  AuthService
  .getTokenFor(server)
  .then(function(token){
    console.log("authservice gave'd a token", token)

    var options = {
      method: req.method,
      headers: Object.assign({}, req.headers, {
        host: undefined,
        accept: req.headers.accept.match(/^text\/html/) ? 'application/json+fhir' : req.headers.accept,
        authorization: 'Bearer ' + token.access_token}),
        url: server + '/' + req.params[0],
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
  if (!entry || !entry.response) return false;
  return (entry.timestamp + entry.response.expires_in * 1000) > now();
}

function approve(client, ehr){
  return function(){
    return ehr.steps.reduce(function(client, step){
      if (step.click){
        return client.waitForExist(step.click, 5000).click(step.click);
      }
      if (step.keys){
        return client.keys(step.keys);
      }
    },client);
  }
}

var _db = {}

var AuthService = {
  getTokenFor: function(server){

    if (isValid(_db[server])){
      return Promise.resolve(_db[server].response);
    }

    var ehr = ehrs[server],
        ret,
        client = webdriverio.remote(webdriverOptions);

    return  client
    .init()
    .url('http://localhost:8000/fhir-app/launch.html?iss=' + encodeURIComponent(server))
    .then(approve(client, ehr))
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
      _db[server] = {
        timestamp: now(),
        response: ret
      }
      console.log("browsere'd a token", ret)
      return ret;
    });
  }
}

module.exports = router;
