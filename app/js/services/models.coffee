angular.module("app").factory('Models', ['$http', '$window', 'cookie', ($http, $window, cookie) ->

  GATEKEEPER_DOMAIN = "http://localhost:9999"
  GITHUB_TOKEN_COOKIE_NAME = 'oauth-token'

  handleGitHubCallback: (done) ->
    match = $window.location.href.match(/\?code=([a-z0-9]*)/)
    if match
      code = match[1]
      regex = new RegExp("\\?code=#{code}")
      $http.get("#{GATEKEEPER_DOMAIN}/authenticate/#{code}")
      .success (data, status, headers, config) ->
        $window.location.href =$window.location.href.replace(regex, '')
        cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, data.token)
        done(null, data.token)
      .error (data, status, headers, config) ->
        $window.location.href =$window.location.href.replace(regex, '')
        done(new Error("I'm unable to access the authentication Gatekeeper troll. Please accept my apologies on behalf of the twerp."))

  isLoggedIn: () -> cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  logout: () -> cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME)
])
