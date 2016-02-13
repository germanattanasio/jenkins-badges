'use strict';

var app = require('../app');
var request = require('supertest');

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

  it('404 everything else', function testPath(done) {
    request(app)
      .get('/foo')
      .expect(404, done);
  });
});