// initialize webapp module
angular.module('transformApp', [])

// routing logic
angular.module('transformApp')
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'homeController',
    templateUrl: 'client/views/home.html'
  })
  .when('/groups/:id', {
    controller: 'groupLogisticsController',
    templateUrl: 'client/views/groupLogistics.html'
  })
  .when('/prayers', {
    controller: 'prayerListController',
    templateUrl: 'client/views/prayerList.html'
  })
  .when('/prayers/:id', {
    controller: 'prayerDetailController',
    templateUrl: 'client/views/prayerDetail.html'
  })
  .when('/profile', {
    controller: 'profileController',
    templateUrl: 'client/views/profile.html'
  })
  .otherwise({
    redirectTo: '/'
  });
})



// controllers
angular.module('transformApp').controller('homeController', function($scope){
  // add code
});
angular.module('transformApp').controller('groupLogisticsController', function($scope){
  // add code
});

angular.module('transformApp').controller('prayerListController', function($scope){
  // add code
});

angular.module('transformApp').controller('prayerDetailController', function($scope){
  // add code
});

angular.module('transformApp').controller('profileController', function($scope){
  // add code
});


// models

