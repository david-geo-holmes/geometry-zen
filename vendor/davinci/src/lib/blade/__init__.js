/**
 * Geometric Algebra (blade) module for Skulpt Python.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {
  /**
   * Symbolic constants representing the Python classes or functions that are exported by this module.
   * These are captured here for both consistency and self-documentation.
   */
  var EUCLIDEAN_2    = "Euclidean2";    // Multivector of 2-dimensional Euclidean space.
  var EUCLIDEAN_3    = "Euclidean3";    // Multivector of 3-dimensional Euclidean space.

  // The following symbolic constant simulates a zero scalar argument for convenience functions.
  var ARG_ZERO      = Sk.builtin.assk$(0, Sk.builtin.nmber.float$);

  var mod = {};

  function isNumber(x)    { return typeof x === 'number'; }
  function isString(x)    { return typeof x === 'string'; }
  function isBoolean(x)   { return typeof x === 'boolean'; }
  function isNull(x)      { return typeof x === 'object' && x === null; }
  function isUndefined(x) { return typeof x === 'undefined'; }
  function isDefined(x)   { return typeof x !== 'undefined'; }

  function remapE2ToPy(x0, x1, x2, x3) {
    return Sk.misceval.callsim(mod[EUCLIDEAN_2],
      Sk.builtin.assk$(x0, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x1, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x2, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x3, Sk.builtin.nmber.float$));
  }

  function remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7) {
    return Sk.misceval.callsim(mod[EUCLIDEAN_3],
      Sk.builtin.assk$(x0, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x1, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x2, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x3, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x4, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x5, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x6, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x7, Sk.builtin.nmber.float$));
  }

  mod[EUCLIDEAN_2] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, x0, x1, x2, x3) {
      x0 = Sk.ffi.remapToJs(x0);
      x1 = Sk.ffi.remapToJs(x1);
      x2 = Sk.ffi.remapToJs(x2);
      x3 = Sk.ffi.remapToJs(x3);
      self.tp$name = EUCLIDEAN_2;
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " + " + JSON.stringify(rhs, null, 2));
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " - " + JSON.stringify(rhs, null, 2));
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " * " + JSON.stringify(rhs, null, 2));
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " ^ " + JSON.stringify(rhs, null, 2));
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " << " + JSON.stringify(rhs, null, 2));
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
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
        return remapE2ToPy(x0, x1, x2, x3);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " >> " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__or__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      throw new Error("Under construction or");
    });

    // Unary minus.
    $loc.nb$negative = function() {
      var v = this.v;
      throw new Error("Under construction unary minus");
    };

    // Unary plus.
    $loc.nb$positive = function() {
      return this;
    };

    $loc.__div__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      throw new Error("Under construction");
    });
    $loc.__repr__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      return new Sk.builtin.str(EUCLIDEAN_2 + "(" + mv.join(", ") + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      if (isDefined(mv)) {
        return new Sk.builtin.str(BLADE.Euclidean2.fromCartesian(mv[0], mv[1], mv[2], mv[3]).toStringIJK());
      }
      else {
        return new Sk.builtin.str("<type '" + EUCLIDEAN_2 + "'>");
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

    $loc.__getattr__ = new Sk.builtin.func(function(self, key) {
      if (key === 'w') {
        return Sk.builtin.assk$(self.v.coordinate(0), Sk.builtin.nmber.float$);
      }
      else if (key === 'x') {
        return Sk.builtin.assk$(self.v.coordinate(1), Sk.builtin.nmber.float$);
      }
      else if (key === 'y') {
        return Sk.builtin.assk$(self.v.coordinate(2), Sk.builtin.nmber.float$);
      }
      else if (key === 'xy') {
        return Sk.builtin.assk$(self.v.coordinate(3), Sk.builtin.nmber.float$);
      }
      else {
        throw new Error(key + " is not a valid " + EUCLIDEAN_2 + " attribute.");
      }
    });
  }, EUCLIDEAN_2, []);

  mod[EUCLIDEAN_3] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, x0, x1, x2, x3, x4, x5, x6, x7) {
      x0 = Sk.ffi.remapToJs(x0);
      x1 = Sk.ffi.remapToJs(x1);
      x2 = Sk.ffi.remapToJs(x2);
      x3 = Sk.ffi.remapToJs(x3);
      x4 = Sk.ffi.remapToJs(x4);
      x5 = Sk.ffi.remapToJs(x5);
      x6 = Sk.ffi.remapToJs(x6);
      x7 = Sk.ffi.remapToJs(x7);
      self.tp$name = EUCLIDEAN_3;
      self.v = [x0, x1, x2, x3, x4, x5, x6, x7];
    });
    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        var x0 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var b4 = b[4];
        var b5 = b[5];
        var b6 = b[6];
        var b7 = b[7];
        var x0 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
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
        var a4 = 0;
        var a5 = 0;
        var a6 = 0;
        var a7 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var b4 = rhs[4];
        var b5 = rhs[5];
        var b6 = rhs[6];
        var b7 = rhs[7];
        var x0 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " + " + JSON.stringify(rhs, null, 2));
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
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        var x0 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var b4 = b[4];
        var b5 = b[5];
        var b6 = b[6];
        var b7 = b[7];
        var x0 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
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
        var a4 = 0;
        var a5 = 0;
        var a6 = 0;
        var a7 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var b4 = rhs[4];
        var b5 = rhs[5];
        var b6 = rhs[6];
        var b7 = rhs[7];
        var x0 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " - " + JSON.stringify(rhs, null, 2));
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
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        var x0 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var b4 = b[4];
        var b5 = b[5];
        var b6 = b[6];
        var b7 = b[7];
        var x0 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
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
        var a4 = 0;
        var a5 = 0;
        var a6 = 0;
        var a7 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var b4 = rhs[4];
        var b5 = rhs[5];
        var b6 = rhs[6];
        var b7 = rhs[7];
        var x0 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " * " + JSON.stringify(rhs, null, 2));
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
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        var x0 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var b4 = b[4];
        var b5 = b[5];
        var b6 = b[6];
        var b7 = b[7];
        var x0 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
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
        var a4 = 0;
        var a5 = 0;
        var a6 = 0;
        var a7 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var b4 = rhs[4];
        var b5 = rhs[5];
        var b6 = rhs[6];
        var b7 = rhs[7];
        var x0 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " ^ " + JSON.stringify(rhs, null, 2));
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
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        var x0 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var b4 = b[4];
        var b5 = b[5];
        var b6 = b[6];
        var b7 = b[7];
        var x0 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
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
        var a4 = 0;
        var a5 = 0;
        var a6 = 0;
        var a7 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var b4 = rhs[4];
        var b5 = rhs[5];
        var b6 = rhs[6];
        var b7 = rhs[7];
        var x0 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " << " + JSON.stringify(rhs, null, 2));
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
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b;
        var b1 = 0;
        var b2 = 0;
        var b3 = 0;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        var x0 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var a3 = a[3];
        var a4 = a[4];
        var a5 = a[5];
        var a6 = a[6];
        var a7 = a[7];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];
        var b4 = b[4];
        var b5 = b[5];
        var b6 = b[6];
        var b7 = b[7];
        var x0 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
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
        var a4 = 0;
        var a5 = 0;
        var a6 = 0;
        var a7 = 0;
        var b0 = rhs[0];
        var b1 = rhs[1];
        var b2 = rhs[2];
        var b3 = rhs[3];
        var b4 = rhs[4];
        var b5 = rhs[5];
        var b6 = rhs[6];
        var b7 = rhs[7];
        var x0 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = bladeASM.rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return remapE3ToPy(x0, x1, x2, x3, x4, x5, x6, x7);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " >> " + JSON.stringify(rhs, null, 2));
      }
    });

    $loc.__or__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      var w   =             + a.x * b.x   + a.y * b.y   + a.z * b.z   - a.xy * b.xy  - a.yz * b.yz  - a.zx * b.zx  - a.xyz * b.xyz;
      var x   =                           - a.y * b.xy  + a.z * b.zx  + a.xy * b.y   - a.yz * b.xyz - a.zx * b.z   - a.xyz * b.yz;
      var y   =             + a.x * b.xy                - a.z * b.yz  - a.xy * b.x   + a.yz * b.z   - a.zx * b.xyz - a.xyz * b.zx;
      var z   =             - a.x * b.zx  + a.y * b.yz                - a.xy * b.xyz - a.yz * b.y   + a.zx * b.x   - a.xyz * b.xy;
      var xy  =                                         + a.z * b.xyz                - a.yz * b.zx  + a.zx * b.yz  + a.xyz * b.z;
      var yz  =             + a.x * b.xyz                             + a.xy * b.zx                 - a.zx * b.xy  + a.xyz * b.x;
      var zx  =                           + a.y * b.xyz               - a.xy * b.yz  + a.yz * b.xy                 + a.xyz * b.y;
      var xyz = 0.0;
      return remapE3ToPy(w, x, y, z, xy, yz, zx, xyz);
    });

    // Unary minus.
    $loc.nb$negative = function() {
      var m = Sk.ffi.remapToJs(this);
      var cs = m.coordinates();
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(-cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(-cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(-cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(-cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(-cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(-cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(-cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(-cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    };

    // Unary plus.
    $loc.nb$positive = function() {
      return this;
    };

    $loc.__div__ = new Sk.builtin.func(function(v, w) {
      var factor = w.x * w.x + w.y * w.y;
      var x = (v.x * w.x + v.y * w.y) / factor;
      var y = (v.y * w.x - v.x * w.y) / factor;
      return remapE3ToPy(x, y);
    });

    $loc.__getitem__ = new Sk.builtin.func(function(self, index) {
      index = Sk.builtin.asnum$(index);
      var m = Sk.ffi.remapToJs(self);
      switch(index) {
        case 0: {
          return remapE3ToPy(m[0], 0, 0, 0, 0, 0, 0, 0);
        }
        case 1: {
          return remapE3ToPy(0, m[1], m[2], m[3], 0, 0, 0, 0);
        }
        case 2: {
          return remapE3ToPy(0, 0, 0, 0, m[4], m[5], m[6], 0);
        }
        case 3: {
          return remapE3ToPy(0, 0, 0, 0, 0, 0, 0, m[7]);
        }
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      return new Sk.builtin.str(EUCLIDEAN_3 + "(" + mv.join(", ") + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      if (isDefined(mv)) {
        return new Sk.builtin.str(BLADE.Euclidean3.fromCartesian(mv[0], mv[1], mv[2], mv[3], mv[4], mv[5], mv[6], mv[7]).toStringIJK());
      }
      else {
        return new Sk.builtin.str("<type '" + EUCLIDEAN_3 + "'>");
      }
    });
    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.w === b.w) && (a.x === b.x) && (a.y === b.y) && (a.z === b.z) && (a.xy === b.xy) && (a.yz === b.yz) && (a.zx === b.zx) && (a.xyz === b.xyz);
    });

    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.w !== b.w) || (a.x !== b.x) || (a.y !== b.y) || (a.z !== b.z) || (a.xy !== b.xy) || (a.yz !== b.yz) || (a.zx !== b.zx) || (a.xyz !== b.xyz);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, key) {
      if (key === 'w') {
        return Sk.builtin.assk$(self.v.coordinate(0), Sk.builtin.nmber.float$);
      }
      else if (key === 'x') {
        return Sk.builtin.assk$(self.v.coordinate(1), Sk.builtin.nmber.float$);
      }
      else if (key === 'y') {
        return Sk.builtin.assk$(self.v.coordinate(2), Sk.builtin.nmber.float$);
      }
      else if (key === 'z') {
        return Sk.builtin.assk$(self.v.coordinate(3), Sk.builtin.nmber.float$);
      }
      else if (key === 'xy') {
        return Sk.builtin.assk$(self.v.coordinate(4), Sk.builtin.nmber.float$);
      }
      else if (key === 'yz') {
        return Sk.builtin.assk$(self.v.coordinate(5), Sk.builtin.nmber.float$);
      }
      else if (key === 'zx') {
        return Sk.builtin.assk$(self.v.coordinate(6), Sk.builtin.nmber.float$);
      }
      else if (key === 'xyz') {
        return Sk.builtin.assk$(self.v.coordinate(7), Sk.builtin.nmber.float$);
      }
      else {
        throw new Error(key + " is not a valid " + EUCLIDEAN_3 + " attribute.");
      }
    });
  }, EUCLIDEAN_3, []);

  return mod;
}
