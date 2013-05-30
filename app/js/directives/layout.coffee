angular.module("app").directive "layout", [() ->
  link: (scope, elm) ->
    scope.layout = elm.layout(applyDefaultStyles: true)
    scope.layout.sizePane('west', 400)
    scope.layout.sizePane('east', 0.618);
    if scope.repo
      scope.layout.show('west')
    else
      scope.layout.hide('west')
    scope.layout.hide('east')
]