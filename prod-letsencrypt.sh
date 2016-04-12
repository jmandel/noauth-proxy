#!/bin/sh

docker run \
       --name noauth-proxy \
       --net=nginx-proxy \
       --expose 8000 \
       -v /dev/shm:/dev/shm \
       -e VIRTUAL_HOST=noauth.smarthealthit.org \
       -e VIRTUAL_NETWORK=nginx-proxy \
       -e VIRTUAL_PORT=8000 \
       -e LETSENCRYPT_HOST=noauth.smarthealthit.org \
       -e LETSENCRYPT_EMAIL=letsencrypt@noauth.smarthealthit.org \
       -e APP_PORT=8000  \
       -e BASE_URL=myserver \
       --restart always \
       -d \
       noauth-proxy
