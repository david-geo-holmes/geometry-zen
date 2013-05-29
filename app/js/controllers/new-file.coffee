angular.module("app").controller 'NewFileCtrl', ['$scope', 'GitHub', 'Base64', 'cookie', '$', '_', '$async', ($scope, github, base64, cookie, $, _, $async) ->
  # We'll do this here for now, but it may make sense to do this by resolve(ing) in the routeProvider.
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  $('#myModal').on 'show', ->
    # Notice that the privacy value has to be set using a string for radio input types.
    $scope.file = name: "", message: ""

  $('#myModal').on 'shown', ->

  $('#myModal').on 'hide', ->

  $('#myModal').on 'hidden', ->

  $scope.onOK = () ->
    # Notice the newline at end of file!
    content = base64.encode("# #{$scope.file.name}\n")
    github.putFile token, $scope.owner.name, $scope.repo.name, $scope.file.name, $scope.file.message, content, undefined, (err, response) ->
      if not err
        file = response.content
        commit = response.commit
        $scope.$emit("commit", $scope.owner, $scope.repo, file, commit)
        $('#myModal').modal('hide')
      else
        messages = _.map(response.errors, (error) -> error.message).join()
        alert(messages)
]