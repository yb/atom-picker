#!/bin/bash

# build web
npm ci --prefix web
npm run build --prefix web
mv ./web/build ./server/html

# build server
npm ci --prefix server
pkg server -o atom-picker
rm -r ./server/html
