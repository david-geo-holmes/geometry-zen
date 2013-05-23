angular.module("app", ['jquery', 'underscore']).run(['$rootScope', 'Models', 'Authentication', ($rootScope, models, auth) ->

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)

  $rootScope.isLoggedIn = () -> models.isLoggedIn()

  $rootScope.loginEnabled = () -> not models.isLoggedIn()

  $rootScope.logout = () -> models.logout()
])
