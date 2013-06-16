angular.module("app").factory('GitHub', ['$http', ($http) ->

  GITHUB_PROTOCOL = 'https'
  GITHUB_DOMAIN = 'api.github.com'
  HTTP_METHOD_DELETE = 'DELETE'
  HTTP_METHOD_GET = 'GET'
  HTTP_METHOD_POST = 'POST'
  HTTP_METHOD_PUT = 'PUT'

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
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_GET, url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user", headers: headers)
    .success (user, status, headers, config) ->
      done(null, new User(user.name, user.login), status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getUserRepos: (token, done) ->
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_GET, url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos", headers: headers)
    .success (repos, status, headers, config) ->
      repos = _.map(repos, (repo) -> new Repo(repo.name, repo.description, repo.language, repo.html_url))
      done(null, repos, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getRepoContents: (token, user, repo, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{user}/#{repo}/contents"
    $http("method": HTTP_METHOD_GET, "url": url, "headers": Authorization: "token #{token}")
    .success (contents, status, headers, config) ->
      done(null, contents, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getPathContents: (token, user, repo, path, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{user}/#{repo}/contents"
    if path
      url = "#{url}/#{path}"
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http("method": HTTP_METHOD_GET, "url": url, "headers": headers)
    .success (contents, status, headers, config) ->
      done(null, contents, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

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
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_PUT, url: url, data: data, headers: headers)
    .success (file, status, headers, config) ->
      done(null, file, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  deleteFile: (token, owner, repo, path, message, sha, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents/#{path}"
    data = message: message, sha: sha
    $http(method: HTTP_METHOD_DELETE, url: url, data: data, headers: Authorization: "token #{token}")
    .success (file, status, headers, config) ->
      done(null, file, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  postRepo: (token, name, description, priv, autoInit, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos"
    data = name: name, description: description, "private": priv, auto_init: autoInit
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_POST, url: url, data: data, headers: headers)
    .success (repo, status, headers, config) ->
      done(null, repo, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)
])
