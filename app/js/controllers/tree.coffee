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
    github.getPathContents token, $scope.user.login, $scope.repo.name, $scope.path, (err, items) ->
      if not err
        $scope.contextItem.childItems = items
      else
        alert("Error retrieving path contents")
  else
    $scope.contextItem.name = ""
    $scope.contextItem.type = undefined

  $scope.newFile = () ->
    ga('send', 'event', EVENT_CATEGORY, 'newFile')
    $('#new-file-dialog').modal show: true, backdrop: true

  $scope.$on 'createdFile', (e, user, repo, item, commit) ->
    console.log "tree receiving createdFile message"
    $scope.contextItem.childItems.push(item)

  # This is the save event handler for an existing page, as evident by the provision of the SHA.
  $scope.save = () ->
    ga('send', 'event', EVENT_CATEGORY, 'savePage')

  $scope.deleteItem = (idx) ->
    ga('send', 'event', EVENT_CATEGORY, 'deleteItem')
    childItem = $scope.contextItem.childItems[idx]
    github.deleteFile token, $scope.user.login, $scope.repo.name, childItem.path, "Delete item.", childItem.sha, (err, response) ->
      if not err
        $scope.contextItem.childItems.splice(idx, 1)
      else
        alert("Error deleting item: #{err}")

  $scope.homeBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active" else ""

  $scope.userBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active" else ""

  $scope.repoBreadcrumbClass = () ->
    if $rootScope.breadcrumbStrategy.progressive then "active" else (if $scope.workEnabled() then "" else "active")

  $scope.repoEnabled = () ->
    return $scope.repo and $scope.repo.name

  $scope.workEnabled = () ->
    return ($scope.contextItem and $scope.contextItem.type is "file") or not ($scope.repo and $scope.repo.name)

  $scope.saveEnabled = () ->
    return $scope.contextItem and $scope.contextItem.type is "file"

  $scope.runEnabled = () ->
    return $scope.workEnabled()

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