var setup = angular.module('setup');

setup.controller('setupCtlr', [
  '$scope',
  '$rootScope',
  '$location',
  '$window',
  'i18n',
  'ReadJSON',
  function ($scope, $rootScope, $location, $window, i18n, ReadJSON) {

    $scope.gameType = $window.sessionStorage.gameType;

    // Read text strings
    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;

      // Setup players
      if ($rootScope.gameType === 'HUMAN_VS_HUMAN') {
        $scope.player1Name = $scope.i18n.PLAYER_1;
        $scope.player2Name = $scope.i18n.PLAYER_2;
      } else {

        ReadJSON.read('components/setup/AIs.json', function (data) {
          $scope.aIs = data;

          if ($rootScope.gameType === 'HUMAN_VS_AI') {
            $scope.player1Name = $scope.i18n.PLAYER_1;
            $scope.player2Name = $scope.aIs[Object.keys(
                    $scope.aIs)[0]];

          } else if ($rootScope.gameType === 'AI_VS_AI') {
            $scope.player1Name = $scope.aIs[Object.keys(
                    $scope.aIs)[0]];
            $scope.player2Name = $scope.aIs[Object.keys(
                    $scope.aIs)[1]];
          }

        });

      }
    });

    $scope.startGame = function () {

      $rootScope.playerNames = [$scope.player1Name, $scope.player2Name];
      $window.sessionStorage.playerNames = $rootScope.playerNames;

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
