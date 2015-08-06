var express = require('express');
var path = require('path');
var request = require('request');
var xml2js = require("xml2js");
var cache = require('memory-cache');
var _ = require('lodash');

var app = express();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
}

app.get('/metadata', function (req, res) {
  var url = req.query.url;

  if (!url) {
    res.status(400).send('Url invalid or missing');
    return;
  }

  if (cache.get(url)) {
    res.json(cache.get(url));
    return;
  }

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      xml2js.parseString(body, function (err, result) {
        var entities = _.get(result, [ 'md:EntitiesDescriptor', 'md:EntityDescriptor' ], []);
        if (entities.length) {
          entities = entities.map(function(entity) {
            var type = 'AA';
            if (entity['md:SPSSODescriptor']) {
              type = 'SP';
            } else if (entity['md:IDPSSODescriptor']) {
              type = 'IdP';
            }
            return [entity.$.entityID, type];
          });
        }
        // 1 hour expriration
        res.json(cache.put(url, entities, 3600000));
      });
    }
  });
});

app.get('/feed', function (req, res) {
  var url = req.query.url;

  if (!url) {
    res.status(400).send('Url invalid or missing');
    return;
  }

  request.get(url).pipe(res);
});


var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
