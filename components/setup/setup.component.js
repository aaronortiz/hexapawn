var setup = angular.module('setup');

setup.controller('setupCtlr', [
  '$scope',
  '$location',
  '$window',
  'i18n',
  'ReadJSON',
  function ($scope, $location, $window, i18n, ReadJSON) {

    $scope.gameType = $window.sessionStorage.gameType;

    // Read text strings
    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;

      // Setup players
      if ($scope.gameType === 'HUMAN_VS_HUMAN') {
        $scope.player1Name = $scope.i18n.PLAYER_1;
        $scope.player2Name = $scope.i18n.PLAYER_2;
      } else {

        ReadJSON.read('components/setup/AIs.json', function (data) {
          $scope.aIs = data;

          if ($scope.gameType === 'HUMAN_VS_AI') {
            $scope.player1Name = $scope.i18n.PLAYER_1;
            $scope.player2Name = $scope.aIs[Object.keys(
              $scope.aIs)[0]];

          } else if ($scope.gameType === 'AI_VS_AI') {
            $scope.player1Name = $scope.aIs[Object.keys(
              $scope.aIs)[0]];
            $scope.player2Name = $scope.aIs[Object.keys(
              $scope.aIs)[1]];
          }

        });

      }
    });

    $scope.startGame = function () {

      $window.sessionStorage.player1Name = $scope.player1Name;
      $window.sessionStorage.player2Name = $scope.player2Name;

      switch ($window.sessionStorage.gameType) {
        case 'HUMAN_VS_HUMAN':
          $location.path('/huvshu');
          break;

        case 'HUMAN_VS_AI':
          $location.path('/huvsai');
          break;

        case 'AI_VS_AI':
          $location.path('/aivsai');
          break;

      }

    };

  }]);
