'use strict';

const xml2js = require('xml2js');
const request = require('request-promise');

/**
 * Returns the badge color based on the code coverage %
 * @param  {number} coverage code coverage value
 * @return {String}          The badge color
 */
const badgeColor = function(coverage) {
  if (coverage < 20) {
    return 'red';
  } else if (coverage < 80) {
    return 'yellow';
  } else {
    return 'brightgreen';
  }
};

const REPORT_URL = '/lastSuccessfulBuild/jacoco/api/xml';

module.exports = {
  /**
   * Returns the code coverage badge
   * @param  {Object}   params   The jenkins url
   * @param  {Function} callback Error-first callback
   */
  coverage: function(params, callback) {
    const url = params.job + REPORT_URL;

    request(url)
      .then(function(body) {
        const xmlParser = new xml2js.Parser();
        xmlParser.parseString(body, function(err, result) {
          const lineCoverage = result.coverageReport.lineCoverage[0];
          const cov = parseFloat(lineCoverage.percentageFloat[0]).toFixed(2);
          callback(null, {
            label: cov + '%',
            color: badgeColor(cov),
          });
        });
      })
      .catch(callback);
  },
};
