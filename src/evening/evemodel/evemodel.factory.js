'use strict';

angular.module('evening.evemodel')
.factory('EveModel', function(EveCollection, Resource) {

  function EveModel(data) {
    this._primaryField = '_id';
    angular.extend(this, data);

    // Transform dates
    this._created = typeof(this._created) === 'string' ?
        new Date(this._created) : this._created;
    this._updated = typeof(this._updated) === 'string' ?
        new Date(this._updated) : this._updated;
  }

  Resource.extend(EveModel);

  EveModel._collectionClass = EveCollection;

  // Only fields which do not start with '_', create strings of dates
  EveModel.prototype.fieldsToApi = function() {
    var clean = {};
    angular.forEach(this, function(value, key) {
      if (!(typeof key === 'string' && key.charAt(0) === '_')) {
        clean[key] = value;
      }
    });
    return clean;
  };

  // Overrides Resource's transformItemRequest
  EveModel.prototype.transformItemRequest = function(headers) {
    if (this._etag) {
      headers['If-Match'] = this._etag;
    }
    return this.fieldsToApi();
  };

  /**
   * @ngdoc method
   * @name boardbaseApp.evening.EveModel.search
   * @description
   * Free-text search for resources using the MongoDB `$text` operator.
   *
   * @param {string} query Freetext query
   * @param {object} params Additional parameters
   * @param {object} constraints Extra constraints
   * @param {string} language Language (default is 'en')
   * @return {promise} Promise (Collection)
   */
  EveModel.search = function(query, params, constraints, language) {
    constraints = constraints || {$or: []};
    params = params || {};

    if (query) {
      constraints.$or.push({$text: {
        $search: query,
        $language: language || 'en'
      }});
    }

    if (constraints.$or.length === 0) {
      constraints = {};
    }

    angular.extend(params, {where: constraints});
    return this.query(params);
  };

  // @TODO: put JSON.stringify on Thickm?
  EveModel.query = function(params) {
    for (var key in params) {
      if (typeof(params[key]) === 'object') {
        params[key] = JSON.stringify(params[key]);
      }
    }

    return Resource.query.call(this, params);
  };

  return EveModel;

});
