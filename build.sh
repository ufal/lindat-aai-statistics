#!/usr/bin/env bash

set -e

rm -rf dist
mkdir -p dist/tabs
cp -r public/tabs/*.html dist/tabs
cp bower_components/angular-ui-grid/*.{ttf,woff,eot,svg} dist
./node_modules/.bin/useref public/index.html dist/index.html --css uglify --js uglify

if [ -n "$TRAVIS" ]; then

git add -f dist
git commit -m "Release from Travis build #$TRAVIS_BUILD_NUMBER"

fi
