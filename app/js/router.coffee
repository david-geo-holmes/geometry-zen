angular.module("app").config(['$routeProvider', ($routeProvider) ->

  $routeProvider.when '/home',
    templateUrl: 'angular/home.html'
    controller: 'HomeController'

  $routeProvider.when '/workbench',
    templateUrl: 'angular/workbench.html'
    controller: 'WorkbenchController'

  $routeProvider.when '/browse',
    templateUrl: 'angular/browse.html'
    controller: 'BrowseController'

  $routeProvider.otherwise redirectTo: '/home'
])
