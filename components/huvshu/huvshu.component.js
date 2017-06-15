var huvshu = angular.module('humanVsHuman');

huvshu.controller('humanVsHumanCtlr', [
  '$scope',
  '$location',
  '$timeout',
  '$window',
  'ngAudio',
  'i18n',
  'GameLogic',
  function ($scope, $location, $timeout, $window, ngAudio, i18n, GameLogic) {

    /*------------------------------------------------------------------------*/
    $scope.initializeData = function () {

      // initialize game
      var game = {};
      game.number = 1;
      game.victory = ' ';
      game.boardState = $scope.logic.newGame;
      game.boardMoves = GameLogic.boardMoves(game.boardState, 'W',
              $scope.logic);
      game.arrows = GameLogic.createMoveArrows(game.boardMoves);
      game.playerMoves = [];

      game.currentPlayer = 'W';
      game.players = {
        W: {
          name: $window.sessionStorage.player1Name,
          type: 'human'
        },
        B: {
          name: $window.sessionStorage.player2Name,
          type: 'human'
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
      $scope.soundMove();

      game.playerMoves.push(move);
      game.boardState = GameLogic.doMove(game.boardState, move, $scope.logic);

      game.victory = GameLogic.checkVictory(game.boardState);
      if (game.victory !== ' ') {
        game.boardMoves = [];
      } else {
        game.currentPlayer = (game.currentPlayer === 'W') ? 'B' : 'W'; // Toggle player
        game.boardMoves = GameLogic.boardMoves(game.boardState, game.currentPlayer,
                $scope.logic);
        game.arrows = GameLogic.createMoveArrows(game.boardMoves);
      }

      if ($scope.game.victory !== ' ') {
        $scope.celebrateVictory();
      }

      $window.sessionStorage.game = JSON.stringify(game);
      $scope.game = game;
      //$scope.drawArrows();

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
        var sound = ngAudio.load('assets/audio/5_Sec_Crowd_Cheer-Mike_Koenig-1562033255.mp3');
        sound.play();
      }, 250);
    };

    /*------------------------------------------------------------------------*/
    $scope.newGame = function () {
      var currentGameNumber = $scope.game.number;
      $scope.initializeData();
      $scope.game.number = currentGameNumber + 1;
    };

    /*------------------------------------------------------------------------*/
    $scope.returnToMainMenu = function () {
      $location.path('/');
    };

    /*------------------------------------------------------------------------*/
    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;
    });

    /*------------------------------------------------------------------------*/
    $scope.checkPersistence();

  }
]);