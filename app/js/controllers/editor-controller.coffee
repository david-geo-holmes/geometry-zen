constructorFunction = ($scope, $location) ->

  $scope.title = "Editor"
  $scope.program = "from geometricalgebra import *\n
\n
thickness = 4\n
floor = Cuboid((60, 60, thickness))\n
floor.position = Vector3(0,0,-thickness/2)\n
ball = Sphere(10, Vector3(0, 0, 60))\n
velocity = Vector3(0, 0, 0)\n
g = Vector3(0,0,-9.8)\n
n = Vector3(0, 0, 1)\n
delta = 0.05\n
\n
def tick():\n
  global ball, velocity, g, delta, normal\n
  ball.position = ball.position + velocity * delta\n
  if (ball.position.z < (ball.radius+thickness/2)):\n
    # velocity = velocity * -1\n
    # velocity = Vector3(velocity.x, velocity.y, -velocity.z)\n
    # The following formula for reflection is the geometric way.\n
    velocity = - n * velocity * n\n
  else:\n
    velocity = velocity + g * delta\n
\n
start()"

  $scope.save = () ->
    alert("I'm sorry, Dave. I'm afraid I can't do that.")

  $scope.new = () ->
    alert("I'm sorry, Dave. I'm afraid I can't do that. #{$scope.program}")

  $scope.run = () ->
    alert("I'm sorry, Dave. I'm afraid I can't do that.")

  $scope.login = () -> $location.path('/login')

  $scope.signup = () -> $location.path('/signup')

angular.module("app").controller 'EditorController', ['$scope', '$location', constructorFunction]