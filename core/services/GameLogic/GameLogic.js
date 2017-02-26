var GameLogic = angular.module('GameLogic', ['ngResource']);

GameLogic.service('GameLogic', function ($resource) {

  this.checkVictory = function (boardState) {

    var whiteEndZone = boardState.substr(6, 3);
    var blackEndZone = boardState.substr(0, 3);

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
      return gameLogic.squares[offset].whiteMoves;
    } else if (currentPlayer === 'B') {
      return gameLogic.squares[offset].blackMoves;
    }

  };

  /*--------------------------------------------------------------------------*/
  // Here we return the moves based on the current board
  this.boardMoves = function (boardState, currentPlayer, gameLogic) {

    var moves = [];

    for (offset = 0; offset < 9; offset++) {

      if (boardState.substr(offset, 1) === currentPlayer) {

        var tileMoves = this.cellMoves(offset, currentPlayer, gameLogic);
        for (board = 0; board < tileMoves.length; board++) {

          var destinationTile = tileMoves[board].substr(2, 2);
          var destinationOffset = gameLogic.offsets[destinationTile];
          var destinationContents = boardState.substr(destinationOffset, 1);
          var advance = tileMoves[board].substr(0,
                  1) === tileMoves[board].substr(2,
                  1);

          if (destinationContents !== currentPlayer) {
            if (destinationContents === ' ' && advance) {
              moves.push(tileMoves[board]);
            } else if (!(destinationContents === ' ' || advance)) {
              moves.push(tileMoves[board]);
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

  /*--------------------------------------------------------------------------*/
  this.flipTile = function (tile) {

    if (tile.substr(0, 1) === 'b') {
      return tile;
    } else {
      var newTile = (tile.substr(0, 1) === 'a') ? 'c' : 'a';
      newTile = newTile + tile.substr(1, 1);
      return newTile;
    }

  };

  /*--------------------------------------------------------------------------*/
  this.flipMove = function (move) {

    var newMove = this.flipTile(move.substr(0, 2));
    newMove = newMove + this.flipTile(move.substr(2, 2));

    return newMove;

  };

  /*--------------------------------------------------------------------------*/
  this.invertTile = function (tile) {

    var file = tile.substr(0, 1);
    var rank = tile.substr(1, 1);
    var newTile = '';

    if (rank === '2') {
      newTile = file + rank;
    } else if (rank === '1') {
      newTile = file + '3';
    } else {
      newTile = file + '1';
    }

    return this.flipTile(newTile);

  };

  /*--------------------------------------------------------------------------*/
  this.invertMove = function (move) {

    var newMove = this.invertTile(move.substr(0, 2))
            + this.invertTile(move.substr(2, 2));

    return newMove;

  };

  /*--------------------------------------------------------------------------*/
  this.invertBoardPlayers = function (board) {

    var newBoard = '';

    newBoard = board.substr(8, 1)
            + board.substr(7, 1)
            + board.substr(6, 1)
            + board.substr(5, 1)
            + board.substr(4, 1)
            + board.substr(3, 1)
            + board.substr(2, 1)
            + board.substr(1, 1)
            + board.substr(0, 1);

    newBoard = newBoard.replace(/W/g, 'T');
    newBoard = newBoard.replace(/B/g, 'W');
    newBoard = newBoard.replace(/T/g, 'B');

    return newBoard;

  };

  /*--------------------------------------------------------------------------*/
  this.flipBoard = function (board) {

    var newBoard = '';

    newBoard = board.substr(2, 1)
            + board.substr(1, 1)
            + board.substr(0, 1)
            + board.substr(5, 1)
            + board.substr(4, 1)
            + board.substr(3, 1)
            + board.substr(8, 1)
            + board.substr(7, 1)
            + board.substr(6, 1);

    return newBoard;

  };

  /*--------------------------------------------------------------------------*/
  this.isSymmetric = function (board) {

    return (board === this.flipBoard(board));

  };

  /*--------------------------------------------------------------------------*/
  this.createBoard = function (board, currentPlayer, gameLogic) {

    var boardMoves = {};
    var boardMovesArray = [];
    var isSymmetric = this.isSymmetric(board);

    var allMovesArray = this.boardMoves(board, currentPlayer, gameLogic);
    var allMoves = {};

    for (arrayKey in allMovesArray) {
      allMoves[allMovesArray[arrayKey]] = allMovesArray[arrayKey];
    }

    for (objKey in allMoves) {
      var flippedMove = this.flipMove(allMoves[objKey]);
      if (!(isSymmetric && boardMoves[flippedMove])) {
        boardMoves[objKey] = objKey;
      }
    }

    for (boardMove in boardMoves) {
      boardMovesArray.push(boardMove);
    }

    return boardMovesArray;

  };

  /*--------------------------------------------------------------------------*/
  this.createInvertedBoard = function (board, currentPlayer, gameLogic) {

    var invertedBoard = this.invertBoardPlayers(board);
    var invertedPlayer = (currentPlayer === 'W') ? 'B' : 'W';

    var boardMoves = {};
    var boardMovesArray = [];
    var isSymmetric = this.isSymmetric(board);

    var allMovesArray = this.boardMoves(invertedBoard, currentPlayer,
            gameLogic);
    var allMoves = {};

    for (arrayKey in allMovesArray) {
      allMoves[allMovesArray[arrayKey]] = allMovesArray[arrayKey];
    }

    for (objKey in allMoves) {
      var flippedMove = this.flipMove(allMoves[objKey]);
      if (!(isSymmetric && boardMoves[flippedMove])) {
        boardMoves[objKey] = objKey;
      }
    }

    for (boardMove in boardMoves) {
      boardMovesArray.push(this.invertMove(boardMove));
    }

    return boardMovesArray;

  };

  /*--------------------------------------------------------------------------*/
  this.createBoardsJSON = function (gameLogic) {

    var computedBoards = {white: {}, black: {}};
    var unAnalyzedBoards = [];
    var currentPlayer = "W";
    var startingBoard = gameLogic.newGame;
    unAnalyzedBoards.push(startingBoard);

    while (unAnalyzedBoards.length > 0) {

      var currentBoard = unAnalyzedBoards[0];
      unAnalyzedBoards.shift();

      var moves = this.boardMoves(currentBoard, currentPlayer,
              gameLogic);

      if (currentPlayer === 'W') {
        if (!computedBoards.white[currentBoard]) {
          if (!computedBoards.white[this.flipBoard(currentBoard)]) {
            computedBoards.white[currentBoard] = {
              board: currentBoard,
              moves: moves
            };
          }
        }
      } else if (currentPlayer === "B") {
        if (!computedBoards.black[currentBoard]) {
          if (!computedBoards.black[this.flipBoard(currentBoard)]) {
            computedBoards.black[currentBoard] = {
              board: currentBoard,
              moves: moves
            };
          }
        }
      }

      for (var i in moves) {
        var move = moves[i];
        var newBoard = this.doMove(currentBoard, move, gameLogic);
        unAnalyzedBoards.push(newBoard);
      }

      currentPlayer = (currentPlayer === 'W') ? 'B' : 'W';

    }

    return computedBoards;

  };
});