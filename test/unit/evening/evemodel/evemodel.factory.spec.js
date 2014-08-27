'use strict';

describe('EveModel', function() {

  beforeEach(module('evening.evemodel'));

  var EveModel, response, EveCollection;
  beforeEach(inject(function(_EveModel_, _EveCollection_) {
    EveModel = _EveModel_;
    EveCollection = _EveCollection_;

    response = {
      _id: 'abcd',
      _updated: 'Fri, 15 Aug 2014 15:15:54 GMT',
      description: 'description',
      _etag: '3b4fd261a5b3c3dadd1a73f575618cc4b6447523',
      _created: 'Fri, 15 Aug 2014 15:15:54 GMT',
    };
  }));

  describe('constructor', function() {
    it('transforms created and updated to Date objects', function() {
      var instance = new EveModel(response);
      expect(instance._created instanceof Date).toEqual(true);
      expect(instance._updated instanceof Date).toEqual(true);
    });
  });

  describe('properties', function() {
    it('has _id as primary field', function() {
      expect((new EveModel())._primaryField).toEqual('_id');
    });

    it('has EveCollection as _collectionClass', function() {
      expect(EveModel._collectionClass).toBe(EveCollection);
    });
  });

  describe('fieldsToApi', function() {
    it('cleans away all keys starting with _', function() {
      var instance = new EveModel(response);
      expect(Object.keys(instance.fieldsToApi())).toEqual(['description']);
    });
  });

  describe('transformItemRequest', function() {
    it('sends only fields not starting with _', function(){
      var instance = new EveModel(response);
      expect(Object.keys(instance.transformItemRequest({})))
          .toEqual(['description']);
    });

    it('sets If-Match header', function() {
      var headers = {};
      var instance = new EveModel(response);
      instance.transformItemRequest(headers);
      expect(headers['If-Match']).toEqual(response._etag);
    });
  });

  describe('search', function() {
    // Not yet tested
  });

  describe('query', function() {
    // Not yet tested
  });
});
