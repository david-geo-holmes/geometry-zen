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
 * You can find the parent object in: node_modules/lineman/config/files.coffee
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
      "vendor/bootstrap/js/bootstrap-modal.js",
      "vendor/bootstrap/js/bootstrap-tab.js",
      "vendor/angular/angular.js",
      "vendor/underscore/underscore.js",
      "vendor/js/codemirror.js",
      "vendor/codemirror/mode/python/python.js",
      "vendor/js/skulpt.js",
      "vendor/js/builtin.js",
      "vendor/threejs/build/three.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]
  }
});
