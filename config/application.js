/* Exports an object that defines
 *  all of the configuration needed by the projects'
 *  depended-on grunt tasks.
 *
 * You can find the parent object in: node_modules/lineman/config/application.coffee
 */

module.exports = require(process.env['LINEMAN_MAIN']).config.extend('application', {

  // html5push state simulation
  server: {
    pushState: true
  },

  // configure lineman to load additional angular related npm tasks
  loadNpmTasks: [
    "grunt-angular-templates",
    "grunt-concat-sourcemap",
    "grunt-ngmin"
  ],

  // we don't use the lineman default concat, handlebars, and jst tasks by default
  removeTasks: {
    common: ["concat", "handlebars", "jst"]
  },

  // task override configuration
  prependTasks: {
    dist: ["ngmin"],         // ngmin should run in dist only
    common: ["ngtemplates"] // ngtemplates runs in dist and dev
  },

  // swaps concat_sourcemap in place of vanilla concat
  appendTasks: {
    common: ["concat_sourcemap"]
  },
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

  // configuration for grunt-ngmin, this happens _after_ concat once, which is the ngmin ideal :)
  ngmin: {
    js: {
      src: "<%= files.js.concatenated %>",
      dest: "<%= files.js.concatenated %>"
    }
  },

  // generates a sourcemap for js, specs, and css with inlined sources
  // grunt-angular-templates expects that a module already be defined to inject into
  // this configuration orders the template inclusion _after_ the app level module
  concat_sourcemap: {
    options: {
      sourcesContent: true
    },
    js: {
      src: ["<%= files.js.vendor %>", "<%= files.js.app %>", "<%= files.coffee.generated %>", "<%= files.ngtemplates.dest %>"],
      dest: "<%= files.js.concatenated %>"
    },
    spec: {
      src: ["<%= files.js.specHelpers %>", "<%= files.coffee.generatedSpecHelpers %>", "<%= files.js.spec %>", "<%= files.coffee.generatedSpec %>"],
      dest: "<%= files.js.concatenatedSpec %>"
    },
    css: {
      src: ["<%= files.less.generatedVendor %>", "<%= files.sass.generatedVendor %>", "<%= files.css.vendor %>", "<%= files.less.generatedApp %>", "<%= files.sass.generatedApp %>", "<%= files.css.app %>"],
      dest: "<%= files.css.concatenated %>"
    }
  },

  copy: {
    dev: {
      files: [
        {src: "vendor/ace-builds/src-noconflict/worker-coffee.js",         dest: "generated/js/worker-coffee.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-css.js",            dest: "generated/js/worker-css.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-html.js",           dest: "generated/js/worker-html.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-javascript.js",     dest: "generated/js/worker-javascript.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-json.js",           dest: "generated/js/worker-json.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-lua.js",            dest: "generated/js/worker-lua.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-php.js",            dest: "generated/js/worker-php.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-python.js",         dest: "generated/js/worker-python.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-typescript.js",     dest: "generated/js/worker-typescript.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-workspace.js",      dest: "generated/js/worker-workspace.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-xquery.js",         dest: "generated/js/worker-xquery.js"},

        {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "generated/ts/lib.d.ts"},
        {src: "vendor/davinci-blade/dist/davinci-blade.d.ts",              dest: "generated/ts/davinci-blade.d.ts"},
        {src: "vendor/davinci-eight/dist/davinci-eight.d.ts",              dest: "generated/ts/davinci-eight.d.ts"},
        {src: "vendor/davinci-mathscript/dist/davinci-mathscript.d.ts",    dest: "generated/ts/davinci-mathscript.d.ts"},
        {src: "vendor/davinci-visual/dist/davinci-visual.d.ts",            dest: "generated/ts/davinci-visual.d.ts"},
        {src: "typings/d3/d3.d.ts",                                        dest: "generated/ts/d3.d.ts"},
        {src: "typings/easeljs/easeljs.d.ts",                              dest: "generated/ts/easeljs.d.ts"},
        {src: "typings/threejs/three.d.ts",                                dest: "generated/ts/three.d.ts"},

        {src: "vendor/font-awesome/font/FontAwesome.otf",                  dest: "generated/img/FontAwesome.otf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.eot",          dest: "generated/img/fontawesome-webfont.eot"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.svg",          dest: "generated/img/fontawesome-webfont.svg"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.ttf",          dest: "generated/img/fontawesome-webfont.ttf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.woff",         dest: "generated/img/fontawesome-webfont.woff"}
      ]
    },
    dist: {
      files: [
        {src: "generated/css/app.css",                                     dest: "dist/css/app.css"},
        {src: "generated/js/app.js",                                       dest: "dist/js/app.js"},

        {src: "vendor/ace-builds/src-noconflict/worker-coffee.js",         dest: "dist/js/worker-coffee.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-css.js",            dest: "dist/js/worker-css.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-html.js",           dest: "dist/js/worker-html.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-javascript.js",     dest: "dist/js/worker-javascript.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-json.js",           dest: "dist/js/worker-json.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-lua.js",            dest: "dist/js/worker-lua.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-php.js",            dest: "dist/js/worker-php.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-python.js",         dest: "dist/js/worker-python.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-typescript.js",     dest: "dist/js/worker-typescript.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-workspace.js",      dest: "dist/js/worker-workspace.js"},
        {src: "vendor/ace-builds/src-noconflict/worker-xquery.js",         dest: "dist/js/worker-xquery.js"},

        {src: "node_modules/typescript/bin/lib.d.ts",                      dest: "dist/ts/lib.d.ts"},
        {src: "vendor/davinci-blade/dist/davinci-blade.d.ts",              dest: "dist/ts/davinci-blade.d.ts"},
        {src: "vendor/davinci-eight/dist/davinci-eight.d.ts",              dest: "dist/ts/davinci-eight.d.ts"},
        {src: "vendor/davinci-mathscript/dist/davinci-mathscript.d.ts",    dest: "dist/ts/davinci-mathscript.d.ts"},
        {src: "vendor/davinci-visual/dist/davinci-visual.d.ts",            dest: "dist/ts/davinci-visual.d.ts"},
        {src: "typings/d3/d3.d.ts",                                        dest: "dist/ts/d3.d.ts"},
        {src: "typings/easeljs/easeljs.d.ts",                              dest: "dist/ts/easeljs.d.ts"},
        {src: "typings/threejs/three.d.ts",                                dest: "dist/ts/three.d.ts"},

        {src: "vendor/font-awesome/font/FontAwesome.otf",                  dest: "dist/img/FontAwesome.otf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.eot",          dest: "dist/img/fontawesome-webfont.eot"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.svg",          dest: "dist/img/fontawesome-webfont.svg"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.ttf",          dest: "dist/img/fontawesome-webfont.ttf"},
        {src: "vendor/font-awesome/font/fontawesome-webfont.woff",         dest: "dist/img/fontawesome-webfont.woff"}
      ]
    }
  },

  // replaces linemans common lifecycle "handlebars" task with "ngtemplates"
  appTasks: {
    common: ["coffee", "less", "jshint", "handlebars", "jst", "concat", "images:dev", "webfonts:dev", "pages:dev"],
    dev: ["copy:dev", "server", "watch"],
    dist: ["uglify", "cssmin", "images:dist", "webfonts:dist", "pages:dist", "copy:dist"]
  },

  // configures grunt-watch-nospawn to listen for changes to
  // and recompile angular templates, also swaps lineman default
  // watch target concat with concat_sourcemap
  watch: {
    ngtemplates: {
      files: "app/templates/**/*.html",
      tasks: ["ngtemplates", "concat_sourcemap:js"]
    },
    js: {
      files: ["<%= files.js.vendor %>", "<%= files.js.app %>"],
      tasks: ["concat_sourcemap:js"]
    },
    coffee: {
      files: "<%= files.coffee.app %>",
      tasks: ["coffee", "concat_sourcemap:js"]
    },
    jsSpecs: {
      files: ["<%= files.js.specHelpers %>", "<%= files.js.spec %>"],
      tasks: ["concat_sourcemap:spec"]
    },
    coffeeSpecs: {
      files: ["<%= files.coffee.specHelpers %>", "<%= files.coffee.spec %>"],
      tasks: ["coffee", "concat_sourcemap:spec"]
    },
    css: {
      files: ["<%= files.css.vendor %>", "<%= files.css.app %>"],
      tasks: ["concat_sourcemap:css"]
    },
    less: {
      files: ["<%= files.less.vendor %>", "<%= files.less.app %>"],
      tasks: ["less", "concat_sourcemap:css"]
    },
    sass: {
      files: ["<%= files.sass.vendor %>", "<%= files.sass.app %>"],
      tasks: ["sass", "concat_sourcemap:css"]
    }
  }
});
