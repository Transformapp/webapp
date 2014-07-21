'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: 'app/routes/auth/auth.html',
        controller: 'AuthCtrl'
      });
  });