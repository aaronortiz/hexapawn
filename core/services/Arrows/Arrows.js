var Arrows = angular.module('Arrows', []);
Arrows.service('Arrows', function () {

  /*--------------------------------------------------------------------------*/
  this.setStartPointX = function (startLetter, endLetter) {

    var x = '';
    switch (startLetter) {
      case 'a':
        x = '2.5';
        break;
      case 'b':
        if (endLetter === 'a') {
          x = '3.5';
        } else {
          x = '5.5';
        }
        break;
      case 'c':
        if (endLetter === 'c') {
          x = '8.5';
        } else {
          x = '6.5';
        }
        break;
    }

    return parseFloat(x);
  };
  /*--------------------------------------------------------------------------*/
  this.setStartPointY = function (startNumber, endNumber) {

    var y = '';
    switch (startNumber) {
      case '1':
        y = '6.5';
        break;
      case '2':
        if (endNumber = '3') {
          y = '3.5';
        } else {
          y = '5.5';
        }
        break;
      case '3':
        y = '2.5';
        break;
    }

    return parseFloat(y);
  };
  /*--------------------------------------------------------------------------*/
  this.setEndPointX = function (startLetter, endLetter) {

    var x = '';
    switch (endLetter) {
      case 'a':
        x = '2.5';
        break;
      case 'b':
        if (startLetter === 'a') {
          x = '3.5';
        } else {
          x = '5.5';
        }
        break;
      case 'c':
        if (startLetter === 'b') {
          x = '6.5';
        } else {
          x = '8.5';
        }

        break;
    }

    return parseFloat(x);
  };
  /*--------------------------------------------------------------------------*/
  this.setEndPointY = function (startNumber, endNumber) {

    var y = '';
    switch (endNumber) {
      case '1':
        y = '6.5';
        break;
      case '2':
        if (startNumber === '3') {
          y = '3.5';
        } else {
          y = '5.5';
        }
        break;
      case '3':
        y = '2.5';
        break;
    }

    return parseFloat(y);
  }

  /*--------------------------------------------------------------------------*/
  this.findDirection = function (startLetter, startNumber, endLetter, endNumber) {

    var direction = '';
    if (startLetter === endLetter) { // Vertical lines
      if (startNumber < endNumber) {
        direction = 'N';
      } else {
        direction = 'S';
      }
    } else if (startNumber === endNumber) { // Horizontal lines
      if (startLetter < endLetter) {
        direction = 'E';
      } else {
        direction = 'W';
      }
    } else { // Diagonal lines
      if (startNumber < endNumber) {
        direction = 'N';
      } else {
        direction = 'S';
      }
      if (startLetter < endLetter) {
        direction = direction + 'E';
      } else {
        direction = direction + 'W';
      }
    }

    return direction;
  };
  /*--------------------------------------------------------------------------*/
  this.getStyle = function (moveNumber) {

    var style = '';
    switch (moveNumber) {
      case '0':
        style = 'stroke:rgb(0,255,0);stroke-width:6;stroke-linecap:round';
        break;
      case '1':
        style = 'stroke:rgb(255,0,0);stroke-width:6;stroke-linecap:round';
        break;
      case '2':
        style = 'stroke:rgb(0,0,255);stroke-width:6;stroke-linecap:round';
        break;
      case '3':
        style = 'stroke:rgb(255,255,0);stroke-width:6;stroke-linecap:round';
        break;
      case '4':
        style = 'stroke:rgb(0,255,255);stroke-width:6;stroke-linecap:round';
        break;
    }
    return style;
  };

  /*--------------------------------------------------------------------------*/
  this.addPoint = function (array, x, y) {
    array.push({x: x.toFixed(2), y: y.toFixed(2)});
  };

  /*--------------------------------------------------------------------------*/
  this.addArrowhead = function (arrow) {

    var direction = this.findDirection(startLetter, startNumber, endLetter, endNumber);

    // Create arrowhead
    switch (direction) {
      case 'N':
        this.addPoint(arrow.points, arrow.x2 - offset, arrow.y2 - offset);
        this.addPoint(arrow.points, arrow.x2 + offset, arrow.y2 - offset);
        break;
      case 'S':
        this.addPoint(arrow.points, arrow.x2 - offset, arrow.y2 + offset);
        this.addPoint(arrow.points, arrow.x2 + offset, arrow.y2 + offset);
        break;
      case 'E':
        this.addPoint(arrow.points, arrow.x2 - offset, arrow.y2 - offset);
        this.addPoint(arrow.points, arrow.x2 - offset, arrow.y2 + offset);
        break;
      case 'W':
        this.addPoint(arrow.points, arrow.x2 + offset, arrow.y2 - offset);
        this.addPoint(arrow.points, arrow.x2 + offset, arrow.y2 + offset);
        break;
      case 'NE':
        break;
      case 'SE':
        break;
      case 'SW':
        break;
      case 'NW':
        break;
    }

  };

  /*--------------------------------------------------------------------------*/
  this.createPointString = function (points) {

    var pointArray = [];

    for (point in points) {
      pointArray.push(String(points(point).x) + ',' + String(points(point).y));
    }

    return pointArray.join();

  };

  /*--------------------------------------------------------------------------*/
  this.createArrow = function (move, moveNumber) {

    const offset = parseFloat('0.7051');

    var arrow = {points: [], pointString: '', x1: '', y1: '', x2: '', y2: '', style: ''};
    var startLetter = move.substr(0, 1);
    var startNumber = move.substr(1, 1);
    var endLetter = move.substr(2, 1);
    var endNumber = move.substr(3, 1);

    arrow.x1 = this.setStartPointX(startLetter, endLetter);
    arrow.y1 = this.setStartPointY(startNumber, endNumber);
    arrow.x2 = this.setEndPointX(startLetter, endLetter);
    arrow.y2 = this.setEndPointY(startNumber, endNumber);

    this.addPoint(arrow.points, arrow.x1, arrow.y1);
    this.addPoint(arrow.points, arrow.x2, arrow.y2);

    this.addArrowhead(arrow);
    arrow.pointString = this.createPointString(arrow.points);

    arrow.style = this.getStyle(moveNumber);
    return arrow;
  };
  /*--------------------------------------------------------------------------*/
  this.createMoveArrows = function (moves) {

    var arrows = [];
    for (var move in moves) {
      arrows.push(this.createArrow(moves[move], move));
    }
    return arrows;
  };
});
