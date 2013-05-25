angular.module("app").factory('GitHub', ['$http', '$', '_', ($http, $, _) ->

  GITHUB_PROTOCOL = 'https'
  GITHUB_DOMAIN = 'api.github.com'

  class User
    constructor: (name, login) ->
      @name = name
      @login = login

  class Repo
    constructor: (name, description, language) ->
      @name = name
      @description = description
      @language = language

  getUser: (token, done) ->
    $http(method: 'GET', url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user", headers: Authorization: "token #{token}")
    .success (user, status, headers, config) ->
      done(null, new User(user.name, user.login))
    .error (data, status, headers, config) ->
      done(new Error("Something is rotten in Denmark"))

  getUserRepos: (token, done) ->
    $http(method: 'GET', url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos", headers: Authorization: "token #{token}")
    .success (repos, status, headers, config) ->
      console.log JSON.stringify(repos[0], undefined, 2)
      repos = _.map(repos, (repo) -> new Repo(repo.name, repo.description, repo.language))
      done(null, repos)
    .error (data, status, headers, config) ->
      done(new Error("Something is rotten in Denmark"))
])
