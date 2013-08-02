var $builtinmodule = function(name) {

  function isNumber(x) {return typeof x === 'number';}
  function isUndefined(x) {return typeof x === 'undefined';}

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

  // This is what you would use in code. e.g. i = complex(0.0, 1.0)
  var COMPLEX_CONSTRUCTOR_NAME = "complex";
  var PROP_REAL = "real";
  var PROP_IMAG = "imag";

  var mod = {};

  mod[COMPLEX_CONSTRUCTOR_NAME] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, re, im) {
      self.tp$name = COMPLEX_CONSTRUCTOR_NAME;
      self.v = {"x": Sk.ffi.remapToJs(re), "y": Sk.ffi.remapToJs(im)};
    });
    $loc.__getattr__ = new Sk.builtin.func(function(z, name) {
      z = Sk.ffi.remapToJs(z);
      switch(name) {
        case PROP_REAL: {
          return Sk.builtin.assk$(z.x, Sk.builtin.nmber.float$);
        }
        case PROP_IMAG: {
          return Sk.builtin.assk$(z.y, Sk.builtin.nmber.float$);
        }
      }
    });
    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        x = a.x + b;
        y = a.y;
      }
      else {
        x = a.x + b.x;
        y = a.y + b.y;
      }
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });
    $loc.__radd__ = new Sk.builtin.func(function(b, a) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        x = a + b.x;
        y = b.y;
        return Sk.misceval.callsim(
          mod[COMPLEX_CONSTRUCTOR_NAME],
          Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
          Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__iadd__ = new Sk.builtin.func(function(aPy, b) {
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
    $loc.__sub__ = new Sk.builtin.func(function(a, b) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        x = a.x - b;
        y = a.y;
      }
      else {
        x = a.x - b.x;
        y = a.y - b.y;
      }
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });
    $loc.__rsub__ = new Sk.builtin.func(function(b, a) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        x = a - b.x;
        y = -b.y;
        return Sk.misceval.callsim(
          mod[COMPLEX_CONSTRUCTOR_NAME],
          Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
          Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__isub__ = new Sk.builtin.func(function(aPy, b) {
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
    $loc.__mul__ = new Sk.builtin.func(function(a, b) {
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
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });
    $loc.__rmul__ = new Sk.builtin.func(function(b, a) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        x = a * b.x;
        y = a * b.y;
        return Sk.misceval.callsim(
          mod[COMPLEX_CONSTRUCTOR_NAME],
          Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
          Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__imul__ = new Sk.builtin.func(function(aPy, b) {
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
    $loc.__div__ = new Sk.builtin.func(function(a, b) {
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
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });
    $loc.__rdiv__ = new Sk.builtin.func(function(b, a) {
      var x, y;
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        var factor = b.x * b.x + b.y * b.y;
        x = (a * b.x) / factor;
        y = (-a * b.y) / factor;
        return Sk.misceval.callsim(
          mod[COMPLEX_CONSTRUCTOR_NAME],
          Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
          Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__idiv__ = new Sk.builtin.func(function(aPy, b) {
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
    $loc.__str__ = new Sk.builtin.func(function(z) {
      z = Sk.ffi.remapToJs(z);
      if (!isUndefined(z)) {
        return new Sk.builtin.str("(" + stringFromCoordinates([z.x, z.y], ["1", "j"], "") + ")");
      }
      else {
        return new Sk.builtin.str("<type '" + COMPLEX_CONSTRUCTOR_NAME + "'>");
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(z) {
      z = Sk.ffi.remapToJs(z);
      if (!isUndefined(z)) {
        return new Sk.builtin.str(COMPLEX_CONSTRUCTOR_NAME + '(' + z.x + ', ' + z.y + ')');
      }
      else {
        return new Sk.builtin.str("__repr__(z)");
      }
    });
    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.x === b.x) && (a.y === b.y);
    });
    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.x !== b.x) || (a.y !== b.y);
    });
  }, COMPLEX_CONSTRUCTOR_NAME, []);

  // Conversions to and from polar coordinates
  mod.phase = new Sk.builtin.func(function(z) {
    z = Sk.ffi.remapToJs(z);
    if (isNumber(z.x) && isNumber(z.y)) {
      // The argument is a complex number.
      return Sk.builtin.assk$(phase(z.x, z.y), Sk.builtin.nmber.float$)
    }
    else if (isNumber(z)) {
      // The argument should be considered as a real number with no imaginary part.
      return Math.atan2(0, z);
    }
    else {
      return z;
    }
  });

  mod.polar = new Sk.builtin.func(function(z) {
    z = Sk.ffi.remapToJs(z);
    if (isNumber(z.x) && isNumber(z.y)) {
      return new Sk.builtin.tuple([norm(z.x, z.y), phase(z.x, z.y)]);
    }
    else if (isNumber(z)) {
      // The argument should be considered as a real number with no imaginary part.
      return Math.atan2(0, z);
    }
    else {
      // What do we do with illegal arguments?
    }
  });

  // Constants
  mod.pi = Sk.builtin.assk$(Math.PI, Sk.builtin.nmber.float$);
  mod.e =  Sk.builtin.assk$(Math.E, Sk.builtin.nmber.float$);

  return mod;
};
