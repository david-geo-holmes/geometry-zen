angular.module("app").controller 'WorkbenchCtrl', ['$scope', '$window', '$routeParams', '$', '_', ($scope, $window, $routeParams, $, _) ->

  if ($routeParams.owner and $routeParams.repo)
    # We were invoked by specifying an existing repository
  else
    # We were invoked without specifying a repository.

  outputHandler = (text) ->
    mypre = $window.document.getElementById("my-output")
    mypre.innerHTML = mypre.innerHTML + text

  builtinRead = (x) ->
    if (Sk.builtinFiles == undefined || Sk.builtinFiles["files"][x] == undefined)
      throw "File not found: '" + x + "'"
    return Sk.builtinFiles["files"][x]

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
      "autofocus": true,
      "indentUnit": 2,
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

  $scope.save = () ->
    $scope.layout.show('west')
    $scope.layout.hide('east')
    $scope.layout.hide('south')

  $scope.new = () ->
    $scope.title = "New Model"
    if editor
      editor.setValue("from geometricalgebra import *\n\n# Configuration\nball = Sphere(5)\n\n# Simulation\ndef tick():\n  global ball\n  ball.position = Vector3(0, 0, 0)\n\nstart()")
    # The layout is created in the directive, which happens after the controller has been initialized.
    if $scope.layout
      if ($scope.hasFeature('gz:feature:github'))
        $scope.layout.show('west')
      else
        $scope.layout.hide('west')
      $scope.layout.hide('east')
      $scope.layout.hide('south')

  $scope.run = () ->
    $scope.layout.hide('west')
    prog = editor.getValue()
    $window.document.getElementById("my-output").innerHTML = ''
    Sk.canvas = "my-canvas"
    Sk.pre = "my-output"
    Sk.configure({"output":outputHandler, "read":builtinRead})
    try
      if prog.trim().length > 0
        $scope.layout.show('east')
        $scope.layout.show('south')
        eval(Sk.importMainWithBody("<stdin>", false, prog.trim()))
    catch e
      alert(e.message)
    finally

  if editor
    setFullScreen(editor, false)
  else
    console.log "The editor does not exist."

  CodeMirror.on $window, "resize", () ->
    showing = $window.document.body.getElementsByClassName("CodeMirror-fullscreen")[0]
    if (showing)
      showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px"

  $scope.new()
  
  return
]