var i18n = angular.module('i18n', ['ngResource']);

i18n.service('i18n', function ($resource) {

  this.getI18nStrings = function (language, callback) {
    var fileName = 'core/services/i18n/' + language + '.json';
    $resource(fileName).get(function (data) {
      if (typeof callback === 'function') {
        callback(data);
      }
    });
  };
});