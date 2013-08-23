module = angular.module("app")

module.directive "aHome", ->
  restrict: "E"
  replace: true
  templateUrl: "angular/a-home.html"