angular.module("app", []).run(['$rootScope', ($rootScope) ->

  $rootScope.log = (thing) ->
    console.log thing

  $rootScope.alert = (thing) ->
    alert(thing)
])
