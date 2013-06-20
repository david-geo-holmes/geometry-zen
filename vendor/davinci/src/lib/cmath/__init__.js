var $builtinmodule = function(name) {

  function isNumber(x) {
    return typeof x === 'number';
  }

  function phase(x, y) {
    return Math.atan2(y, x);
  }

  function norm(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  // This is what you would use in code. e.g. i = complex(0.0, 1.0)
  var COMPLEX_CONSTRUCTOR_NAME = "complex";

  var mod = {};

  var complex = function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, x, y) {
      self.x = Sk.builtin.asnum$(x);
      self.y = Sk.builtin.asnum$(y);
    });

    $loc.__add__ = new Sk.builtin.func(function(v, w) {
      return Sk.misceval.callsim(mod[COMPLEX_CONSTRUCTOR_NAME], v.x + w.x, v.y + w.y);
    });

    $loc.__sub__ = new Sk.builtin.func(function(v, w) {
      return Sk.misceval.callsim(mod[COMPLEX_CONSTRUCTOR_NAME], v.x - w.x, v.y - w.y);
    });

    $loc.__mul__ = new Sk.builtin.func(function(v, w) {
      return Sk.misceval.callsim(mod[COMPLEX_CONSTRUCTOR_NAME], v.x * w.x - v.y * w.y, v.y * w.x + v.x * w.y);
    });

    $loc.__div__ = new Sk.builtin.func(function(v, w) {
      var factor = w.x * w.x + w.y * w.y;
      var x = (v.x * w.x + v.y * w.y) / factor;
      var y = (v.y * w.x - v.x * w.y) / factor;
      return Sk.misceval.callsim(mod[COMPLEX_CONSTRUCTOR_NAME], x, y);
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(self.x + ' + ' + self.y + 'i');
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(COMPLEX_CONSTRUCTOR_NAME + '(' + self.x + ', ' + self.y + ')');
    });

    $loc.__eq__ = new Sk.builtin.func(function(v, w) {
      return (v.x === w.x) && (v.y === w.y);
    });

    $loc.__ne__ = new Sk.builtin.func(function(v, w) {
      return (v.x !== w.x) || (v.y !== w.y);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, key) {
      if (key === 'real') 
        return self.x
      else if (key === 'imag') 
        return self.y
    });

  };

  mod[COMPLEX_CONSTRUCTOR_NAME] = Sk.misceval.buildClass(mod, complex, COMPLEX_CONSTRUCTOR_NAME, []);

  // Conversions to and from polar coordinates
  mod.phase = new Sk.builtin.func(function(z) {
    if (isNumber(z.x) && isNumber(z.y)) {
      // The argument is a complex number.
      return Sk.builtin.assk$(phase(z.x, z.y), Sk.builtin.nmber.float$)
    }
    else if (isNumber(z.v)) {
      // The argument should be considered as a real number with no imaginary part.
      return Math.atan2(0, z.v);
    }
    else {
      return z;
    }
  });

  mod.polar = new Sk.builtin.func(function(z) {
    if (isNumber(z.x) && isNumber(z.y)) {
      return new Sk.builtin.tuple([norm(z.x, z.y), phase(z.x, z.y)]);
    }
    else if (isNumber(z.v)) {
      // The argument should be considered as a real number with no imaginary part.
      return Math.atan2(0, z.v);
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
