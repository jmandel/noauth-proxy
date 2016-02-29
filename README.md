# NOAuth: Open proxy for SMART on FHIR

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
