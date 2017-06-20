var gameHeaderModule = angular.module('GameHeader');

gameHeaderModule.directive('hxpGameHeader', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'game': '=gamedata'
    },
    transclude: true,
    templateUrl: 'core/directives/hxpGameHeader/hxpGameHeader.template.html'
  };

});