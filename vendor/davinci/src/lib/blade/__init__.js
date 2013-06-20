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

  /**
   * We're doing Geometric Algebra here so it's really all about Clifford Numbers and
   * Clifford Algebras over the real numbers. The purpose of this function is to convert
   * an argument of the form {"skType": ..., "v": ...} into a JavaScript number.
   */
  function numberFromScalarArg(arg, argName, functionName) {
    if (isNull(arg)) {
      throw new Sk.builtin.TypeError(functionName + "( ... " + argName + " ... ) must be convertible to a number, but was None.");
    }
    if (isBoolean(arg)) {
      throw new Sk.builtin.TypeError(functionName + "( ... " + argName + " ... ) must be convertible to a number, but was a Boolean.");
    }

    if (arg.skType) {
      switch(arg.skType) {
        case EUCLIDEAN_2: {
          return arg.v.coordinate(0);
        }
        case EUCLIDEAN_3: {
          return arg.v.coordinate(0);
        }
        case 'float': {
          return arg.v;
        }
        case 'int': {
          return arg.v;
        }
        default: {
          throw new Sk.builtin.TypeError(functionName + "(" + argName + ": " + arg.skType + ") must be convertible to a number.");
        }
      }
    }
    else if (arg.v) {
      if (isString(arg.v)) {
        throw new Sk.builtin.TypeError(functionName + "( ... " + argName + " ... ) must be convertible to a number, but was a String.");
      }
      else {
        throw new Sk.builtin.AssertionError(functionName + "( ... " + argName + " ... ) is unknown.");
      }
    }
    else {
      throw new Sk.builtin.AssertionError(functionName + "( ... " + argName + " ... ) is unknown.");
    }
  }

  function integerToNumber(arg, argName, functionName) {
    // TODO: Maybe need an argument to say whether undefined is acceptable?
    // TODO: Likewise for whether null is acceptable.
    if (isUndefined(arg)) {
      return arg;
    }
    else if (isNull(arg)) {
      return null;
    }
    else {
      if (arg.skType) {
        switch(arg.skType) {
          case 'int': {
            return arg.v;
          }
        }
      }
      throw new Sk.builtin.AssertionError(functionName + "( ... " + argName + " ... ) must be an integer.");
    }
  }

  function boxCartesian3(w, x, y, z, xy, yz, zx, xyz) {
    return Sk.misceval.callsim(mod[EUCLIDEAN_3],
      Sk.builtin.assk$(w, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(y, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(z, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(xy, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(yz, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(zx, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(xyz, Sk.builtin.nmber.float$));
  }

  function unboxArg2(arg, name) {
    if (isNull(arg)) {
      throw new Sk.builtin.TypeError("1");
    }
    if (isBoolean(arg)) {
      throw new Sk.builtin.TypeError("2");
    }

    if (arg.skType) {
      switch(arg.skType) {
        case EUCLIDEAN_2: {
          return arg.v;
        }
        case 'float': {
          if (isNumber(arg.v)) {
            return BLADE.Euclidean2.fromCartesian(arg.v, 0, 0, 0);
          }
          else {
            throw new Sk.builtin.AssertionError();
          }
        }
        break;
        case 'int': {
          if (isNumber(arg.v)) {
            return BLADE.Euclidean2.fromCartesian(arg.v, 0, 0, 0);
          }
          else {
            throw new Sk.builtin.AssertionError();
          }
        }
        break;
        default: {
          throw new Sk.builtin.TypeError("Unknown skType: " + arg.skType);
        }
      }
    }
    else if (arg.v) {
      if (isString(arg.v)) {
        throw new Sk.builtin.TypeError("6");
      }
      else {
        throw new Sk.builtin.AssertionError("7");
      }
    }
    else {
      throw new Sk.builtin.AssertionError("8");
    }
  }

  function unboxArg3(arg, name) {
    if (isNull(arg)) {
      throw new Sk.builtin.TypeError("1");
    }
    if (isBoolean(arg)) {
      throw new Sk.builtin.TypeError("2");
    }

    if (arg.skType) {
      switch(arg.skType) {
        case EUCLIDEAN_3: {
          return arg.v;
        }
        case 'float': {
          if (isNumber(arg.v)) {
            return BLADE.Euclidean3.fromCartesian(arg.v, 0, 0, 0, 0, 0, 0, 0);
          }
          else {
            throw new Sk.builtin.AssertionError("3");
          }
        }
        break;
        case 'int': {
          if (isNumber(arg.v)) {
            return BLADE.Euclidean3.fromCartesian(arg.v, 0, 0, 0, 0, 0, 0, 0);
          }
          else {
            throw new Sk.builtin.AssertionError("4");
          }
        }
        break;
        default: {
          throw new Sk.builtin.TypeError("Unknown skType: " + arg.skType);
        }
      }
    }
    else if (arg.v) {
      if (isString(arg.v)) {
        throw new Sk.builtin.TypeError("6");
      }
      else {
        throw new Sk.builtin.AssertionError("7");
      }
    }
    else {
      throw new Sk.builtin.AssertionError("8");
    }
  }

  mod[EUCLIDEAN_2] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, x0, x1, x2, x3) {
      self.skType = EUCLIDEAN_2;
      self.tp$name = EUCLIDEAN_2;
      self.v = new BLADE.Euclidean2(
        numberFromScalarArg(x0, "x[0]", EUCLIDEAN_2),
        numberFromScalarArg(x1, "x[1]", EUCLIDEAN_2),
        numberFromScalarArg(x2, "x[2]", EUCLIDEAN_2),
        numberFromScalarArg(x3, "x[3]", EUCLIDEAN_2)
      );
    });

    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg2(a, "lhs of addition operator");
      b = unboxArg2(b, "rhs of addition operator");
      var cs = BLADE.Euclidean2.add(a.coordinates(), b.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__sub__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = unboxArg2(lhs, "lhs of subtraction operator");
      rhs = unboxArg2(rhs, "rhs of subtraction operator");
      var cs = BLADE.Euclidean2.sub(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__rsub__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = unboxArg2(lhs, "lhs of subtraction operator");
      rhs = unboxArg2(rhs, "rhs of subtraction operator");
      var cs = BLADE.Euclidean2.sub(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__mul__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = unboxArg2(lhs, "lhs of multiplication operator");
      rhs = unboxArg2(rhs, "rhs of multiplication operator");
      var cs = BLADE.Euclidean2.mul(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__rmul__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = unboxArg2(lhs, "lhs of multiplication operator");
      rhs = unboxArg2(rhs, "rhs of multiplication operator");
      var cs = BLADE.Euclidean2.mul(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__xor__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg2(a, "lhs of exterior product operator");
      b = unboxArg2(b, "rhs of exterior product operator");
      var cs = BLADE.Euclidean2.wedge(a.coordinates(), b.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__lshift__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg2(a, "lhs of left contraction operator");
      b = unboxArg2(b, "rhs of left contraction operator");
      var cs = BLADE.Euclidean2.lshift(a.coordinates(), b.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__rshift__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg2(a, "lhs of right contraction operator");
      b = unboxArg2(b, "rhs of right contraction operator");
      var cs = BLADE.Euclidean2.rshift(a.coordinates(), b.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_2], xs[0], xs[1], xs[2], xs[3]);
    });

    $loc.__or__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg2(a, "lhs of interior product operator");
      b = unboxArg2(b, "rhs of interior product operator");
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
      a = unboxArg2(a, "lhs of interior product operator");
      b = unboxArg2(b, "rhs of interior product operator");
      throw new Error("Under construction");
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(self.v.toStringIJK());
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var v = self.v;
      return new Sk.builtin.str(EUCLIDEAN_2 + '(' + v.coordinate(0) + ', ' + v.coordinate(1) + ', ' + v.coordinate(2) + ', ' + v.coordinate(3) + ')');
    });

    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg2(a, "lhs of equality operator");
      b = unboxArg2(b, "rhs of equality operator");
      throw new Error("Under construction eq");
    });

    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg2(a, "lhs of inequality operator");
      b = unboxArg2(b, "rhs of inequality operator");
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
      self.skType = EUCLIDEAN_3;
      self.tp$name = EUCLIDEAN_3;
      self.v = BLADE.Euclidean3.fromCartesian(
        numberFromScalarArg(x0, "x0", EUCLIDEAN_3),
        numberFromScalarArg(x1, "x1", EUCLIDEAN_3),
        numberFromScalarArg(x2, "x2", EUCLIDEAN_3),
        numberFromScalarArg(x3, "x3", EUCLIDEAN_3),
        numberFromScalarArg(x4, "x4", EUCLIDEAN_3),
        numberFromScalarArg(x5, "x5", EUCLIDEAN_3),
        numberFromScalarArg(x6, "x6", EUCLIDEAN_3),
        numberFromScalarArg(x7, "x7", EUCLIDEAN_3)
      );
    });

    $loc.__add__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = unboxArg3(lhs, "lhs of addition operator");
      rhs = unboxArg3(rhs, "rhs of addition operator");
      var cs = BLADE.Euclidean3.add(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__radd__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = unboxArg3(lhs, "lhs of addition operator");
      rhs = unboxArg3(rhs, "rhs of addition operator");
      var cs = BLADE.Euclidean3.add(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__sub__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = unboxArg3(lhs, "lhs of subtraction operator");
      rhs = unboxArg3(rhs, "rhs of subtraction operator");
      var cs = BLADE.Euclidean3.sub(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__rsub__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = unboxArg3(lhs, "lhs of subtraction operator");
      rhs = unboxArg3(rhs, "rhs of subtraction operator");
      var cs = BLADE.Euclidean3.sub(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });
    $loc.__mul__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = unboxArg3(lhs, "lhs of multiplication operator");
      rhs = unboxArg3(rhs, "rhs of multiplication operator");
      var cs = BLADE.Euclidean3.mul(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__rmul__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = unboxArg3(lhs, "lhs of multiplication operator");
      rhs = unboxArg3(rhs, "rhs of multiplication operator");
      var cs = BLADE.Euclidean3.mul(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__xor__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = unboxArg3(lhs, "lhs of exterior product operator");
      rhs = unboxArg3(rhs, "rhs of exterior product operator");
      var cs = BLADE.Euclidean3.wedge(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__rxor__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = unboxArg3(lhs, "lhs of exterior product operator");
      rhs = unboxArg3(rhs, "rhs of exterior product operator");
      var cs = BLADE.Euclidean3.wedge(lhs.coordinates(), rhs.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });
    $loc.__lshift__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of left contraction operator");
      b = unboxArg3(b, "rhs of left contraction operator");
      var cs = BLADE.Euclidean3.lshift(a.coordinates(), b.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__rshift__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of right contraction operator");
      b = unboxArg3(b, "rhs of right contraction operator");
      var cs = BLADE.Euclidean3.rshift(a.coordinates(), b.coordinates());
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__or__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of interior product operator");
      b = unboxArg3(b, "rhs of interior product operator");
      var w   =             + a.x * b.x   + a.y * b.y   + a.z * b.z   - a.xy * b.xy  - a.yz * b.yz  - a.zx * b.zx  - a.xyz * b.xyz;
      var x   =                           - a.y * b.xy  + a.z * b.zx  + a.xy * b.y   - a.yz * b.xyz - a.zx * b.z   - a.xyz * b.yz;
      var y   =             + a.x * b.xy                - a.z * b.yz  - a.xy * b.x   + a.yz * b.z   - a.zx * b.xyz - a.xyz * b.zx;
      var z   =             - a.x * b.zx  + a.y * b.yz                - a.xy * b.xyz - a.yz * b.y   + a.zx * b.x   - a.xyz * b.xy;
      var xy  =                                         + a.z * b.xyz                - a.yz * b.zx  + a.zx * b.yz  + a.xyz * b.z;
      var yz  =             + a.x * b.xyz                             + a.xy * b.zx                 - a.zx * b.xy  + a.xyz * b.x;
      var zx  =                           + a.y * b.xyz               - a.xy * b.yz  + a.yz * b.xy                 + a.xyz * b.y;
      var xyz = 0.0;
      return boxCartesian3(w, x, y, z, xy, yz, zx, xyz);
    });

    // Unary minus.
    $loc.nb$negative = function() {
      var m = unboxArg3(this, "unary minus");
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
      return boxCartesian3(x, y);
    });

    $loc.__getitem__ = new Sk.builtin.func(function(self, index) {
      index = Sk.builtin.asnum$(index);
      var m = unboxArg3(self, "grade extraction operator");
      var cs = m.grade(index).coordinates();
      var xs = [ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO];
      xs[0] = Sk.builtin.assk$(cs[0], Sk.builtin.nmber.float$);
      xs[1] = Sk.builtin.assk$(cs[1], Sk.builtin.nmber.float$);
      xs[2] = Sk.builtin.assk$(cs[2], Sk.builtin.nmber.float$);
      xs[3] = Sk.builtin.assk$(cs[3], Sk.builtin.nmber.float$);
      xs[4] = Sk.builtin.assk$(cs[4], Sk.builtin.nmber.float$);
      xs[5] = Sk.builtin.assk$(cs[5], Sk.builtin.nmber.float$);
      xs[6] = Sk.builtin.assk$(cs[6], Sk.builtin.nmber.float$);
      xs[7] = Sk.builtin.assk$(cs[7], Sk.builtin.nmber.float$);
      return Sk.misceval.callsim(mod[EUCLIDEAN_3], xs[0], xs[1], xs[2], xs[3], xs[4], xs[5], xs[6], xs[7]);
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(self.v.toStringIJK());
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var m = self.v;
      var w = m.coordinate(0);
      var x = m.coordinate(1);
      var y = m.coordinate(2);
      var z = m.coordinate(3);
      var xy = m.coordinate(4);
      var yz = m.coordinate(5);
      var zx = m.coordinate(6);
      var xyz = m.coordinate(7);
      return new Sk.builtin.str(EUCLIDEAN_3 + '(' + w + ', ' + x + ', ' + y + ', ' + z + ', ' + xy + ', ' + yz + ', ' + zx + ', ' + xyz + ')');
    });

    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of equality operator");
      b = unboxArg3(b, "rhs of equality operator");
      return (a.w === b.w) && (a.x === b.x) && (a.y === b.y) && (a.z === b.z) && (a.xy === b.xy) && (a.yz === b.yz) && (a.zx === b.zx) && (a.xyz === b.xyz);
    });

    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of inequality operator");
      b = unboxArg3(b, "rhs of inequality operator");
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
