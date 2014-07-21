'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('prayers', {
        url: '/prayers',
        templateUrl: 'app/routes/prayers/prayers.html',
        controller: 'PrayersCtrl'
      });
  });