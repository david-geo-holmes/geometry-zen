angular.module("app", ['async', 'jquery', 'underscore']).run(['$rootScope','$location', 'GitHub', 'Authentication', ($rootScope, $location, github, auth) ->

  $rootScope.user = 
    name: "Dav Hol"
    login: "d-g-h"

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)

  $rootScope.isLoggedIn = () -> github.isLoggedIn()

  $rootScope.loginEnabled = () -> not github.isLoggedIn()

  $rootScope.logout = () -> github.logout()

  $rootScope.username = () -> github.username()
])
