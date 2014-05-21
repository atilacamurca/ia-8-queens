'use strict';

describe('Service: Genetic', function () {

  // load the service's module
  beforeEach(module('ia8queensApp'));

  // instantiate service
  var Genetic;
  beforeEach(inject(function (_Genetic_) {
    Genetic = _Genetic_;
  }));

  it('should do something', function () {
    expect(!!Genetic).toBe(true);
  });

});
