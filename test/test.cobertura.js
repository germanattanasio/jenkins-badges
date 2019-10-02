'use strict';

const assert = require('assert');
const nock = require('nock');
const cobertura = require('../plugins/cobertura');

describe('cobertura', function() {
  const jenkinsUrl = 'http://the.jenkins.server:80';
  const jobPath = '/my-job';
  const reportUrl = '/lastSuccessfulBuild/cobertura/api/json/?depth=2';
  const jobUrl = jenkinsUrl + jobPath;
  const validResponse = {
    results: {
      elements: [
        {
          denominator: 11.0,
          name: 'Lines',
          numerator: 14.0,
          ratio: 98.12,
        },
        {
          denominator: 602.0,
          name: 'Conditionals',
          numerator: 57.0,
          ratio: 96.34,
        },
      ],
      name: 'Cobertura Coverage Report',
    },
  };

  it('should generate a green badge', function() {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(200, validResponse);

    cobertura.coverage({ job: jobUrl }, function(err, badge) {
      assert.equal(null, err);
      assert.deepEqual({ label: '98.12%', color: 'brightgreen' }, badge);
    });
  });

  it("should generate an error if jenkins doesn't return a 200", function() {
    nock(jenkinsUrl)
      .get(jobPath + reportUrl)
      .reply(404, {});

    cobertura.coverage({ job: jobUrl }, function(err, badge) {
      assert.equal(404, err.statusCode);
      assert.deepEqual(undefined, badge);
    });
  });
});
