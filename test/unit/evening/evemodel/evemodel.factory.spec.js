'use strict';

describe('EveModel', function() {

  beforeEach(module('evening.evemodel'));

  var EveModel;
  beforeEach(inject(function(_EveModel_) {
    EveModel = _EveModel_;
  }));

  it('has _id as primary field', function() {
    expect((new EveModel())._primaryField).toEqual('_id');
  });

  it('has EveCollection as collection class', function() {
    var EveCollection;
    inject(function(_EveCollection_) {
      EveCollection = _EveCollection_;
    });
    expect(EveModel._collectionClass).toBe(EveCollection);
  });

});
