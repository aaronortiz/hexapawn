var welcome = angular.module('welcome');
welcome.controller('welcomeCtlr', [
  '$scope',
  '$rootScope',
  '$location',
  '$window',
  'i18n',
  function (
          $scope,
          $rootScope,
          $location,
          $window,
          i18n
          ) {

    if (!$rootScope.AiBoards) {
      $rootScope.AiBoards = {
        'W': {},
        'B': {}
      };
    }

    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;
    });

    $scope.setupGame = function (gameType) {

      $rootScope.gameType = gameType;

      $window.sessionStorage.gameType = gameType;
      $location.path('/setup');
    };

    $scope.resetAi = function () {
      $rootScope.AiBoards = {
        'W': {},
        'B': {}
      };
    };
  }
]);