'use strict';

describe('Service: busline', function () {

  // load the service's module
  beforeEach(module('joychApp'));

  // instantiate service
  var busline;
  beforeEach(inject(function (_busline_) {
    busline = _busline_;
  }));

  it('should do something', function () {
    expect(!!busline).toBe(true);
  });

});
