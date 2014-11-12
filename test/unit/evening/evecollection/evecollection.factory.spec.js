'use strict';

describe('EveCollection', function() {

  beforeEach(module('evening.evecollection'));

  var EveCollection, ThickModelCollection, MockModel, response;
  beforeEach(inject(function(_EveCollection_, _ThickModelCollection_, ThickModel) {
    EveCollection = _EveCollection_;
    ThickModelCollection = _ThickModelCollection_;

    MockModel = function(data) {
      ThickModel.apply(this, data);
    };
    ThickModel.extend(MockModel);

    response = {
      data: {
        _links: { next: {href: '/mock?page=2'} },
        _meta: { meta: true },
        _items: []
      }
    };
  }));

  describe('properties', function() {
    it('has "_items" as items field', function() {
      expect(EveCollection._itemsField).toEqual('_items');
    });

    it('has "_meta" as meta field', function() {
      expect(EveCollection._metaField).toEqual('_meta');
    });
  });

  describe('inheritance', function() {
    var instance;
    beforeEach(function() {
      instance = new EveCollection();
    });

    it('is instanceof EveCollection', function() {
      expect(instance instanceof EveCollection);
    });

    it('is instanceof ThickModelCollection', function() {
      expect(instance instanceof ThickModelCollection);
    });

    it('is instanceof Array', function() {
      expect(instance instanceof ThickModelCollection);
    });
  });

  describe('build', function() {
    it('attaches _links field to the returned instance', function() {
      var instance = EveCollection.build(MockModel, response);
      expect(instance._links).toEqual(response.data._links);
    });
  });

  describe('hasMore', function() {
    it('is true if next-link exists', function() {
      var instance = EveCollection.build(MockModel, response);
      expect(instance.hasMore()).toEqual(true);
    });

    it('is false if next-link does not exist', function() {
      delete response.data._links.next;
      var instance = EveCollection.build(MockModel, response);
      expect(instance.hasMore()).toEqual(false);
    });
  });

  describe('loadMore', function() {
    it('runs a query', function() {
      var instance = EveCollection.build(MockModel, response);
      spyOn(MockModel, 'query').andCallThrough();
      instance.loadMore();
      expect(MockModel.query).toHaveBeenCalled();
    });
  });

});
