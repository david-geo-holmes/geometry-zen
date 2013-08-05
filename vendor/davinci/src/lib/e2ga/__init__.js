/**
 * Geometric Algebra (e2ga) module.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {

  var EUCLIDEAN_2    = "Euclidean2";

  var mod = {};

  Sk.builtin.defineEuclidean2(mod);

  return mod;
}
