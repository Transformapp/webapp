'use strict';

describe('Controller: PrayersCtrl', function () {

  // load the controller's module
  beforeEach(module('transformAppApp'));

  var PrayersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrayersCtrl = $controller('PrayersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
