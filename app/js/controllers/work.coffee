angular.module("app").controller 'WorkCtrl', ['$rootScope','$scope','$http', '$location', '$window', '$routeParams', '$', '_', 'GitHub', 'Base64', 'cookie', 'GitHubAuthManager', ($rootScope, $scope, $http, $location, $window, $routeParams, $, _, github, base64, cookie, authManager) ->

  # Ensure that scrollbars are disabled.
  # This is so that we don't get double scrollbars when using the editor.
  $window.document.body.style.overflow = 'hidden'

  # I'm not sure if this is actually doing anything.
  # In any case, it will soon be removed.
  # $($window.document).ready ()-> $('#container').layout()

  EVENT_CATEGORY = "work"
  ga 'create', 'UA-41504069-1', 'geometryzen.org'
  ga 'set', 'page', '/work'
  ga 'send', 'pageview'

  DOMAIN = "#{$location.protocol()}://#{$location.host()}:#{$location.port()}"

  endsWith = (str, suffix) ->
    if str and suffix
      return str.length > 0 and str.substring(str.length-suffix.length, str.length) is suffix
    else
      return false

  isCoffeeScript = (path) -> return endsWith(path, '.coffee')

  isHTML = (path) -> return endsWith(path, '.html')

  isJavaScript = (path) -> return endsWith(path, '.js')

  isJSON = (path) -> return endsWith(path, '.json')

  isMarkDown = (path) -> return endsWith(path, '.md')

  isPython = (path) -> return endsWith(path, '.py')

  isTypeScript = (path) -> return endsWith(path, '.ts')

  authManager.handleLoginCallback (err, token) ->
    if err
      $window.alert err.message

  ace.config.set('workerPath', '/js')

  workspace = ace.workspace()

  fileNames = ['lib.d.ts', 'davinci-eight.d.ts', 'davinci-blade.d.ts', 'davinci-mathscript.d.ts', 'd3.d.ts', 'easeljs.d.ts', 'jxg.d.ts', 'three.d.ts', 'davinci-visual.d.ts']

  readFile = (fileName, callback) =>
    url = "#{DOMAIN}/ts/#{fileName}"
    $http.get(url)
      .success (data, status, headers, config) ->
        callback(null, data)
      .error (data, status, headers, config) ->
        callback new Error "Unable to wrangle #{fileName}."

  editor = ace.edit "editor", workspace
  # Keep the theme as textmate until the context sensitive popup is integrated.
  editor.setTheme "ace/theme/chrome"
  editor.getSession().setMode "ace/mode/typescript"
  editor.getSession().setTabSize 2
  editor.setShowInvisibles true
  editor.setFontSize '18px'
  editor.setShowPrintMargin false
  editor.setDisplayIndentGuides false

  resizeHandler = () =>
    h = $window.innerHeight
    # 159 is the magic number that makes the editor resize correctly.
    $('#editor').css('height', (h-159).toString()+'px')
    # This final call forces a refresh of the editor.
    # I wonder if supplying all the parameters would allow us to stop fiddling with CSS?
    editor.resize true

  # Hook the 'resize' event.
  $($window).resize resizeHandler

  # Force a resize when the page first loads.
  resizeHandler()

  fileNames.forEach (fileName) =>
    readFile fileName, (err, content) =>
      if not err
        if workspace
          workspace.ensureScript fileName, content.replace(/\r\n?/g, '\n'), true
      else
        console.log "#{err}"

  editor.getSession().on "initAfter", (event) =>
    # Not sure how knowledge of worker being ready might be used.

  editor.getSession().on "syntaxErrors", (event) =>
    console.log "#{event}"
    $scope.outputFile = null

  editor.getSession().on "change", (event) =>
    $scope.outputFile = null

  editor.getSession().on "outputFiles", (event) =>
    try
      outputFiles = event.data
      outputFiles.forEach (file) =>
        text = file.text
        $scope.outputFile = file
    catch e
      console.log "#{e}"

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
          if isTypeScript(file.path)
            editor.getSession().setMode "ace/mode/typescript"
            editor.getSession().setTabSize 2
          else if isJavaScript(file.path)
            editor.getSession().setMode "ace/mode/javascript"
            editor.getSession().setTabSize 2
          else if isCoffeeScript(file.path)
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

          if editor['changeFile']
            editor.changeFile(base64.decode(file.content), file.name)
          else
            editor.setValue(base64.decode(file.content))
          editor.focus()
          editor.gotoLine(0, 0)
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
        # TODO: Workspace support...
        editor.setValue gist.files["main.py"].content
        editor.focus()
        editor.gotoLine(0, 0)
        return
      else
        console.log err
        return
  else
    $scope.contextItem.name = "Untitled"
    $scope.contextItem.type = undefined

  $scope.run = () ->

    ga('send', 'event', EVENT_CATEGORY, 'run')

    $rootScope.$broadcast 'reset'
    $scope.messages.length = 0

    prog = editor.getValue()

    try
      # Initialize the global Sk so that we can hijack the output.
      Sk.canvas = "canvas"
      Sk.python3 = false
      Sk.configure
        "output": (text) ->
          console.log text
          # $rootScope.$broadcast('print', text)
        "debugout": (arg) ->
          console.log arg
        "read": (searchPath) ->
          if Sk.builtinFiles is undefined or Sk.builtinFiles["files"][searchPath] is undefined
            throw new Error "File not found: '#{searchPath}'"
          else
            return Sk.builtinFiles["files"][searchPath]
      dumpJS = false

      if isTypeScript $scope.contextItem.path
        if $scope.outputFile
          prog = $scope.outputFile.text
          #console.log "js: #{prog}"
          prog = Ms.transpile(prog)
          #console.log "ms: #{prog}"
          eval(prog)
        else
          alert "The program is not ready to be executed."
      else if isJavaScript $scope.contextItem.path
        #console.log "js: #{prog}"
        prog = Ms.transpile(prog)
        #console.log "ms: #{prog}"
        eval(prog)
      else if isCoffeeScript $scope.contextItem.path
        js = CoffeeScript.compile prog
        #console.log "js: #{js}"
        ms = Ms.transpile js
        #console.log "ms: #{ms}"
        eval(ms)
      else if isPython $scope.contextItem.path
        Sk.importMainWithBody "<stdin>", dumpJS, prog
      else
        Sk.importMainWithBody "<stdin>", false, prog
    catch e
      console.log "Exception: #{e}"
      if typeof e isnt 'undefined'
        if typeof e.name is 'string' and typeof e.message is 'string'
          if typeof e.lineNumber is 'number'
            editor.focus()
            if typeof e.columnNumber is 'number'
              $scope.messages.push name: e.name, text: "[#{e.lineNumber}, #{e.columnNumber}]: #{e.message}", severity: 'error'
              editor.gotoLine(e.lineNumber, e.columnNumber)
            else
              $scope.messages.push name: e.name, text: "[#{e.lineNumber}]: #{e.message}", severity: 'error'
              editor.gotoLine(e.lineNumber, 0)
        else if typeof e.toString is 'function'
          # Unfortunately, we have to parse the string representation of the message.
          # It would be nice if exceptions had the standard name and message.
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
    content = base64.encode editor.getValue()
    if $scope.user
      github.putFile token, $scope.user.login, $scope.repo.name, $scope.contextItem.path, "Save file.", content, $scope.contextItem.sha, (err, response, status, headers, config) ->
        if not err
          $scope.contextItem.sha = response.content.sha
        else
          # The cause given by the err is really for developer use only.
          alert "Error saving file to repository. Cause: #{err.message}"
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
        data.description = "Geometry Zen Gist"
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

  $scope.saveEnabled = () ->
    # TODO: Rename so that the context and authenticated user are clearer.
    if $scope.user
      return $scope.isLoggedIn() and ($scope.userLogin() is $scope.user.login) and $scope.contextItem and ($scope.contextItem.type is "file")
    else
      # We will be able to save the code as a GitHub Gist
      return true

  # TODO: The UI does not seem to be truly dynamic!
  $scope.runEnabled = () ->
    return ($scope.contextItem and $scope.contextItem.type is "file") or not ($scope.repo and $scope.repo.name)

  $scope.runVisible = () ->
    return $scope.runEnabled()

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