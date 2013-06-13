angular.module("app").controller 'TreeCtrl', ['$rootScope','$scope', '$window', '$routeParams', '$', '_', 'GitHub', 'Base64', 'cookie', ($rootScope, $scope, $window, $routeParams, $, _, github, base64, cookie) ->

  EVENT_CATEGORY = "tree"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/tree')
  ga('send', 'pageview')

  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  # A message object has name, text and severity (error, warning, info, success)
  $scope.messages = []

  $('.carousel').carousel({interval: false})

  # I think the router can do the leg-work and decouple us from URL knowledge?
  $scope.contextItem = {}
  if ($routeParams.user and $routeParams.repo)
    $scope.user = login: $routeParams.user
    $scope.repo = name: $routeParams.repo
    $scope.branch = name: $routeParams.branch
    steps = []
    for n in [0..6]
      if $routeParams["step#{n}"]
        steps.push($routeParams["step#{n}"])
    $scope.path = steps.join("/")

    $scope.contextItem.name = $scope.repo.name
    $scope.contextItem.type = "repo"
    # TODO: We are already on this page if this call fails. We should try to do this access in the router?
    # TODO: This call uses etag. Can we use that to minimize network traffic?
    github.getPathContents token, $scope.user.login, $scope.repo.name, $scope.path, (err, response, status, headers, config) ->
      if not err
        # status is 2xx
        # console.log "err: #{err}, response: #{JSON.stringify(response, null, 2)}, status: #{status}, headers: #{JSON.stringify(headers(), null, 2)}, config: #{JSON.stringify(config, null, 2)}"
        $scope.contextItem.childItems = response
      else
        # TODO: Log this message to analytics as an exception.
        # status may be 401, 403
        console.log "err: #{err}, response: #{JSON.stringify(response, null, 2)}, status: #{status}, headers: #{JSON.stringify(headers(), null, 2)}, config: #{JSON.stringify(config, null, 2)}"
        alert "#{err.message}. Cause: #{response.message}."
  else
    $scope.contextItem.name = ""
    $scope.contextItem.type = undefined

  $scope.isNewFileEnabled = () ->
    # TODO: Rename so that the context and authenticated user are clearer.
    return $scope.isLoggedIn() and $scope.userLogin() is $scope.user.login

  $scope.newFile = () ->
    if $scope.isNewFileEnabled()
      $('#new-file-dialog').modal show: true, backdrop: true
    else
      alert "Create a New File is not enabled."

  $scope.$on 'createdFile', (e, user, repo, item, commit) ->
    $scope.contextItem.childItems.push(item)

  $scope.isDeleteItemEnabled = () ->
    # TODO: Rename so that the context and authenticated user are clearer.
    return $scope.isLoggedIn() and $scope.userLogin() is $scope.user.login

  $scope.deleteItem = (idx) ->
    ga('send', 'event', EVENT_CATEGORY, 'deleteItem')
    childItem = $scope.contextItem.childItems[idx]
    github.deleteFile token, $scope.user.login, $scope.repo.name, childItem.path, "Delete item.", childItem.sha, (err, response, status, headers, config) ->
      if not err
        $scope.contextItem.childItems.splice(idx, 1)
      else
        alert("Error deleting item: #{err}")

  $scope.homeBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active" else ""

  $scope.userBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active" else ""

  $scope.repoBreadcrumbClass = () ->
    return "active"

  # Compute the href for the item specified.
  $scope.hrefFromItem = (item) ->
    collectionName = if item.type is "file" then "blob" else (if item.type is "dir" then "tree" else "unknown")
    return "/users/#{$scope.user.login}/repos/#{$scope.repo.name}/#{collectionName}/#{$scope.branch.name}/#{item.path}"

  # convert from the GitHub content.type ("file" or "dir") to the locale-independent icon.
  # i18n will then take care of localization.
  $scope.iconFromItem = (item) ->
    switch item.type
      when "file"
        return "icon-page"
      when "dir"
        return "icon-book"
      else
        return "icon-question"

  return
]