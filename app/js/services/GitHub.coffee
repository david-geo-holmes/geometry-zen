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
      done(new Error("Error getting the user profile"))

  getUserRepos: (token, done) ->
    $http(method: 'GET', url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos", headers: Authorization: "token #{token}")
    .success (repos, status, headers, config) ->
      repos = _.map(repos, (repo) -> new Repo(repo.name, repo.description, repo.language))
      done(null, repos)
    .error (data, status, headers, config) ->
      done(new Error("Error getting the user repositories"))

  getContentsOfRepoByOwner: (token, owner, repo, done) ->
    $http(method: 'GET', url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents", headers: Authorization: "token #{token}")
    .success (contents, status, headers, config) ->
      done(null, contents)
    .error (data, status, headers, config) ->
      done(new Error("Error getting the contents of the repo"))

  getFile: (token, owner, repo, path, done) ->
    $http(method: 'GET', url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents/#{path}", headers: Authorization: "token #{token}")
    .success (file, status, headers, config) ->
      done(null, file)
    .error (data, status, headers, config) ->
      done(new Error("Error getting the contents of the file"))

  putFile: (token, owner, repo, path, message, content, sha, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents/#{path}"
    data = message: message, content: content, sha: sha
    $http(method: 'PUT', url: url, data: data, headers: Authorization: "token #{token}")
    .success (file, status, headers, config) ->
      done(null, file)
    .error (data, status, headers, config) ->
      done(new Error("Error getting the contents of the file"))

  postRepoForAuthenticatedUser: (token, name, description, priv, autoInit, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos"
    data = name: name, description: description, "private": priv, auto_init: autoInit
    $http(method: 'POST', url: url, data: data, headers: Authorization: "token #{token}")
    .success (response, status, headers, config) ->
      done(null, response)
    .error (data, status, headers, config) ->
      done(new Error("Error posting the repository"), data)
])
