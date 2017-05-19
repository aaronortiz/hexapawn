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
      var boards = GameLogic.createBoardsJSON($scope.logic);

      game.number = 1;
      game.victory = ' ';
      game.boardState = $scope.logic.newGame;
      game.boardMoves = GameLogic.boardMoves(game.boardState, 'W',
              $scope.logic);

      game.playerMoves = [];
      game.boardHistory = [];
      game.currentPlayer = 'W';
      game.players = {
        W: {
          name: $window.sessionStorage.player1Name,
          type: 'human'
        },
        B: {
          name: $window.sessionStorage.player2Name,
          type: 'ai',
          currentBoards: boards.black,
          learningStates: [JSON.stringify(boards.black)]
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

      game.playerMoves.push(move);
      game.boardHistory.push(game.boardState);

      game.boardState = GameLogic.doMove(game.boardState, move, $scope.logic);

      game.victory = GameLogic.checkVictory(game.boardState);
      if (game.victory !== ' ') {
        game.boardMoves = [];
        $scope.teachAI();
      } else {
        game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
        game.boardMoves = GameLogic.boardMoves(game.boardState, game.currentPlayer,
                $scope.logic);
      }

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

    };

    /*------------------------------------------------------------------------*/
    $scope.aiMove = function () {

      var game = $scope.game;
      var aiBoards = $scope.game.players['B'].currentBoards;

      if (aiBoards[game.boardState]) {

        var moves = GameLogic.boardMoves(game.boardState, game.currentPlayer,
                $scope.logic);

        if (moves.length > 0) {
          var move = Math.floor((Math.random() * moves.length));
          $scope.doMove(moves[move]);
        }
      }

      if (move === '') { //resign
        $scope.game.victory = 'W';
        $game.boardMoves = [];
        $scope.teachAI;
      }
    };

    /*------------------------------------------------------------------------*/
    $scope.teachAI = function () {

      var history = $scope.game.boardHistory;

      if (history.length > 1) {

        var lastGoodBoard = history[history.length - 2];
        var badMove = $scope.game.playerMoves[history.length - 2];

        console.log(lastGoodBoard);
        console.log(badMove);
      }
    };

    /*------------------------------------------------------------------------*/
    $scope.newGame = function () {

      var currentGameNumber = $scope.game.number;
      var currentAIBoards = $scope.game.players['B'].currentBoards;

      $scope.initializeData();

      // Reset persistent data
      $scope.game.number = currentGameNumber + 1;
      $scope.game.players['B'].currentBoards = currentAIBoards;
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
    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;
    });

    /*------------------------------------------------------------------------*/
    $scope.showTools = false;
    $scope.checkPersistence();

  }
]);