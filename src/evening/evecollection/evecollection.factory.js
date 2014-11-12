'use strict';

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
    this._modelClass.query(params).then(function(collection) {
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
