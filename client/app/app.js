'use strict';

function parseInit() {
  Parse.$ = jQuery;
    
  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("tK9bW3HzysojL4fxbjjj2H1zCT81JuyW1s6x02Vr",
                   "ZiGuizOBCP3JK8TKqHhnWzzQLhO6Ym9iJOFJWP2F");
}

var currentGroupId = 'ONaVZYN95k';

angular.module('transformAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule',
  'shoppinpal.mobile-menu'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/auth');

    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, $state, $spMenu, localStorageService, UserService, GroupService) {
    parseInit();
    $spMenu.hide();
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.restrict) {
        // set previous state
        if( fromState.name == "" ){
          $rootScope.previousState = "auth"
        }
        else{
          $rootScope.previousState = fromState.name;
        }
        $rootScope.currentUser = UserService.currentLoggedInUser();
        if (!$rootScope.currentUser) {
          event.preventDefault();
          $state.go("auth");
        }
      }
    });
    GroupService.loadGroup(currentGroupId).then(function(group) {
      localStorageService.set(currentGroupId, group);
      group.users.forEach(function(user) {
        localStorageService.set(user.id, user);
      });
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