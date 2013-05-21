cb = ($scope, $location, AuthenticationService) ->
  
  $scope.title = "Home";

  onLogoutSuccess = (response) ->
    alert(response.message)
    $location.path('/login')

  $scope.login = () -> $location.path('/login')

  $scope.signup = () -> $location.path('/signup')

  $scope.logout = () -> AuthenticationService.logout().success(onLogoutSuccess)

  $scope.editor = () -> $location.path('/editor')

  $scope.projects = () -> $location.path('/projects')

angular.module("app").controller('HomeController', ['$scope', '$location', 'AuthenticationService', cb])