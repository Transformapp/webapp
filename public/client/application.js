angular.module('transformApp', [])
angular.module('transformApp')
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'mainController',
    templateUrl: 'client/views/main.html'
  })
  .otherwise({
    redirectTo: '/'
  });
})