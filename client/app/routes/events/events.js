'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('events', {
        url: '^/events',
        templateUrl: 'app/routes/events/events.html',
        controller: 'EventsCtrl', 
        parent: 'home'
      })
      .state('eventAdd', {
        url: '^/event/add',
        templateUrl: 'app/routes/events/saveEvent.html',
        controller: 'SaveEventCtrl',
        parent: 'home'
      })
      .state('eventEdit', {
        url: '^/event/edit/:id',
        templateUrl: 'app/routes/events/saveEvent.html',
        controller: 'SaveEventCtrl',
        parent: 'home'
      });
  });