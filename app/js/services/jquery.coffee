angular.module('jquery', []).factory('$', ['$window',
  (w) ->
    console.log "Calling the jQuery shim"
    w.$
])