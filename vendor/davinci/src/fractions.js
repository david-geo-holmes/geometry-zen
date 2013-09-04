/**
 * Convenience function for incorporating fractions into a module.
 *
 * Usage:
 *
 * Sk.builtin.defineFractions(mod);
 */
(function() {

/**
 * @const
 * @type {string}
 */
var INT              = "int";
/**
 * @const
 * @type {string}
 */
var NUMBER           = "Number";
/**
 * @const
 * @type {string}
 */
var PROP_NUMERATOR   = "numerator";
/**
 * @const
 * @type {string}
 */
var PROP_NUMER       = "numer";
/**
 * @const
 * @type {string}
 */
var PROP_DENOMINATOR = "denominator";
/**
 * @const
 * @type {string}
 */
var PROP_DENOM       = "denom";
/**
 * @const
 * @type {string}
 */
var ARG_SELF         = "self";
/**
 * @const
 * @type {string}
 */
var ARG_OTHER        = "other";
/**
 * @const
 * @type {string}
 */
var OP_ADD           = "+";
/**
 * @const
 * @type {string}
 */
var OP_SUB           = "-";
/**
 * @const
 * @type {string}
 */
var OP_MUL           = "*";
/**
 * @const
 * @type {string}
 */
var OP_DIV           = "/";
/**
 * @const
 * @type {string}
 */
var DENOMINATOR_ZERO = "denominator must not be zero";

/**
 * @param {string} RATIONAL The name to be given to the fraction class, usually Rational or Fraction.
 * @param {function(number, number): Object} factory
 */
Sk.builtin.defineFractions = function(mod, RATIONAL, factory) {
  Sk.ffi.checkFunctionArgs("defineFractions", arguments, 3, 3);
  /**
   * @param {Object} valuePy
   * @return {boolean} true if the thing is a vector, otherwise false.
   */
  var isRational = function(valuePy) {
    return Sk.ffi.isObjectRef(valuePy) && Sk.ffi.typeName(valuePy) === RATIONAL;
  }
  /**
   * @param {number} numerator
   * @param {number} denominator
   */
  var rationalToPy = function(numerator, denominator) {
    return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.numberToPy(numerator), Sk.ffi.numberToPy(denominator));
  };
  mod[RATIONAL] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, numerPy, denomPy) {
      if (!Sk.ffi.isUndefined(denomPy)) {
        Sk.ffi.checkMethodArgs(RATIONAL, arguments, 2, 2);
        Sk.ffi.checkArgType(PROP_NUMERATOR, INT, Sk.ffi.isInt(numerPy));
        Sk.ffi.checkArgType(PROP_DENOMINATOR, INT, Sk.ffi.isInt(denomPy));
        var numer = Sk.ffi.remapToJs(numerPy);
        var denom = Sk.ffi.remapToJs(denomPy);
        if (denom != 0) {
          Sk.ffi.referenceToPy(factory(numer, denom), RATIONAL, undefined, selfPy);
        }
        else {
          throw new Sk.builtin.ZeroDivisionError(DENOMINATOR_ZERO);
        }
      }
      else {
        if (Sk.ffi.isUndefined(numerPy)) {
          Sk.ffi.referenceToPy(factory(0, 1), RATIONAL, undefined, selfPy);
        }
        else {
          if (isRational(numerPy)) {
            Sk.ffi.checkMethodArgs(RATIONAL, arguments, 1, 1);
            Sk.ffi.referenceToPy(Sk.ffi.remapToJs(numerPy), RATIONAL, undefined, selfPy);
          }
          else if (Sk.ffi.isNumber(numerPy)) {
            Sk.ffi.checkArgType(PROP_NUMERATOR, INT, Sk.ffi.isInt(numerPy));
            var numer = Sk.ffi.remapToJs(numerPy);
            Sk.ffi.referenceToPy(factory(numer, 1), RATIONAL, undefined, selfPy);
          }
          else {
            Sk.ffi.checkMethodArgs(RATIONAL, arguments, 2, 2);
          }
        }
      }
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(selfPy, name) {
      var rational = Sk.ffi.remapToJs(selfPy);
      switch(name) {
        case PROP_NUMER:
        case PROP_NUMERATOR: {
          return Sk.ffi.numberToIntPy(rational.numer);
        }
        case PROP_DENOM:
        case PROP_DENOMINATOR: {
          return Sk.ffi.numberToIntPy(rational.denom);
        }
        default: {
          throw Sk.ffi.err.attribute(name).isNotGetableOnType(RATIONAL);
        }
      }
    });
    $loc.__add__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_ADD, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      Sk.ffi.checkArgType(ARG_OTHER, [RATIONAL, INT], isRational(otherPy) || Sk.ffi.isInt(otherPy));
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.add(b), RATIONAL));
    });
    $loc.__radd__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_ADD, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      Sk.ffi.checkArgType(ARG_OTHER, INT, Sk.ffi.isInt(otherPy));
      var self = Sk.ffi.remapToJs(selfPy);
      var other = factory(Sk.ffi.remapToJs(otherPy), 1);
      return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(other.add(self), RATIONAL));
    });
    $loc.__sub__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_SUB, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      Sk.ffi.checkArgType(ARG_OTHER, [RATIONAL, INT], isRational(otherPy) || Sk.ffi.isInt(otherPy));
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.sub(b), RATIONAL));
    });
    $loc.__rsub__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_ADD, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      Sk.ffi.checkArgType(ARG_OTHER, INT, Sk.ffi.isInt(otherPy));
      var self = Sk.ffi.remapToJs(selfPy);
      var other = factory(Sk.ffi.remapToJs(otherPy), 1);
      return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(other.sub(self), RATIONAL));
    });
    $loc.__mul__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_MUL, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      if (Sk.ffi.isNumber(otherPy)) {
        Sk.ffi.checkArgType(ARG_OTHER, INT, Sk.ffi.isInt(otherPy));
        return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.numberToIntPy(a.numer * b), Sk.ffi.numberToIntPy(a.denom));
      }
      else {
        Sk.ffi.checkArgType(ARG_OTHER, RATIONAL, isRational(otherPy));
        return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.mul(b), RATIONAL));
      }
    });
    $loc.__rmul__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_ADD, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      Sk.ffi.checkArgType(ARG_OTHER, INT, Sk.ffi.isInt(otherPy));
      var self = Sk.ffi.remapToJs(selfPy);
      var other = factory(Sk.ffi.remapToJs(otherPy), 1);
      return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(other.mul(self), RATIONAL));
    });
    $loc.__div__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_DIV, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      var numer = Sk.ffi.remapToJs(selfPy);
      var denom = Sk.ffi.remapToJs(otherPy);
      if (Sk.ffi.isNumber(otherPy)) {
        Sk.ffi.checkArgType(ARG_OTHER, INT, Sk.ffi.isInt(otherPy));
        if (denom != 0) {
          return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.numberToIntPy(numer.numer), Sk.ffi.numberToIntPy(numer.denom * denom));
        }
        else {
          throw new Sk.builtin.ZeroDivisionError(DENOMINATOR_ZERO);
        }
      }
      else {
        Sk.ffi.checkArgType(ARG_OTHER, RATIONAL, isRational(otherPy));
        if (denom.numer != 0) {
          return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(numer.div(denom), RATIONAL));
        }
        else {
          throw new Sk.builtin.ZeroDivisionError(DENOMINATOR_ZERO);
        }
      }
    });
    $loc.__rdiv__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_ADD, arguments, 2, 2);
      Sk.ffi.checkArgType(ARG_SELF,  RATIONAL, isRational(selfPy));
      Sk.ffi.checkArgType(ARG_OTHER, INT, Sk.ffi.isInt(otherPy));
      var self = Sk.ffi.remapToJs(selfPy);
      var other = factory(Sk.ffi.remapToJs(otherPy), 1);
      if (self.numer != 0) {
        return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(other.div(self), RATIONAL));
      }
      else {
        throw new Sk.builtin.ZeroDivisionError(DENOMINATOR_ZERO);
      }
    });
    $loc.__eq__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkFunctionArgs(OP_DIV, arguments, 2, 2);
      if (isRational(selfPy) && isRational(otherPy)) {
        var a = Sk.ffi.remapToJs(selfPy);
        var b = Sk.ffi.remapToJs(otherPy);
        return Sk.ffi.booleanToPy(a.equals(b));
      }
      else {
        return Sk.ffi.bool.False;
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(rationalPy) {
      var rational = Sk.ffi.remapToJs(rationalPy);
      return Sk.ffi.remapToPy(RATIONAL + "(" + rational.numer + "," + rational.denom + ")");
    });
    $loc.__str__ = Sk.ffi.functionPy(function(rationalPy) {
      var rational = Sk.ffi.remapToJs(rationalPy);
      return Sk.ffi.remapToPy("" + rational);
    });
  }, RATIONAL, []);
};
}).call(this);
