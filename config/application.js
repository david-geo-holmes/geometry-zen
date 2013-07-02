/* Exports an object that defines
 *  all of the configuration needed by the projects'
 *  depended-on grunt tasks.
 *
 * You can find the parent object in: node_modules/lineman/config/application.coffee
 */

module.exports = require(process.env['LINEMAN_MAIN']).config.extend('application', {

  // configuration for grunt-angular-templates
  ngtemplates: {
    app: { // "app" matches the name of the angular module defined in app.js
      options: {
        base: "app/templates"
      },
      src: "app/templates/**/*.html",
      // puts angular templates in a different spot than lineman looks for other templates in order not to conflict with the watch process
      dest: "generated/angular/template-cache.js"
    }
  },

  copy: {
    dev: {
      files: [
        {src: "vendor/bladejs/build/bladeASM.js", dest: "generated/js/bladeASM.js"},
        {src: "vendor/font-awesome/font/FontAwesome.otf",          dest: "generated/img/FontAwesome.otf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.eot",  dest: "generated/img/fontawesome-webfont.eot"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.svg",  dest: "generated/img/fontawesome-webfont.svg"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.ttf",  dest: "generated/img/fontawesome-webfont.ttf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.woff", dest: "generated/img/fontawesome-webfont.woff"}
      ]
    },
    dist: {
      files: [
        {src: "vendor/bladejs/build/bladeASM.js", dest: "dist/js/bladeASM.js"},
        {src: "vendor/font-awesome/font/FontAwesome.otf",          dest: "dist/img/FontAwesome.otf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.eot",  dest: "dist/img/fontawesome-webfont.eot"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.svg",  dest: "dist/img/fontawesome-webfont.svg"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.ttf",  dest: "dist/img/fontawesome-webfont.ttf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.woff", dest: "dist/img/fontawesome-webfont.woff"}
      ]
    }
  },

  // replaces linemans common lifecycle "handlebars" task with "ngtemplates"
  // copies the bladeASM.js script (that we don't want to be compressed) to the appropriate js folder.
  appTasks: {
    common: ["coffee", "less", "jshint", "ngtemplates", "jst", "configure", "concat:js", "concat:spec", "concat:css", "images:dev", "webfonts:dev", "homepage:dev"],
    dev: ["copy:dev", "server", "watch"],
    dist: ["uglify", "cssmin", "images:dist", "webfonts:dist", "homepage:dist", "copy:dist"]
  },

  // grunt-angular-templates expects that a module already be defined to inject into
  // this configuration orders the template inclusion _after_ the app level module
  concat: {
    js: {
      src: ["<banner:meta.banner>", "<%= files.js.vendor %>", "<%= files.coffee.generated %>", "<%= files.js.app %>", "<%= files.ngtemplates.dest %>"],
      separator: ";"
    }
  },

  // configures grunt-watch-nospawn to listen for changes to, and recompile angular templates
  watch: {
    ngtemplates: {
      files: "app/templates/**/*.html",
      tasks: ["configure", "ngtemplates", "configure", "concat:js"]
    }
  }

  // API Proxying
  //
  // During development, you'll likely want to make XHR (AJAX) requests to an API on the same
  // port as your lineman development server. By enabling the API proxy and setting the port, all
  // requests for paths that don't match a static asset in ./generated will be forwarded to
  // whatever service might be running on the specified port.
  //
  // server: {
  //   apiProxy: {
  //     enabled: true,
  //     host: 'localhost',
  //     port: 3000
  //   }
  // }

});
