angular.module("app").factory('GitHub', ['$http', '$window', '$location', 'cookie', '$', ($http, $window, $location, cookie, $) ->

  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  GITHUB_LOGIN_COOKIE_NAME = 'github-login'

  getUser: (token, done) ->
    $.ajax(
      type: 'GET'
      url: 'https://api.github.com/user'
      dataType: 'json'
      contentType: 'application/x-www-form-urlencoded'
      headers: Authorization: "token #{token}"
      success: (user) ->
        # There's lots of other stuff that we might want to cache, but for now just keep the username.
        done(null, {name: user.name, login: user.login})
      error: (err) ->
        done(new Error("I'm sorry Dave..."))
    )

  isLoggedIn: () -> cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME)

  logout: () -> cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME)

  username: () -> cookie.getItem(GITHUB_LOGIN_COOKIE_NAME)
])
