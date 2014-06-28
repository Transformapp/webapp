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
var parseModule = angular.module('parseModule', []);
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
  .state('addPrayer', {
    url: '/addprayer',
    templateUrl: 'client/views/addPrayer.html',
    controller: 'addPrayerController'
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
app.controller('prayerListController', function($scope, PrayerService, UserService){
  // query all prayers and asynchronously refresh the page when the requests
  // are retrieved from Parse backend.
  $(".loading").show();
  var promise = PrayerService.loadAllPrayers();
  
  promise.then(function(data) {
    $(".loading").hide();
    console.log('success');
    $scope.prayers = data;
  }, function(error) {
    alert('Failed to load prayers: ' + error);
  });
  $scope.title = "Prayers List";

  // $( "#addPrayer" ).click(function() {
  //     alert( "Add Prayer button clicked" );
  // });
});
app.controller('addPrayerController', function($scope, PrayerService){
  $scope.title = "Add A New Prayer/Praise";
  // clicked submit
  $("#submit").click(function() {
    // save prayer in backend
    var promise = PrayerService.addPrayer();
    promise.then(function(prayer) {
      $scope.prayer = prayer;
      alert('added prayer to backend');
    }, function (error) {
      alert('Failed to load prayer: ' + error);
    });
  });


});
app.controller('prayerDetailController', function($scope, $stateParams, PrayerService){  
  $(".loading").show();
  var promise = PrayerService.loadPrayer($stateParams.prayer_id);
  promise.then(function(prayer) {
    $(".loading").hide();
    $scope.prayer = prayer;
  }, function (error) {
    alert('Failed to load prayer: ' + error);
  });
});
app.controller('profileController', function($scope, UserService){
    $(".loading").show();
    var u_id = 'Ddw8VGKsZ1'; // TEMP!! set user ID here! 
    var promise = UserService.loadProfile(u_id);
    promise.then(function(data) {
        $(".loading").hide();
        $scope.user = data;
    }, function(error) {
        alert('Failed to load profile: ' + error);
    });
  $scope.title = "Profile Page";
});

// models

