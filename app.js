'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const extend = require('util')._extend;
const validUrl = require('valid-url');
const format = require('string-template');

const BADGE_URL = 'https://img.shields.io/badge/{subject}-{label}-{color}.svg?style={style}';
// default parameters
const DEF_BADGE_PARAMS = {
  label: 'Unknown',
  color: 'lightgrey',
  style: 'flat'
};

// jenkins plugins
const plugins = {
  cobertura: require(__dirname + '/plugins/cobertura'),
  jacoco: require(__dirname + '/plugins/jacoco')
};

// Configure Express
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// list plugins and methods
app.get('/', function(req, res) {
  const availablePlugins = extend({}, plugins);

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
    res.status(400).send('Missing query parameter: job, it must be a valid HTTP/HTTPS url');
    return;
  }

  // Call plugin#fn() and return the badge
  plugins[req.params.plugin][req.params.fn](req.query, function(err, badge) {
    // override default parameters with the result from: plugin.fn()
    badge.subject = req.params.fn;

    const badgeParams = extend(DEF_BADGE_PARAMS, badge);
    return res.redirect(format(BADGE_URL, badgeParams));
  });
});

module.exports = app;