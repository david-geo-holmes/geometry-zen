angular.module("app").factory('Models', ['$window', '$http', 'docCookies', ($window, $http, docCookies) ->

  GITHUB_TOKEN_COOKIE_NAME = 'GitHub-OAuth-token'

  authenticate: () ->
    if docCookies.has(GITHUB_TOKEN_COOKIE_NAME)
      $window.authenticated = true
      return true
    match = $window.location.href.match(/\?code=([a-z0-9]*)/)
    if match
      code = match[1]
      $http.get("http://localhost:9999/authenticate/#{code}")
      .success (data, status, headers, config) ->
        $window.authenticated = true
        docCookies.set(GITHUB_TOKEN_COOKIE_NAME, data.token)
        regex = new RegExp("\\?code=#{code}")
        redirectTo = $window.location.href.replace(regex, '').replace('&state=', '')
        $window.location.href = redirectTo;

      .error () ->
        $window.authenticated = false
        console.log "error"

  logout: () ->
    $window.authenticated = false;
    docCookies.unset(GITHUB_TOKEN_COOKIE_NAME)
])
