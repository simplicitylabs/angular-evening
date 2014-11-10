'use strict';

angular.module('evening.evemodel')
.factory('EveModel', function(EveCollection, ThickModel) {

  function EveModel(data) {
    this._primaryField = '_id';

    // Transform dates
    if (angular.isObject(data)) {
      data._created = typeof(data._created) === 'string' ?
          new Date(data._created) : data._created;
      data._updated = typeof(data._updated) === 'string' ?
          new Date(data._updated) : data._updated;
    }

    ThickModel.call(this, data);
  }

  ThickModel.extend(EveModel);

  EveModel._collectionClass = EveCollection;

  /**
   * @ngdoc method
   * @name evening.EveModel.transformItemRequest
   * @description
   * Add `etag` to the headers if present, then use the parent's corresponding
   * function to get the fields to send to the API. After that, subtract the
   * fields which start with '_', which are considered to be hidden.
   *
   * @param {Object} headers Headers object
   * @returns {Object} Object which is sent to API.
   */
  EveModel.prototype.transformItemRequest = function(headers) {
    if (this._etag) {
      headers['If-Match'] = this._etag;
    }

    var trans = ThickModel.prototype.transformItemRequest.call(this, headers);

    var clean = {};
    angular.forEach(trans, function(value, key) {
      if(!(typeof key === 'string' && key.charAt(0) === '_')) {
        clean[key] = value;
      }
    });

    return clean;
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
