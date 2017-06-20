var movesModule = angular.module('Moves');

movesModule.directive('hxpMoves', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'gameType': '=gametype',
      'game': '=gamedata',
      'doMove': '&onMove',
      'aiMove': '&onAiMove',
      'newGame': '&onNewGame',
      'showBlackLogic': '&onShowBlackLogic',
      'showWhiteLogic': '&onShowWhiteLogic',
      'returnToMainMenu': '&onReturnToMainMenu'
    },
    transclude: true,
    templateUrl: 'core/directives/hxpMoves/hxpMoves.template.html'
  };


});