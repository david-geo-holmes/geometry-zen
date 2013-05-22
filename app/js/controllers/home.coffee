angular.module("app").controller('HomeController', ['$scope', '$location', 'Models', ($scope, $location, models) ->

  # The controller scope is instantiated for each page load.
  $scope.anonymous = not models.authenticate()

  $scope.workbench = () -> $location.path('/workbench')

  $scope.browse = () -> $location.path('/browse')
])