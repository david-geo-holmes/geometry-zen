angular.module("app").factory('Authentication', ['$http', ($http) ->
  
  authenticated: false

  login: () ->
    authenticated = true

  logout: () ->
    authenticated = false
])
