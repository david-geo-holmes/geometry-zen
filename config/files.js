
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
 * You may change 'vendor' to '..' to pull in davinci locally.
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
      "vendor/js-beautify/js/lib/beautify.js",
      "vendor/davinci/davinci.min.js",
      "vendor/davinci/davinci-stdlib.js",
      "vendor/bootstrap/js/bootstrap-carousel.js",
      "vendor/bootstrap/js/bootstrap-collapse.js",
      "vendor/bootstrap/js/bootstrap-dropdown.js",
      "vendor/bootstrap/js/bootstrap-modal.js",
      "vendor/bootstrap/js/bootstrap-tab.js",
      "vendor/bootstrap/js/bootstrap-transition.js",
      "vendor/angular/angular.js",
      "vendor/underscore/underscore.js",
      "vendor/jed/jed.js",

      "vendor/ace-builds/src-min-noconflict/ace.js",

      "vendor/coffee-script/extras/coffee-script.js",

      "vendor/ace-builds/src-min-noconflict/mode-coffee.js",
      "vendor/ace-builds/src-min-noconflict/mode-css.js",
      "vendor/ace-builds/src-min-noconflict/mode-html.js",
      "vendor/ace-builds/src-min-noconflict/mode-javascript.js",
      "vendor/ace-builds/src-min-noconflict/mode-json.js",
      "vendor/ace-builds/src-min-noconflict/mode-julia.js",
      "vendor/ace-builds/src-min-noconflict/mode-latex.js",
      "vendor/ace-builds/src-min-noconflict/mode-less.js",
      "vendor/ace-builds/src-min-noconflict/mode-markdown.js",
      "vendor/ace-builds/src-min-noconflict/mode-python.js",
      "vendor/ace-builds/src-min-noconflict/mode-text.js",
      "vendor/ace-builds/src-min-noconflict/mode-typescript.js",
      "vendor/ace-builds/src-min-noconflict/mode-xml.js",

      "vendor/ace-builds/src-min-noconflict/theme-eclipse.js",
      "vendor/ace-builds/src-min-noconflict/theme-monokai.js",
      "vendor/ace-builds/src-min-noconflict/theme-textmate.js",
      "vendor/ace-builds/src-min-noconflict/theme-twilight.js",

      "vendor/d3/d3.min.js",
      "vendor/EaselJS/lib/easeljs-0.8.0.min.js",
      "vendor/TweenJS/lib/tweenjs-0.6.0.min.js",
      "vendor/EaselJS/lib/movieclip-0.8.0.min.js",
      "vendor/bladejs/dist/bladejs.min.js",
      "vendor/eightjs/dist/eight.min.js",
      "vendor/davinci-blade/dist/davinci-blade.min.js",
      "vendor/davinci-eight/dist/davinci-eight.min.js",
      "vendor/davinci-mathscript/dist/davinci-mathscript.min.js",
      "vendor/gl-matrix/dist/gl-matrix-min.js",
      "vendor/threejs/build/three.min.js",
      "vendor/tweenjs/build/tween.min.js",
      "vendor/google-analytics/tracking-code.js",
      "vendor/stats.js/build/stats.min.js"
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
