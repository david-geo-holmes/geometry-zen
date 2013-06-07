angular.module("app").config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->

  $routeProvider.when '/',
    templateUrl: 'angular/home.html'
    controller: 'HomeCtrl'

  $routeProvider.when '/work',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  $routeProvider.when '/browse',
    templateUrl: 'angular/browse.html'
    controller: 'BrowseCtrl'

  $routeProvider.when '/users/:owner/repos/:repo',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  $routeProvider.when '/users/:username',
    templateUrl: 'angular/user.html'
    controller: 'UserCtrl'

  $routeProvider.otherwise redirectTo: '/'

  $locationProvider.html5Mode(true)
])
