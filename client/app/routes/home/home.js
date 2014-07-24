'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/routes/home/home.html',
        controller: 'HomeCtrl',
        restrict: {
          type: 'User'
        }
      });
  });