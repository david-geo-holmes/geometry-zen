angular.module("app").config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->

  $routeProvider.when '/',
    templateUrl: 'angular/home.html'
    controller: 'HomeCtrl'

  $routeProvider.when '/workbench/',
    templateUrl: 'angular/workbench.html'
    controller: 'WorkbenchCtrl'

  $routeProvider.when '/browse',
    templateUrl: 'angular/browse.html'
    controller: 'BrowseCtrl'

  $routeProvider.otherwise redirectTo: '/'

  # If you don't do this, your URLs will be contain '#'.
  # But there's also a problem refreshing the browser from the workbench or browse pages.
  # $locationProvider.html5Mode(true)
])
