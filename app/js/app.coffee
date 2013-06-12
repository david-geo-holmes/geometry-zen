angular.module("app", ['async', 'jed', 'jquery', 'underscore']).run(['$rootScope','$location', 'GitHub', 'cookie', 'i18n', ($rootScope, $location, github, cookie, i18n) ->

  GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'github-application-client-id'
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  GITHUB_LOGIN_COOKIE_NAME = 'github-login'

  $rootScope.marketing =
    name: "Geometry Zen"
    version: "Hydrogen"
    tagLine: "Looking at the multiverse from a Geometric Algebra perspective"
    Repos: i18n.translate("Repo").ifPlural(2, "Repos").fetch()

  $rootScope.i18n = i18n
  $rootScope.breadcrumbStrategy = progressive: false

  # The server drops this cookie so that we can make the GitHub autorization request.
  $rootScope.clientId = () -> cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME)

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)

  $rootScope.isLoggedIn = () -> cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.loginEnabled = () -> not cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.logout = () ->
    cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME)
    cookie.removeItem(GITHUB_LOGIN_COOKIE_NAME)

  $rootScope.username = () -> cookie.getItem(GITHUB_LOGIN_COOKIE_NAME)
])
