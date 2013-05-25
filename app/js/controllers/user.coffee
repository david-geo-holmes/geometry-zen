angular.module("app").controller('UserCtrl', ['$scope', 'GitHub', 'cookie', '_', ($scope, github, cookie, _) ->
  # We'll do this here for now, but it may make sense to do this by resolve(ing) in the routeProvider.
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  github.getUserRepos token, (error, repos) ->
    if not error
      $scope.repos = _.filter(repos, (repo) -> repo.language is 'Python')
    else
      alert("Error retrieving your repositories!")
    return
  return
])