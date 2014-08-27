(function(window, document) {
  'use strict';
// Source: src/evening/evecollection/evecollection.module.js
angular.module('evening.evecollection', [
  'thickm'
]);
// Source: src/evening/evemodel/evemodel.module.js
angular.module('evening.evemodel', [
  'thickm',
  'evening.evecollection'
]);
// Source: src/evening/evening.module.js
angular.module('evening', [
  'evening.evemodel',
  'evening.evecollection'
]);
// Source: src/evening/evecollection/evecollection.factory.js
angular.module('evening.evecollection')
.factory('EveCollection', function(ThickModelCollection, $q) {
  function EveCollection() {}

  ThickModelCollection.extend(EveCollection);

  EveCollection._itemsField = '_items';
  EveCollection._metaField = '_meta';

  // Parses the GET parameters of an URL, e.g. `endpoint?param=1` to
  // `{ endpoint: "1" }`.
  // @TODO could be solved by just using the string? Perhaps $http would rewrite
  // duplicates
  var qs = function(url) {
    url = url.split('?');
    var a = url.length > 1 ? url[1].split('&') : url[0].split('&');
    if (a === '') {
      return {};
    }
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length !== 2) { continue; }
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
    }
    return b;
  };

  // Pull in the '_links' field
  EveCollection.build = function(cls, response) {
    var rc = ThickModelCollection.build.call(this, cls, response);
    rc._links = response.data._links;
    return rc;
  };

  // See if there is more on the server
  EveCollection.prototype.hasMore = function() {
    return angular.isDefined(this._links && this._links.next);
  };

  // Load more contents to the collection via the 'next' link supplied from the
  // API. Merges the results into the already present collection.
  //
  // Warning: Because of the merging, _links object might not be correct after
  // running this method.
  EveCollection.prototype.loadMore = function() {
    var deferred = $q.defer(),
        _self = this;

    if (!this.hasMore()) {
      deferred.reject();
      return deferred.promise;
    }

    var params = qs(this._links.next.href);
    this._resourceClass.query(params).then(function(collection) {
      angular.forEach(collection, function(resource) {
        _self.push(resource);
      });
      _self._links = collection._links;
      _self._meta.total = collection._meta.total;
      _self._meta.max_results += collection._meta.max_results;
      deferred.resolve(collection);
    });

    return deferred.promise;
  };

  return EveCollection;
});
// Source: src/evening/evemodel/evemodel.factory.js
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

    return ThickModel.query.call(this, params);
  };

  return EveModel;

});
// Source: src/evening/evening.suffix
})(window, document);