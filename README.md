# NOAuth: Open proxy for SMART on FHIR


##### Build it

    docker build -t oauth-tester-debug .

##### Run it

    docker run --name oauth-tester-debug \
       -v $PWD/app:/app \
       -v /dev/shm:/dev/shm \
       -e APP_PORT=8888  \
       -e BASE_URL=myserver \
       --rm -it \
       oauth-tester-debug
