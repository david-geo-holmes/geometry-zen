angular.module("app").controller 'UserCtrl', ['$scope', 'GitHub', 'cookie', '$', '_', '$async', ($scope, github, cookie, $, _, $async) ->
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
      github.getUserRepos token, (err, repos) ->
        if not err
          # $scope.repos = _.filter(repos, (repo) -> repo.language is 'Python')
          $scope.repos = repos
        else
          alert("Error retrieving user repositories")
        callback err, repos
    ],
    (err, results) ->
  )

  $scope.newRepository = () ->
    $('#myModal').modal show: true, backdrop: true
]