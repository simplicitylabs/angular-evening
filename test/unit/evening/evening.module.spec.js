'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {
    // Get module
    module = angular.module('evening');
    dependencies = module.requires;
  });

  it('should load model module', function() {
    expect(hasModule('evening.evemodel')).toBeTruthy();
  });

  it('should load collection module', function() {
    expect(hasModule('evening.evecollection')).toBeTruthy();
  });
});
