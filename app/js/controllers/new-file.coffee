angular.module("app").controller 'NewFileCtrl', ['$scope', 'GitHub', 'Base64', 'cookie', '$', '_', '$async', ($scope, github, base64, cookie, $, _, $async) ->

  EVENT_CATEGORY = "new-file"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/new-file')
  ga('send', 'pageview')

  # We'll do this here for now, but it may make sense to do this by resolve(ing) in the routeProvider.
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  $('#new-file-dialog').on 'show', ->
    $scope.file = name: "", message: ""

  $('#new-file-dialog').on 'shown', ->

  $('#new-file-dialog').on 'hide', ->

  $('#new-file-dialog').on 'hidden', ->

  $scope.createFile = () ->
    ga('send', 'event', EVENT_CATEGORY, 'createFile')
    # Notice the newline at end of file to keep GitHub happy!
    content = base64.encode("# #{$scope.file.name}\n")
    github.putFile token, $scope.user.login, $scope.repo.name, $scope.file.name, $scope.file.message, content, undefined, (err, response) ->
      if not err
        console.log "response: #{JSON.stringify(response, null, 2)}"
        $scope.$emit("createdFile", $scope.user, $scope.repo, response.content, response.commit)
        $('#new-file-dialog').modal('hide')
      else
        messages = _.map(response.errors, (error) -> error.message).join()
        alert(messages)
]