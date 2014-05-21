'use strict';

describe('Service: Chromosome', function () {

  // load the service's module
  beforeEach(module('ia8queensApp'));

  // instantiate service
  var Chromosome;
  beforeEach(inject(function (_Chromosome_) {
    Chromosome = _Chromosome_;
  }));

  it('should do something', function () {
    expect(!!Chromosome).toBe(true);
  });

});
