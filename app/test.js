var webdriverio = require('webdriverio');
var options = {
  desiredCapabilities: {
    browserName: 'chrome'
  }
};

var client = webdriverio
.remote(options)

client.on('error', function(e) {
    // will be executed everytime an error occured
    // e.g. when element couldn't be found
  console.log("ErR",e)
    console.log(e.body.value.class);
    console.log(e.body.value.message);
});

client
  .init()
  .url('https://nyt.com')
  .title().then(function(res) {
    console.log('Title was: ' + res.value);
  }).catch(function(e){
    console.log('caight', e);
  })
  .end();
