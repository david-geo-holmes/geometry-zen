/**
 * Convenience function for incorporating a Euclidean2 class into a module.
 *
 * Usage:
 *
 * Sk.builtin.defineEuclidean2(mod);
 */
(function() {
this.BLADE = this.BLADE || {};
var BLADE = this.BLADE;
Sk.builtin.defineEuclidean2 = function(mod) {

  var EUCLIDEAN_2    = "Euclidean2";
  var SCALAR_2       = "Scalar2";
  var VECTOR_2       = "Vector2";
  var PSEUDOSCALAR_2 = "Pseudoscalar2";
  var UNIT           = "Unit";
  var MEASURE        = "Measure";

  var PROP_W         = "w";
  var PROP_X         = "x";
  var PROP_Y         = "y";
  var PROP_XY        = "xy";
  var METHOD_CLONE   = "clone";
  var METHOD_LENGTH  = "length";

  function isNumber(x)    { return typeof x === 'number'; }

  function remapE2ToPy(x00, x01, x10, x11) {
    return Sk.ffi.callsim(mod[EUCLIDEAN_2], Sk.ffi.numberToPy(x00), Sk.ffi.numberToPy(x01), Sk.ffi.numberToPy(x10), Sk.ffi.numberToPy(x11));
  }

  function stringFromCoordinates(coordinates, labels, multiplier) {
    var append, i, sb, str, _i, _ref;
    sb = [];
    append = function(number, label) {
      var n;
      if (number !== 0) {
        if (number >= 0) {
          if (sb.length > 0) {
            sb.push("+");
          }
        } else {
          sb.push("-");
        }
        n = Math.abs(number);
        if (n === 1) {
          return sb.push(label);
        } else {
          sb.push(n.toString());
          if (label !== "1") {
            sb.push(multiplier);
            return sb.push(label);
          }
        }
      }
    };
    for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      append(coordinates[i], labels[i]);
    }
    if (sb.length > 0) {
      str = sb.join("");
    } else {
      str = "0";
    }
    return str;
  }

  function divide(a00, a01, a10, a11, b00, b01, b10, b11, m) {
    // r = ~b
    var r00 = +b00;
    var r01 = +b01;
    var r10 = +b10;
    var r11 = -b11;
    // m = b * r
    var m00 = b00 * r00 + b01 * r01 + b10 * r10 - b11 * r11;
    var m01 = 0;
    var m10 = 0;
    var m11 = 0;
    // c = cliffordConjugate(m)
    var c00 = +m00;
    var c01 = -m01;
    var c10 = -m10;
    var c11 = -m11;
    // s = r * c
    var s00 = r00 * c00 + r01 * c01 + r10 * c10 - r11 * c11;
    var s01 = r00 * c01 + r01 * c00 - r10 * c11 + r11 * c10;
    var s10 = r00 * c10 + r01 * c11 + r10 * c00 - r11 * c01;
    var s11 = r00 * c11 + r01 * c10 - r10 * c01 + r11 * c00;
    // k = b * s
    var k00 = b00 * s00 + b01 * s01 + b10 * s10 - b11 * s11;
    // i = inverse(b)
    var i00 = s00/k00;
    var i01 = s01/k00;
    var i10 = s10/k00;
    var i11 = s11/k00;
    // x = a * inverse(b)
    var x00 = a00 * i00 + a01 * i01 + a10 * i10 - a11 * i11;
    var x01 = a00 * i01 + a01 * i00 - a10 * i11 + a11 * i10;
    var x10 = a00 * i10 + a01 * i11 + a10 * i00 - a11 * i01;
    var x11 = a00 * i11 + a01 * i10 - a10 * i01 + a11 * i00;
    if (typeof m !== 'undefined') {
      m[PROP_W]  = x00;
      m[PROP_X]  = x01;
      m[PROP_Y]  = x10;
      m[PROP_XY] = x11;
    }
    else {
      return remapE2ToPy(x00, x01, x10, x11);
    }
  }

  mod[SCALAR_2] = Sk.ffi.defineFunction(function(w) {
    Sk.ffi.checkArgCount(SCALAR_2, arguments, 1, 1);
    Sk.ffi.checkArgType("w", "Number", Sk.ffi.isNumber(w));
    w = Sk.ffi.remapToJs(w);
    return remapE2ToPy(w, 0, 0, 0);
  });

  mod[VECTOR_2] = Sk.ffi.defineFunction(function(x, y) {
    Sk.ffi.checkArgCount(VECTOR_2, arguments, 2, 2);
    Sk.ffi.checkArgType("x", "Number", Sk.ffi.isNumber(x));
    Sk.ffi.checkArgType("y", "Number", Sk.ffi.isNumber(y));
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    return remapE2ToPy(0, x, y, 0);
  });

  mod[PSEUDOSCALAR_2] = Sk.ffi.defineFunction(function(xy) {
    Sk.ffi.checkArgCount(PSEUDOSCALAR_2, arguments, 1, 1);
    Sk.ffi.checkArgType("xy", "Number", Sk.ffi.isNumber(xy));
    xy = Sk.ffi.remapToJs(xy);
    return remapE2ToPy(0, 0, 0, xy);
  });

  mod[EUCLIDEAN_2] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.defineFunction(function(self, x00, x01, x10, x11) {
      self.tp$name = EUCLIDEAN_2;
      Sk.ffi.checkArgCount(EUCLIDEAN_2, arguments, 2, 5);
      switch(Sk.ffi.getType(x00)) {
        case Sk.ffi.PyType.FLOAT:
        case Sk.ffi.PyType.INT: {
          Sk.ffi.checkArgCount(EUCLIDEAN_2, arguments, 5, 5);
          Sk.ffi.checkArgType("w",  "Number", Sk.ffi.isNumber(x00));
          Sk.ffi.checkArgType("x",  "Number", Sk.ffi.isNumber(x01));
          Sk.ffi.checkArgType("y",  "Number", Sk.ffi.isNumber(x10));
          Sk.ffi.checkArgType("xy", "Number", Sk.ffi.isNumber(x11));
          x00 = Sk.ffi.remapToJs(x00);
          x01 = Sk.ffi.remapToJs(x01);
          x10 = Sk.ffi.remapToJs(x10);
          x11 = Sk.ffi.remapToJs(x11);
          self.v = new BLADE.Euclidean2(x00, x01, x10, x11);
        }
        break;
        case Sk.ffi.PyType.REFERENCE: {
          Sk.ffi.checkArgCount(EUCLIDEAN_2, arguments, 2, 2);
          self.v = Sk.ffi.remapToJs(x00);
        }
        break;
        default: {
          throw new Sk.builtin.AssertionError("Ouch " + Sk.ffi.getType(x00));
        }
      }
    });
    $loc.__add__ = Sk.ffi.defineFunction(function(lhs, rhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(rhs)) {
        return remapE2ToPy(lhs.w + rhs, lhs.x, lhs.y, lhs.xy);
      }
      else {
        return remapE2ToPy(lhs.w + rhs.w, lhs.x + rhs.x, lhs.y + rhs.y, lhs.xy + rhs.xy);
      }
    });
    $loc.__radd__ = Sk.ffi.defineFunction(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs + rhs.w, rhs.x, rhs.y, rhs.xy);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " + " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__iadd__ = Sk.ffi.defineFunction(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self.w += other;
        return selfPy;
      }
      else {
        self.w  += other.w;
        self.x  += other.x;
        self.y  += other.y;
        self.xy += other.xy;
        return selfPy;
      }
    });
    $loc.__sub__ = Sk.ffi.defineFunction(function(lhs, rhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(rhs)) {
        return remapE2ToPy(lhs.w - rhs, lhs.x, lhs.y, lhs.xy);
      }
      else {
        return remapE2ToPy(lhs.w - rhs.w, lhs.x - rhs.x, lhs.y - rhs.y, lhs.xy - rhs.xy);
      }
    });
    $loc.__rsub__ = Sk.ffi.defineFunction(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs - rhs.w, -rhs.x, -rhs.y, -rhs.xy);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " - " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__isub__ = Sk.ffi.defineFunction(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self.w -= other;
        return selfPy;
      }
      else {
        self.w  -= other.w;
        self.x  -= other.x;
        self.y  -= other.y;
        self.xy -= other.xy;
        return selfPy;
      }
    });
    $loc.__mul__ = Sk.ffi.defineFunction(function(lhsPy, rhsPy) {
      switch(Sk.ffi.getType(rhsPy)) {
        case Sk.ffi.PyType.REFERENCE: {
          switch(Sk.ffi.typeName(rhsPy)) {
            case EUCLIDEAN_2: {
              var a = Sk.ffi.remapToJs(lhsPy);
              var b = Sk.ffi.remapToJs(rhsPy);
              var a00 = a.w;
              var a01 = a.x;
              var a10 = a.y;
              var a11 = a.xy;
              var b00 = b.w;
              var b01 = b.x;
              var b10 = b.y;
              var b11 = b.xy;
              var x00 = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
              var x01 = a00 * b01 + a01 * b00 - a10 * b11 + a11 * b10;
              var x10 = a00 * b10 + a01 * b11 + a10 * b00 - a11 * b01;
              var x11 = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
              return remapE2ToPy(x00, x01, x10, x11);
            }
            case UNIT: {
              return Sk.ffi.callsim(mod[MEASURE], lhsPy, rhsPy);
            }
            default: {
              throw new Sk.builtin.AssertionError(EUCLIDEAN_2 + " (__mul__) typeName(rhsPy) => " + Sk.ffi.typeName(rhsPy));
            }
          }
        }
        case Sk.ffi.PyType.FLOAT:
        case Sk.ffi.PyType.INT: {
          var a = Sk.ffi.remapToJs(lhsPy);
          var b = Sk.ffi.remapToJs(rhsPy);
          return remapE2ToPy(a.w * b, a.x * b, a.y * b, a.xy * b);
        }
        default: {
          throw new Sk.builtin.AssertionError(EUCLIDEAN_2 + " (__mul__) typeofPy(rhsPy) => " + Sk.ffi.getType(rhsPy));
        }
      }
    });
    $loc.__rmul__ = Sk.ffi.defineFunction(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs.w, lhs * rhs.x, lhs * rhs.y, lhs * rhs.xy);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " * " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__imul__ = Sk.ffi.defineFunction(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self.w  *= other;
        self.x  *= other;
        self.y  *= other;
        self.xy *= other;
        return selfPy;
      }
      else {
        var a00 = self.w;
        var a01 = self.x;
        var a10 = self.y;
        var a11 = self.xy;
        var b00 = other.w;
        var b01 = other.x;
        var b10 = other.y;
        var b11 = other.xy;
        self.w  = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        self.x  = a00 * b01 + a01 * b00 - a10 * b11 + a11 * b10;
        self.y  = a00 * b10 + a01 * b11 + a10 * b00 - a11 * b01;
        self.xy = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
        return selfPy;
      }
    });
    $loc.__div__ = Sk.ffi.defineFunction(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return divide(a.w, a.x, a.y, a.xy, b, 0, 0, 0, undefined);
      }
      else {
        return divide(a.w, a.x, a.y, a.xy, b.w, b.x, b.y, b.xy, undefined);
      }
    });
    $loc.__rdiv__ = Sk.ffi.defineFunction(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return divide(lhs, 0, 0, 0, rhs.w, rhs.x, rhs.y, rhs.xy, undefined);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " / " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__idiv__ = Sk.ffi.defineFunction(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        divide(self.w, self.x, self.y, self.xy, other, 0, 0, 0, self);
        return selfPy;
      }
      else {
        divide(self.w, self.x, self.y, self.xy, other.w, other.x, other.y, other.xy, self);
        return selfPy;
      }
    });
    $loc.__xor__ = Sk.ffi.defineFunction(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE2ToPy(a.w * b, a.x * b, a.y * b, a.xy * b);
      }
      else {
        var a00 = a.w;
        var a01 = a.x;
        var a10 = a.y;
        var a11 = a.xy;
        var b00 = b.w;
        var b01 = b.x;
        var b10 = b.y;
        var b11 = b.xy;
        var x00 = a00 * b00;
        var x01 = a00 * b01 + a01 * b00;
        var x10 = a00 * b10             + a10 * b00;
        var x11 = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__rxor__ = Sk.ffi.defineFunction(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs.w, lhs * rhs.x, lhs * rhs.y, lhs * rhs.xy);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " ^ " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__ixor__ = Sk.ffi.defineFunction(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self.w  *= other;
        self.x  *= other;
        self.y  *= other;
        self.xy *= other;
        return selfPy;
      }
      else {
        var a00 = self.w;
        var a01 = self.x;
        var a10 = self.y;
        var a11 = self.xy;
        var b00 = other.w;
        var b01 = other.x;
        var b10 = other.y;
        var b11 = other.xy;
        self.w  = a00 * b00;
        self.x  = a00 * b01 + a01 * b00;
        self.y  = a00 * b10             + a10 * b00;
        self.xy = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
        return selfPy;
      }
    });
    $loc.__lshift__ = Sk.ffi.defineFunction(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE2ToPy(a.w * b, 0, 0, 0);
      }
      else {
        var a00 = a.w;
        var a01 = a.x;
        var a10 = a.y;
        var a11 = a.xy;
        var b00 = b.w;
        var b01 = b.x;
        var b10 = b.y;
        var b11 = b.xy;
        var x00 = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        var x01 = a00 * b01             - a10 * b11;
        var x10 = a00 * b10 + a01 * b11;
        var x11 = a00 * b11;
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__rlshift__ = Sk.ffi.defineFunction(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs.w, lhs * rhs.x, lhs * rhs.y, lhs * rhs.xy);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " << " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__ilshift__ = Sk.ffi.defineFunction(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self.w *= other;
        self.x  = 0;
        self.y  = 0;
        self.xy = 0;
        return selfPy;
      }
      else {
        var a00 = self.w;
        var a01 = self.x;
        var a10 = self.y;
        var a11 = self.xy;
        var b00 = other.w;
        var b01 = other.x;
        var b10 = other.y;
        var b11 = other.xy;
        self.w  = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        self.x  = a00 * b01             - a10 * b11;
        self.y  = a00 * b10 + a01 * b11;
        self.xy = a00 * b11;
        return selfPy;
      }
    });
    $loc.__rshift__ = Sk.ffi.defineFunction(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE2ToPy(a.w * b, -a.x * b, -a.y * b, a.xy * b);
      }
      else {
        var a00 = a.w;
        var a01 = a.x;
        var a10 = a.y;
        var a11 = a.xy;
        var b00 = b.w;
        var b01 = b.x;
        var b10 = b.y;
        var b11 = b.xy;
        var x00 = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        var x01 =           + a01 * b00             + a11 * b10;
        var x10 =                       + a10 * b00 - a11 * b01;
        var x11 =                                     a11 * b00;
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__rrshift__ = Sk.ffi.defineFunction(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs.w, 0, 0, 0);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " >> " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__irshift__ = Sk.ffi.defineFunction(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a00 = self.w;
        var a01 = self.x;
        var a10 = self.y;
        var a11 = self.xy;
        var b00 = other;
        var b01 = 0;
        var b10 = 0;
        var b11 = 0;
        self.w  *=  other;
        self.x  *= -other;
        self.y  *= -other;
        self.xy *=  other;
        return selfPy;
      }
      else {
        var a00 = self.w;
        var a01 = self.x;
        var a10 = self.y;
        var a11 = self.xy;
        var b00 = other.w;
        var b01 = other.x;
        var b10 = other.y;
        var b11 = other.xy;
        self.w  = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        self.x  =           + a01 * b00             + a11 * b10;
        self.y  =                       + a10 * b00 - a11 * b01;
        self.xy =                                     a11 * b00;
        return selfPy;
      }
    });
    $loc.nb$negative = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapE2ToPy(-self.w, -self.x, -self.y, -self.xy);
    };
    $loc.nb$positive = function() {
      return this;
    };
    $loc.nb$invert = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapE2ToPy(self.w, self.x, self.y, -self.xy);
    };
    $loc.__getitem__ = Sk.ffi.defineFunction(function(mv, index) {
      mv = Sk.ffi.remapToJs(mv);
      index = Sk.ffi.remapToJs(index);
      switch(index) {
        case 0: {
          return remapE2ToPy(mv.w, 0, 0, 0);
        }
        case 1: {
          return remapE2ToPy(0, mv.x, mv.y, 0);
        }
        case 2: {
          return remapE2ToPy(0, 0, 0, mv.xy);
        }
      }
    });
    $loc.__repr__ = Sk.ffi.defineFunction(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      return Sk.ffi.stringToPy(EUCLIDEAN_2 + "(" + [mv.w, mv.x, mv.y, mv.xy].map(function(x) {return String(x);}).join(", ") + ")");
    });
    $loc.__str__ = Sk.ffi.defineFunction(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      if (mv.isNaN()) {
        return Sk.ffi.stringToPy("NaN");
      }
      else {
        return Sk.ffi.stringToPy(stringFromCoordinates([mv.w, mv.x, mv.y, mv.xy], ["1", "i", "j", "I"], "*"));
      }
    });
    $loc.__eq__ = Sk.ffi.defineFunction(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.w === b.w) && (a.x === b.x) && (a.y === b.y) && (a.xy === b.xy);
    });
    $loc.__ne__ = Sk.ffi.defineFunction(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.w !== b.w) || (a.x !== b.x) || (a.y !== b.y) || (a.xy !== b.xy);
    });
    $loc.__getattr__ = Sk.ffi.defineFunction(function(mvPy, name) {
      var mv = Sk.ffi.remapToJs(mvPy);
      switch(name) {
        case PROP_W: {
          return Sk.ffi.numberToPy(mv[PROP_W]);
        }
        case PROP_X: {
          return Sk.ffi.numberToPy(mv[PROP_X]);
        }
        case PROP_Y: {
          return Sk.ffi.numberToPy(mv[PROP_Y]);
        }
        case PROP_XY: {
          return Sk.ffi.numberToPy(mv[PROP_XY]);
        }
        case METHOD_CLONE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.defineFunction(function(methodPy) {
              methodPy.tp$name = METHOD_CLONE;
            });
            $loc.__call__ = Sk.ffi.defineFunction(function(methodPy) {
              return remapE2ToPy(mv.w, mv.x, mv.y, mv.xy);
            });
            $loc.__str__ = Sk.ffi.defineFunction(function(methodPy) {
              return Sk.ffi.stringToPy(METHOD_CLONE);
            });
            $loc.__repr__ = Sk.ffi.defineFunction(function(methodPy) {
              return Sk.ffi.stringToPy(METHOD_CLONE);
            });
          }, METHOD_CLONE, []));
        }
        case METHOD_LENGTH: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.defineFunction(function(self) {
              self.tp$name = METHOD_LENGTH;
            });
            $loc.__call__ = Sk.ffi.defineFunction(function(self) {
              return Sk.ffi.numberToIntPy(4);
            });
            $loc.__str__ = Sk.ffi.defineFunction(function(self) {
              return Sk.ffi.stringToPy(METHOD_LENGTH);
            });
            $loc.__repr__ = Sk.ffi.defineFunction(function(self) {
              return Sk.ffi.stringToPy(METHOD_LENGTH);
            });
          }, METHOD_LENGTH, []));
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.defineFunction(function(selfPy, name, valuePy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_W: {
          self.w = value;
        }
        break;
        case PROP_X: {
          self.x = value;
        }
        break;
        case PROP_Y: {
          self.y = value;
        }
        break;
        case PROP_XY: {
          self.xy = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a writeable attribute of " + EUCLIDEAN_2);
        }
      }
    });
  }, EUCLIDEAN_2, []);
};
}).call(this);
