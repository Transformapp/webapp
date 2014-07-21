'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('prayers', {
        url: '/prayers',
        templateUrl: 'app/routes/prayers/prayers.html',
        controller: 'PrayersCtrl'
      })
      .state('prayer', {
        url: '/prayer',
        templateUrl: 'app/routes/prayers/prayer.html',
        controller: 'PrayerCtrl'
      })
      .state('addPrayer', {
        url: '/addPrayer',
        templateUrl: 'app/routes/prayers/addPrayer.html',
        controller: 'AddPrayerCtrl'
      });
  });