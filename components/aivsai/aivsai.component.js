var aivsai = angular.module('aiVsAi');

aivsai.controller('aiVsAiCtlr', ['$scope', function ($scope) {

    $scope.showBoxes = true;

    $scope.boxes = [];

    for (var i = 0; i < 24; i++) {
      $scope.boxes[i] = {};
    }

    $scope.boxes[0].turn = 2;
    $scope.boxes[0].moves = ["green", "red", "blue"];

    $scope.boxes[1].turn = 2;
    $scope.boxes[1].moves = ["green", "red"];

    $scope.boxes[2].turn = 4;
    $scope.boxes[2].moves = ["green", "red", "blue", "yellow"];

    $scope.boxes[3].turn = 4;
    $scope.boxes[3].moves = ["green", "red", "blue"];

    $scope.boxes[4].turn = 4;
    $scope.boxes[4].moves = ["green", "red", "blue"];

    $scope.boxes[5].turn = 4;
    $scope.boxes[5].moves = ["green", "red", "blue"];

    $scope.boxes[6].turn = 4;
    $scope.boxes[6].moves = ["green", "red", "blue"];

    $scope.boxes[7].turn = 4;
    $scope.boxes[7].moves = ["green", "red"];

    $scope.boxes[8].turn = 4;
    $scope.boxes[8].moves = ["green", "red"];

    $scope.boxes[9].turn = 4;
    $scope.boxes[9].moves = ["green", "red"];

    $scope.boxes[10].turn = 4;
    $scope.boxes[10].moves = ["green", "red"];

    $scope.boxes[11].turn = 4;
    $scope.boxes[11].moves = ["green", "red"];

    $scope.boxes[12].turn = 4;
    $scope.boxes[12].moves = ["green"];

    $scope.boxes[13].turn = 6;
    $scope.boxes[13].moves = ["green", "red"];

    $scope.boxes[14].turn = 6;
    $scope.boxes[14].moves = ["green"];

    $scope.boxes[15].turn = 6;
    $scope.boxes[15].moves = ["green", "red"];

    $scope.boxes[16].turn = 6;
    $scope.boxes[16].moves = ["green", "red"];

    $scope.boxes[17].turn = 6;
    $scope.boxes[17].moves = ["green", "red"];

    $scope.boxes[18].turn = 6;
    $scope.boxes[18].moves = ["green", "red"];

    $scope.boxes[19].turn = 6;
    $scope.boxes[19].moves = ["green", "red", "blue"];

    $scope.boxes[20].turn = 6;
    $scope.boxes[20].moves = ["green", "red"];

    $scope.boxes[21].turn = 6;
    $scope.boxes[21].moves = ["green", "red"];

    $scope.boxes[22].turn = 6;
    $scope.boxes[22].moves = ["green", "red"];

    $scope.boxes[23].turn = 6;
    $scope.boxes[23].moves = ["green", "red"];

    $scope.range = function (n) {
      return new Array(n);
    };

  }
]);