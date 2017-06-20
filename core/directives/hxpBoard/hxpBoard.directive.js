var board = angular.module('HexapawnBoard');

board.directive('hxpBoard', function () {

  return {
    scope: {
      'boardState': '=boardstate',
      'arrows': '=arrows'
    },
    transclude: true,
    templateUrl: 'core/directives/hxpBoard/hxpBoard.template.html'
  };

});