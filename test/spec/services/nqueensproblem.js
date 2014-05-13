'use strict';

describe('Service: NQueensProblem', function () {

  // load the service's module
  beforeEach(module('ia8queensApp'));

  // instantiate service
  var NQueensProblem;
  beforeEach(inject(function (_NQueensProblem_) {
    NQueensProblem = _NQueensProblem_;
  }));

  it('should do something', function () {
    expect(!!NQueensProblem).toBe(true);
  });

});
