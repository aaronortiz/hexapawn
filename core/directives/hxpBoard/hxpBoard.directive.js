var board = angular.module('HexapawnBoard');

board.directive('hxpBoard', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'gameType': '=gametype',
      'game': '=gamedata',
      'doMove': '&onMove',
      'aiMove': '&onAiMove',
      'newGame': '&onNewGame',
      'exportJson': '&onExportJson',
      'returnToMainMenu': '&onReturnToMainMenu'
    },
    transclude: true,
    templateUrl: 'core/directives/hxpBoard/hxpBoard.template.html'
  };

});