#!/bin/sh

docker run --name oauth-tester-debug \
       -v $PWD/app:/app \
       -v /dev/shm:/dev/shm \
       -e APP_PORT=8000  \
       -e BASE_URL=myserver \
       -p 8000:8000 \
       --rm -it \
       oauth-tester-debug
