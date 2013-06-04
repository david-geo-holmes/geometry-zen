

angular.module("app").controller 'WorkbenchCtrl', ['$rootScope','$scope', '$window', '$routeParams', '$', '_', 'GitHub', 'Base64', 'cookie', ($rootScope, $scope, $window, $routeParams, $, _, github, base64, cookie) ->

  GITHUB_TOKEN_COOKIE_NAME = 'github-token'
  token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)

  $('.carousel').carousel({interval: false})

  if ($routeParams.owner and $routeParams.repo)
    $scope.owner = name: $routeParams.owner
    $scope.repo = name: $routeParams.repo
    github.getContentsOfRepoByOwner token, $routeParams.owner, $routeParams.repo, (err, files) ->
      if not err
        $scope.repo.files = files
      else
        alert("Error retrieving repository files")
  else
    $scope.repo = {}

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
      wrapperElement.style.height = "800px"
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
        "Ctrl-S": (cm) -> $scope.save()
        "Ctrl-Enter": (cm) -> $scope.run()
    )
  else
    console.log "The code element could not be found"

  $scope.run = () ->
    $rootScope.$broadcast 'reset'
    $scope.right()

    prog = editor.getValue()
    Sk.canvasWebGL = "canvasWebGL"
    Sk.canvas = "canvas2d"

    Sk.configure
      "output": (text) ->
        $rootScope.$broadcast('print', text)
      "read": (searchPath) ->
        if Sk.builtinFiles is undefined or Sk.builtinFiles["files"][searchPath] is undefined
          # It is important that we throw an exception here to say "this is not the right path".
          canGetFromElsewhere = false # Maybe we decide we can
          if canGetFromElsewhere
            # We should get it.
            throw new Error("File not found: '#{searchPath}'")
          else
            throw new Error("File not found: '#{searchPath}'")
        else
          # The second time we will be asked for the contents.
          return Sk.builtinFiles["files"][searchPath]

    if prog.trim().length > 0
      eval(Sk.importMainWithBody("<stdin>", false, prog.trim()))

  $scope.newFile = () ->
    $('#myModal').modal show: true, backdrop: true

  $scope.$on 'commit', (e, owner, repo, file, commit) ->
    $scope.repo.files.push(file)
    $scope.editFile(file.path)

  $scope.editFile = (path) ->
    # TODO: Use the $index technique as in deleteFile
    if editor
      github.getFile token, $routeParams.owner, $routeParams.repo, path, (err, file) ->
        if not err
          $scope.file = file
          editor.setValue base64.decode(file.content)
        else
          alert("Error retrieving the file")
    $scope.right()

  $scope.saveEnabled = () ->
    return $scope.file and $scope.file.name

  # This is the save event handler for an existing file, as evident by the provision of the SHA.
  $scope.save = () ->
    content = base64.encode(editor.getValue())
    github.putFile token, $routeParams.owner, $scope.repo.name, $scope.file.path, "Save file.", content, $scope.file.sha, (err, response) ->
      if not err
        $scope.file.sha = response.content.sha
      else
        alert("Error saving file to repository: #{err}")

  $scope.deleteFile = (idx) ->
    # Note that we should use indexOf on the array if the list has been filtered.
    file = $scope.repo.files[idx]
    github.deleteFile token, $routeParams.owner, $scope.repo.name, file.path, "Delete file.", file.sha, (err, response) ->
      if not err
        $scope.repo.files.splice(idx, 1)
      else
        alert("Error saving file to repository: #{err}")

  $scope.leftEnabled = () ->
    return $scope.repo and $scope.repo.name

  $scope.left = () ->
    $('.carousel').carousel(0)

  $scope.right = () ->
    $('.carousel').carousel(1)

  if editor
    setFullScreen(editor, false)
  else
    console.log "The editor does not exist."

  # Install a handler for window resize - although this does not appear to be called!
  CodeMirror.on $window, "resize", () ->
    showing = $window.document.body.getElementsByClassName("CodeMirror-fullscreen")[0]
    if (showing)
      console.log "Editor IS in full screen mode."
      showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px"
    else
      console.log "Editor is NOT in full screen mode."

  # Initialize the Workbench perspective to either left (Book) or right (Page).
  if $scope.repo.name
    $scope.left()
  else
    $scope.right()

  return
]