'use strict';

describe('Filter: languageFormatter', function () {

  // load the filter's module
  beforeEach(module('transformAppApp'));

  // initialize a new instance of the filter before each test
  var languageFormatter;
  beforeEach(inject(function ($filter) {
    languageFormatter = $filter('languageFormatter');
  }));

  it('should return the input prefixed with "languageFormatter filter:"', function () {
    var text = 'angularjs';
    expect(languageFormatter(text)).toBe('languageFormatter filter: ' + text);
  });

});
