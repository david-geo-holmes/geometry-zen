/**
 * Geometric Algebra (e2ga) module for DaVinci Python.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {
  var EUCLIDEAN_2    = "Euclidean2";

  var mod = {};

  function isBoolean(x)   { return typeof x === 'boolean'; }
  function isNumber(x)    { return typeof x === 'number'; }
  function isString(x)    { return typeof x === 'string'; }
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

  function divide(a00, a01, a10, a11, b00, b01, b10, b11, x) {
    // r = ~b
    var r00 = +b00;
    var r01 = +b01;
    var r10 = +b10;
    var r11 = -b11;
    // m = b * r
    var m00 = bladeASM.mulE2(b00, b01, b10, b11, r00, r01, r10, r11, 0);
    var m01 = bladeASM.mulE2(b00, b01, b10, b11, r00, r01, r10, r11, 1);
    var m10 = bladeASM.mulE2(b00, b01, b10, b11, r00, r01, r10, r11, 2);
    var m11 = bladeASM.mulE2(b00, b01, b10, b11, r00, r01, r10, r11, 3);
    // c = cliffordConjugate(m)
    var c00 = +m00;
    var c01 = -m01;
    var c10 = -m10;
    var c11 = -m11;
    // s = r * c
    var s00 = bladeASM.mulE2(r00, r01, r10, r11, c00, c01, c10, c11, 0);
    var s01 = bladeASM.mulE2(r00, r01, r10, r11, c00, c01, c10, c11, 1);
    var s10 = bladeASM.mulE2(r00, r01, r10, r11, c00, c01, c10, c11, 2);
    var s11 = bladeASM.mulE2(r00, r01, r10, r11, c00, c01, c10, c11, 3);
    // k = b * s
    var k00 = bladeASM.mulE2(b00, b01, b10, b11, s00, s01, s10, s11, 0);
    // i = inverse(b)
    var i00 = s00/k00;
    var i01 = s01/k00;
    var i10 = s10/k00;
    var i11 = s11/k00;
    // x = a * inverse(b)
    var x00 = bladeASM.mulE2(a00, a01, a10, a11, i00, i01, i10, i11, 0);
    var x01 = bladeASM.mulE2(a00, a01, a10, a11, i00, i01, i10, i11, 1);
    var x10 = bladeASM.mulE2(a00, a01, a10, a11, i00, i01, i10, i11, 2);
    var x11 = bladeASM.mulE2(a00, a01, a10, a11, i00, i01, i10, i11, 3);
    if (typeof x !== 'undefined') {
      x[0] = x00;
      x[1] = x01;
      x[2] = x10;
      x[3] = x11;
    }
    else {
      return remapE2ToPy(x00, x01, x10, x11);
    }
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
        var a00 = a[0];
        var a01 = a[1];
        var a10 = a[2];
        var a11 = a[3];
        var b00 = b;
        var b01 = 0;
        var b10 = 0;
        var b11 = 0;
        var x00 = e2gaASM.add00(a00, a01, a10, a11, b00, b01, b10, b11);
        var x01 = e2gaASM.add01(a00, a01, a10, a11, b00, b01, b10, b11);
        var x10 = e2gaASM.add10(a00, a01, a10, a11, b00, b01, b10, b11);
        var x11 = e2gaASM.add11(a00, a01, a10, a11, b00, b01, b10, b11);
        return remapE2ToPy(x00, x01, x10, x11);
      }
      else {
        var a00 = a[0];
        var a01 = a[1];
        var a10 = a[2];
        var a11 = a[3];
        var b00 = b[0];
        var b01 = b[1];
        var b10 = b[2];
        var b11 = b[3];
        var x00 = e2gaASM.add00(a00, a01, a10, a11, b00, b01, b10, b11);
        var x01 = e2gaASM.add01(a00, a01, a10, a11, b00, b01, b10, b11);
        var x10 = e2gaASM.add10(a00, a01, a10, a11, b00, b01, b10, b11);
        var x11 = e2gaASM.add11(a00, a01, a10, a11, b00, b01, b10, b11);
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__radd__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var a00 = lhs;
        var a01 = 0;
        var a10 = 0;
        var a11 = 0;
        var b00 = rhs[0];
        var b01 = rhs[1];
        var b10 = rhs[2];
        var b11 = rhs[3];
        var x00 = e2gaASM.add00(a00, a01, a10, a11, b00, b01, b10, b11);
        var x01 = e2gaASM.add01(a00, a01, a10, a11, b00, b01, b10, b11);
        var x10 = e2gaASM.add10(a00, a01, a10, a11, b00, b01, b10, b11);
        var x11 = e2gaASM.add11(a00, a01, a10, a11, b00, b01, b10, b11);
        return remapE2ToPy(x00, x01, x10, x11);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " + " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__iadd__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a00 = self[0];
        var a01 = self[1];
        var a10 = self[2];
        var a11 = self[3];
        var b00 = other;
        var b01 = 0;
        var b10 = 0;
        var b11 = 0;
        self[0] = e2gaASM.add00(a00, a01, a10, a11, b00, b01, b10, b11);
        self[1] = e2gaASM.add01(a00, a01, a10, a11, b00, b01, b10, b11);
        self[2] = e2gaASM.add10(a00, a01, a10, a11, b00, b01, b10, b11);
        self[3] = e2gaASM.add11(a00, a01, a10, a11, b00, b01, b10, b11);
        return selfPy;
      }
      else {
        var a00 = self[0];
        var a01 = self[1];
        var a10 = self[2];
        var a11 = self[3];
        var b00 = other[0];
        var b01 = other[1];
        var b10 = other[2];
        var b11 = other[3];
        self[0] = e2gaASM.add00(a00, a01, a10, a11, b00, b01, b10, b11);
        self[1] = e2gaASM.add01(a00, a01, a10, a11, b00, b01, b10, b11);
        self[2] = e2gaASM.addE2(a00, a01, a10, a11, b00, b01, b10, b11);
        self[3] = e2gaASM.addE2(a00, a01, a10, a11, b00, b01, b10, b11);
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
    $loc.__div__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return divide(a[0], a[1], a[2], a[3], b, 0, 0, 0);
      }
      else {
        return divide(a[0], a[1], a[2], a[3], b[0], b[1], b[2], b[3]);
      }
    });
    $loc.__rdiv__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return divide(lhs, 0, 0, 0, rhs[0], rhs[1], rhs[2], rhs[3]);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " / " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__idiv__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        divide(self[0], self[1], self[2], self[3], other, 0, 0, 0, self)
        return selfPy;
      }
      else {
        divide(self[0], self[1], self[2], self[3], other[0], other[1], other[2], other[3], self)
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
    $loc.nu$neg = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapE2ToPy(-self[0], -self[1], -self[2], -self[3]);
    };
    $loc.nu$pos = function() {
      return this;
    };
    $loc.nu$inv = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapE2ToPy(self[0], self[1], self[2], -self[3]);
    };
    $loc.__getitem__ = new Sk.builtin.func(function(mv, index) {
      mv = Sk.ffi.remapToJs(mv);
      index = Sk.builtin.asnum$(index);
      switch(index) {
        case 0: {
          return remapE2ToPy(mv[0], 0, 0, 0);
        }
        case 1: {
          return remapE2ToPy(0, mv[1], mv[2], 0);
        }
        case 2: {
          return remapE2ToPy(0, 0, 0, mv[3]);
        }
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      return new Sk.builtin.str(EUCLIDEAN_2 + "(" + mv.join(", ") + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      if (isDefined(mv)) {
        return new Sk.builtin.str(bladeSTR.stringFromCoordinates([mv[0], mv[1], mv[2], mv[3]], ["1", "i", "j", "I"]));
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
        throw new Error(key + " is not a valid " + EUCLIDEAN_2 + " attribute.");
      }
    });
  }, EUCLIDEAN_2, []);

  return mod;
}
