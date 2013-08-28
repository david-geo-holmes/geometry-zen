angular.module("app").controller 'WorkCtrl', ['$rootScope','$scope', '$location', '$window', '$routeParams', '$', '_', 'GitHub', 'Base64', 'cookie', 'GitHubAuthManager', ($rootScope, $scope, $location, $window, $routeParams, $, _, github, base64, cookie, authManager) ->

  EVENT_CATEGORY = "work"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/work')
  ga('send', 'pageview')

  authManager.handleLoginCallback (err, token) ->
    if err
      $window.alert err.message

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
          editor.setValue base64.decode(file.content)
        else
          alert "Unknown encoding: #{file.encoding}"
      else
        alert("Error retrieving the page")
  else if ($routeParams.gistId)
    github.getGist token, $routeParams.gistId, (err, gist) ->
      if not err
        $scope.contextGist = gist
        $scope.contextItem.name = "main.py"
        editor.setValue gist.files["main.py"].content
      else
        alert "Error retrieving the Gist."
  else
    $scope.contextItem.name = "Untitled"
    $scope.contextItem.type = undefined

  winHeight = () -> $window.innerHeight || ($window.document.documentElement || $window.document.body).clientHeight
  winWidth  = () -> $window.innerWidth  || ($window.document.documentElement || $window.document.body).clientWidth

  isFullScreen = (cm) -> return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className)

  setFullScreen = (cm, full) ->
    wrapperElement = cm.getWrapperElement()
    if (full)
      wrapperElement.className += " CodeMirror-fullscreen"
      wrapperElement.style.height = winHeight() + "px"
      document.documentElement.style.overflow = "hidden"
    else
      wrapperElement.className = wrapperElement.className.replace(" CodeMirror-fullscreen", "")
      wrapperElement.style.height = "600px"
      document.documentElement.style.overflow = ""
    cm.refresh()

  code = document.getElementById("code")
  if code
    editor = CodeMirror.fromTextArea(code,
      "autofocus": false,
      "indentUnit": 4, # Python guys like to use 4 spaces
      "lineNumbers": true,
      "lineWrapping": true,
      "autoMatchParens": true,
      "parserConfig": {"pythonVersion": 2, "strictErrors": true},
      "theme": "twilight",
      "extraKeys":
        "Tab": (cm) ->
          spaces = Array(cm.getOption("indentUnit") + 1).join(" ")
          cm.replaceSelection(spaces, "end", "+input")
        "Ctrl-S": (cm) -> $scope.saveFile()
        "Ctrl-Enter": (cm) -> $scope.run()
    )
  else
    alert "The code element could not be found"

  $scope.run = () ->

    ga('send', 'event', EVENT_CATEGORY, 'run')

    $rootScope.$broadcast 'reset'
    $scope.messages.length = 0

    prog = editor.getValue()
    Sk.canvas = "canvas"

    Sk.configure
      "output": (text) ->
        $rootScope.$broadcast('print', text)
      "debugout": (arg) ->
        console.log "#{JSON.stringify(arg, null, 2)}"
      "read": (searchPath) ->
        if Sk.builtinFiles is undefined or Sk.builtinFiles["files"][searchPath] is undefined
          throw new Error("File not found: '#{searchPath}'")
        else
          return Sk.builtinFiles["files"][searchPath]

    if prog.trim().length > 0
      try
        eval(Sk.importMainWithBody("<stdin>", false, prog.trim()))
      catch e
        # Unfortunately, we have to parse the string representation of the message.
        message = e.toString()
        name = message.substring(0, message.indexOf(":"))
        text = message.substring(message.indexOf(":") + 1)
        $scope.messages.push name: name, text: text, severity: 'error'

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
        data.description = "GeometryZen Gist"
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

  $scope.runEnabled = () ->
    return $scope.workEnabled()

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

  if editor
    setFullScreen(editor, false)

  CodeMirror.on $window, "resize", () ->
    showing = $window.document.body.getElementsByClassName("CodeMirror-fullscreen")[0]
    if (showing)
      showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px"
    else
      # We seem to end up down here.

  return
]