scopeFn = ($rootScope) ->

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)

angular.module("app", []).run(['$rootScope', scopeFn])
