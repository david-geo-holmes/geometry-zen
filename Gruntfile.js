/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-angular-templates");
  grunt.loadNpmTasks("grunt-contrib-copy");
  require(process.env['LINEMAN_MAIN']).config.grunt.run(grunt);
};
