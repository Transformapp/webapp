'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '^/profile',
        templateUrl: 'app/routes/profile/profile.html',
        controller: 'ProfileCtrl', 
        parent: 'home'
      });
  });