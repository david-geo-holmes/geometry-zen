angular.module("app").config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->

  $routeProvider.when '/',
    templateUrl: 'angular/home.html'
    controller: 'HomeCtrl'

  $routeProvider.when '/workbench',
    templateUrl: 'angular/workbench.html'
    controller: 'WorkbenchCtrl'

  $routeProvider.when '/browse',
    templateUrl: 'angular/browse.html'
    controller: 'BrowseCtrl'

#  $routeProvider.when '/callback',
#    templateUrl: 'angular/callback.html'
#    controller: 'CallbackCtrl'

  $routeProvider.when '/users/:username',
    templateUrl: 'angular/user.html'
    controller: 'UserCtrl'

  $routeProvider.otherwise redirectTo: '/'

  $locationProvider.html5Mode(true)
])
