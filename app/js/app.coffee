app = angular.module("app", ['async', 'jed', 'jquery', 'underscore'])

app.run(['$rootScope', '$window' , '$location', 'cookie', 'i18n', ($rootScope, $window, $location, cookie, i18n) ->

  GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'github-application-client-id'
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  GITHUB_LOGIN_COOKIE_NAME = 'github-login'

  $rootScope.i18n = i18n
  $rootScope.breadcrumbStrategy = progressive: false

  # The server drops this cookie so that we can make the GitHub autorization request.
  $rootScope.clientId = () -> cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME)

  $rootScope.log = (thing) ->

  $rootScope.alert = (thing) ->
    alert(thing)

  $rootScope.isLoggedIn = () -> cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.loginEnabled = () -> not cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  $rootScope.logout = () ->
    # console.log "logout"
    cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME)
    cookie.removeItem(GITHUB_LOGIN_COOKIE_NAME)

  $rootScope.login = () ->
    # console.log "login"
    clientId = cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME)
    $window.location.href = "https://github.com/login/oauth/authorize?client_id=#{clientId}&amp;scope=repo,user,gist"

  $rootScope.userLogin = () -> cookie.getItem(GITHUB_LOGIN_COOKIE_NAME)

  $rootScope.headerEnabled = () -> true

  isMenuLocation = () ->
    if $window.location and $window.location.href
      # Note: The $ isn't a typo - it means there is nothing more.
      return not $window.location.href.match(new RegExp("/workbench$")) and
             not $window.location.href.match(new RegExp("/users/")) and
             not $window.location.href.match(new RegExp("/gists/"))
    else
      return false

  $rootScope.isHomePage = () -> true

  $rootScope.jumpIcon = () -> if isMenuLocation() then "icon-edit" else "icon-home"
  $rootScope.jumpText = () -> if isMenuLocation() then "Workbench" else "Home"
  $rootScope.jumpHRef = () -> if isMenuLocation() then "/workbench" else "/"
])
