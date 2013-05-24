angular.module('async', []).factory('$async', ['$window',
  (w) ->
    console.log "Calling the async shim"
    w.async
])