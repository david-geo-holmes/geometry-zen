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
          "vendor/css/layout-default-latest.css",
          "vendor/css/boostrap-2.3.1.css",
          "vendor/css/boostrap-responsive-2.3.1.css",
          "vendor/css/codemirror.css",
          "vendor/codemirror/theme/twilight.css",
          "vendor/codemirror/theme/night.css",
          "app/css/**/*.less"
        ]
      }
    }
  },
  js: {
    vendor: [
      "vendor/js/jquery-1.9.1.js",
      "vendor/js/jquery-ui-1.9.1.js",
      "vendor/js/jquery.layout-1.3.0.js",
      "vendor/js/bootstrap-2.3.1.js",
      "vendor/js/angular-1.1.4.js",
      "vendor/js/underscore-1.3.3.js",
      "vendor/js/codemirror.js",
      "vendor/codemirror/mode/python/python.js",
      "vendor/js/skulpt.js",
      "vendor/js/builtin.js",
      "vendor/js/three.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]
  }
});
