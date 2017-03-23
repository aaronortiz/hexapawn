var brain = angular.module('AIBrain');

brain.directive('hxpBrain', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'player': '=player',
      'boardsstring': '=boards'
    },
    link: function (scope, elem, attrs) {

      scope.boards = {};
      var boardsArray = JSON.parse(scope.boardsstring);

      for (var i in boardsArray) {
        var board = boardsArray[i].board;
        var moves = boardsArray[i].moves;
        scope.boards[board] = {board: board, moves: moves};
      }

    },
    transclude: true,
    templateUrl: 'core/directives/hxpBrain/hxpBrain.template.html'
  };

});