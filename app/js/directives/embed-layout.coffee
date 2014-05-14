module = angular.module("app")

module.directive "embedLayout", ->
  restrict: "C"
  link: (scope, elm, attrs) ->
    elm.layout(
      applyDefaultStyles: false
      east__size:         0.3
      south__size:        0.15
    )