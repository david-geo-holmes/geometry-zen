/**
 * The 'three' module is a foreign function interface over Three.js for the DaVinci Python to JavaScript cross-compiler.
 *
 * The 'three' module is in core respects API-compatible with the Three.js library.
 *
 * The 'three' module contains additional helper functions for Physicists.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {
  var mod = {};
  Sk.builtin.defineThree(mod, THREE);
  return mod;
}
