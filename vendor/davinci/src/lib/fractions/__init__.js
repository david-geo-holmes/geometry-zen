/**
 * fractions - Rational numbers
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {

  var mod = {};

  var FRACTION = "Fraction";

  Sk.builtin.defineFractions(mod, FRACTION, function(n, d) {return new BLADE.Rational(n, d)});

  return mod;
};