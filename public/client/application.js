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
  $urlRouterProvider.otherwise('/'); // default

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'client/views/home.html',
    controller: 'homeController'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'client/views/login.html',
    controller: 'loginController'
  })
  .state('groupLogistics', {
    url: '/groups',
    templateUrl: 'client/views/groupLogistics.html',
    controller: 'groupLogisticsController',
    restrict: {
      type: 'User'
    }
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'client/views/profile.html',
    controller: 'profileController',
    restrict: {
      type: 'User'
    }
  })
  .state('prayerList', {
    url: '/prayers',
    templateUrl: 'client/views/prayerList.html',
    controller: 'prayerListController',
    restrict: {
      type: 'User'
    }
  })
  .state('addPrayer', {
    url: '/addprayer',
    templateUrl: 'client/views/addPrayer.html',
    controller: 'addPrayerController'
  })
  .state('prayerDetail', {
    url: '/prayers/:prayer_id',
    templateUrl: 'client/views/prayerDetail.html',
    controller: 'prayerDetailController',
    restrict: {
      type: 'User'
    }
  });
})

app.run(function($rootScope, $state, UserService, $spMenu) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (toState.restrict) {
      $rootScope.currentUser = UserService.currentLoggedInUser();
      if (!$rootScope.currentUser) {
        event.preventDefault();
        $state.go("home");
      }
    }
  });
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    //$spMenu.hide();
  });
});


// controllers
app.controller('homeController', function($scope){
  // add code
});
app.controller('loginController', function($scope){
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
  $("#addPrayerSubmit").click(function() {
    // DUMMY USER RIGHT NOW -- Currently set to Kevin Tu
    var currentUser = new User('Ddw8VGKsZ1', null,null,null);
    // Get contents from form
    if (document.getElementById("form_praise").checked){
      var p_type = document.getElementById("form_praise").value;
    } else{
      var p_type = document.getElementById("form_prayer").value;
    }
    var p_title = document.getElementById("form_title").value;
    var p_description = document.getElementById("form_description").value;
    console.log(p_type, p_title, p_description);
    // create prayer 
    var newprayer = new Prayer(null, currentUser, p_title, p_description, p_type, null,[],[]);
    // save prayer in backend
    var promise = PrayerService.addPrayer(newprayer);
    promise.then(function(prayer) {
      // navigate back home when done adding
      window.location = $("#addPrayerSubmit").attr('href');
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

