angular.module("app").factory('Authentication', ['$http', ($http) ->

  successFn = () ->
    console.log "Success"

  errorFn = () ->
    console.log "Error"

  login: () ->

  logout: () ->
])
