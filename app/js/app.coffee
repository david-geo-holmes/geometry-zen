angular.module("app", ['async', 'jquery', 'underscore']).run(['$rootScope','$location', 'GitHub', 'cookie', ($rootScope, $location, github, cookie) ->

  GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'github-application-client-id'
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  GITHUB_LOGIN_COOKIE_NAME = 'github-login'

  $rootScope.marketing = name: "Geometry Zen", version: "Genesis"
  # The server drops this cookie so that we can make the GitHub autorization request.
  $rootScope.clientId = -> cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME)

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)

  $rootScope.isLoggedIn = () -> cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.loginEnabled = () -> not cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.logout = () -> cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.username = () -> cookie.getItem(GITHUB_LOGIN_COOKIE_NAME)

  $rootScope.hasFeature = (feature) ->
    switch feature
      when 'gz:feature:examples'
        false
      when 'gz:feature:github'
        true
      when 'gz:feature:real-time-collaboration'
        false
      when 'gz:feature:search'
        false
      else
        alert "hasFeature(#{feature})"
        false
])
