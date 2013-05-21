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

  // replaces linemans common lifecycle "handlebars" task with "ngtemplates"
  appTasks: {
    common: ["coffee", "less", "jshint", "ngtemplates", "jst", "configure", "concat:js", "concat:spec", "concat:css", "images:dev", "webfonts:dev", "homepage:dev"]
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
