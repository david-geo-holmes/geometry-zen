angular.module("app").controller('HomeCtrl', ['$rootScope','$scope', '$http', '$location', '$window', 'GitHub','cookie', ($rootScope, $scope, $http, $location, $window, github, cookie) ->

  GATEKEEPER_DOMAIN = "http://localhost:9999"
  # TODO: This symbolic constant also appears in the GitHub service (DRY).
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  GITHUB_LOGIN_COOKIE_NAME = 'github-login'

  # Trap callback from GitHub. Note that the HTTP call is actually asynchronous.
# match = $location.path().match(/\?code=([a-z0-9]*)/)
  match = $window.location.href.match(/\?code=([a-z0-9]*)/)
  if match
    # We've scraped the code from the URL so let's clear the URL now, synchronously.
    # If we wait till later and do it in an async callback then it will not change. 
    $location.search({})
    code = match[1]
    # regex = new RegExp("\\?code=#{code}")
    # Using the Gatekeeper a proxy, exchange the session code for an auth token.
    # Note: The token should be treated like a password.
    # Therefore, the communication with the Gatekeeper should be secure and
    # the token should not be left laying around in cookies or local storage.
    # e.g use HTTPS and set the "secure" flag on auth cookies.
    $http.get("#{GATEKEEPER_DOMAIN}/authenticate/#{code}")
    .success (data, status, headers, config) ->
      # Here we chop of the extra, but we could go fetch the user using the auth token then
      # redirect to our own /users/:username.
      # Also, lets not have the library making the decision.
      token = data.token
      # TODO: We should at least make this a secure token or something.
      # Currently, setting the cookie item is used to record the authentication state.
      cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token)
      # Here is the second asynchronous request.
      github.getUser token, (error, user) ->
        if not error
          cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login)
        else
          # Note, we do have the auth token so it could be that we don't actually need the username.
          alert("Error retrieving your username!")
        return
      return
    .error (data, status, headers, config) ->
      alert("Something is rotten in Denmark.")
      return

  $scope.workbench = ->
    $location.path('/workbench')
    return

  $scope.browse = ->
    $location.path('/browse')
    return
])