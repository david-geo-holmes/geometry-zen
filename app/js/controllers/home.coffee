angular.module("app").controller('HomeCtrl', ['$scope', '$location', 'Models','cookie', ($scope, $location, models, cookie) ->

  # The controller scope is instantiated for each page load.
  models.handleGitHubCallback (err, token) ->
    if err
      alert err.message

  $scope.workbench = () -> $location.path('/workbench')

  $scope.browse = () -> $location.path('/browse')
])