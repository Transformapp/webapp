'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('prayers', {
        url: '^/prayers',
        templateUrl: 'app/routes/prayers/prayers.html',
        controller: 'PrayersCtrl', 
        parent: 'home'
      })
      .state('prayer', {
        url: '^/prayer/:prayerId',
        templateUrl: 'app/routes/prayers/prayer.html',
        controller: 'PrayerCtrl', 
        parent: 'home'
      })
      .state('prayersAdd', {
        url: '^/prayers/add',
        templateUrl: 'app/routes/prayers/addPrayer.html',
        controller: 'AddPrayerCtrl', 
        parent: 'home'
      });
  });