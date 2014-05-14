
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
  js: {
    vendor: [
      "vendor/async/lib/async.js",
      "vendor/jquery/jquery.js",
      "vendor/jquery-ui/ui/jquery-ui.js",
      "vendor/jquery.layout/dist/jquery.layout-latest.js",
      "../davinci-dev/dist/davinci.min.js",
      "../davinci-dev/dist/davinci-stdlib.js",
      "vendor/bootstrap/js/bootstrap-carousel.js",
      "vendor/bootstrap/js/bootstrap-collapse.js",
      "vendor/bootstrap/js/bootstrap-dropdown.js",
      "vendor/bootstrap/js/bootstrap-modal.js",
      "vendor/bootstrap/js/bootstrap-tab.js",
      "vendor/bootstrap/js/bootstrap-transition.js",
      "vendor/angular/angular.js",
      "vendor/underscore/underscore.js",
      "vendor/jed/jed.js",
      "vendor/ace-builds/src-noconflict/ace.js",
      "vendor/ace-builds/src-noconflict/mode-python.js",
      "vendor/ace-builds/src-noconflict/theme-monokai.js",
      "vendor/ace-builds/src-noconflict/theme-twilight.js",
      "vendor/d3/d3.min.js",
      "vendor/EaselJS/lib/easeljs-0.6.1.min.js",
      "vendor/TweenJS/lib/tweenjs-0.4.1.min.js",
      "vendor/EaselJS/lib/movieclip-0.6.1.min.js",
      "vendor/threejs/build/three.min.js",
      "vendor/tweenjs/build/tween.min.js",
      "vendor/google-analytics/tracking-code.js",
      "vendor/stats.js/src/Stats.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]
  },
  less: {
    compile: {
      options: {
        paths: [
          "app/css/**/*.less",
          "vendor/base-admin-2/*.less"
        ]
      }
    }
  }
});
