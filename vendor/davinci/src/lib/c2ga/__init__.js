/**
 * Geometric Algebra (c2ga) module for DaVinci Python.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {
  /**
   * Symbolic constants representing the Python classes or functions that are exported by this module.
   * These are captured here for both consistency and self-documentation.
   */
  var CONFORMAL_2    = "Conformal2";    // Multivector of 4-dimensional Conformal space to represent Euclidean 2D Motions.

  // The following symbolic constant simulates a zero scalar argument for convenience functions.
  var ARG_ZERO      = Sk.builtin.assk$(0, Sk.builtin.nmber.float$);

  var mod = {};

  function isNumber(x)    { return typeof x === 'number'; }
  function isString(x)    { return typeof x === 'string'; }
  function isBoolean(x)   { return typeof x === 'boolean'; }
  function isNull(x)      { return typeof x === 'object' && x === null; }
  function isUndefined(x) { return typeof x === 'undefined'; }
  function isDefined(x)   { return typeof x !== 'undefined'; }

  function remapC3ToPy(x0, x1, x2, x3) {
    return Sk.misceval.callsim(mod[CONFORMAL_2],
      Sk.builtin.assk$(x0, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x1, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x2, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x3, Sk.builtin.nmber.float$));
  }

  mod[CONFORMAL_2] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, x0, x1, x2, x3) {
      x0 = Sk.ffi.remapToJs(x0);
      x1 = Sk.ffi.remapToJs(x1);
      x2 = Sk.ffi.remapToJs(x2);
      x3 = Sk.ffi.remapToJs(x3);
      self.tp$name = CONFORMAL_2;
      self.v = [x0, x1, x2, x3];
    });
    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var x0 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
    });
    $loc.__radd__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var a0 = lhs;
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var x0 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " + " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__iadd__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        self[0] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
      else {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other[0];
        var b1 = other[1];
        var b2 = other[2];
        var b3 = other[3];
        self[0] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.addE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
    });
    $loc.__sub__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var x0 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
    });
    $loc.__rsub__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var a0 = lhs;
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var x0 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " - " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__isub__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        self[0] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
      else {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other[0];
        var b1 = other[1];
        var b2 = other[2];
        var b3 = other[3];
        self[0] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
    });
    $loc.__mul__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var x0 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
    });
    $loc.__rmul__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var a0 = lhs;
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var x0 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " * " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__imul__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        self[0] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
      else {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other[0];
        var b1 = other[1];
        var b2 = other[2];
        var b3 = other[3];
        self[0] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
    });
    $loc.__xor__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var x0 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
    });
    $loc.__rxor__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var a0 = lhs;
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var x0 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " ^ " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__ixor__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        self[0] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
      else {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other[0];
        var b1 = other[1];
        var b2 = other[2];
        var b3 = other[3];
        self[0] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
    });
    $loc.__lshift__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var x0 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
    });
    $loc.__rlshift__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var a0 = lhs;
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var x0 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " << " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__ilshift__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        self[0] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
      else {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other[0];
        var b1 = other[1];
        var b2 = other[2];
        var b3 = other[3];
        self[0] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
    });
    $loc.__rshift__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var x0 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var x0 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
    });
    $loc.__rrshift__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var a0 = lhs;
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var x0 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        var x1 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        var x2 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        var x3 = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return remapC3ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " >> " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__irshift__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        self[0] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
      else {
        var a0 = self[0];
        var a1 = self[1];
        var a2 = self[2];
        var a3 = self[3];
        var b0 = other[0];
        var b1 = other[1];
        var b2 = other[2];
        var b3 = other[3];
        self[0] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        self[1] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        self[2] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        self[3] = bladeASM.rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return selfPy;
      }
    });
    $loc.__or__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      throw new Error("Under construction or");
    });
    $loc.nb$negative = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapC3ToPy(-self[0], -self[1], -self[2], -self[3]);
    };
    $loc.nb$positive = function() {
      return this;
    };
    $loc.nb$invert = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapC3ToPy(self[0], self[1], self[2], -self[3]);
    };
    $loc.__div__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      throw new Error("Under construction");
    });
    $loc.__repr__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      return new Sk.builtin.str(CONFORMAL_2 + "(" + mv.join(", ") + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      if (isDefined(mv)) {
        return new Sk.builtin.str(bladeSTR.stringFromCoordinates([mv[0], mv[1], mv[2], mv[3]], ["1", "i", "j", "I"]));
      }
      else {
        return new Sk.builtin.str("<type '" + CONFORMAL_2 + "'>");
      }
    });
    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      throw new Error("Under construction eq");
    });

    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      throw new Error("Under construction ne");
    });

    $loc.__getattr__ = new Sk.builtin.func(function(selfPy, key) {
      var self = Sk.ffi.remapToJs(selfPy);
      if (key === 'w') {
        return Sk.builtin.assk$(self[0], Sk.builtin.nmber.float$);
      }
      else if (key === 'x') {
        return Sk.builtin.assk$(self[1], Sk.builtin.nmber.float$);
      }
      else if (key === 'y') {
        return Sk.builtin.assk$(self[2], Sk.builtin.nmber.float$);
      }
      else if (key === 'xy') {
        return Sk.builtin.assk$(self[3], Sk.builtin.nmber.float$);
      }
      else {
        throw new Error(key + " is not a valid " + CONFORMAL_2 + " attribute.");
      }
    });
  }, CONFORMAL_2, []);

  return mod;
}
