angular.module("app").controller 'NewGistCtrl', ['$scope', 'GitHub', 'cookie', '$', '_', ($scope, github, cookie, $, _) ->

  EVENT_CATEGORY = "new-gist"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/new-gist')
  ga('send', 'pageview')

  # We'll do this here for now, but it may make sense to do this by resolve(ing) in the routeProvider.
  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  $('#new-gist-dialog').on 'show', ->
    # Notice that the privacy value has to be set using a string for radio input types.
    $scope.gist = path: "", description: "", "private": "false", markdownReadme: true, pythonReadme: true

  $('#new-gist-dialog').on 'shown', ->

  $('#new-gist-dialog').on 'hide', ->

  $('#new-gist-dialog').on 'hidden', ->

  $scope.createGist = () ->
    ga('send', 'event', EVENT_CATEGORY, 'createGist')
    data = {}
    data.description = $scope.gist.description
    data['public'] = true
    data.files = {"main.py": {"content": "# main.py"}}
    github.postGist token, data, (err, response, status, headers, config) ->
      if not err
        $scope.$emit("createdGist", $scope.user, response)
        $('#new-gist-dialog').modal('hide')
      else
        messages = _.map(response.errors, (error) -> error.message).join()
        alert(messages)
]