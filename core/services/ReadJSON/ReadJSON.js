var ReadJSON = angular.module('ReadJSON', ['ngResource']);

ReadJSON.service('ReadJSON', function ($resource) {

  this.read = function (fileName, callback) {
    $resource(fileName).get(function (data) {
      if (typeof callback === 'function') {
        callback(data);
      }
    });
  };
});