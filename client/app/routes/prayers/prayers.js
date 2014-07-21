'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('prayers', {
        url: '/prayers',
        templateUrl: 'app/routes/prayers/prayers.html',
        controller: 'PrayersCtrl',
        restrict: {
          type: 'User'
        }
      })
      .state('prayer', {
        url: '/prayer/:prayerId',
        templateUrl: 'app/routes/prayers/prayer.html',
        controller: 'PrayerCtrl',
        restrict: {
          type: 'User'
        }
      })
      .state('addPrayer', {
        url: '/addPrayer',
        templateUrl: 'app/routes/prayers/addPrayer.html',
        controller: 'AddPrayerCtrl',
        restrict: {
          type: 'User'
        }
      });
  });