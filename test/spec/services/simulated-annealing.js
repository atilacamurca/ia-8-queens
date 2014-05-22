'use strict';

describe('Service: SimulatedAnnealing', function () {

  // load the service's module
  beforeEach(module('ia8queensApp'));

  // instantiate service
  var SimulatedAnnealing;
  beforeEach(inject(function (_SimulatedAnnealing_) {
    SimulatedAnnealing = _SimulatedAnnealing_;
  }));

  it('should do something', function () {
    expect(!!SimulatedAnnealing).toBe(true);
  });

});
