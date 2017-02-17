var hexapawn = angular.module('hexapawnApp', [
  'ngRoute',
  'welcome',
  'board'
]);

hexapawn.config(function ($routeProvider) {

  $routeProvider
    // Route for welcome screen
    .when('/', {
      templateUrl: 'components/welcome.template.html',
      controller: 'welcomeCtlr'
    })

    // Route for game board
    .when('/board', {
      templateUrl: 'components/board.template.html',
      controller: 'boardCtlr'
    });
});

