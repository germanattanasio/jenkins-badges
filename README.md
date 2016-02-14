# jenkins-badges

[![Build Status](https://travis-ci.org/germanattanasio/jenkins-badges.svg?branch=master)](http://travis-ci.org/germanattanasio/jenkins-badges)
[![codecov.io](https://codecov.io/github/germanattanasio/jenkins-badges/coverage.svg?branch=master)](https://codecov.io/github/germanattanasio/jenkins-badges?branch=master)
[![npm-version](https://img.shields.io/npm/v/jenkins-badges.svg)](https://www.npmjs.com/package/jenkins-badges)
[![npm-downloads](https://img.shields.io/npm/dm/jenkins-badges.svg)](https://www.npmjs.com/package/jenkins-badges)


[Express][express] application that creates [shield.io](http://shields.io/) badges from [Jenkins][jenkins] plugins.

## Live demo

http://jenkins-badges.mybluemix.net/

**Note:** If your jenkins is running behind a firewall or in a VPN you will need to won't be able to use the live demo.

Fork this repo and deploy your own version on [Bluemix][bluemix] automatically:  
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/germanattanasio/jenkins-badges)

## Supported Plugins

 * [JaCoCo][jacoco]
 * [Cobertura][cobertura]
 * Request a new plugin [here](issues).

## Installation

```sh
$ npm install jenkins-badges -g
```

## Usage
    # Run with port number (default: 9913)
    $ PORT=3000 jbadges
    Server running on port: 3000


To generate a badge you need the Jenkins job url.

**JaCoCo**

      <application-url>/jacoco/coverage?job=<job-url>

**Cobertura**

      <application-url>/cobertura/coverage?job=<job-url>


Where: `<application-url>` is the express app and `<job-url>` is the Jenkins job.


## Tests
Running all the tests:

    $ npm test


Running a specific test:

    $ mocha -g '<test name>'


## License

MIT

## Contributing
See [CONTRIBUTING](https://github.com/germanattanasio/jenkins-badges/blob/master/CONTRIBUTING.md).

[bluemix]: http://bluemix.net/
[express]: http://expressjs.com/
[jenkins]: https://jenkins-ci.org/
[jacoco]: http://eclemma.org/jacoco/
[cobertura]: http://cobertura.github.io/cobertura/
[issues]: https://github.com/germanattanasio/jenkins-badges/issues/new?labels=new-plugin&title=Add+support+for:

## Inspiration

 * https://github.com/neoziro/jenkins-badge
 * https://github.com/mnpk/jenkins-coverage-badge
 * https://github.com/hbetts/jenkins-coverage-badge
