
/* Exports an object that defines
 *  all of the paths & globs that the project
 *  is concerned with.
 *
 * The "configure" task will require this file and
 *  then re-initialize the grunt config such that
 *  directives like <config:files.js.app> will work
 *  regardless of the point you're at in the build
 *  lifecycle.
 *
 * You will find the parent object in: node_modules/lineman/config/files.coffee
 *
 * You may change 'vendor' to '..' to work on davinci locally.
 */

module.exports = require(process.env['LINEMAN_MAIN']).config.extend('files', {
  ngtemplates: {
    dest: "generated/angular/template-cache.js"
  },
  less: {
    compile: {
      options: {
        paths: [
          "app/css/**/*.less"
        ]
      }
    }
  },
  js: {
    vendor: [
      "vendor/async/lib/async.js",
      "vendor/jquery/jquery.js",
      "vendor/jquery-ui/ui/jquery-ui.js",
      "vendor/js/jquery.layout-1.3.0.js",
      "vendor/bladejs/build/bladeSTR.js",
      "vendor/bladejs/build/blade.js",
      "../davinci/build/davinci.min.js",
      "../davinci/build/davinciLib.js",
      "vendor/bootstrap/js/bootstrap-carousel.js",
      "vendor/bootstrap/js/bootstrap-collapse.js",
      "vendor/bootstrap/js/bootstrap-dropdown.js",
      "vendor/bootstrap/js/bootstrap-modal.js",
      "vendor/bootstrap/js/bootstrap-tab.js",
      "vendor/bootstrap/js/bootstrap-transition.js",
      "vendor/angular/angular.js",
      "vendor/underscore/underscore.js",
      "vendor/jed/jed.js",
      "vendor/js/codemirror.js",
      "vendor/codemirror/mode/python/python.js",

      "vendor/EaselJS/src/easeljs/events/Event.js",
      "vendor/EaselJS/src/easeljs/events/EventDispatcher.js",
      "vendor/EaselJS/src/easeljs/utils/UID.js",
      "vendor/EaselJS/src/easeljs/utils/Ticker.js",
      "vendor/EaselJS/src/easeljs/events/MouseEvent.js",
      "vendor/EaselJS/src/easeljs/geom/Matrix2D.js",
      "vendor/EaselJS/src/easeljs/geom/Point.js",
      "vendor/EaselJS/src/easeljs/geom/Rectangle.js",
      "vendor/EaselJS/src/easeljs/display/Graphics.js",
      "vendor/EaselJS/src/easeljs/display/DisplayObject.js",
      "vendor/EaselJS/src/easeljs/display/Container.js",
      "vendor/EaselJS/src/easeljs/display/Stage.js",
      "vendor/EaselJS/src/easeljs/display/Shape.js",
      "vendor/EaselJS/src/easeljs/display/Text.js",

      "vendor/TweenJS/src/tweenjs/Tween.js",
      "vendor/TweenJS/src/tweenjs/Timeline.js",
      "vendor/TweenJS/src/tweenjs/Ease.js",
      "vendor/TweenJS/src/tweenjs/MotionGuidePlugin.js",
      "vendor/TweenJS/src/tweenjs/version.js",

      "vendor/EaselJS/src/easeljs/display/MovieClip.js",

      "vendor/threejs/build/three.js",
      "vendor/tweenjs/build/tween.min.js",
      "vendor/google-analytics/tracking-code.js",
      "vendor/stats.js/src/Stats.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]
  }
});
