constructorFunction = ($scope, $location, AuthenticationService) ->

  $scope.profile =
    name:
      given: ""
      family: ""

  $scope.credentials = 
    username: ""
    password: ""

  onRegisterSuccess = (response) ->
    alert(response.message)
    $location.path('/home')

  $scope.login = () ->
    AuthenticationService.login($scope.credentials).success(onRegisterSuccess)

angular.module("app").controller('SignupController', ['$scope', '$location', 'AuthenticationService', constructorFunction]);
