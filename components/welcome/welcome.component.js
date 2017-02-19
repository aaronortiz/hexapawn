var welcome = angular.module('welcome');
welcome.controller('welcomeCtlr', [
  '$scope',
  'i18n',
  '$location',
  function ($scope, i18n, $location) {

    i18n.getI18nStrings('EN', function (data) {
      $scope.i18n = data;
    });

    $scope.startGame = function (gameType) {

      switch (gameType) {
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
      ;
    };
  }
]);