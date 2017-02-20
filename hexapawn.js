var hexapawn = angular.module('hexapawnApp', [
  'ngRoute',
  'i18n',
  'welcome',
  'humanVsHuman',
  'humanVsAi',
  'aiVsAi'
]);
hexapawn.config(function ($routeProvider) {

  $routeProvider
          // Route for welcome screen
          .when('/', {
            templateUrl: 'components/welcome/welcome.template.html',
            controller: 'welcomeCtlr'
          })

          // Route for human vs. human
          .when('/huvshu', {
            templateUrl: 'components/huvshu/huvshu.template.html',
            controller: 'humanVsHumanCtlr'
          })

          // Route for human vs. ai
          .when('/huvsai', {
            templateUrl: 'components/huvsai/huvsai.template.html',
            controller: 'humanVsAiCtlr'
          })

          // Route for ai vs. ai
          .when('/aivsai', {
            templateUrl: 'components/aivsai/aivsai.template.html',
            controller: 'aiVsAiCtlr'
          });
});

hexapawn.directive('hxpBoard', function () {

  return {
    scope: {
      gameType: '=gametype',
      playerNames: '=playernames',
      boardState: '=boardstate',
      moves: '=moves'
    },
    templateUrl: 'core/directives/hxpBoard/hxpBoard.template.html'
  };

});