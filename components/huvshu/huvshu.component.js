var huvshu = angular.module('humanVsHuman');

huvshu.controller('humanVsHumanCtlr', [
  '$scope',
  '$window',
  'i18n',
  'GameLogic',
  function ($scope, $window, i18n, GameLogic) {

    /*------------------------------------------------------------------------*/
    $scope.initializeData = function () {

      // initialize game
      $scope.game = {};
      $scope.game.boardState = $scope.logic.newGame;
      $scope.game.moves = GameLogic.boardMoves($scope.game.boardState, 'W',
        $scope.logic);

      $scope.game.moveCount = 0;
      $scope.game.currentPlayer = 'W';
      $scope.game.players = {
        W: $window.sessionStorage.player1Name,
        B: $window.sessionStorage.player2Name
      };

      $window.sessionStorage.game = JSON.stringify($scope.game);

    }

    /*------------------------------------------------------------------------*/
    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;
    });

    /*------------------------------------------------------------------------*/
    GameLogic.readLogic(function (data) {

      $scope.logic = data;
      $window.sessionStorage.logic = JSON.stringify(data);
      $scope.initializeData();

    });

    /*------------------------------------------------------------------------*/
    $scope.doMove = function (move) {

    };

  }
]);