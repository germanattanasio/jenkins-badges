'use strict';

const assert = require('assert');
const nock = require('nock');
const jacoco = require('../plugins/jacoco');

describe('jacoco', function() {
  const jenkinsUrl = 'http://the.jenkins.server:80';
  const jobPath = '/my-job';
  const reportUrl = '/lastSuccessfulBuild/jacoco/api/xml';
  const jobUrl = jenkinsUrl + jobPath;
  const response =
    '<coverageReport><lineCoverage><percentageFloat>' +
    98.12 +
    '</percentageFloat></lineCoverage></coverageReport>';

  it('should generate a valid badge', function(done) {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(200, response);

    jacoco.coverage({ job: jobUrl }, function(err, badge) {
      assert.equal(null, err);
      assert.deepEqual({ label: '98.12%', color: 'brightgreen' }, badge);
      done();
    });
  });

  it("should generate an error if jenkins doesn't return a 200", function(done) {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(404, {});

    jacoco.coverage({ job: jobUrl }, function(err, badge) {
      assert.equal(404, err.statusCode);
      assert.deepEqual(undefined, badge);
      done();
    });
  });
});
