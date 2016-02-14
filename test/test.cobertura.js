'use strict';

var assert    = require('assert');
var nock      = require('nock');
var cobertura = require('../plugins/cobertura');

describe('cobertura', function() {
  var jenkinsUrl = 'http://the.jenkins.server:80';
  var jobPath = '/my-job';
  var reportUrl = '/lastSuccessfulBuild/cobertura/api/json/?depth=2';
  var jobUrl = jenkinsUrl + jobPath;
  var validResponse = {
    results: {
      elements: [{
        denominator: 11.0,
        name: 'Lines',
        numerator: 14.0,
        ratio: 98.12
      }, {
        denominator: 602.0,
        name: 'Conditionals',
        numerator: 57.0,
        ratio: 96.34
      }],
      name: 'Cobertura Coverage Report'
    }
  };

  it('should generate a green badge', function() {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(200, validResponse);

    cobertura.coverage({ job: jobUrl }, function (err, badge) {
      assert.equal(null, err);
      assert.deepEqual({label: '98.12%', color: 'brightgreen'}, badge);
    });
  });
  
  it('should generate an error if jenkins doesn\'t return a 200', function() {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(404, {});

    cobertura.coverage({ job: jobUrl }, function (err, badge) {
      assert.equal(404, err.statusCode);
      assert.deepEqual(undefined, badge);
    });
  });

});
