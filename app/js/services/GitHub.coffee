angular.module("app").factory('GitHub', ['$http', '$', '_', ($http, $, _) ->

  GITHUB_PROTOCOL = 'https'
  GITHUB_DOMAIN = 'api.github.com'

  class User
    constructor: (name, login) ->
      @name = name
      @login = login

  class Repo
    constructor: (name, description, language, github_html_url) ->
      @name = name
      @description = description
      @language = language
      @github_html_url = github_html_url

  getUser: (token, done) ->
    $http(method: 'GET', url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user", headers: Authorization: "token #{token}")
    .success (user, status, headers, config) ->
      done(null, new User(user.name, user.login))
    .error (data, status, headers, config) ->
      done(new Error("Error getting the user profile"))

  getUserRepos: (token, done) ->
    $http(method: 'GET', url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos", headers: Authorization: "token #{token}")
    .success (repos, status, headers, config) ->
      repos = _.map(repos, (repo) -> new Repo(repo.name, repo.description, repo.language, repo.html_url))
      done(null, repos)
    .error (data, status, headers, config) ->
      done(new Error("Error getting the user repositories"))

  getRepoContents: (token, user, repo, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{user}/#{repo}/contents"
    $http("method": 'GET', "url": url, "headers": Authorization: "token #{token}")
    .success (contents, status, headers, config) ->
      done(null, contents)
    .error (data, status, headers, config) ->
      done(new Error("Error getting the contents of the repo with URL #{url}"))

  getPathContents: (token, user, repo, path, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{user}/#{repo}/contents"
    if path
      url = "#{url}/#{path}"
    $http("method": 'GET', "url": url, "headers": Authorization: "token #{token}")
    .success (contents, status, headers, config) ->
      done(null, contents)
    .error (data, status, headers, config) ->
      done(new Error("Error getting the contents of the path with URL #{url}"))

  ###
  The GitHub API uses the same method (PUT) and URL (/repos/:owner/:repo/contents/:path)
  for Creating a file as for updating a file. The key difference is that the update
  requires the blob SHA of the file being replaced. In effect, the existence of the sha
  determines whether the intention is to create a new file or update and existing one.
  ###
  putFile: (token, owner, repo, path, message, content, sha, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents/#{path}"
    data = message: message, content: content
    if sha
      data.sha = sha
    $http(method: 'PUT', url: url, data: data, headers: Authorization: "token #{token}")
    .success (file, status, headers, config) ->
      done(null, file)
    .error (response, status, headers, config) ->
      done(new Error("Error getting the contents of the file"), response)

  deleteFile: (token, owner, repo, path, message, sha, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents/#{path}"
    data = message: message, sha: sha
    $http(method: 'DELETE', url: url, data: data, headers: Authorization: "token #{token}")
    .success (file, status, headers, config) ->
      done(null, file)
    .error (response, status, headers, config) ->
      done(new Error("Error deleting the file"), response)

  postRepo: (token, name, description, priv, autoInit, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos"
    data = name: name, description: description, "private": priv, auto_init: autoInit
    $http(method: 'POST', url: url, data: data, headers: Authorization: "token #{token}")
    .success (repo, status, headers, config) ->
      done(null, repo)
    .error (response, status, headers, config) ->
      done(new Error("Error posting the repository"), response)
])
