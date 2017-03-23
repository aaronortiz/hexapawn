var huvsai = angular.module('humanVsAi');

huvsai.controller('humanVsAiCtlr', [
  '$scope',
  '$location',
  '$window',
  'i18n',
  'GameLogic',
  function ($scope, $location, $window, i18n, GameLogic) {

    /*------------------------------------------------------------------------*/
    $scope.initializeData = function () {

      // initialize game
      var game = {};
      game.victory = ' ';
      game.boardState = $scope.logic.newGame;
      game.moves = GameLogic.boardMoves(game.boardState, 'W',
              $scope.logic);

      game.moveCount = 0;
      game.currentPlayer = 'W';
      game.players = {
        W: {
          name: $window.sessionStorage.player1Name,
          type: 'human'
        },
        B: {
          name: $window.sessionStorage.player2Name,
          type: 'ai'
        }
      };

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

    };

    /*------------------------------------------------------------------------*/
    $scope.checkGamePersistence = function () {

      if (!$scope.game) {
        if (!$window.sessionStorage.game) {
          $scope.initializeData();
        } else {
          $scope.game = JSON.parse($window.sessionStorage.game);
        }
      }

    };

    /*------------------------------------------------------------------------*/
    $scope.checkPersistence = function () {

      if (!$scope.logic) {
        if (!$window.sessionStorage.logic) {
          GameLogic.readLogic(function (data) {

            $scope.logic = data;
            $window.sessionStorage.logic = JSON.stringify(data);
            $scope.initializeData();

          });
        } else {
          $scope.logic = JSON.parse($window.sessionStorage.logic);
          $scope.checkGamePersistence();
        }
      } else {
        $scope.checkGamePersistence();
      }

    };

    /*------------------------------------------------------------------------*/
    $scope.doMove = function (move) {

      var game = $scope.game;

      $scope.checkPersistence();

      game.moveCount++;
      game.boardState = GameLogic.doMove(game.boardState, move, $scope.logic);

      game.victory = GameLogic.checkVictory(game.boardState);
      if (game.victory !== ' ') {
        game.moves = [];
      } else {
        game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
        game.moves = GameLogic.boardMoves(game.boardState, game.currentPlayer,
                $scope.logic);
      }

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

    };

    /*------------------------------------------------------------------------*/
    $scope.aiMove = function () {

      var game = $scope.game;

      if (game.moves.length > 0) {
        var move = Math.floor((Math.random() * game.moves.length));
        $scope.doMove(game.moves[move]);
      }

    };

    /*------------------------------------------------------------------------*/
    $scope.returnToMainMenu = function () {
      $location.path('/');
    };

    /*------------------------------------------------------------------------*/
    $scope.toggleTools = function () {

      $scope.showTools = !$scope.showTools;

      if ($scope.showTools) {
        $scope.boards = JSON.stringify(GameLogic.createBoardsJSON(
                $scope.logic));
      }

    };

    /*------------------------------------------------------------------------*/
    $scope.toggleBrain = function () {

      $scope.showBrain = !$scope.showBrain;

      if ($scope.showBrain) {
        var boards = GameLogic.createBoardsJSON(
                $scope.logic);

        if ($scope.game.currentPlayer === 'W') {
          $scope.boards = JSON.stringify(boards.white);
        } else {
          $scope.boards = JSON.stringify(boards.black);
        }

      }

    };

    /*------------------------------------------------------------------------*/
    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;
    });

    /*------------------------------------------------------------------------*/
    $scope.showTools = false;
    $scope.checkPersistence();

  }
]);