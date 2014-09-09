'use strict';

angular.module('evening.evemodel')
.factory('EveModel', function(EveCollection, ThickModel) {

  function EveModel(data) {
    this._primaryField = '_id';
    angular.extend(this, data);

    // Transform dates
    this._created = typeof(this._created) === 'string' ?
        new Date(this._created) : this._created;
    this._updated = typeof(this._updated) === 'string' ?
        new Date(this._updated) : this._updated;
  }

  ThickModel.extend(EveModel);

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

  // Overrides ThickModel's transformItemRequest
  EveModel.prototype.transformItemRequest = function(headers) {
    if (this._etag) {
      headers['If-Match'] = this._etag;
    }
    return this.fieldsToApi();
  };

  /**
   * @ngdoc method
   * @name evening.EveModel.search
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

    return ThickModel.query.call(this, params);
  };

  /**
   * @ngdoc method
   * @name evening.EveModel.all
   * @description
   * Does a query for 1000 instances
   *
   * @param {object} params Additional parameters
   */
  EveModel.all = function(params) {
    params = params || {};
    angular.extend(params, {max_results: 1000});
    return this.query(params);
  };

  return EveModel;

});
