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
        if ($scope.game.currentPlayer === 'W') {
          $scope.teachAI();
        }
      } else {
        game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
        game.boardMoves = GameLogic.boardMoves(game.boardState, game.currentPlayer,
                $scope.logic);
        if (game.boardMoves.length === 0) {
          game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
          game.victory = game.currentPlayer;
        }
      }

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

    };

    /*------------------------------------------------------------------------*/
    $scope.aiMove = function () {

      var game = $scope.game;
      var boardState = game.boardState;
      var aiBoards = $scope.game.players['B'].currentBoards;

      if (!aiBoards[boardState]) {
        boardState = GameLogic.flipBoard(boardState);
        if (!aiBoards[boardState]) {
          console.log('Board ' + $scope.game.boardState + ' not found.');
          return;
        }
      }

      var moves = aiBoards[boardState].moves;

      if (moves.length > 0) {
        var move = Math.floor((Math.random() * moves.length));
        $scope.doMove(moves[move]);
      } else { //resign
        $scope.game.victory = 'R';
        game.boardMoves = [];
        $scope.teachAI;
      }
    };

    /*------------------------------------------------------------------------*/
    $scope.teachAI = function () {

      var aiBoards = $scope.game.players['B'].currentBoards;
      var history = $scope.game.boardHistory;
      var offset = 2;

      if ($scope.game.victory === 'R') {
        offset++;
      }

      if (history.length - offset >= 0) {
        var lastGoodBoard = history[history.length - offset];
        var badMove = $scope.game.playerMoves[history.length - offset];

        console.log(lastGoodBoard);
        console.log(badMove);
        GameLogic.removeMoveFromBoard(aiBoards, lastGoodBoard, badMove);
        $scope.game.players['B'].learningStates.push(JSON.stringify(aiBoards));
        $scope.game.players['B'].currentBoards = aiBoards;
      } else {
        console.log($scope.game.players['B'].playerName + ' has failed to learn because of a history offset error.');
        console.log(history);
      }
    };

    /*------------------------------------------------------------------------*/
    $scope.newGame = function () {

      var currentGameNumber = $scope.game.number;
      var currentAIPlayer = $scope.game.players['B'];

      $scope.initializeData();

      // Reset persistent data
      $scope.game.number = currentGameNumber + 1;
      $scope.game.players['B'] = currentAIPlayer;
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