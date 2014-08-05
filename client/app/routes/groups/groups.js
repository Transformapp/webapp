'use strict';

angular.module('transformAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('groups', {
        url: '^/groups',
        templateUrl: 'app/routes/groups/groups.html',
        controller: 'GroupsCtrl', 
        parent: 'home'
      })
      .state('groupJoin', {
        url: '^/groups/join/:id',
        templateUrl: 'app/routes/groups/groups.html',
        controller: 'GroupJoinCtrl'
      });
  });