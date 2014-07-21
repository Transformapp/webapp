'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('events', {
        url: '/events',
        templateUrl: 'app/routes/events/events.html',
        controller: 'EventsCtrl'
      });
  });