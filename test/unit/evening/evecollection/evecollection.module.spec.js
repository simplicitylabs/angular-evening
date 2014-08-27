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
    module = angular.module('evening.evecollection');
    dependencies = module.requires;
  });

  it('should load thickm', function() {
    expect(hasModule('thickm')).toBeTruthy();
  });

});
