var huvshu = angular.module('humanVsHuman');

huvshu.controller('humanVsHumanCtlr', [
  '$scope',
  'i18n',
  'GameLogic',
  function ($scope, i18n, GameLogic) {

    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;
    });

    $scope.playerNames = ['Aaron Ernesto Ortiz López', 'HAL 9000'];

    GameLogic.readLogic(function (data) {
      $scope.logic = data;
      $scope.boardState = $scope.logic.newGame;
      $scope.moves = GameLogic.boardMoves($scope.boardState, 'W',
              $scope.logic);

      $scope.boardState = GameLogic.doMove($scope.boardState, "b3b2",
              $scope.logic);
      $scope.moves = GameLogic.boardMoves($scope.boardState, 'B',
              $scope.logic);

      $scope.boardState = GameLogic.doMove($scope.boardState, "a1b2",
              $scope.logic);
      $scope.moves = GameLogic.boardMoves($scope.boardState, 'W',
              $scope.logic);

      $scope.boardState = GameLogic.doMove($scope.boardState, "c3b2",
              $scope.logic);
      $scope.moves = GameLogic.boardMoves($scope.boardState, 'B',
              $scope.logic);

      $scope.boardState = GameLogic.doMove($scope.boardState, "c1b2",
              $scope.logic);
      $scope.moves = GameLogic.boardMoves($scope.boardState, 'W',
              $scope.logic);

      $scope.boardState = GameLogic.doMove($scope.boardState, "a3a2",
              $scope.logic);
      $scope.moves = GameLogic.boardMoves($scope.boardState, 'B',
              $scope.logic);

      $scope.boardState = GameLogic.doMove($scope.boardState, "b2b3",
              $scope.logic);
      $scope.moves = GameLogic.boardMoves($scope.boardState, 'W',
              $scope.logic);

      $scope.victory = GameLogic.checkVictory($scope.boardState);


    });

  }
]);