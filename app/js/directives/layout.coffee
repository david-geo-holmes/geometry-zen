angular.module("app").directive "layout", [() ->
  link: (scope, elm) ->
    scope.layout = elm.layout(applyDefaultStyles: true)
    scope.layout.sizePane('west', 260)
    scope.layout.sizePane('east', 0.618);
    scope.layout.hide('west')
    scope.layout.hide('east')
    scope.layout.hide('south')
]