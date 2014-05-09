angular.module("app").controller 'UserCtrl', ['$rootScope','$scope', '$routeParams', 'GitHub', 'cookie', '$', '_', 'async', ($rootScope, $scope, $routeParams, github, cookie, $, _, async) ->

  EVENT_CATEGORY = "user"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/user')
  ga('send', 'pageview')

  # We'll do this here for now, but it may make sense to do this by resolve(ing) in the routeProvider.
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  loadGists = (callback) ->
    github.getGists token, (err, gists) ->
      if not err
        $scope.gists = _.filter(_.map(gists, (gist) -> {"id": gist.id, "description": gist.description, "html_url": gist.html_url}), (gist) -> true)
      else
        alert("Error retrieving user Gists.")
      callback(err, gists)

  loadRepos = (callback) ->
    github.getUserRepos token, (err, repos) ->
      if not err
        $scope.repos = repos
      else
        alert("Error retrieving user Repositories.")
      callback(err, repos)

  async.parallel([
    (callback) ->
      github.getUser token, (err, user) ->
        if not err
          $scope.user = user
        else
          alert("Error retrieving user profile")
        callback err, user
    (callback) -> loadRepos(callback)
    (callback) -> loadGists(callback)
    ],
    (err, results) ->
  )

  $scope.homeBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active distance-1" else ""

  $scope.userBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active distance-0" else "active distance-0"

  $scope.newGist = () ->
    $('#new-gist-dialog').modal show: true, backdrop: true

  findIndex = (xs, match) ->
    length = xs
    for i in [0..length-1]
      x = xs[i]
      if match(x)
        return x
    return -1

  $scope.deleteGist = (owner, id) ->
    ga('send', 'event', EVENT_CATEGORY, 'deleteGist')
    github.deleteGist token, owner, id, (err, response, status, headers, config) ->
      if not err
        index = findIndex($scope.gists, (gist) -> gist.id is id)
        $scope.gists.splice(index, 1)
      else
        alert("Error deleting gist: #{err}")

  $scope.$on('createdGist', (e, user, gist) -> $scope.gists.push(gist))

  $scope.newRepo = (owner) ->
    $('#new-repo-dialog').modal show: true, backdrop: true

  $scope.deleteRepo = (owner, repo) ->
    ga('send', 'event', EVENT_CATEGORY, 'deleteRepo')
    github.deleteRepo token, owner, repo, (err, response, status, headers, config) ->
      if not err
      else
        alert("Error deleting repo: #{err}")

  $scope.$on('createdRepo', (e, user, repo) -> $scope.repos.push(repo))
]