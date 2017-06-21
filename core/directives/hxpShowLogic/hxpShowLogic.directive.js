var showLogicModule = angular.module('ShowLogic');

showLogicModule.directive('hxpShowLogic', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'playerName': '=playerName',
      'boards': '=boards',
      'player': '=player',
      'hideLogic': '&onHideLogic'
    },
    transclude: true,
    templateUrl: 'core/directives/hxpShowLogic/hxpShowLogic.template.html'
  };

});