// initialize webapp module
var app = angular.module('transformApp', ['ui.router']);

// routing logic
// app.config(function($routeProvider) {
//   $routeProvider
//   .when('/', {
//     controller: 'homeController',
//     templateUrl: 'client/views/home.html'
//   })
//   .when('/groups/:id', {
//     controller: 'groupLogisticsController',
//     templateUrl: 'client/views/groupLogistics.html'
//   })
//   .when('/prayers', {
//     controller: 'prayerListController',
//     templateUrl: 'client/views/prayerList.html'
//   })
//   .when('/prayers/:id', {
//     controller: 'prayerDetailController',
//     templateUrl: 'client/views/prayerDetail.html'
//   })
//   .when('/profile', {
//     controller: 'profileController',
//     templateUrl: 'client/views/profile.html'
//   })
//   .otherwise({
//     redirectTo: '/'
//   });
// })



// controllers
app.controller('homeController', function($scope){
  // add code
});
app.controller('groupLogisticsController', function($scope){
  // add code
});
app.controller('prayerListController', function($scope){
  // $scope.title = "Prayers List"
  // $scope.prayers = [
  //   {
  //     summary: "first prayer",
  //     type: "prayer" 
  //   },
  //   {
  //     summary: "second praise",
  //     type: "praise"
  //   }
  // ]
});
app.controller('prayerDetailController', function($scope){
  // add code
});
app.controller('profileController', function($scope){
  // add code
});


// models

