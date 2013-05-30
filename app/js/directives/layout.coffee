angular.module("app").directive "layout", [() ->
  link: (scope, elm) ->
    # The applyDefaultStyles option is intended, according to the documentation, for quick mock-ups,
    # so that you can 'see' your layout immediately.
    # See http://layout.jquery-dev.net/documentation.cfm#Option_applyDefaultStyles
    # We will disable it so that we don't have to fight the styling, such as padding.
    scope.layout = elm.layout applyDefaultStyles: false

    scope.layout.sizePane('west', 350)
    scope.layout.sizePane('east', 0.618);
    if scope.repo
      scope.layout.show('west')
      scope.layout.hide('east')
    else
      scope.layout.hide('west')
      scope.layout.show('east')
]