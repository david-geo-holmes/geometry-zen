angular.module("app").controller 'WorkCtrl', ['$rootScope','$scope', '$location', '$window', '$routeParams', '$', '_', 'GitHub', 'Base64', 'cookie', 'GitHubAuthManager', ($rootScope, $scope, $location, $window, $routeParams, $, _, github, base64, cookie, authManager) ->

  endsWith = (str, suffix) ->
    if str and suffix
      return str.length > 0 and str.substring(str.length-suffix.length, str.length) is suffix
    else
      return false

  isCoffee = (path) ->
    return endsWith(path, '.coffee')

  isHTML = (path) ->
    return endsWith(path, '.html')

  isJS = (path) ->
    return endsWith(path, '.js')

  isJSON = (path) ->
    return endsWith(path, '.json')

  isMarkDown = (path) ->
    return endsWith(path, '.md')

  isPython = (path) ->
    return endsWith(path, '.py')

  EVENT_CATEGORY = "work"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/work')
  ga('send', 'pageview')

  authManager.handleLoginCallback (err, token) ->
    if err
      $window.alert err.message

  editor = ace.edit("editor")
  editor.setTheme("ace/theme/twilight")
  editor.getSession().setMode "ace/mode/python"
  editor.getSession().setTabSize 4
  editor.setShowInvisibles(true)
  editor.setFontSize(15)
  editor.setShowPrintMargin false

  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  # A message object has name, text and severity (error, warning, info, success)
  $scope.messages = []

  $scope.contextItem = {}
  $scope.contextGist = {}
  if ($routeParams.user and $routeParams.repo)
    $scope.user = login: $routeParams.user
    $scope.repo = name: $routeParams.repo
    $scope.branch = name: $routeParams.branch
    steps = []
    for n in [0..6]
      if $routeParams["step#{n}"]
        steps.push($routeParams["step#{n}"])
    $scope.path = steps.join("/")
    $scope.contextItem.name = $routeParams.repo
    $scope.contextItem.type = "repo"
    github.getPathContents token, $scope.user.login, $scope.repo.name, $scope.path, (err, file) ->
      if not err
        contextItem = name: file.name, path: file.path, sha: file.sha, type: file.type, parentItem: $scope.contextItem, childItems: []
        $scope.contextItem = contextItem
        if file.encoding is "base64"
          if isJS(file.path)
            editor.getSession().setMode "ace/mode/javascript"
            editor.getSession().setTabSize 2
          else if isCoffee(file.path)
            editor.getSession().setMode "ace/mode/coffee"
            editor.getSession().setTabSize 2
          else if isPython(file.path)
            editor.getSession().setMode "ace/mode/python"
            editor.getSession().setTabSize 4
          else if isHTML(file.path)
            editor.getSession().setMode "ace/mode/html"
            editor.getSession().setTabSize 2
          else if isJSON(file.path)
            editor.getSession().setMode "ace/mode/json"
            editor.getSession().setTabSize 2
          else if isMarkDown(file.path)
            editor.getSession().setMode "ace/mode/markdown"
            editor.getSession().setTabSize 2
          else
            editor.getSession().setMode "ace/mode/text"
            editor.getSession().setTabSize 2

          editor.setValue base64.decode(file.content)
          editor.focus()
          editor.gotoLine 0, 0
        else
          alert "Unknown encoding: #{file.encoding}"
      else
        console.log err
        return
  else if ($routeParams.gistId)
    github.getGist token, $routeParams.gistId, (err, gist) ->
      if not err
        $scope.contextGist = gist
        $scope.contextItem.name = "main.py"
        editor.setValue gist.files["main.py"].content
        editor.focus()
        editor.gotoLine 0, 0
        return
      else
        console.log(err)
        return
  else
    $scope.contextItem.name = "Untitled"
    $scope.contextItem.type = undefined

  $scope.run = () ->

    ga('send', 'event', EVENT_CATEGORY, 'run')

    $rootScope.$broadcast 'reset'
    $scope.messages.length = 0

    prog = editor.getValue()
    Sk.canvas = "canvas"

    Sk.python3 = false
    Sk.configure
      "output": (text) ->
        $rootScope.$broadcast('print', text)
      "debugout": (arg) ->
        console.log(arg)
      "read": (searchPath) ->
        if Sk.builtinFiles is undefined or Sk.builtinFiles["files"][searchPath] is undefined
          throw new Error("File not found: '#{searchPath}'")
        else
          return Sk.builtinFiles["files"][searchPath]

    try
      if isJS($scope.contextItem.path)
        eval(prog)
      else if isCoffee($scope.contextItem.path)
        CoffeeScript.eval(prog)
      else if isPython($scope.contextItem.path)
        dumpJS = true
        Sk.importMainWithBody "<stdin>", dumpJS, prog
      else
        Sk.importMainWithBody "<stdin>", false, prog
    catch e
      # Unfortunately, we have to parse the string representation of the message.
      # It would be nice if exceptions had the standard name and message.
      if typeof e isnt 'undefined'
        if typeof e.toString is 'function'
          message = e.toString()
          name = message.substring(0, message.indexOf(":"))
          text = message.substring(message.indexOf(":") + 1)
          $scope.messages.push name: name, text: text, severity: 'error'
        else
          # Messages raised don't all support toString
          console.log JSON.stringify(e, null, 2)

  # This is the save event handler for an existing page, as evident by the provision of the SHA.
  $scope.saveFile = () ->
    ga('send', 'event', EVENT_CATEGORY, 'savePage')
    content = base64.encode(editor.getValue())
    if $scope.user
      github.putFile token, $scope.user.login, $scope.repo.name, $scope.contextItem.path, "Save file.", content, $scope.contextItem.sha, (err, response, status, headers, config) ->
        if not err
          $scope.contextItem.sha = response.content.sha
        else
          # The cause given by the err is really for developer use only.
          alert("Error saving file to repository. Cause: #{err.message}")
    else
      if $scope.contextGist.id
        description = $scope.contextGist.description
        files = {"main.py":{content:editor.getValue()}}
        github.patchGist token, $scope.contextGist.id, {description:description, files:files}, (err, response, status, headers, config) ->
          if not err
          else
            # The cause given by the err is really for developer use only.
            alert("Error patching Gist. Cause: #{err.message}")
      else
        files = {"main.py":{content:editor.getValue()}}
        data = {}
        data.description = "Geometric Physics Gist"
        data.public = true
        data.files = files
        github.postGist token, data, (err, response, status, headers, config) ->
          if not err
            $location.path("/gists/#{response.id}")
          else
            # The cause given by the err is really for developer use only.
            alert("Error posting Gist. Cause: #{err.message}")

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
    # TODO: Rename so that the context and authenticated user are clearer.
    if $scope.user
      return $scope.isLoggedIn() and $scope.userLogin() is $scope.user.login and $scope.contextItem and $scope.contextItem.type is "file"
    else
      # We will be able to save the code as a GitHub Gist
      return true

  $scope.runEnabled = -> $scope.workEnabled()

  $rootScope.headerEnabled = -> true

  # convert from the GitHub content.type ("file" or "dir") to the locale-independent icon.
  # i18n will then take care of localization.
  # TODO: DRY This is the same as in tree.coffee
  $scope.iconFromItem = (item) ->
    switch item.type
      when "file"
        return "icon-file"
      when "dir"
        return "icon-dir"
      else
        return "icon-question"

  return
]