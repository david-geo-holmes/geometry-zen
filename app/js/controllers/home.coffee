angular.module("app").controller 'HomeCtrl', ['$rootScope','$scope', '$http', '$location', '$window', 'GitHubAuthManager', ($rootScope, $scope, $http, $location, $window, authManager) ->

  # Ensure that scrollbars are enabled.
  # This is because we diable them for editing.
  $window.document.body.style.overflow = 'auto'

  EVENT_CATEGORY = "home"
  ga 'create', 'UA-41504069-1', 'geometryzen.org'
  ga 'set', 'page', '/home'
  ga 'send', 'pageview'

  authManager.handleLoginCallback (err, token) ->
    if err
      $window.alert err.message

  $scope.work = ->
    ga 'send', 'event', EVENT_CATEGORY, 'work'
    $location.path "/work"
    return

  $scope.browse = ->
    ga 'send', 'event', EVENT_CATEGORY, 'browse'
    $location.path "/browse"
    return

  $scope.user = ->
    ga 'send', 'event', EVENT_CATEGORY, 'user'
    path = "/users/#{$scope.userLogin()}"
    $location.path path
    return
]