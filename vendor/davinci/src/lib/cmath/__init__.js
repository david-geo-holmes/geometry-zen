var $builtinmodule = function(name) {

  var COMPLEX = "complex";
  var PROP_REAL = "real";
  var PROP_IMAG = "imag";

  function isNumber(x) {return typeof x === 'number';}
  function isUndefined(x) {return typeof x === 'undefined';}
  function isComplex(argPy) { return Sk.ffi.isObjectRef(argPy) && Sk.ffi.typeName(argPy) === COMPLEX;};

  function phase(x, y) {
    return Math.atan2(y, x);
  }

  function norm(x, y) {
    return Math.sqrt(x * x + y * y);
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

  var mod = {};

  function cartesianToComplexPy(x, y) {
    return Sk.ffi.callsim(mod[COMPLEX], Sk.ffi.numberToPy(x), Sk.ffi.numberToPy(y));
  }

  mod[COMPLEX] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, rePy, imPy) {
      Sk.ffi.checkMethodArgs(COMPLEX, arguments, 2, 2);
      Sk.ffi.checkArgType(PROP_REAL, "Number", Sk.ffi.isNumber(rePy));
      Sk.ffi.checkArgType(PROP_IMAG, "Number", Sk.ffi.isNumber(imPy));
      Sk.ffi.referenceToPy({"x": Sk.ffi.remapToJs(rePy), "y": Sk.ffi.remapToJs(imPy)}, COMPLEX, undefined, selfPy);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(z, name) {
      z = Sk.ffi.remapToJs(z);
      switch(name) {
        case PROP_REAL: {
          return Sk.ffi.numberToPy(z.x);
        }
        case PROP_IMAG: {
          return Sk.ffi.numberToPy(z.y);
        }
      }
    });
    $loc.__add__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      if (isComplex(otherPy)) {
        return cartesianToComplexPy(a.x + b.x, a.y + b.y);
      }
      else if (Sk.ffi.isNumber(otherPy)) {
        return cartesianToComplexPy(a.x + b, a.y);
      }
      else {
        throw Sk.ffi.err.expectArg("other").toHaveType(COMPLEX);
      }
    });
    $loc.__radd__ = Sk.ffi.functionPy(function(otherPy, selfPy) {
      Sk.ffi.checkArgType("self", "Number", Sk.ffi.isNumber(selfPy));
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      return cartesianToComplexPy(a + b.x, b.y);
    });
    $loc.__iadd__ = Sk.ffi.functionPy(function(aPy, b) {
      var a = Sk.ffi.remapToJs(aPy);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        a.x += b;
      }
      else {
        a.x += b.x;
        a.y += b.y;
      }
      return aPy;
    });
    $loc.__sub__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      if (isComplex(otherPy)) {
        return cartesianToComplexPy(a.x - b.x, a.y - b.y);
      }
      else if (Sk.ffi.isNumber(otherPy)) {
        return cartesianToComplexPy(a.x - b, a.y);
      }
      else {
        throw Sk.ffi.err.expectArg("other").toHaveType(COMPLEX);
      }
    });
    $loc.__rsub__ = Sk.ffi.functionPy(function(b, a) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        x = a - b.x;
        y = -b.y;
        return cartesianToComplexPy(x, y);
      }
      else {
        throw Sk.ffi.err.expectArg("a").toHaveType("Number");
      }
    });
    $loc.__isub__ = Sk.ffi.functionPy(function(aPy, b) {
      var a = Sk.ffi.remapToJs(aPy);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        a.x -= b;
      }
      else {
        a.x -= b.x;
        a.y -= b.y;
      }
      return aPy;
    });
    $loc.__mul__ = Sk.ffi.functionPy(function(a, b) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        x = a.x * b;
        y = a.y * b;
      }
      else {
        x = a.x * b.x - a.y * b.y;
        y = a.y * b.x + a.x * b.y;
      }
      return cartesianToComplexPy(x, y);
    });
    $loc.__rmul__ = Sk.ffi.functionPy(function(b, a) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        x = a * b.x;
        y = a * b.y;
        return cartesianToComplexPy(x, y);
      }
      else {
        throw Sk.ffi.err.expectArg("a").toHaveType("Number");
      }
    });
    $loc.__imul__ = Sk.ffi.functionPy(function(aPy, b) {
      var a = Sk.ffi.remapToJs(aPy);
      var aX = a.x;
      var aY = a.y;
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        a.x *= b;
        a.y *= b;
      }
      else {
        a.x = aX * b.x - aY * b.y;
        a.y = aY * b.x + aX * b.y;
      }
      return aPy;
    });
    $loc.__div__ = Sk.ffi.functionPy(function(a, b) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        x = a.x / b;
        y = a.y / b;
      }
      else {
        var factor = b.x * b.x + b.y * b.y;
        x = (a.x * b.x + a.y * b.y) / factor;
        y = (a.y * b.x - a.x * b.y) / factor;
      }
      return cartesianToComplexPy(x, y);
    });
    $loc.__rdiv__ = Sk.ffi.functionPy(function(b, a) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        var factor = b.x * b.x + b.y * b.y;
        x = (a * b.x) / factor;
        y = (-a * b.y) / factor;
        return cartesianToComplexPy(x, y);
      }
      else {
        throw Sk.ffi.err.expectArg("a").toHaveType("Number");
      }
    });
    $loc.__idiv__ = Sk.ffi.functionPy(function(aPy, b) {
      var a = Sk.ffi.remapToJs(aPy);
      var aX = a.x;
      var aY = a.y;
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        a.x /= b;
        a.y /= b;
      }
      else {
        var factor = b.x * b.x + b.y * b.y;
        a.x = (aX * b.x + aY * b.y) / factor;
        a.y = (aY * b.x - aX * b.y) / factor;
      }
      return aPy;
    });
    $loc.__pos__ = Sk.ffi.functionPy(function(selfPy) {
      return selfPy;
    });
    $loc.__neg__ = Sk.ffi.functionPy(function(selfPy) {
      var z = Sk.ffi.remapToJs(selfPy);
      return cartesianToComplexPy(-z.x, -z.y);
    });
    $loc.__invert__ = Sk.ffi.functionPy(function(selfPy) {
      var onePy = cartesianToComplexPy(1, 0);
      return Sk.ffi.callsim(selfPy['__div__'], onePy, selfPy);
    });
    $loc.__str__ = Sk.ffi.functionPy(function(z) {
      z = Sk.ffi.remapToJs(z);
      return Sk.ffi.stringToPy("(" + stringFromCoordinates([z.x, z.y], ["1", "j"], "") + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(z) {
      z = Sk.ffi.remapToJs(z);
      return Sk.ffi.stringToPy(COMPLEX + '(' + z.x + ', ' + z.y + ')');
    });
    $loc.__eq__ = Sk.ffi.functionPy(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.x === b.x) && (a.y === b.y);
    });
    $loc.__ne__ = Sk.ffi.functionPy(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.x !== b.x) || (a.y !== b.y);
    });
  }, COMPLEX, []);

  // Conversions to and from polar coordinates
  mod.phase = Sk.ffi.functionPy(function(xPy) {
    Sk.ffi.checkFunctionArgs("phase", arguments, 1, 1);
    if (isComplex(xPy)) {
      var z = Sk.ffi.remapToJs(xPy);
      return Sk.ffi.numberToPy(phase(z.x, z.y));
    }
    else if (Sk.ffi.isNumber(xPy)) {
      return Sk.ffi.numberToPy(Math.atan2(0, Sk.ffi.remapToJs(xPy)));
    }
    else {
      Sk.ffi.checkArgType("x", COMPLEX, false);
    }
  });

  mod.polar = Sk.ffi.functionPy(function(xPy) {
    Sk.ffi.checkFunctionArgs("polar", arguments, 1, 1);
    if (isComplex(xPy)) {
      var z = Sk.ffi.remapToJs(xPy);
      return Sk.ffi.tuplePy([Sk.ffi.remapToPy(norm(z.x, z.y)), Sk.ffi.remapToPy(phase(z.x, z.y))]);
    }
    else if (Sk.ffi.isNumber(xPy)) {
      return Sk.ffi.tuplePy([Sk.ffi.remapToPy(norm(Sk.ffi.remapToJs(xPy), 0)), Sk.ffi.remapToPy(0)]);
    }
    else {
      Sk.ffi.checkArgType("x", COMPLEX, false);
    }
  });

  // Constants
  mod.pi = Sk.ffi.numberToPy(Math.PI);
  mod.e =  Sk.ffi.numberToPy(Math.E);

  return mod;
};
