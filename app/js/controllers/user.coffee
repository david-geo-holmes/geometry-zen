angular.module("app").controller 'UserCtrl', ['$rootScope','$scope', 'GitHub', 'cookie', '$', '_', '$async', ($rootScope, $scope, github, cookie, $, _, $async) ->

  EVENT_CATEGORY = "user"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/user')
  ga('send', 'pageview')

  # We'll do this here for now, but it may make sense to do this by resolve(ing) in the routeProvider.
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  $async.parallel([
    (callback) ->
      github.getUser token, (err, user) ->
        if not err
          $scope.user = user
        else
          alert("Error retrieving user profile")
        callback err, user
    (callback) ->
      # We're getting my repos, but we should be URL-driven by the user.
      github.getUserRepos token, (err, repos) ->
        if not err
          $scope.repos = _.filter(repos, (repo) -> repo.language is 'Python')
        else
          alert("Error retrieving user repositories")
        callback err, repos
    ],
    (err, results) ->
  )

  $scope.homeBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active distance-1" else ""

  $scope.userBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active distance-0" else "active distance-0"

  $scope.newRepo = () ->
    $('#new-repo-dialog').modal show: true, backdrop: true

  $scope.$on 'createdRepo', (e, user, repo) ->
    $scope.repos.push(repo)
    # TODO: Should we navigate to the new repository?
]