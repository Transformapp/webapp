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
var app = angular.module('transformApp', ['ui.router', 'parseModule', 'shoppinpal.mobile-menu']);

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
  // .state('groupLogistics', {
  //   url: '/groups/:id',
  //   templateUrl: 'client/views/groupLogistics.html',
  //   controller: 'groupLogisticsController'
  // })
  .state('groupLogistics', {
    url: '/groups',
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
    url: '/prayers/:prayer_id',
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
app.controller('prayerListController', function($scope, PrayerService){
  // query all prayers and asynchronously refresh the page when the requests
  // are retrieved from Parse backend.
  var promise = PrayerService.loadPreviousPrayers();
  promise.then(function(data) {
    console.log('success');
    $scope.prayers = data;
  }, function(error) {
    alert('Failed to load prayers: ' + error);
  });
  $scope.title = "Prayers List";
});
app.controller('prayerDetailController', function($scope, $stateParams){
  $scope.prayer_id = $stateParams.prayer_id;
});
app.controller('profileController', function($scope){
  // add code
});


// models

