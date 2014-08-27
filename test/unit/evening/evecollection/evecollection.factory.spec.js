'use strict';

describe('EveCollection', function() {

  beforeEach(module('evening.evecollection'));

  var EveCollection;
  beforeEach(inject(function(_EveCollection_) {
    EveCollection = _EveCollection_;
  }));

  it('has _items as items field', function() {
    expect(EveCollection._itemsField).toEqual('_items');
  });

  it('has _meta as meta field', function() {
    expect(EveCollection._metaField).toEqual('_meta');
  });

});
