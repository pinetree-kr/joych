'use strict';

describe('Controller: BuslineCtrl', function () {

  // load the controller's module
  beforeEach(module('joychApp'));

  var BuslineCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuslineCtrl = $controller('BuslineCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
