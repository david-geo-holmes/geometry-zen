providerFunction = ($http) ->
  # these routes are configured in config/server.js
  login: (credentials) -> $http.post('/login', credentials)
  logout: () -> $http.post('/logout')
angular.module("app").factory('AuthenticationService', ['$http', providerFunction])
