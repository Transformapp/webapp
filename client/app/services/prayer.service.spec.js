'use strict';

describe('Service: Prayerservice', function () {

  // load the service's module
  beforeEach(module('transformAppApp'));

  // instantiate service
  var Prayerservice;
  beforeEach(inject(function (_Prayerservice_) {
    Prayerservice = _Prayerservice_;
  }));

  it('should do something', function () {
    expect(!!Prayerservice).toBe(true);
  });

});
