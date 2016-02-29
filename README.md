# NOAuth: Open proxy for SMART on FHIR

### What is it?

A testing tool that sits in front of an OAuth-protected SMART on FHIR sandbox, like the ones hosted by [Argonaut Implementation Program](https://github.com/argonautproject/implementation-program/wiki) participants. It automates the authorization process (using webdriver) and presents the facade of an open server. This is designed to faciliate testing and manual inspection, and as a building block for an OAuth testing suite.

### Try it

You can use URLs like the following as a FHIR base URL:

    http://noauth.smarthealthit.org/open/:server

Where `:server` is one of these Argonaut test servers:

 * `allscripts`
 * `epic`
 * `intersystems`
 * `meditech`
 * `smart`

#### Examples:

Note: you may experience a 5s delay if nobody has talked to your target server in more than an hour (since the proxy only refreshes tokens when needed).

##### An `Observation` from Epic
http://noauth.smarthealthit.org/open/epic/Observation/Tl4xxjAMDmAdEfs3nmEjOkjNfEKA5NpRW-zNUTlnIyfsB

##### A `Patient` from Intersystems
http://noauth.smarthealthit.org/open/intersys/Patient/450

##### A `Patient` from Meditech
http://noauth.smarthealthit.org/open/meditech/Patient/S1-B20150826100257463

##### A `Patient` from SMART
http://noauth.smarthealthit.org/open/smart/Patient/99912345

### Build it

    docker build -t noauth-proxy .

### Run it in dev
    docker build -t noauth-proxy .
    ./dev.sh
    
### Run it in prod

    docker-machine create --driver rackspace noauth-proxy
    eval $(docker-machine env noauth-proxy)
    docker build -t noauth-proxy .
    ./prod.sh

### Add your server

You can add your server by submitting a pull request with a `.json` file like the ones you see in https://github.com/jmandel/noauth-proxy/tree/master/app/ehr. Briefly: 
 * `steps` array provides the manual steps that need to occur to sign into your server and approve an app's access request
 * `oauth` object provides the client configuration details. Your server must suppor this client with a `redirect_uri` of `http://localhost:8000/fhir-app/`
