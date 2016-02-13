'use strict';

var assert = require('assert');
var nock   = require('nock');
var jacoco = require('../plugins/jacoco');

describe('jacoco', function() {
  var jenkinsUrl = 'http://the.jenkins.server:80';
  var jobPath = '/my-job';
  var reportUrl = '/lastSuccessfulBuild/jacoco/api/xml';
  var jobUrl = jenkinsUrl + jobPath;
  var response = '<coverageReport><lineCoverage><percentageFloat>' + 98.12 +
    '</percentageFloat></lineCoverage></coverageReport>';

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.cleanAll();
  });

  it('should generate a valid badge', function(done) {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(200, response);

    jacoco.coverage({ job: jobUrl }, function (err, badge) {
      assert.equal(null, err);
      assert.deepEqual({label: '98.12%', color: 'brightgreen'}, badge);
      done();
    });
  });

  it('should generate an error if jenkins doesn\'t return a 200', function(done) {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(404, {});

    jacoco.coverage({ job: jobUrl }, function (err, badge) {
      assert.equal(404, err.statusCode);
      assert.deepEqual(undefined, badge);
      done();
    });
  });

});
