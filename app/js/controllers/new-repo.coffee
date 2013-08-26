angular.module("app").controller 'NewRepoCtrl', ['$scope', 'GitHub', 'cookie', '$', '_', ($scope, github, cookie, $, _) ->

  EVENT_CATEGORY = "new-repo"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/new-repo')
  ga('send', 'pageview')

  # We'll do this here for now, but it may make sense to do this by resolve(ing) in the routeProvider.
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  $('#new-repo-dialog').on 'show', ->
    # Notice that the privacy value has to be set using a string for radio input types.
    $scope.repo = path: "", description: "", "private": "false", markdownReadme: true, pythonReadme: true

  $('#new-repo-dialog').on 'shown', ->

  $('#new-repo-dialog').on 'hide', ->

  $('#new-repo-dialog').on 'hidden', ->

  $scope.createRepo = () ->
    ga('send', 'event', EVENT_CATEGORY, 'createRepo')
    github.postRepo token, $scope.repo.name, $scope.repo.description, false, $scope.repo.markdownReadme, (err, repo) ->
      if not err
        $scope.$emit("createdRepo", $scope.user, repo)
        $('#new-repo-dialog').modal('hide')
      else
        messages = _.map(response.errors, (error) -> error.message).join()
        alert(messages)
]