'use strict';

describe('Service: HillClimbing', function () {

  // load the service's module
  beforeEach(module('ia8queensApp'));

  // instantiate service
  var HillClimbing;
  beforeEach(inject(function (_HillClimbing_) {
    HillClimbing = _HillClimbing_;
  }));

  it('should do something', function () {
    expect(!!HillClimbing).toBe(true);
  });

});
