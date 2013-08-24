module = angular.module "app"

module.directive "userLinks", () ->
  restrict: "E"
  replace: true
  template: """
    <div class="user-links">
      <a class="btn btn-secondary" ng-href="{{jumpHRef()}}">
        <i class="{{jumpIcon()}}"/>
        <span>{{jumpText()}}</span>
      </a>
      <button class="btn btn-secondary" ng-click="logout()" href="#" ng-show="isLoggedIn()">
        <i class="icon-signout"></i>
        <span>{{userLogin()}}</span>
      </button>
      <a class="btn btn-secondary" ng-hide="isLoggedIn()" ng-click="login()">
        <i class="icon-signin"/>
        <span>Sign in</span>
      </a>
    </div>
    """