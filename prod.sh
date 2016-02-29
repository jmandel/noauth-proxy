#!/bin/sh

docker run --name noauth-proxy \
       -v /dev/shm:/dev/shm \
       -e APP_PORT=8000  \
       -e BASE_URL=myserver \
       -p 80:8000 \
       --restart always \
       -d \
       noauth-proxy
