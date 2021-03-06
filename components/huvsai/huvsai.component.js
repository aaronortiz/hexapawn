var huvsai = angular.module('humanVsAi');

huvsai.controller('humanVsAiCtlr', [
  '$scope',
  '$rootScope',
  '$location',
  '$timeout',
  '$window',
  'ngAudio',
  'Arrows',
  'i18n',
  'GameLogic',
  function ($scope, $rootScope, $location, $timeout, $window, ngAudio, Arrows, i18n, GameLogic) {

    /*------------------------------------------------------------------------*/
    $scope.initializeData = function () {

      // initialize game
      var game = {};

      $scope.gameType = 'huvsai';
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
          type: 'human'
        },
        B: {
          name: $window.sessionStorage.player2Name,
          type: 'ai',
          currentBoards: $scope.getCurrentBoards()
        }
      };

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

    };

    /*------------------------------------------------------------------------*/
    $scope.getCurrentBoards = function () {

      var playerName = '';
      var boards = GameLogic.createBoardsJSON($scope.logic);

      playerName = $window.sessionStorage.player2Name;

      if ($rootScope.AiBoards['B'][playerName]) {
        return JSON.parse(JSON.stringify($rootScope.AiBoards['B'][playerName]))
      } else {
        return JSON.parse(JSON.stringify(boards.black));
      }

    }

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

      $scope.soundMove();
      $scope.checkPersistence();

      game.playerMoves.push(move);
      game.boardHistory.push(game.boardState);

      console.log(
              '[' + game.boardState + ']' + ' G' + game.number + game.currentPlayer + ':' + move);

      game.boardState = GameLogic.doMove(game.boardState, move, $scope.logic);

      game.victory = GameLogic.checkVictory(game.boardState);
      if (game.victory !== ' ') {
        $scope.doVictory();
      } else {
        game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
        game.boardMoves = GameLogic.boardMoves(game.boardState,
                game.currentPlayer,
                $scope.logic);
        game.arrows = Arrows.createMoveArrows(game.boardMoves);
        if (game.boardMoves.length === 0) {
          game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
          game.victory = 'T'; //game.currentPlayer;
          $scope.doTie();
        }
      }

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;

    };

    /*------------------------------------------------------------------------*/
    $scope.doVictory = function () {

      $scope.game.boardMoves = [];
      $scope.game.arrows = [];

      if ($scope.game.victory === 'W') {
        $scope.teachAI();
        $scope.celebratePlayerVictory();
      } else if ($scope.game.victory === 'B') {
        $scope.celebrateAIVictory();
      }

    };

    /*------------------------------------------------------------------------*/
    $scope.doTie = function () {

      $scope.game.boardMoves = [];
      $scope.game.arrows = [];

    };

    /*------------------------------------------------------------------------*/
    $scope.soundMove = function () {

      $timeout(function () {
        var sound = ngAudio.load(
                'assets/audio/351518__mh2o__chess-move-on-alabaster.wav');
        sound.play();
      }, 10);
    };

    /*------------------------------------------------------------------------*/
    $scope.celebratePlayerVictory = function () {

      $timeout(function () {
        var sound = ngAudio.load(
                'assets/audio/5_Sec_Crowd_Cheer-Mike_Koenig-1562033255.mp3');
        sound.play();
      }, 250);
    };

    /*------------------------------------------------------------------------*/
    $scope.celebrateAIVictory = function () {

      $timeout(function () {
        var sound = ngAudio.load(
                'assets/audio/Buzzer-SoundBible.com-188422102.mp3');
        sound.play();
      }, 250);
    };
    /*------------------------------------------------------------------------*/
    $scope.aiMove = function () {

      var game = $scope.game;
      var boardState = game.boardState;
      var aiBoards = $scope.game.players['B'].currentBoards;
      var boardFlipped = false;

      if (!aiBoards[boardState]) {
        boardState = GameLogic.flipBoard(boardState);
        boardFlipped = true;
        if (!aiBoards[boardState]) {
          console.log('Board ' + $scope.game.boardState + ' not found.');
          return;
        }
      }

      var moves = aiBoards[boardState].moves;

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
        $scope.teachAI;
      }
    };

    /*------------------------------------------------------------------------*/
    $scope.teachAI = function () {

      var history = $scope.game.boardHistory;
      var offset = 2;

      if ($scope.game.victory === 'R') {
        offset++;
      }

      if (history.length - offset >= 0) {
        var lastGoodBoard = history[history.length - offset];
        var badMove = $scope.game.playerMoves[history.length - offset];

        GameLogic.removeMoveFromBoard(
                $scope.game.players['B'].currentBoards,
                lastGoodBoard,
                badMove
                );
        GameLogic.removeMoveFromBoard(// remove mirror image of move as well
                $scope.game.players['B'].currentBoards,
                GameLogic.flipBoard(lastGoodBoard),
                GameLogic.flipMove(badMove)
                );

        $rootScope.AiBoards['B'][$scope.game.players['B'].name] = $scope.game.players['B'].currentBoards;

      } else {
        console.log(
                $scope.game.players['B'].name + ' has failed to learn because of a history offset error.');
        console.log(history);
      }
    };

    /*------------------------------------------------------------------------*/
    $scope.newGame = function () {

      var currentGameNumber = $scope.game.number;
      var currentAIPlayer = JSON.parse(JSON.stringify(
              $scope.game.players['B']));

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