angular.module("app", ['async', 'jquery', 'underscore']).run(['$rootScope','$location', 'GitHub', 'cookie', ($rootScope, $location, github, cookie) ->

  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  GITHUB_LOGIN_COOKIE_NAME = 'github-login'

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)

  $rootScope.isLoggedIn = () -> cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.loginEnabled = () -> not cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.logout = () -> cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.username = () -> cookie.getItem(GITHUB_LOGIN_COOKIE_NAME)
])
