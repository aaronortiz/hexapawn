var brain = angular.module('AIBrain');

brain.directive('hxpBrain', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'player': '=player',
      'boards': '=boards'
    },
    transclude: true,
    templateUrl: 'core/directives/hxpBrain/hxpBrain.template.html'
  };

});