###
 This should transform to JavaScript with the standard return {restrict: "E", ...};
 It should be used as data-a-brand. Methinks we need a namespace convention like data-gz-*
###
angular.module("app").directive "aBrand", () ->
  restrict: "E"
  templateUrl: "angular/a-brand.html"