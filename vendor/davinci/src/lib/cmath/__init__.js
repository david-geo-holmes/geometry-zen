var $builtinmodule = function(name) {

  function isNumber(x) {return typeof x === 'number';}
  function isUndefined(x) {return typeof x === 'undefined';}

  function phase(x, y) {
    return Math.atan2(y, x);
  }

  function norm(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  // This is what you would use in code. e.g. i = complex(0.0, 1.0)
  var COMPLEX_CONSTRUCTOR_NAME = "complex";

  var mod = {};

  mod[COMPLEX_CONSTRUCTOR_NAME] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, re, im) {
      self.tp$name = COMPLEX_CONSTRUCTOR_NAME;
      self.v = {re: Sk.ffi.remapToJs(re), im: Sk.ffi.remapToJs(im)};
    });

    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      var x = bladeASM.addEuclidean2(a.re, 0, 0, a.im, b.re, 0, 0, b.im, 0);
      var y = bladeASM.addEuclidean2(a.re, 0, 0, a.im, b.re, 0, 0, b.im, 3);
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });

    $loc.__sub__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      var x = bladeASM.subEuclidean2(a.re, 0, 0, a.im, b.re, 0, 0, b.im, 0);
      var y = bladeASM.subEuclidean2(a.re, 0, 0, a.im, b.re, 0, 0, b.im, 3);
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });

    $loc.__mul__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      var x = bladeASM.mulEuclidean2(a.re, 0, 0, a.im, b.re, 0, 0, b.im, 0);
      var y = bladeASM.mulEuclidean2(a.re, 0, 0, a.im, b.re, 0, 0, b.im, 3);
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });

    $loc.__div__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      var factor = b.re * b.re + b.im * b.im;
      var x = (a.re * b.re + a.im * b.im) / factor;
      var y = (a.im * b.re - a.re * b.im) / factor;
      return Sk.misceval.callsim(
        mod[COMPLEX_CONSTRUCTOR_NAME],
        Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
        Sk.builtin.assk$(y, Sk.builtin.nmber.float$));
    });

    $loc.__str__ = new Sk.builtin.func(function(z) {
      z = Sk.ffi.remapToJs(z);
      if (!isUndefined(z)) {
        return new Sk.builtin.str('(' + z.re + '+' + z.im + 'j)');
      }
      else {
        return new Sk.builtin.str("<type '" + COMPLEX_CONSTRUCTOR_NAME + "'>");
      }
    });

    $loc.__repr__ = new Sk.builtin.func(function(z) {
      z = Sk.ffi.remapToJs(z);
      if (!isUndefined(z)) {
        return new Sk.builtin.str(COMPLEX_CONSTRUCTOR_NAME + '(' + z.re + ', ' + z.im + ')');
      }
      else {
        return new Sk.builtin.str("__repr__(z)");
      }
    });

    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.re === b.re) && (a.im === b.im);
    });

    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a.re !== b.re) || (a.im !== b.im);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(z, key) {
      z = Sk.ffi.remapToJs(z);
      if (key === 'real') {
        return z.re
      }
      else if (key === 'imag') {
        return z.im
      }
    });

  }, COMPLEX_CONSTRUCTOR_NAME, []);

  // Conversions to and from polar coordinates
  mod.phase = new Sk.builtin.func(function(z) {
    z = Sk.ffi.remapToJs(z);
    if (isNumber(z.re) && isNumber(z.im)) {
      // The argument is a complex number.
      return Sk.builtin.assk$(phase(z.re, z.im), Sk.builtin.nmber.float$)
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
    if (isNumber(z.re) && isNumber(z.im)) {
      return new Sk.builtin.tuple([norm(z.re, z.im), phase(z.re, z.im)]);
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
}
