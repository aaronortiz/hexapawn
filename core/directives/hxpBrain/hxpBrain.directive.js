var brain = angular.module('AIBrain');

brain.directive('hxpBrain', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'player': '=player',
      'learningStates': '=learningstates'
    },
    link: function (scope, elem, attrs) {

      var tempBoards = [];

      for (var s in scope.learningStates) {
        tempBoards = [];
        for (var b in scope.learningStates[s]) {
          var board = scope.learningStates[s][b].board;
          var moves = scope.learningStates[s][b].moves;
          tempBoards.push({board: board, moves: moves});
        }
        scope.learningStates[s] = tempBoards;
      }

      console.log(scope.learningStates);

    },
    transclude: true,
    templateUrl: 'core/directives/hxpBrain/hxpBrain.template.html'
  };

});