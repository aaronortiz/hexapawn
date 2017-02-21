var GameLogic = angular.module('GameLogic', ['ngResource']);

GameLogic.service('GameLogic', function ($resource) {

  this.checkVictory = function (boardState) {

    var whiteEndZone = boardState.substr(0, 3);
    var blackEndZone = boardState.substr(6, 3);

    if (whiteEndZone.search('W') > -1) {
      return 'W';
    } else if (blackEndZone.search('B') > -1) {
      return 'B';
    } else {
      return ' ';
    }
  };

  // The idea is that the game read the logic only once and keep it in session storage
  this.readLogic = function (callback) {

    $resource('core/services/GameLogic/GameLogic.js').get(function (data) {
      if (typeof callback === 'function') {
        callback(data);
      }
    });

  };

  // Here we pare down the haystack to a more manageable size, per tile
  this.cellMoves = function (offset, currentPlayer, gameLogic) {

    if (currentPlayer === 'W') {
      return gameLogic.squares[offset].whiteLegalMoves;
    } else if (currentPlayer === 'B') {
      return gameLogic.squares[offset].blackLegalMoves;
    }

  };

  // Here we return the moves based on the current board
  this.boardMoves = function (boardState, currentPlayer, gameLogic) {

    var moves = [];

    for (offset = 0; offset < 9; offset++) {

      var tileMoves = this.cellMoves(offset, currentPlayer, gameLogic);
      for (move = 0; move < tileMoves.length; move++) {

        var destinationTile = tileMoves[move].substr(2, 2);
        var destinationOffset = gameLogic.offsets[destinationTile];
        var destinationContents = boardState.substr(destinationOffset, 1);

        if (destinationContents !== currentPlayer) {
          moves.push(tileMoves[move]);
        }

      }
    }

    return moves;

  };

});