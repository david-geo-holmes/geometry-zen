app = angular.module("app")

app.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->

  # The home page.
  $routeProvider.when '/',
    templateUrl: 'angular/home.html'
    controller: 'HomeCtrl'

  # The workbench page.
  $routeProvider.when '/workbench',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  # The workbench page for a Gist.
  $routeProvider.when '/gists/:gistId',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  # The workbench page for GitHub Repositories (Embedding Mode).
  $routeProvider.when '/embed/users/:user/repos/:repo/blob/:branch/:step0/:step1/:step2',
    templateUrl: 'angular/embed.html'
    controller: 'EmbedCtrl'

  $routeProvider.when '/embed/users/:user/repos/:repo/blob/:branch/:step0/:step1',
    templateUrl: 'angular/embed.html'
    controller: 'EmbedCtrl'

  $routeProvider.when '/embed/users/:user/repos/:repo/blob/:branch/:step0',
    templateUrl: 'angular/embed.html'
    controller: 'EmbedCtrl'

  # The workbench page for GitHub Repositories.
  $routeProvider.when '/users/:user/repos/:repo/blob/:branch/:step0/:step1/:step2',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  $routeProvider.when '/users/:user/repos/:repo/blob/:branch/:step0/:step1',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  $routeProvider.when '/users/:user/repos/:repo/blob/:branch/:step0',
    templateUrl: 'angular/work.html'
    controller: 'WorkCtrl'

  # The tree page.
  $routeProvider.when '/users/:user/repos/:repo/tree/:branch/:step0/:step1',
    templateUrl: 'angular/tree.html'
    controller: 'TreeCtrl'

  $routeProvider.when '/users/:user/repos/:repo/tree/:branch/:step0',
    templateUrl: 'angular/tree.html'
    controller: 'TreeCtrl'

  $routeProvider.when '/users/:user/repos/:repo/tree/:branch',
    templateUrl: 'angular/tree.html'
    controller: 'TreeCtrl'

  # The user page.
  $routeProvider.when '/users/:user',
    templateUrl: 'angular/user.html'
    controller: 'UserCtrl'

  $routeProvider.otherwise redirectTo: '/'

  $locationProvider.html5Mode(true)
])
