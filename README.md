# Lindat AAI Statistics

See https://lindat-aai-statistics.herokuapp.com/

## How to use locally

1. Clone repository
  ```
git clone https://github.com/ufal/lindat-aai-statistics.git
  ```
  
1. Install dependencies and run local server
  ```
npm install
npm start
  ```

1. Open open web in your browser
  ```
xdg-open 'http://localhost:3000'
  ```

## Developing

The application is a composition of tabs which follow certain conventions:

- All tab related files are in `tabs` directory
- The tab has a name and its in *kebab case* like `my-awesome-search`
- It has a main template called `my-awesome-search.html` and an Angular controller called `MyAwesomeSearchController` in the file called `my-awesome-search.controller.js`
- All controller files are listed in `index.html` and loaded as last

For a new tab just add template and controller file and put it's name in `lindat-aai.module.js` into the `TABS` constant. Like this:

```.javascript
// Add new tab here
angular.module('lindat-aai').constant('TABS', [
  'entity-search',
  'metadata-compare',
  'my-awesome-search' // Added here
]);
```

The rest should be taken care of by itself.

## Deployment

Every push to master will deploy to Heroku automatically. It is running build script `build.sh` and then pushing `dist` directory into the Heroku created branch.
