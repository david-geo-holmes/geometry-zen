angular.module("app").controller('HomeController', ['$scope', '$location', 'Authentication', ($scope, $location, authentication) ->

  $scope.workbench = () -> $location.path('/workbench')

  $scope.browse = () -> $location.path('/browse')

  $scope.login = () -> authentication.login()

  $scope.logout = () -> authentication.logout()
])