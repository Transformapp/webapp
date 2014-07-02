function parseInit() {
  Parse.$ = jQuery;
    
  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("tK9bW3HzysojL4fxbjjj2H1zCT81JuyW1s6x02Vr",
                   "ZiGuizOBCP3JK8TKqHhnWzzQLhO6Ym9iJOFJWP2F");
}

// initialize webapp module
var parseModule = angular.module('parseModule', []);
var app = angular.module('transformApp', ['ui.router', 'parseModule', 'shoppinpal.mobile-menu', 'LocalStorageModule']);

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
app.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
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
    controller: 'addPrayerController',
    restrict: {
      type: 'User'
    }
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

app.run(function($rootScope, $state, UserService, $spMenu, localStorageService) {
  parseInit();
  $spMenu.hide();
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (toState.restrict) {
      // set previous state
      if( fromState.name == "" ){
        $rootScope.previousState = "home"
      }
      else{
        $rootScope.previousState = fromState.name;
      }
      $rootScope.currentUser = UserService.currentLoggedInUser();
      if (!$rootScope.currentUser) {
        event.preventDefault();
        $state.go("home");
      }
    }
  });
  UserService.loadAllUsers().then(function(users) {
    users.forEach(function(user) {
      localStorageService.set(user.id, user);
    })
  }, function(error) {
    alert('Failed to load all users: ' + error);
  });
  // check if menuButton is a menu or a back button
  $("#menuButton").click(function() { 
    if ($("#menuButton").hasClass("backButton")){
      $state.go($rootScope.previousState);
      $("#menuButton").attr('class', 'menuButton');
    }
    else{
      $spMenu.toggle();
    }
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $("#menuButton").attr('class', 'menuButton');
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
  // determine position/height of list and set it dynamically.
  var top = $("#prayer-list-container").offset().top;
  var fontSize = $("#add-prayer").css('font-size');
  var lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 7.4);
  var bottom = $(window).height() - lineHeight;
  $("#prayer-list-container").css("height",(bottom - top).toString()+ "px");
  // query all prayers and asynchronously refresh the page when the requests are retrieved from Parse backend.
  $(".loading").show();
  var promise = PrayerService.loadAllPrayers();

  promise.then(function(prayers) {
    $(".loading").hide();
    $scope.prayers = prayers;
  }, function(error) {
    alert('Failed to load prayers: ' + error);
  });
  $scope.title = "Prayers List";
});
app.controller('addPrayerController', function($scope, PrayerService, UserService, $state){
  $("#menuButton").attr('class', 'backButton'); 
  // save prayer
  var currentUser = UserService.currentLoggedInUser();
  $scope.title = "Add A New Prayer/Praise";
  $scope.master = {};
  $scope.save = function(p) {
    $scope.master = angular.copy(p);
    var newprayer = new Prayer(null, currentUser, p.title, p.description, p.type, null,[],[]);
    // save prayer in backend
    var promise = PrayerService.addPrayer(newprayer);
    promise.then(function(prayer) {
      // navigate back home when done adding
      $state.go("prayerList");
    }, function (error) {
      alert('Failed to load prayer: ' + error);
    });
  };

});
app.controller('prayerDetailController', function($scope, $stateParams, PrayerService, UserService){
  $("#menuButton").attr('class', 'backButton'); 
  $(".loading").show();
  var promise = PrayerService.loadPrayer($stateParams.prayer_id);
  promise.then(function(prayer) {
    $(".loading").hide();
    $scope.prayer = prayer;
  }, function (error) {
    alert('Failed to load prayer: ' + error);
  });
  $scope.addCommentToPrayer = function() {
    comment = new Comment(null,
                          UserService.currentLoggedInUser(),
                          $scope.new_comment);
    prayer = new Prayer($stateParams.prayer_id);
    var promise =
      PrayerService.addCommentToPrayer(prayer, comment);
    promise.then(function(newly_added_comment) {
      $scope.prayer.comments.push(newly_added_comment);
      $scope.new_comment = null; // reset the text box
    }, function(error) {
      alert('Failed to add comment to prayer: ' + error);
    });
  };
});
app.controller('profileController', function($scope, UserService){
  // var img_width = $('#pic_img').width();
  // $('#pic_img').css({'height':img_width+'px'});
  $(".loading").hide();
  $scope.user = UserService.currentLoggedInUser();
  $scope.title = "Profile Page";

});


// models

