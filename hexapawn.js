var hexapawn = angular.module('hexapawnApp', [
  'ngAudio',
  'ngRoute',
  'Arrows',
  'i18n',
  'AIBrain',
  'GameLogic',
  'HexapawnBoard',
  'ReadJSON',
  'welcome',
  'setup',
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

          // Route for setup screen
          .when('/setup', {
            templateUrl: 'components/setup/setup.template.html',
            controller: 'setupCtlr'
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