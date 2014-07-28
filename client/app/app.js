'use strict';

function parseInit() {
  Parse.$ = jQuery;
  Parse.initialize("tK9bW3HzysojL4fxbjjj2H1zCT81JuyW1s6x02Vr",
                   "ZiGuizOBCP3JK8TKqHhnWzzQLhO6Ym9iJOFJWP2F");
}

function facebookInit() {
  window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
      appId      : '1439344516345455', // Facebook App ID
      channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File (todo: need to update this later)
      cookie     : true, // enable cookies to allow Parse to access the session
      xfbml      : true  // parse XFBML
    });
  };

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

var currentGroupId = 'ONaVZYN95k';

angular.module('transformAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule',
  'snap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/auth');

    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, $state, localStorageService, UserService, GroupService) {
    parseInit();
    facebookInit();

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      // always default previous state to auth
      if(fromState.name == "" ) {
        $rootScope.previousState = "auth"
      }
      else {
        $rootScope.previousState = fromState.name;
      }
    });

    // optimistically load and cache group information on load
    GroupService.loadGroup(currentGroupId).then(function(group) {
      localStorageService.set(currentGroupId, group);
      group.users.forEach(function(user) {
        localStorageService.set(user.id, user);
      });
    }, function(error) {
      alert('Failed to load all users: ' + error);
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if(toState.name == "prayer" || toState.name == "prayersAdd"){
        $rootScope.snapOptions = {
            touchToDrag:false,
            disable: 'left'
        };
      }
      else{
        $rootScope.snapOptions = {
            touchToDrag:false,
            disable: 'none'
        };
      }
    });
  });