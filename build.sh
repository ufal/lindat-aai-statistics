#!/usr/bin/env bash

set -e

git_user="Michal Sedlák"
git_email="sedlakmichal@gmail.com"

rm -rf dist
mkdir -p dist/tabs
mkdir -p dist/fonts
mkdir -p dist/images

cp -r public/tabs/*.html dist/tabs
cp bower_components/angular-ui-grid/*.{ttf,woff,eot,svg} dist
cp bower_components/bootstrap/fonts/* dist/fonts
cp -r bower_components/lindat-common/dist/public/{images,fonts} dist
./node_modules/.bin/useref public/index.html dist/index.html --css uglify --js uglify

if [ -n "$TRAVIS" ]; then

  git config user.name "$git_user"
  git config user.email "$git_email"

  git add -f dist
  git commit -m "Release from Travis build #$TRAVIS_BUILD_NUMBER"

fi
