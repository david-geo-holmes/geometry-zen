angular.module('underscore', []).factory('_', ['$window',
  (w) ->
    console.log "Calling the underscore shim"
    w._
])