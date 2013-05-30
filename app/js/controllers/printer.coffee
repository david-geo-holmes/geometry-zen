angular.module("app").controller 'PrinterCtrl', ['$scope', 'GitHub', 'cookie', '$', '_', '$async', ($scope, github, cookie, $, _, $async) ->

  $scope.printer = lines: []

  $scope.$on 'reset', (e) ->
    $scope.printer.lines.length = 0
    $scope.printer.lines.push("")

  $scope.$on 'print', (e, text) ->
    if (text is "\n")
      $scope.printer.lines.push("")
    else
      $scope.printer.lines[$scope.printer.lines.length - 1] += text
]