# haste [![Build Status](https://travis-ci.org/jarrodconnolly/haste.svg?branch=master)](https://travis-ci.org/jarrodconnolly/haste) [![Dependencies](https://david-dm.org/jarrodconnolly/haste.png)](https://david-dm.org/jarrodconnolly/haste) [![Code Climate](https://codeclimate.com/github/jarrodconnolly/haste.png)](https://codeclimate.com/github/jarrodconnolly/haste) ![Code Status](http://img.shields.io/badge/state-pre--alpha-brightgreen.svg)

Load testing using simulated browsers. Includes simple reflection server and data gathering.

**_Project is pre-alpha and still in development_**

## What does it do?
I needed a realistic browser load testing tool so I decided to write one. Using phantomjs controlled by nodejs this will allow many browsers to be launched that follow a preset script of pages to hit while downloading all the resources from those pages.

## Usage

Install

    $ npm install -g haste

Test

    $ npm test

## License
See [LICENSE](LICENSE).
