'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var extend = require('util')._extend;
var validUrl = require('valid-url');
var format = require('string-template');

var BADGE_URL = 'https://img.shields.io/badge/{subject}-{label}-{color}.svg?style={style}';
// default parameters
var DEF_BADGE_PARAMS = {
  label: 'Unknown',
  color: 'lightgrey',
  style: 'flat'
};

// jenkins plugins
var plugins = {
  cobertura: require(__dirname + '/plugins/cobertura'),
  jacoco: require(__dirname + '/plugins/jacoco')
};

// Configure Express
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// list plugins and methods
app.get('/', function(req, res) {
  var availablePlugins = extend({}, plugins);

  Object.keys(plugins).forEach(function(key) {
    availablePlugins[key] = Object.keys(plugins[key]).map(function(m) { return m;});
  });

  res.json({plugins: availablePlugins});
});


//cobertura
app.get('/:plugin/:fn', function(req, res) {
  if (!plugins[req.params.plugin]) {
    res.status(404).send('Jenkins plugin not found: ' + req.params.plugin);
    return;
  } else if (typeof(plugins[req.params.plugin][req.params.fn]) !== 'function') {
    res.status(404).send('Unknown method: '+ req.params.fn +' for plugin: ' + req.params.plugin);
    return;
  } else if (!req.query.job && !validUrl.isWebUri(req.query.job)) {
    res.status(404).send('Missing query parameter: job, it must be a valid HTTP/HTTPS url');
    return;
  }

  // Call plugin#fn() and return the badge
  plugins[req.params.plugin][req.params.fn](req.query, function(err, badge) {
    // override default parameters with the result from: plugin.fn()
    var badgeParams = extend(DEF_BADGE_PARAMS, { subject: req.params.fn}, err ? {} : badge);
    return res.redirect(format(BADGE_URL, badgeParams));
  });
});

module.exports = app;