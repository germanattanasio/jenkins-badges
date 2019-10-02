'use strict';

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

const REPORT_URL = '/lastSuccessfulBuild/cobertura/api/json/?depth=2';

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
        const elements = JSON.parse(body).results.elements;
        const index = elements
          .map(function(e) {
            return e.name;
          })
          .indexOf('Lines');

        if (index !== -1) {
          const cov = elements[index].ratio.toFixed(2);
          callback(null, {
            label: cov + '%',
            color: badgeColor(cov),
          });
        } else {
          callback(null, {});
        }
      })
      .catch(callback);
  },
};
