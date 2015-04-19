angular.module("app").controller 'PrinterCtrl', ['$scope', ($scope) ->

  EVENT_CATEGORY = "printer"
  ga('create', 'UA-41504069-1', 'geometryzen.org')
  ga('set', 'page', '/printer')
  ga('send', 'pageview')

  PRESERVE_ELEMENT_ID = "a5f435e0-c92e-11e2-8b8b-0800200c9a66"

  escapeHtml = (s) -> s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")

  $scope.$on 'reset', (e) ->
    elem = document.getElementById(PRESERVE_ELEMENT_ID)
    if elem
      elem.innerHTML = ""
    else
      console.log "Unable to find element with Id #{PRESERVE_ELEMENT_ID}"

  $scope.$on 'print', (e, text) ->
    elem = document.getElementById(PRESERVE_ELEMENT_ID)
    if elem
      elem.innerHTML = elem.innerHTML + escapeHtml(text)
    else
      console.log "Unable to find element with Id #{PRESERVE_ELEMENT_ID}"
]