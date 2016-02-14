'use strict';

var app = require('../app');
var request = require('supertest');
var nock = require('nock');

describe('express', function() {
  it('list plugins when GET /', function (done) {
    var response = { plugins: {
      cobertura: ['coverage'],
      jacoco: ['coverage']
    }};

    request(app)
      .get('/')
      .expect(200, response, done);
  });

  it('404 when plugin not found', function (done) {
    request(app)
      .get('/foo/bar')
      .expect(404, done);
  });

  it('404 when method in plugin not found', function (done) {
    request(app)
      .get('/jacoco/foo')
      .expect(404, done);
  });

  it('404 everything else', function (done) {
    request(app)
      .get('/foo')
      .expect(404, done);
  });

  it('400 when missing job url', function (done) {
    request(app)
      .get('/cobertura/coverage')
      .expect(400, done);
  });

  it('200 when everything is correct', function (done) {
    var jenkinsUrl = 'http://the.jenkins.server:80';
    var jobPath = '/my-awesome-job';
    var reportUrl = '/lastSuccessfulBuild/cobertura/api/json/?depth=2';
    var jobUrl = jenkinsUrl + jobPath;
    var response = {
      results: {
        elements: [{
          denominator: 11.0,
          name: 'Lines',
          numerator: 14.0,
          ratio: 96.12
        }, {
          denominator: 602.0,
          name: 'Conditionals',
          numerator: 57.0,
          ratio: 93.34
        }],
        name: 'Cobertura Coverage Report'
      }
    };
    var badge = 'https://img.shields.io/badge/coverage-96.12%-brightgreen.svg?style=flat';

    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(200, response);

    request(app)
      .get('/cobertura/coverage?job=' + jobUrl)
      .expect(302, function(err, res){
        if (res.headers.location === badge)
          done();
        else done(res.headers.location +' != '+ badge);
      });
  });

});