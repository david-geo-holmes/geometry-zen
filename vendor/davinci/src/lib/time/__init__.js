/*
 * Barebones implementation of the Python time package.
 *
 * For now, only the clock() function is implemented.
 */
var $builtinmodule = function(name) {
  var mod = {};

  mod.clock = new Sk.builtin.func(function() {
    return Sk.builtin.assk$(new Date().getTime() / 1000, Sk.builtin.nmber.float$);
  });

  return mod;
};
