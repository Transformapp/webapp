// initialize webapp module
var app = angular.module('transformApp', ['ui.router']);

// routing logic
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/prayers'); // default

  $stateProvider
  // .state('home', {
  //   url: '/',
  //   templateUrl: 'client/views/home.html',
  //   controller: 'homeController'
  // })
  // .state('groupLogistics', {
  //   url: '/groups/:id',
  //   templateUrl: 'client/views/groupLogistics.html',
  //   controller: 'groupLogisticsController'
  // })
  // .state('profile', {
  //   url: '/profile',
  //   templateUrl: 'client/views/profile.html',
  //   controller: 'profileController'
  // })
  .state('prayerList', {
    url: '/prayers',
    templateUrl: 'client/views/prayerList.html',
    controller: 'prayerListController'
  })
  .state('prayerDetail', {
    url: '/prayers/:id',
    templateUrl: 'client/views/prayerDetail.html',
    controller: 'prayerDetailController'
  });
})



// controllers
app.controller('homeController', function($scope){
  // add code
});
app.controller('groupLogisticsController', function($scope){
  // add code
});
app.controller('prayerListController', function($scope){
  $scope.title = "Prayers List"
  $scope.prayers = [
    {
      summary: "first prayer",
      type: "prayer" 
    },
    {
      summary: "second praise",
      type: "praise"
    }
  ]
});
app.controller('prayerDetailController', function($scope){
  // add code
});
app.controller('profileController', function($scope){
  // add code
});


// models

