angular.module("app").controller 'NewFileCtrl', ['$scope', 'GitHub', 'Base64', 'cookie', '$', '_', ($scope, github, base64, cookie, $, _) ->

  EVENT_CATEGORY = "new-file"
  ga('create', 'UA-41504069-1', 'geometryzen.org')
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
    path = if $scope.path then "#{$scope.path}/#{$scope.file.name}" else $scope.file.name
    github.putFile token, $scope.user.login, $scope.repo.name, path, $scope.file.message, content, undefined, (err, response, status, headers, config) ->
      if not err
        $scope.$emit("createdFile", $scope.user, $scope.repo, response.content, response.commit)
        $('#new-file-dialog').modal('hide')
      else
        messages = _.map(response.errors, (error) -> error.message).join()
        alert(messages)
]