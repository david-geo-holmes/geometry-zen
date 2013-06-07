angular.module("app").controller 'BrowseCtrl', ['$scope', '$window', '$location', ($scope, $window, $location) ->

  EVENT_CATEGORY = "browse"
  ga('create', 'UA-41504069-1', 'geometryzen.org');
  ga('set', 'page', '/browse')
  ga('send', 'pageview')

]