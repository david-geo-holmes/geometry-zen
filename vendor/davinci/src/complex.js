/**
 * Convenience function for incorporating complex into a module.
 *
 * Usage:
 *
 * Sk.builtin.defineComplex(mod);
 */
(function() {
  Sk.builtin.defineComplex = function(mod, COMPLEX) {
    Sk.ffi.checkFunctionArgs("defineComplex", arguments, 2, 2);
  /**
   * @const
   * @type {string}
   */
    var PROP_REAL = "real";
  /**
   * @const
   * @type {string}
   */
    var PROP_IMAG = "imag";
  /**
   * @const
   * @type {string}
   */
    var NUMBER   = "Number";
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

    function isComplex(valuePy) {return Sk.ffi.isObjectRef(valuePy) && Sk.ffi.typeName(valuePy) === COMPLEX;};

    function phase(x, y) {return Math.atan2(y, x);}

    function norm(x, y) {return Math.sqrt(x * x + y * y);}

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

    /**
     * @param {number} x
     * @param {number} y
     * @return {!Object}
     */
    function cartesianToComplexPy(x, y) {return Sk.ffi.callsim(mod[COMPLEX], Sk.ffi.numberToPy(x), Sk.ffi.numberToPy(y));}

    mod[COMPLEX] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
      $loc.__init__ = Sk.ffi.functionPy(function(selfPy, rePy, imPy) {
        Sk.ffi.checkMethodArgs(COMPLEX, arguments, 2, 2);
        Sk.ffi.checkArgType(PROP_REAL, NUMBER, Sk.ffi.isNumber(rePy));
        Sk.ffi.checkArgType(PROP_IMAG, NUMBER, Sk.ffi.isNumber(imPy));
        Sk.ffi.referenceToPy({x: Sk.ffi.remapToJs(rePy), y: Sk.ffi.remapToJs(imPy)}, COMPLEX, undefined, selfPy);
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
          throw Sk.ffi.err.argument(ARG_OTHER).mustHaveType(COMPLEX);
        }
      });
      $loc.__radd__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        Sk.ffi.checkArgType(ARG_OTHER, NUMBER, Sk.ffi.isNumber(otherPy));
        var a = Sk.ffi.remapToJs(otherPy);
        var b = Sk.ffi.remapToJs(selfPy);
        return cartesianToComplexPy(a + b.x, b.y);
      });
      $loc.__iadd__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var a = Sk.ffi.remapToJs(selfPy);
        var b = Sk.ffi.remapToJs(otherPy);
        if (Sk.ffi.isNumber(otherPy)) {
          a.x += b;
        }
        else if (isComplex(otherPy)) {
          a.x += b.x;
          a.y += b.y;
        }
        else {
          throw Sk.ffi.err.argument(ARG_OTHER).mustHaveType([COMPLEX, NUMBER]);
        }
        return selfPy;
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
          throw Sk.ffi.err.argument(ARG_OTHER).mustHaveType([COMPLEX, NUMBER]);
        }
      });
      $loc.__rsub__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var x, y;
        var a = Sk.ffi.remapToJs(otherPy);
        var b = Sk.ffi.remapToJs(selfPy);
        if (Sk.ffi.isNumber(otherPy)) {
          x = a - b.x;
          y = -b.y;
          return cartesianToComplexPy(x, y);
        }
        else {
          throw Sk.ffi.err.argument(ARG_OTHER).mustHaveType(NUMBER);
        }
      });
      $loc.__isub__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var a = Sk.ffi.remapToJs(selfPy);
        var b = Sk.ffi.remapToJs(otherPy);
        if (Sk.ffi.isNumber(otherPy)) {
          a.x -= b;
        }
        else {
          a.x -= b.x;
          a.y -= b.y;
        }
        return selfPy;
      });
      $loc.__mul__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var x, y;
        var a = Sk.ffi.remapToJs(selfPy);
        var b = Sk.ffi.remapToJs(otherPy);
        if (Sk.ffi.isNumber(otherPy)) {
          x = a.x * b;
          y = a.y * b;
        }
        else {
          x = a.x * b.x - a.y * b.y;
          y = a.y * b.x + a.x * b.y;
        }
        return cartesianToComplexPy(x, y);
      });
      $loc.__rmul__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var x, y;
        var a = Sk.ffi.remapToJs(otherPy);
        var b = Sk.ffi.remapToJs(selfPy);
        if (Sk.ffi.isNumber(otherPy)) {
          x = a * b.x;
          y = a * b.y;
          return cartesianToComplexPy(x, y);
        }
        else {
          throw Sk.ffi.err.argument("a").mustHaveType(NUMBER);
        }
      });
      $loc.__imul__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var a = Sk.ffi.remapToJs(selfPy);
        var aX = a.x;
        var aY = a.y;
        var b = Sk.ffi.remapToJs(otherPy);
        if (Sk.ffi.isNumber(otherPy)) {
          a.x *= b;
          a.y *= b;
        }
        else {
          a.x = aX * b.x - aY * b.y;
          a.y = aY * b.x + aX * b.y;
        }
        return selfPy;
      });
      // TODO: Use of nb$* will require fixes in abstract.js
      /*
      $loc.nb$divide = function(otherPy) {
        Sk.ffi.checkArgType("self",  COMPLEX, isComplex(this));
        var a = Sk.ffi.remapToJs(this);
        var b = Sk.ffi.remapToJs(otherPy);
        if (isComplex(otherPy)) {
          var factor = b.x * b.x + b.y * b.y;
          return cartesianToComplexPy((a.x * b.x + a.y * b.y) / factor, (a.y * b.x - a.x * b.y) / factor);
        }
        else if (Sk.ffi.isNumber(otherPy)) {
          return cartesianToComplexPy(a.x / b, a.y / b);
        }
        else {
          throw Sk.ffi.err.expectArg("other").toHaveType([COMPLEX, NUMBER].join(" or "));
        }
      };
      $loc.nb$rdiv = function(otherPy) {
        Sk.ffi.checkArgType("other", NUMBER,  Sk.ffi.isNumber(otherPy));
        var a = Sk.ffi.remapToJs(otherPy);
        var b = Sk.ffi.remapToJs(this);
        var factor = b.x * b.x + b.y * b.y;
        return cartesianToComplexPy((a * b.x) / factor, (-a * b.y) / factor);
      };
      */
      $loc.__div__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var a = Sk.ffi.remapToJs(selfPy);
        var b = Sk.ffi.remapToJs(otherPy);
        if (isComplex(otherPy)) {
          var factor = b.x * b.x + b.y * b.y;
          return cartesianToComplexPy((a.x * b.x + a.y * b.y) / factor, (a.y * b.x - a.x * b.y) / factor);
        }
        else if (Sk.ffi.isNumber(otherPy)) {
          return cartesianToComplexPy(a.x / b, a.y / b);
        }
        else {
          Sk.ffi.checkArgType(ARG_OTHER, [COMPLEX, NUMBER], false);
        }
      });
      $loc.__rdiv__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        Sk.ffi.checkArgType(ARG_OTHER, NUMBER,  Sk.ffi.isNumber(otherPy));
        var a = Sk.ffi.remapToJs(otherPy);
        var b = Sk.ffi.remapToJs(selfPy);
        if (Sk.ffi.isNumber(otherPy)) {
          var factor = b.x * b.x + b.y * b.y;
          return cartesianToComplexPy((a * b.x) / factor, (-a * b.y) / factor);
        }
        else {
          throw Sk.ffi.err.argument(ARG_OTHER).mustHaveType(NUMBER);
        }
      });
      $loc.__idiv__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
        var a = Sk.ffi.remapToJs(selfPy);
        var aX = a.x;
        var aY = a.y;
        var b = Sk.ffi.remapToJs(otherPy);
        if (Sk.ffi.isNumber(otherPy)) {
          a.x /= b;
          a.y /= b;
        }
        else {
          var factor = b.x * b.x + b.y * b.y;
          a.x = (aX * b.x + aY * b.y) / factor;
          a.y = (aY * b.x - aX * b.y) / factor;
        }
        return selfPy;
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
  };
}).call(this);
