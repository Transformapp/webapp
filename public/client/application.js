function parseInit() {
  Parse.$ = jQuery;
    
  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("tK9bW3HzysojL4fxbjjj2H1zCT81JuyW1s6x02Vr",
                   "ZiGuizOBCP3JK8TKqHhnWzzQLhO6Ym9iJOFJWP2F");
}

window.onload = function() {
  parseInit();
};

// initialize webapp module
var app = angular.module('transformApp', ['ui.router']);

app.service('currentPrayer', function () {
  var prayer = null;
  return {
    getPrayer: function() {
      return prayer;
    },
    setPrayer: function(val) {
      prayer = val;
    }
  };
}) 

// routing logic
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/prayers'); // default

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'client/views/home.html',
    controller: 'homeController'
  })
  .state('groupLogistics', {
    url: '/groups/:id',
    templateUrl: 'client/views/groupLogistics.html',
    controller: 'groupLogisticsController'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'client/views/profile.html',
    controller: 'profileController'
  })
  .state('prayerList', {
    url: '/prayers',
    templateUrl: 'client/views/prayerList.html',
    controller: 'prayerListController'
  })
  .state('prayerDetail', {
    url: '/prayers/:prayer',
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
app.controller('prayerListController', function($scope, currentPrayer, $location){
  // query all prayers and asynchronously refresh the page when the requests
  // are retrieved from Parse backend.
  loadPreviousPrayers($scope);
  $scope.title = "Prayers List";
  $scope.setCurrentPrayer = function(current_prayer) {
    console.log('setCurrentPrayer');
    currentPrayer.setPrayer(current_prayer);
  };
});
app.controller('prayerDetailController', function($scope, currentPrayer){
  console.log('prayerDetailController');
  $scope.prayer = currentPrayer.getPrayer();
});
app.controller('profileController', function($scope){
  // add code
});


// models

