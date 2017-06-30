var aivsai = angular.module('aiVsAi');

aivsai.controller('aiVsAiCtlr', [
  '$scope',
  '$rootScope',
  '$interval',
  '$location',
  '$timeout',
  '$window',
  'ngAudio',
  'Arrows',
  'i18n',
  'GameLogic',
  function ($scope, $rootScope, $interval, $location, $timeout, $window, ngAudio, Arrows, i18n, GameLogic) {

    /*------------------------------------------------------------------------*/
    $scope.initializeData = function () {

      // initialize game
      var game = {};
      var intervalPromise;

      $scope.gameType = 'aivsai';
      $scope.showLogicPlayer = '';

      game.number = 1;
      game.victory = ' ';
      game.boardState = $scope.logic.newGame;
      game.boardMoves = GameLogic.boardMoves(game.boardState, 'W',
              $scope.logic);
      game.arrows = Arrows.createMoveArrows(game.boardMoves);
      game.playerMoves = [];
      game.boardHistory = [];
      game.currentPlayer = 'W';
      game.players = {
        W: {
          name: $window.sessionStorage.player1Name,
          type: 'ai',
          currentBoards: $scope.getCurrentBoards('W'),
          unusedMoves: $scope.getCurrentBoards('W')
        },
        B: {
          name: $window.sessionStorage.player2Name,
          type: 'ai',
          currentBoards: $scope.getCurrentBoards('B'),
          unusedMoves: $scope.getCurrentBoards('B')
        }
      };

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

      intervalPromise = $interval(function () {
        if ($scope.game.victory !== ' ') {
          $interval.cancel(intervalPromise);
        } else {
          $scope.aiMove();
        }
      }, 250);

    };

    /*------------------------------------------------------------------------*/
    $scope.getCurrentBoards = function (player) {

      var playerName = '';
      var boards = GameLogic.createBoardsJSON($scope.logic);
      var tempBoards = {};

      switch (player) {
        case 'W':
          playerName = $window.sessionStorage.player1Name;
          tempBoards = boards.white;
          break;

        case 'B':
          playerName = $window.sessionStorage.player2Name;
          tempBoards = boards.black;
          break
      }

      if ($rootScope.AiBoards[playerName]) {
        return JSON.parse(JSON.stringify($rootScope.AiBoards[playerName]))
      } else {
        return JSON.parse(JSON.stringify(tempBoards));
      }

    }

    /*------------------------------------------------------------------------*/
    $scope.stopInterval = function () {
      if (angular.isDefined(intervalPromise)) {
        $interval.cancel(intervalPromise);
      }
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
    $scope.updateHistory = function (move) {

      var game = $scope.game;

      game.playerMoves.push(move);
      game.boardHistory.push(game.boardState);
      // Keep track of moves that have already been used, to learn faster
      GameLogic.removeMoveFromBoard(
              game.players[game.currentPlayer].unusedMoves,
              game.boardState,
              move);
      GameLogic.removeMoveFromBoard(
              game.players[game.currentPlayer].unusedMoves,
              GameLogic.flipBoard(game.boardState),
              GameLogic.flipMove(move));

      console.log('[' + game.boardState + ']' + ' G' + game.number + game.currentPlayer + ':' + move);

    }
    /*------------------------------------------------------------------------*/
    $scope.doMove = function (move) {

      var game = $scope.game;

      $scope.checkPersistence();
      $scope.soundMove();
      $scope.updateHistory(move);

      game.boardState = GameLogic.doMove(game.boardState, move, $scope.logic);

      game.victory = GameLogic.checkVictory(game.boardState);
      if (game.victory !== ' ') {
        $scope.doVictory();
      } else {
        game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
        game.boardMoves = GameLogic.boardMoves(game.boardState, game.currentPlayer,
                $scope.logic);
        game.arrows = Arrows.createMoveArrows(game.boardMoves);
        if (game.boardMoves.length === 0) {
          game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
          game.victory = game.currentPlayer;
          $scope.doVictory();
        }
      }

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

    };

    /*------------------------------------------------------------------------*/
    $scope.doVictory = function () {

      $scope.game.boardMoves = [];
      $scope.game.arrows = [];

      $scope.celebrateVictory();
      $scope.teachAI();

    };

    /*------------------------------------------------------------------------*/
    $scope.soundMove = function () {

      $timeout(function () {
        var sound = ngAudio.load('assets/audio/351518__mh2o__chess-move-on-alabaster.wav');
        sound.play();
      }, 10);
    };

    /*------------------------------------------------------------------------*/
    $scope.celebrateVictory = function () {

      $timeout(function () {
        var sound = ngAudio.load('assets/audio/126421__cabeeno-rossley__level-complete.wav');
        sound.play();
      }, 250);
    };

    /*------------------------------------------------------------------------*/
    $scope.aiMove = function () {

      var game = $scope.game;
      var boardState = game.boardState;
      var aiBoards = $scope.game.players[$scope.game.currentPlayer].currentBoards;
      var aiUnusedMoves = $scope.game.players[$scope.game.currentPlayer].unusedMoves;
      var boardFlipped = false;
      var moves = [];

      if (!aiBoards[boardState]) {
        boardState = GameLogic.flipBoard(boardState);
        boardFlipped = true;
        if (!aiBoards[boardState]) {
          console.log('AiMove: Board ' + $scope.game.boardState + ' not found.');
          return;
        }
      }

      if (aiUnusedMoves[boardState].moves.length > 0) {
        moves = aiUnusedMoves[boardState].moves;
      } else {
        moves = aiBoards[boardState].moves;
      }

      if (moves.length > 0) {
        var move = Math.floor((Math.random() * moves.length));
        if (!boardFlipped) {
          $scope.doMove(moves[move]);
        } else {
          $scope.doMove(GameLogic.flipMove(moves[move]));
        }
      } else { //resign
        $scope.game.victory = 'R';
        game.boardMoves = [];
        $scope.teachAI();
      }
    };

    /*------------------------------------------------------------------------*/
    $scope.teachAI = function () {

      var currentLoser = ($scope.game.currentPlayer === 'W') ? 'B' : 'W';
      var history = $scope.game.boardHistory;
      var offset = 2;

      if ($scope.game.victory === 'R') {
        offset++;
      }

      if (history.length - offset >= 0) {
        var lastGoodBoard = history[history.length - offset];
        var badMove = $scope.game.playerMoves[history.length - offset];

        GameLogic.removeMoveFromBoard(
                $scope.game.players[currentLoser].currentBoards,
                lastGoodBoard,
                badMove
                );
        console.log('Move [' + badMove + '] in board [' + lastGoodBoard + '] leads to defeat.');
        GameLogic.removeMoveFromBoard(// remove mirror image of move as well
                $scope.game.players[currentLoser].currentBoards,
                GameLogic.flipBoard(lastGoodBoard),
                GameLogic.flipMove(badMove)
                );
        console.log('Flipped move [' + GameLogic.flipMove(badMove) + '], in board [' + GameLogic.flipBoard(lastGoodBoard) + '] leads to defeat.');

      } else {
        console.log($scope.game.players[currentLoser].name + ' has failed to learn because of a history offset error.');
        console.log(history);
      }

      $rootScope.AiBoards[$scope.game.players[currentLoser].name] = JSON.parse(JSON.stringify($scope.game.players[currentLoser].currentBoards));

    };

    /*------------------------------------------------------------------------*/
    $scope.newGame = function () {

      //var currentPlayer = $scope.game.currentPlayer;
      var currentGameNumber = $scope.game.number;
      var whiteAIPlayer = JSON.parse(JSON.stringify($scope.game.players['W']));
      var blackAIPlayer = JSON.parse(JSON.stringify($scope.game.players['B']));

      $scope.initializeData();

      // Reset persistent data
      $scope.game.number = currentGameNumber + 1;
      $scope.game.players['W'] = whiteAIPlayer;
      $scope.game.players['B'] = blackAIPlayer;
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
    $scope.showLogic = function (player) {

      $scope.showLogicPlayer = player;

      var boards = [];

      if ($scope.game.players[player].currentBoards) {
        boards = $scope.game.players[player].currentBoards;

        for (var board in boards) {
          boards[board].arrows = Arrows.createMoveArrows(boards[board].moves);
        }
      }
      $scope.showLogicBoards = boards;

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