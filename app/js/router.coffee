configFn = ($routeProvider) ->

  $routeProvider.when '/home',
    templateUrl: 'angular/home.html'
    controller: 'HomeController'

  $routeProvider.when '/login',
    templateUrl: 'angular/login.html'
    controller: 'LoginController'

  $routeProvider.when '/signup',
    templateUrl: 'angular/signup.html'
    controller: 'SignupController'

  $routeProvider.when '/editor',
    templateUrl: 'angular/editor.html'
    controller: 'EditorController'

  $routeProvider.when '/projects',
    templateUrl: 'angular/projects.html'
    controller: 'ProjectsController'

  $routeProvider.otherwise redirectTo: '/home'

angular.module("app").config(['$routeProvider', configFn])
