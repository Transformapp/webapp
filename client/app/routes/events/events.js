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
        templateUrl: 'app/routes/events/addEvent.html',
        controller: 'AddEventCtrl',
        parent: 'home'
      })
      .state('eventEdit', {
        url: '^/event/edit/:id',
        templateUrl: 'app/routes/events/editEvent.html',
        controller: 'EditEventCtrl',
        parent: 'home'
      });
  });