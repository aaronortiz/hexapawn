var GameLogic = angular.module('GameLogic', ['ngResource']);

GameLogic.service('GameLogic', function ($resource) {

  this.checkVictory = function (boardState) {

    var whiteEndZone = boardState.substr(0, 3);
    var blackEndZone = boardState.substr(6, 3);

    // add when if there is none of a certain piece

    if (whiteEndZone.search('W') > -1) {
      return 'W';
    } else if (blackEndZone.search('B') > -1) {
      return 'B';
    } else if (boardState.search('W') > -1 && boardState.search('B') === -1) {
      return 'W';
    } else if (boardState.search('B') > -1 && boardState.search('W') === -1) {
      return 'B';
    } else {
      return ' ';
    }
  };

  /*--------------------------------------------------------------------------*/
  // The idea is that the game read the logic only once and keep it in session storage
  this.readLogic = function (callback) {

    $resource('core/services/GameLogic/gameLogic.json').get(function (data) {
      if (typeof callback === 'function') {
        callback(data);
      }
    });

  };

  /*--------------------------------------------------------------------------*/
  // Here we pare down the haystack to a more manageable size, per tile
  this.cellMoves = function (offset, currentPlayer, gameLogic) {

    if (currentPlayer === 'W') {
      return gameLogic.squares[offset].whiteLegalMoves;
    } else if (currentPlayer === 'B') {
      return gameLogic.squares[offset].blackLegalMoves;
    }

  };

  /*--------------------------------------------------------------------------*/
  // Here we return the moves based on the current board
  this.boardMoves = function (boardState, currentPlayer, gameLogic) {

    var moves = [];

    for (offset = 0; offset < 9; offset++) {

      if (boardState.substr(offset, 1) === currentPlayer) {

        var tileMoves = this.cellMoves(offset, currentPlayer, gameLogic);
        for (move = 0; move < tileMoves.length; move++) {

          var destinationTile = tileMoves[move].substr(2, 2);
          var destinationOffset = gameLogic.offsets[destinationTile];
          var destinationContents = boardState.substr(destinationOffset, 1);
          var advance = tileMoves[move].substr(0,
                  1) === tileMoves[move].substr(2,
                  1);

          if (destinationContents !== currentPlayer) {
            if (destinationContents === ' ' && advance) {
              moves.push(tileMoves[move]);
            } else if (!(destinationContents === ' ' || advance)) {
              moves.push(tileMoves[move]);
            }
          }

        }
      }
    }

    return moves;

  };

  /*--------------------------------------------------------------------------*/
  // Replace single character
  this.replaceChar = function (source, char, offset) {

    var newString = '';

    if (offset >= source.length || offset < 0) {
      newString = source;

    } else if (offset === 0) {
      newString = char + source.substr(1);

    } else if (offset === source.length - 1) {
      newString = source.substr(0, offset) + char;

    } else {
      newString = source.substr(0, offset) + char + source.substr(
              offset + 1);
    }

    return newString;
  };

  /*--------------------------------------------------------------------------*/
  // Takes care of the logic of a move
  this.doMove = function (boardState, move, gameLogic) {

    var newBoard = boardState;

    var fromTile = move.substr(0, 2);
    var fromOffset = gameLogic.offsets[fromTile];
    var fromPiece = boardState.substr(fromOffset, 1);

    var toTile = move.substr(2, 2);
    var toOffset = gameLogic.offsets[toTile];

    newBoard = this.replaceChar(newBoard, ' ', fromOffset);
    newBoard = this.replaceChar(newBoard, fromPiece, toOffset);

    return newBoard;

  };

});