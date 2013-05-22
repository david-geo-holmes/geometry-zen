angular.module("app", ['underscore']).run(['$rootScope', 'Models', ($rootScope, models) ->

  $rootScope.anonymous = true

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)

  $rootScope.login = (authenticate) ->
    if (authenticate)
      models.authenticate()
    else
      models.logout()
    $rootScope.anonymous = not authenticate
])
