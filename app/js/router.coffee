angular.module("app").config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->

  # The home page
  $routeProvider.when '/',
    templateUrl: 'angular/home.html'
    controller: 'HomeCtrl'

  # The work page
  $routeProvider.when '/users/:user/repos/:repo/blob/:branch/:step0/:step1/:step2',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  $routeProvider.when '/users/:user/repos/:repo/blob/:branch/:step0/:step1',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  $routeProvider.when '/users/:user/repos/:repo/blob/:branch/:step0',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  # The tree page
  $routeProvider.when '/users/:user/repos/:repo/tree/:branch/:step0/:step1',
    templateUrl: 'angular/tree.html'
    controller: 'TreeCtrl'

  $routeProvider.when '/users/:user/repos/:repo/tree/:branch/:step0',
    templateUrl: 'angular/tree.html'
    controller: 'TreeCtrl'

  $routeProvider.when '/users/:user/repos/:repo/tree/:branch',
    templateUrl: 'angular/tree.html'
    controller: 'TreeCtrl'

  # The user page
  $routeProvider.when '/users/:user',
    templateUrl: 'angular/user.html'
    controller: 'UserCtrl'

  # The context-free work page
  $routeProvider.when '/work',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  $routeProvider.otherwise redirectTo: '/'

  $locationProvider.html5Mode(true)
])
