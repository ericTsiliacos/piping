var Deferred = require('deferred-js');

var Promise = function(value) {
  this.deferred = new Deferred();
  this.then = this.deferred.then;
  this.resolve = this.deferred.resolve;
  this.reject = this.deferred.reject;

  if (value !== undefined) this.deferred.resolve(value);
};

module.exports = Promise;
