var brain = angular.module('AIBrain');

brain.directive('hxpBrain', function () {

  return {
    scope: {
      'i18n': '=i18n',
      'player': '=player',
      'learningstring': '=learningstring'
    },
    link: function (scope, elem, attrs) {

      scope.learningStates = [];
      if (scope.learningstring) {
        var learningTemp = JSON.parse(scope.learningstring);

        for (var i in learningTemp) {
          var board = learningTemp[i].board;
          var moves = learningTemp[i].moves;
          scope.learningStates.push({board: board, moves: moves});
        }
      }

    },
    transclude: true,
    templateUrl: 'core/directives/hxpBrain/hxpBrain.template.html'
  };

});