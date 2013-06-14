/**
 * three.js wrapper module for Skulpt Python.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {
  /**
   * Symbolic constants representing the Python classes or functions that are exported by this module.
   * These are captured here for both consistency and self-documentation.
   */
  var CARTESIAN_3    = "Cartesian3";    // Multivector of 3-dimensional Euclidean space with Cartesian coordinates.
  var SCALAR_3       = "Scalar3";       // Constructor function alias for Cartesian3(w, 0, 0, 0, 0, 0, 0, 0)
  var VECTOR_3       = "Vector3";       // Constructor function alias for Cartesian3(0, x, y, z, 0, 0, 0, 0)
  var BIVECTOR_3     = "Bivector3";     // Constructor function alias for Cartesian3(0, 0, 0, 0, xy, yz, zx, 0)
  var PSEUDOSCALAR_3 = "Pseudoscalar3"; // Constructor function alias for Cartesian3(0, 0, 0, 0, 0, 0, 0, xyz)
  
  var MUTABLE_VECTOR_3 = "MutableVector3";

  var SCENE                = "Scene";
  var CANVAS_RENDERER      = "CanvasRenderer";
  var WEBGL_RENDERER       = "WebGLRenderer";
  var PERSPECTIVE_CAMERA   = "PerspectiveCamera";
  var MESH_NORMAL_MATERIAL = "MeshNormalMaterial";
  var MESH                 = "Mesh";
  var CUBE_GEOMETRY        = "CubeGeometry";
  var PLANE_GEOMETRY       = "PlaneGeometry";
  var SPHERE_GEOMETRY      = "SphereGeometry";

  // The following symbolic constant simulates a zero scalar argument for convenience functions.
  var ARG_ZERO      = Sk.builtin.assk$(0, Sk.builtin.nmber.float$);

  var mod = {};

  var getClassName = function (obj) {
    var str;
    var arr;
    if (obj && obj.constructor && obj.constructor.toString()) {
      //  for browsers which have name property in the constructor
      //  of the object,such as chrome 
      if(obj.constructor.name) {
        return obj.constructor.name;
      }
      str = obj.constructor.toString();
      // executed if the return of object.constructor.toString() is 
      // "[object objectClass]"
      if(str.charAt(0) === '[') {
        arr = str.match(/\[\w+\s*(\w+)\]/);
      }
      else {
        // executed if the return of object.constructor.toString() is 
        // "function objectClass () {}"
        // for IE Firefox
        arr = str.match(/function\s*(\w+)/);
      }
      if (arr && arr.length === 2) {
        return arr[1];
      }
    }
    return undefined; 
  };

  function isNumber(x)    { return typeof x === 'number'; }
  function isString(x)    { return typeof x === 'string'; }
  function isBoolean(x)   { return typeof x === 'boolean'; }
  function isNull(x)      { return typeof x === 'object' && x === null; }
  function isUndefined(x) { return typeof x === 'undefined'; }

  function webGLSupported() {
    try {
      if (window.WebGLRenderingContext) {
        if (document.createElement('canvas').getContext('experimental-webgl')) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    catch(e) {
      return false;
    }
  }

  /**
   * We're doing Geometric Algebra here so it's really all about Clifford Numbers and
   * Clifford Algebras over the real numbers. The purpose of this function is to convert
   * an argument of the form {"skType": ..., "v": ...} into a JavaScript number.
   */
  function numberFromScalarArg(arg, argName, functionName) {
    // console.log("arg: " + JSON.stringify(arg, null, 2) + ", argName " + argName);
    if (isNull(arg)) {
      throw new Sk.builtin.TypeError(functionName + "( ... " + argName + " ... ) must be convertible to a number, but was None.");
    }
    if (isBoolean(arg)) {
      throw new Sk.builtin.TypeError(functionName + "( ... " + argName + " ... ) must be convertible to a number, but was a Boolean.");
    }

    if (arg.skType) {
      switch(arg.skType) {
        case CARTESIAN_3: {
          return arg.v.w;
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

  function strFromCartesian3(w, x, y, z, xy, yz, zx, xyz) {
    var sb = [];
    function append(number, label) {
      if (number !== 0) {
        // Determine and conditionally add a sign.
        if (number >= 0) {
          if (sb.length > 0) {
            sb.push("+")
          }
        }
        else {
          sb.push("-")
        }
        // If the absolute value of the number is unity then we only need the label.
        var n = Math.abs(number);
        if (n === 1) {
          sb.push(label);
        }
        else {
          sb.push(n.toString());
          // We only need the label if it contributes under multiplication.
          if (label !== "1") {
            sb.push("*");
            sb.push(label);
          }
        }
      }
    }
    append(w, "1");
    append(x, "e1");
    append(y, "e2");
    append(z, "e3");
    append(xy, "e12");
    append(yz, "e23");
    append(zx, "e31");
    append(xyz, "e123");
    var str;
    if (sb.length > 0) {
      var str = sb.join("");
    }
    else {
      str = "0";
    }
    return str;
  }

  function boxCartesian3(w, x, y, z, xy, yz, zx, xyz) {
    return Sk.misceval.callsim(mod[CARTESIAN_3],
      Sk.builtin.assk$(w, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(y, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(z, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(xy, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(yz, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(zx, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(xyz, Sk.builtin.nmber.float$));
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
        case CARTESIAN_3: {
          return arg.v;
        }
        case 'float': {
          if (isNumber(arg.v)) {
            return {w: arg.v, x: 0, y: 0, z: 0, xy: 0, yz: 0, zx: 0, xyz: 0};
          }
          else {
            throw new Sk.builtin.AssertionError("3");
          }
        }
        break;
        case 'int': {
          if (isNumber(arg.v)) {
            return {w: arg.v, x: 0, y: 0, z: 0, xy: 0, yz: 0, zx: 0, xyz: 0};
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

  var Cartesian3 = function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, w, x, y, z, xy, yz, zx, xyz) {
      self.skType = CARTESIAN_3;
      self.tp$name = CARTESIAN_3;
      self.v = {
        w:   numberFromScalarArg(w,   "w",   CARTESIAN_3),
        x:   numberFromScalarArg(x,   "x",   CARTESIAN_3),
        y:   numberFromScalarArg(y,   "y",   CARTESIAN_3),
        z:   numberFromScalarArg(z,   "z",   CARTESIAN_3),
        xy:  numberFromScalarArg(xy,  "xy",  CARTESIAN_3),
        yz:  numberFromScalarArg(yz,  "yz",  CARTESIAN_3),
        zx:  numberFromScalarArg(zx,  "zx",  CARTESIAN_3),
        xyz: numberFromScalarArg(xyz, "xyz", CARTESIAN_3)
      };
    });

    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of addition operator");
      b = unboxArg3(b, "rhs of addition operator");
      return boxCartesian3( 
        a.w + b.w,
        a.x + b.x,
        a.y + b.y,
        a.z + b.z,
        a.xy + b.xy,
        a.yz + b.yz,
        a.zx + b.zx,
        a.xyz + b.xyz);
    });

    $loc.__sub__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of subtraction operator");
      b = unboxArg3(b, "rhs of subtraction operator");
      return boxCartesian3( 
        a.w - b.w,
        a.x - b.x,
        a.y - b.y,
        a.z - b.z,
        a.xy - b.xy,
        a.yz - b.yz,
        a.zx - b.zx,
        a.xyz - b.xyz);
    });

    $loc.__mul__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of multiplication operator");
      b = unboxArg3(b, "rhs of multiplication operator");
      var w   = a.w * b.w   + a.x * b.x   + a.y * b.y   + a.z * b.z   - a.xy * b.xy  - a.yz * b.yz  - a.zx * b.zx  - a.xyz * b.xyz;
      var x   = a.w * b.x   + a.x * b.w   - a.y * b.xy  + a.z * b.zx  + a.xy * b.y   - a.yz * b.xyz - a.zx * b.z   - a.xyz * b.yz;
      var y   = a.w * b.y   + a.x * b.xy  + a.y * b.w   - a.z * b.yz  - a.xy * b.x   + a.yz * b.z   - a.zx * b.xyz - a.xyz * b.zx;
      var z   = a.w * b.z   - a.x * b.zx  + a.y * b.yz  + a.z * b.w   - a.xy * b.xyz - a.yz * b.y   + a.zx * b.x   - a.xyz * b.xy;
      var xy  = a.w * b.xy  + a.x * b.y   - a.y * b.x   + a.z * b.xyz + a.xy * b.w   - a.yz * b.zx  + a.zx * b.yz  + a.xyz * b.z;
      var yz  = a.w * b.yz  + a.x * b.xyz + a.y * b.z   - a.z * b.y   + a.xy * b.zx  + a.yz * b.w   - a.zx * b.xy  + a.xyz * b.x;
      var zx  = a.w * b.zx  - a.x * b.z   + a.y * b.xyz + a.z * b.x   - a.xy * b.yz  + a.yz * b.xy  + a.zx * b.w   + a.xyz * b.y;
      var xyz = a.w * b.xyz + a.x * b.yz  + a.y * b.zx  + a.z * b.xy  + a.xy * b.z   + a.yz * b.x   + a.zx * b.y   + a.xyz * b.w;
      return boxCartesian3(w, x, y, z, xy, yz, zx, xyz);
    });

    $loc.__xor__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of exterior product operator");
      b = unboxArg3(b, "rhs of exterior product operator");
      var w   = a.w * b.w;
      var x   = a.w * b.x   + a.x * b.w;
      var y   = a.w * b.y                 + a.y * b.w;
      var z   = a.w * b.z                               + a.z * b.w;
      var xy  = a.w * b.xy  + a.x * b.y   - a.y * b.x                 + a.xy * b.w;
      var yz  = a.w * b.yz                + a.y * b.z   - a.z * b.y                  + a.yz * b.w;
      var zx  = a.w * b.zx  - a.x * b.z                 + a.z * b.x                                 + a.zx * b.w;
      var xyz = a.w * b.xyz + a.x * b.yz  + a.y * b.zx  + a.z * b.xy  + a.xy * b.z   + a.yz * b.x   + a.zx * b.y   + a.xyz * b.w;
      return boxCartesian3(w, x, y, z, xy, yz, zx, xyz);
    });

    $loc.__lshift__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of left contraction operator");
      b = unboxArg3(b, "rhs of left contraction operator");
      // TODO: LShift
      return boxCartesian3(1, 2, 3, 4, 4, 3, 2, 1);
    });

    $loc.__rshift__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of right contraction operator");
      b = unboxArg3(b, "rhs of right contraction operator");
      // TODO: RShift
      return boxCartesian3(4, 3, 2, 1, 1, 2, 3, 4);
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
      var v = this.v;
      return boxCartesian3(-v.w, -v.x, -v.y, -v.z, -v.xy, -v.yz, -v.zx, -v.xyz);
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

    $loc.grade = new Sk.builtin.func(function(self, n) {
      var grade = Sk.builtin.asnum$(n);
      if (grade === 0) {
        return boxCartesian3(self.v.w, 0, 0, 0, 0, 0, 0, 0);
      }
      else if (grade === 1) {
        return boxCartesian3(0, self.v.x, self.v.y, self.v.z, 0, 0, 0, 0);
      }
      else if (grade === 2) {
        return boxCartesian3(0, 0, 0, 0, self.v.xy, self.v.yz, self.v.zx, 0);
      }
      else if (grade === 3) {
        return boxCartesian3(0, 0, 0, 0, 0, 0, 0, self.v.xyz);
      }
      else {
        throw new Error(grade + " is not a valid " + CARTESIAN_3 + " grade.");
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var v = self.v;
      return new Sk.builtin.str(strFromCartesian3(v.w, v.x, v.y, v.z, v.xy, v.yz, v.zx, v.xyz));
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var v = self.v;
      return new Sk.builtin.str(CARTESIAN_3 + '(' + v.w + ', ' + v.x + ', ' + v.y + ', ' + v.z + ', ' + v.xy + ', ' + v.yz + ', ' + v.zx + ', ' + v.xyz + ')');
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
        return Sk.builtin.assk$(self.v.w, Sk.builtin.nmber.float$);
      }
      else if (key === 'x') {
        return Sk.builtin.assk$(self.v.x, Sk.builtin.nmber.float$);
      }
      else if (key === 'y') {
        return Sk.builtin.assk$(self.v.y, Sk.builtin.nmber.float$);
      }
      else if (key === 'z') {
        return Sk.builtin.assk$(self.v.z, Sk.builtin.nmber.float$);
      }
      else if (key === 'xy') {
        return Sk.builtin.assk$(self.v.xy, Sk.builtin.nmber.float$);
      }
      else if (key === 'yz') {
        return Sk.builtin.assk$(self.v.yz, Sk.builtin.nmber.float$);
      }
      else if (key === 'zx') {
        return Sk.builtin.assk$(self.v.zx, Sk.builtin.nmber.float$);
      }
      else if (key === 'xyz') {
        return Sk.builtin.assk$(self.v.xyz, Sk.builtin.nmber.float$);
      }
      else {
        throw new Error(key + " is not a valid " + CARTESIAN_3 + " attribute.");
      }
    });
  };

  mod[CARTESIAN_3] = Sk.misceval.buildClass(mod, Cartesian3, CARTESIAN_3, []);

  mod[SCALAR_3] = new Sk.builtin.func(function(w) {
    // Invoke argument conversion for the validation side-effect and a more specific function type.
    numberFromScalarArg(w, "w", SCALAR_3);
    return Sk.misceval.callsim(mod[CARTESIAN_3], w, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO);
  });

  mod[VECTOR_3] = new Sk.builtin.func(function(x, y, z) {
    // Invoke argument conversion for the validation side-effect and a more specific function type.
    numberFromScalarArg(x, "x", VECTOR_3);
    numberFromScalarArg(y, "y", VECTOR_3);
    numberFromScalarArg(z, "z", VECTOR_3);
    return Sk.misceval.callsim(mod[CARTESIAN_3], ARG_ZERO, x, y, z, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO);
  });

  mod[BIVECTOR_3] = new Sk.builtin.func(function(xy, yz, zx) {
    numberFromScalarArg(xy, "xy", BIVECTOR_3);
    numberFromScalarArg(yz, "yz", BIVECTOR_3);
    numberFromScalarArg(zx, "zx", BIVECTOR_3);
    return Sk.misceval.callsim(mod[CARTESIAN_3], ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, xy, yz, zx, ARG_ZERO);
  });

  mod[PSEUDOSCALAR_3] = new Sk.builtin.func(function(xyz) {
    numberFromScalarArg(xyz, "xyz", PSEUDOSCALAR_3);
    return Sk.misceval.callsim(mod[CARTESIAN_3], ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, ARG_ZERO, xyz);
  });

  /*
   * MutableVector3
   *
   * It is important to note that this wrapper class keeps a reference to
   * the original argument which is expected to have come from the THREE.Vector3
   */
   mod[MUTABLE_VECTOR_3] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, v) {
        self.v = v;
        self.skType = MUTABLE_VECTOR_3;
      });

    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      throw new Sk.builtin.AssertionError("__add__ for " + MUTABLE_VECTOR_3);
      // a = unboxArg3(a, "lhs of addition operator");
      // b = unboxArg3(b, "rhs of addition operator");
      // return Sk.misceval.callsim(mod[CARTESIAN_3], 
      //   a.w + b.w,
      //   a.x + b.x,
      //   a.y + b.y,
      //   a.z + b.z,
      //   a.xy + b.xy,
      //   a.yz + b.yz,
      //   a.zx + b.zx,
      //   a.xyz + b.xyz);
  });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case "x": {
          return Sk.builtin.assk$(self.v.x, Sk.builtin.nmber.float$);
        }
        case "y": {
          return Sk.builtin.assk$(self.v.y, Sk.builtin.nmber.float$);
        }
        case "z": {
          return Sk.builtin.assk$(self.v.z, Sk.builtin.nmber.float$);
        }
        default: {
          throw new Error(name + " is not an attribute of " + MUTABLE_VECTOR_3);
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
      switch(name) {
        case "x": {
          self.v.x = Sk.builtin.asnum$(value);
        }
        break;
        case "y": {
          self.v.y = Sk.builtin.asnum$(value);
        }
        break;
        case "z": {
          self.v.z = Sk.builtin.asnum$(value);
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + MUTABLE_VECTOR_3);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(strFromCartesian3(0, self.v.x, self.v.y, self.v.z, 0, 0, 0, 0));
    });

  }, MUTABLE_VECTOR_3, []);

var CANVAS_HEIGHT, CANVAS_WIDTH, COLOR_GRID, COLOR_X_AXIS, COLOR_Y_AXIS, COLOR_Z_AXIS, GeometryView, KEYCODE_ADD, KEYCODE_MINUS, KEYCODE_PLUS, KEYCODE_SUBTRACT, MATERIAL_GRID_MAJOR, MATERIAL_GRID_MINOR;

COLOR_X_AXIS = 0xff0000;
COLOR_Y_AXIS = 0x00ff00;
COLOR_Z_AXIS = 0x0000ff;
COLOR_GRID = 0x66A1D2;
MATERIAL_GRID_MAJOR = new THREE.LineBasicMaterial({
  color: COLOR_GRID,
  opacity: 0.20,
  transparent: true
});
MATERIAL_GRID_MINOR = new THREE.LineBasicMaterial({
  color: COLOR_GRID,
  opacity: 0.02,
  transparent: true
});
CANVAS_WIDTH = 800;
CANVAS_HEIGHT = 600;
KEYCODE_ADD = 107;
KEYCODE_SUBTRACT = 109;
KEYCODE_PLUS = 187;
KEYCODE_MINUS = 189;

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock(false);
var overRenderer = false;
var lastCameraPosition = new THREE.Vector3(0, 0, 0);
  // Sperical Polar Coordinates.
  var distance = 1000;
  var polarAngle = 60 * Math.PI / 180;
  var azimuthAngle = 10 * Math.PI / 180;
  var target = {"distance": 300, "polarAngle": polarAngle, "azimuthAngle": azimuthAngle};
  var targetScenePosition = new THREE.Vector3(0, 0, 0);

  var CUBOID_CONSTRUCTOR_NAME = "Cuboid";
  var cuboid = function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, size, position) {
      var sizeX = 1;
      var sizeY = 1;
      var sizeZ = 1;
      switch(arguments.length) {
        case 1: {
          position = new THREE.Vector3(0, 0, 0);
        }
        break;
        case 2: {
          sizeX = size.v[0].v;
          sizeY = size.v[1].v;
          sizeZ = size.v[2].v
          position = new THREE.Vector3(0, 0, 0);
        }
        break;
        case 3: {
          sizeX = size.v[0].v;
          sizeY = size.v[1].v;
          sizeZ = size.v[2].v
          position = new THREE.Vector3(position.v[0].v, position.v[1].v, position.v[2].v);
        }
        break;
        default: {
          throw new Error("Expecting " + CUBOID_CONSTRUCTOR_NAME + "([size[,position]])");
        }
      }
      var geometry = new THREE.CubeGeometry(sizeX, sizeY, sizeZ);
//      var material = new THREE.MeshPhongMaterial({color: 0x0000FF, specular: 0x0000FF, shininess: 100});
var material = new THREE.MeshLambertMaterial({color: 0x0000FF});
self.mesh = new THREE.Mesh(geometry, material);
self.mesh.position.set(position.x, position.y, position.z);
scene.add(self.mesh);
});

$loc.__getattr__ = new Sk.builtin.func(function(self, name) {
  switch(name) {
    case "name": {
      return Sk.builtin.str(self.mesh.name);
    }
    case "sizeX": {
      return self.mesh.geometry.width;
    }
    case "sizeY": {
      return self.mesh.geometry.height;
    }
    case "sizeZ": {
      return self.mesh.geometry.depth;
    }
    case "position": {
      return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.mesh.position.x, self.mesh.position.y, self.mesh.position.z, 0, 0, 0, 0);
    }
    case "scale": {
      return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.mesh.scale.x, self.mesh.scale.y, self.mesh.scale.z, 0, 0, 0, 0);
    }
    default: {
      throw new Error(name + " is not an attribute of " + CUBOID_CONSTRUCTOR_NAME);
    }
  }
});

$loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
  switch(name) {
    case "name": {
      self.mesh.name = value.v;
    }
    break;
    case "sizeX": {
      self.mesh.geometry.width = Sk.builtin.asnum$(value);
    }
    break;
    case "sizeY": {
      self.mesh.geometry.height = Sk.builtin.asnum$(value);
    }
    break;
    case "sizeZ": {
      self.mesh.geometry.depth = Sk.builtin.asnum$(value);
    }
    break;
    case "position": {
      var position = unboxArg3(value);
      self.mesh.position.set(position.x, position.y, position.z);
    }
    break;
    case "scale": {
      var scale = unboxArg3(value);
      self.mesh.scale.set(scale.x, scale.y, scale.z);
    }
    break;
    default: {
      throw new Error(name + " is not an attribute of " + CUBOID_CONSTRUCTOR_NAME);
    }
  }
});

};

mod[CUBOID_CONSTRUCTOR_NAME] = Sk.misceval.buildClass(mod, cuboid, CUBOID_CONSTRUCTOR_NAME, []);

var CYLINDER_CONSTRUCTOR_NAME = "Cylinder";
var cylinder = function($gbl, $loc) {

  $loc.__init__ = new Sk.builtin.func(function(self, radiusArg, heightArg, positionArg) {
    var radius = 1;
    var height = 1;
    var position = null;
    switch(arguments.length) {
      case 1: {
        position = new THREE.Vector3(0, 0, 0);
      }
      break;
      case 2: {
        radius = unboxArg3(radiusArg).w;
        position = new THREE.Vector3(0, 0, 0);
      }
      break;
      case 3: {
        radius = unboxArg3(radiusArg).w;
        height = unboxArg3(heightArg).w;
        position = new THREE.Vector3(0, 0, 0);
      }
      break;
      case 4: {
        radius = unboxArg3(radiusArg).w;
        height = unboxArg3(heightArg).w;
        position = unboxArg3(positionArg);
        position = new THREE.Vector3(position.x, position.y, position.z);
      }
      break;
      default: {
        throw new Error("Expecting " + CYLINDER_CONSTRUCTOR_NAME + "([radius[,height[,position]]])");
      }
    }
    var geometry = new THREE.CylinderGeometry(radius, radius, height, 16, 12, false);
    var material = new THREE.MeshPhongMaterial({color: 0x00FF00, specular: 0x00FF00, shininess: 100});
    self.mesh = new THREE.Mesh(geometry, material);
    self.mesh.position.set(position.x, position.y, position.z);
    scene.add(self.mesh);
  });

$loc.__getattr__ = new Sk.builtin.func(function(self, name) {
  switch(name) {
    case "name": {
      return Sk.builtin.str(self.mesh.name);
    }
    case "radius": {
      return self.mesh.geometry.radius;
    }
    case "position": {
      return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.mesh.position.x, self.mesh.position.y, self.mesh.position.z, 0, 0, 0, 0);
    }
    case "rotation": {
      return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.mesh.rotation.x, self.mesh.rotation.y, self.mesh.rotation.z, 0, 0, 0, 0);
    }
    case "scale": {
      return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.mesh.scale.x, self.mesh.scale.y, self.mesh.scale.z, 0, 0, 0, 0);
    }
    default: {
      throw new Error(name + " is not an attribute of " + CYLINDER_CONSTRUCTOR_NAME);
    }
  }
});

$loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
  switch(name) {
    case "name": {
      self.mesh.name = value.v;
    }
    break;
    case "position": {
      var position = unboxArg3(value);
      self.mesh.position.set(position.x, position.y, position.z);
    }
    break;
    case "rotation": {
      var rotation = unboxArg3(value);
      self.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    }
    break;
    case "scale": {
      var scale = unboxArg3(value);
      self.mesh.scale.set(scale.x, scale.y, scale.z);
    }
    break;
    default: {
      throw new Error(name + " is not an attribute of " + CYLINDER_CONSTRUCTOR_NAME);
    }
  }
});

};

mod[CYLINDER_CONSTRUCTOR_NAME] = Sk.misceval.buildClass(mod, cylinder, CYLINDER_CONSTRUCTOR_NAME, []);

var SPHERE_CONSTRUCTOR_NAME = "Sphere";
var sphere = function($gbl, $loc) {

  $loc.__init__ = new Sk.builtin.func(function(self, radiusArg, positionArg) {
    var radius = 1;
    var position = null;
    switch(arguments.length) {
      case 1: {
        position = new THREE.Vector3(0, 0, 0);
      }
      break;
      case 2: {
        radius = unboxArg3(radiusArg).w;
        position = new THREE.Vector3(0, 0, 0);
      }
      break;
      case 3: {
        radius = unboxArg3(radiusArg).w;
        position = unboxArg3(positionArg);
        position = new THREE.Vector3(position.x, position.y, position.z);
      }
      break;
      default: {
        throw new Error("Expecting " + SPHERE_CONSTRUCTOR_NAME + "([size[,position]])");
      }
    }
    var geometry = new THREE.SphereGeometry(radius, 16, 12);
    var material = new THREE.MeshPhongMaterial({color: 0xFF0000, specular: 0xFF0000, shininess: 100});
    self.mesh = new THREE.Mesh(geometry, material);
    self.mesh.position.set(position.x, position.y, position.z);
    scene.add(self.mesh);
  });

  $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
    switch(name) {
      case "name": {
        return Sk.builtin.str(self.mesh.name);
      }
      case "radius": {
        return self.mesh.geometry.radius;
      }
      case "position": {
        return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.mesh.position.x, self.mesh.position.y, self.mesh.position.z, 0, 0, 0, 0);
      }
      case "scale": {
        return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.mesh.scale.x, self.mesh.scale.y, self.mesh.scale.z, 0, 0, 0, 0);
      }
      default: {
        throw new Error(name + " is not an attribute of " + SPHERE_CONSTRUCTOR_NAME);
      }
    }
  });

  $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
    switch(name) {
      case "name": {
        self.mesh.name = value.v;
      }
      break;
      case "position": {
        var position = unboxArg3(value);
        self.mesh.position.set(position.x, position.y, position.z);
      }
      break;
      case "scale": {
        var scale = unboxArg3(value);
        self.mesh.scale.set(scale.x, scale.y, scale.z);
      }
      break;
      default: {
        throw new Error(name + " is not an attribute of " + SPHERE_CONSTRUCTOR_NAME);
      }
    }
  });

};

mod[SPHERE_CONSTRUCTOR_NAME] = Sk.misceval.buildClass(mod, sphere, SPHERE_CONSTRUCTOR_NAME, []);

addLights = function(scene) {
  var pointLight;

//    scene.add(new THREE.AmbientLight(0xA0A0A0));
pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(100, -100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(100, 100, -100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(100, -100, -100);
scene.add(pointLight);
};

add = function(a, b) {
  if (THREE.REVISION >= 58) {
    return a.add(b);
  } else {
    return a.addSelf(b);
  }
};

subtract = function(a, b) {
  if (THREE.REVISION >= 58) {
    return new THREE.Vector3().subVectors(a, b);
  } else {
    return new THREE.Vector3().sub(a, b);
  }
};

addAxes = function(scene) {
  var axes, sceneObject;

  axes = [new THREE.Geometry(), new THREE.Geometry(), new THREE.Geometry(), new THREE.Geometry(), new THREE.Geometry(), new THREE.Geometry()];
  axes[0].vertices.push(new THREE.Vector3(0, 0, 0));
  axes[0].vertices.push(new THREE.Vector3(60, 0, 0));
  axes[1].vertices.push(new THREE.Vector3(0, 0, 0));
  axes[1].vertices.push(new THREE.Vector3(0, 60, 0));
  axes[2].vertices.push(new THREE.Vector3(0, 0, 0));
  axes[2].vertices.push(new THREE.Vector3(0, 0, 60));
  axes[3].vertices.push(new THREE.Vector3(0, 0, 0));
  axes[3].vertices.push(new THREE.Vector3(-60, 0, 0));
  axes[4].vertices.push(new THREE.Vector3(0, 0, 0));
  axes[4].vertices.push(new THREE.Vector3(0, -60, 0));
  axes[5].vertices.push(new THREE.Vector3(0, 0, 0));
  axes[5].vertices.push(new THREE.Vector3(0, 0, -60));
  sceneObject = new THREE.Object3D();
  sceneObject.add(new THREE.Line(axes[0], new THREE.LineBasicMaterial({
    color: COLOR_X_AXIS,
    opacity: 0.5,
    transparent: true
  })));
  sceneObject.add(new THREE.Line(axes[1], new THREE.LineBasicMaterial({
    "color": COLOR_Y_AXIS,
    "opacity": 0.5,
    "transparent": true
  })));
  sceneObject.add(new THREE.Line(axes[2], new THREE.LineBasicMaterial({
    "color": COLOR_Z_AXIS,
    "opacity": 0.5,
    "transparent": true
  })));
  sceneObject.add(new THREE.Line(axes[3], new THREE.LineBasicMaterial({
    "color": COLOR_X_AXIS,
    "opacity": 0.2,
    "transparent": true
  })));
  sceneObject.add(new THREE.Line(axes[4], new THREE.LineBasicMaterial({
    "color": COLOR_Y_AXIS,
    "opacity": 0.2,
    "transparent": true
  })));
  sceneObject.add(new THREE.Line(axes[5], new THREE.LineBasicMaterial({
    "color": COLOR_Z_AXIS,
    "opacity": 0.2,
    "transparent": true
  })));
  return scene.add(sceneObject);
};

addMainGrid = function(scene, size) {
  var gridLineGeometry, line, material, sceneObject, x, y, _i, _j;

  sceneObject = new THREE.Object3D();
  for (x = _i = -size; -size <= size ? _i <= size : _i >= size; x = -size <= size ? ++_i : --_i) {
    if (x !== 0) {
      gridLineGeometry = new THREE.Geometry();
      gridLineGeometry.vertices.push(new THREE.Vector3(x, -size, 0));
      gridLineGeometry.vertices.push(new THREE.Vector3(x, size, 0));
      material = x % 10 === 0 ? MATERIAL_GRID_MAJOR : MATERIAL_GRID_MINOR;
      line = new THREE.Line(gridLineGeometry, material);
      sceneObject.add(line);
    }
  }
  for (y = _j = -size; -size <= size ? _j <= size : _j >= size; y = -size <= size ? ++_j : --_j) {
    if (y !== 0) {
      gridLineGeometry = new THREE.Geometry();
      gridLineGeometry.vertices.push(new THREE.Vector3(-size, y, 0));
      gridLineGeometry.vertices.push(new THREE.Vector3(size, y, 0));
      material = y % 10 === 0 ? MATERIAL_GRID_MAJOR : MATERIAL_GRID_MINOR;
      line = new THREE.Line(gridLineGeometry, material);
      sceneObject.add(line);
    }
  }
  return scene.add(sceneObject);
};

addFadingGrid = function(scene, size, boundary) {
  var inside, sceneObject, x, y, _i, _j, _ref, _ref1, _ref2, _ref3;

  sceneObject = new THREE.Object3D();
  for (x = _i = _ref = -size - boundary, _ref1 = size + boundary; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; x = _ref <= _ref1 ? ++_i : --_i) {
    for (y = _j = _ref2 = -size - boundary, _ref3 = size + boundary; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; y = _ref2 <= _ref3 ? ++_j : --_j) {
      inside = isInsideX(x, size) && isInsideY(y, size);
      if ((x % 10 === 0) && (y % 10 === 0) && (x !== 0) && (y !== 0) && !inside) {
        addFadingGridTile(x, y, size, sceneObject);
      }
    }
  }
  return scene.add(sceneObject);
};

isInsideX = function(x, size) {
  return (x >= -size) && (x <= size);
};

isInsideY = function(y, size) {
  return (y >= -size) && (y <= size);
};

addFadingGridTile = function(x, y, size, sceneObject) {
  var dx, dy, fadingGridLineGeometry, line, material, opacity, r;

  fadingGridLineGeometry = new THREE.Geometry();
  fadingGridLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  fadingGridLineGeometry.vertices.push(new THREE.Vector3(10, 0, 0));
  dx = 0;
  if (x < -size) {
    dx = -size - x;
  } else if (x > size) {
    dx = x - size;
  }
  dy = 0;
  if (y < -size) {
    dy = -size - y;
  } else if (y > size) {
    dy = y - size;
  }
  r = Math.sqrt(dx * dx + dy * dy);
  opacity = r === 0 ? 1.0 : 1.0 / (r * 0.9);
  material = new THREE.LineBasicMaterial({
    color: COLOR_GRID,
    opacity: opacity,
    transparent: true
  });
  line = new THREE.Line(fadingGridLineGeometry, material);
  line.position.x = x > 0 ? x - 10 : x;
  line.position.y = y;
  sceneObject.add(line);
  line = new THREE.Line(fadingGridLineGeometry, material);
  line.position.x = x;
  line.position.y = y > 0 ? y - 10 : y;
  line.rotation.z = 90 * Math.PI / 180;
  return sceneObject.add(line);
};

function renderOld() {
  var delta = clock.getDelta();
  if (Sk.globals['tick']) {
    Sk.misceval.callsim(Sk.globals['tick'], delta);
  }

  var dCameraPosition, dDistance, dScenePosition;

  azimuthAngle += (target.azimuthAngle - azimuthAngle) * 0.2;
  polarAngle += (target.polarAngle - polarAngle) * 0.3;
  dDistance = (target.distance - distance) * 0.3;
  if (distance + dDistance > 1000) {
    target.distance = 1000;
    distance = 1000;
  } else if (distance + dDistance < 3) {
    target.distance = 3;
    distance = 3;
  } else {
    distance += dDistance;
  }
  dScenePosition = subtract(targetScenePosition, scene.position).multiplyScalar(0.2);
  add(scene.position, dScenePosition);
  lastCameraPosition = camera.position.clone();
  camera.position.x = distance * Math.sin(polarAngle) * Math.cos(azimuthAngle);
  camera.position.y = distance * Math.sin(polarAngle) * Math.sin(azimuthAngle);
  camera.position.z = distance * Math.cos(polarAngle);
  add(camera.position, scene.position);
  dCameraPosition = subtract(camera.position, lastCameraPosition);
  if ((dScenePosition.length() > 0.1) || (dCameraPosition.length() > 0.1)) {
    camera.lookAt(scene.position);
  }
  renderer.render(scene, camera);
  return this;
}

mod.pi = Sk.builtin.assk$(Math.PI, Sk.builtin.nmber.float$);
mod.e =  Sk.builtin.assk$(Math.E, Sk.builtin.nmber.float$);

  // Erik Moller's requestAnimationFrame for smart(er) animating
  // Minor formatting changes and use of braces for if conditions.
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // The purpose of this enhanced shim is to 
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelRequestAnimationFrame = window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }());

  /*
   * Scene
   */
   mod[SCENE] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.v = new THREE[SCENE]();
    });

    $loc.add = new Sk.builtin.func(function(self, mesh) {
      self.v.add(mesh.v);
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(SCENE);
    });

  }, SCENE, []);

  /*
   * WebGLRenderer
   */
   mod[WEBGL_RENDERER] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, canvas) {
      var rendererClassName = webGLSupported() ? WEBGL_RENDERER : CANVAS_RENDERER;
      self.tp$name = WEBGL_RENDERER;
      if (canvas) {
        self.v = new THREE[rendererClassName]({"canvas": canvas.v, "antialias": true});
      }
      else {
        self.v = new THREE[rendererClassName]();
      }
    });

    $loc.setSize = new Sk.builtin.func(function(self, width, height) {
      self.v.setSize(Sk.builtin.asnum$(width), Sk.builtin.asnum$(height));
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, nameJS) {

      var RENDER = "render";
      var renderer = self.v;

      switch(nameJS) {
        case 'domElement': {
          // TODO: I think duck-typing means that this will work as long as we don't
          // try to do anything more ambitious.
          return {v: renderer.domElement};
        }
        case RENDER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = RENDER;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, scene, camera) {
              renderer.render(scene.v, camera.v);
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(RENDER)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(RENDER)
            })

          }, RENDER, []));
        }
        default: {
          // The framework will raise an AttributeError exception.
          return /* undefined */;
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
      switch(name) {
        case "size": {
          var width  = Sk.builtin.asnum$(value.v[0]);
          var height = Sk.builtin.asnum$(value.v[1]);
          self.v.setSize(width, height);
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + WEBGL_RENDERER);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(WEBGL_RENDERER);
    });

  }, WEBGL_RENDERER, []);

  /*
   * PerspectiveCamera
   */
   mod[PERSPECTIVE_CAMERA] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, fov, aspect, near, far) {
      var fieldOfView = Sk.builtin.asnum$(fov)
      var aspectRatio = Sk.builtin.asnum$(aspect)
      var nearPlane = Sk.builtin.asnum$(near)
      var farPlane = Sk.builtin.asnum$(far)
      self.v = new THREE[PERSPECTIVE_CAMERA](fieldOfView, aspectRatio, nearPlane, farPlane);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      var camera = self.v;
      var UPDATE_PROJECTION_MATRIX = "updateProjectionMatrix"
      switch(name) {
        case "aspect": {
          return Sk.builtin.assk$(camera.aspect, Sk.builtin.nmber.float$);
        }
        case "position": {
          return Sk.misceval.callsim(mod[MUTABLE_VECTOR_3], camera.position);
        }
        case "rotation": {
          return Sk.misceval.callsim(mod[MUTABLE_VECTOR_3], camera.rotation);
        }
        case UPDATE_PROJECTION_MATRIX: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = UPDATE_PROJECTION_MATRIX;
            });

            $loc.__call__ = new Sk.builtin.func(function(self) {
              camera[name]();
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(UPDATE_PROJECTION_MATRIX)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(UPDATE_PROJECTION_MATRIX)
            })

          }, UPDATE_PROJECTION_MATRIX, []));
        }
        default: {
          return;
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
      switch(name) {
        case "aspect": {
          self.v.aspect = numberFromScalarArg(value, "rhs", name);
        }
        break;
        default: {
          throw new Sk.builtin.AssertionError(name + " is not an attribute of " + PERSPECTIVE_CAMERA);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(PERSPECTIVE_CAMERA);
    });

  }, PERSPECTIVE_CAMERA, []);

  /*
   * CubeGeometry
   */
   mod[CUBE_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, width, height, depth, widthSegments, heightSegments, depthSegments) {
      var w = Sk.builtin.asnum$(width)
      var h = Sk.builtin.asnum$(height)
      var d = Sk.builtin.asnum$(depth)
      self.v = new THREE[CUBE_GEOMETRY](w, h, d);
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(CUBE_GEOMETRY);
    });

  }, CUBE_GEOMETRY, []);

  /*
   * PlaneGeometry
   */
   mod[PLANE_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, width, height, widthSegments, heightSegments) {
      var w = Sk.builtin.asnum$(width)
      var h = Sk.builtin.asnum$(height)
      self.v = new THREE[PLANE_GEOMETRY](w, h);
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(PLANE_GEOMETRY);
    });

  }, PLANE_GEOMETRY, []);

  /*
   * SphereGeometry(radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength)
   *
   * radius — sphere radius. Default is 50.
   * segmentsWidth — number of horizontal segments. Minimum value is 3, and the default is 8.
   * segmentsHeight — number of vertical segments. Minimum value is 2, and the default is 6.
   * phiStart — specify horizontal starting angle. Default is 0.
   * phiLength — specify horizontal sweep angle size. Default is Math.PI * 2.
   * thetaStart — specify vertical starting angle. Default is 0.
   * thetaLength — specify vertical sweep angle size. Default is Math.PI.
   *
   * The geometry is created by sweeping and calculating vertexes around the Y axis (horizontal sweep)
   * and the Z axis (vertical sweep). Thus, incomplete spheres (akin to 'sphere slices') can be created
   * through the use of different values of phiStart, phiLength, thetaStart and thetaLength, in order to
   * define the points in which we start (or end) calculating those vertices.
   */
   mod[SPHERE_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength) {
      var r = numberFromScalarArg(radius, "radius", SPHERE_GEOMETRY);
      var w = integerToNumber(segmentsWidth, "segmentsWidth", SPHERE_GEOMETRY);
      var h = integerToNumber(segmentsHeight, "segmentsHeight", SPHERE_GEOMETRY);
      self.v = new THREE[SPHERE_GEOMETRY](r, w, h);
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(SPHERE_GEOMETRY);
    });

  }, SPHERE_GEOMETRY, []);

  /*
   * MeshNormalMaterial
   */
   mod[MESH_NORMAL_MATERIAL] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.v = new THREE[MESH_NORMAL_MATERIAL]();
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + MESH_NORMAL_MATERIAL);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(MESH_NORMAL_MATERIAL);
    });

  }, MESH_NORMAL_MATERIAL, []);

  /*
   * Mesh
   */
   mod[MESH] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, geometry, material) {
      self.v = new THREE[MESH](geometry.v, material.v);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case "overdraw": {
          if (isBoolean(self.v.overdraw)) {
            return self.v.overdraw;
          }
          else {
            return null;
          }
        }
        case "position": {
          var mesh = self.v;
          return Sk.misceval.callsim(mod[MUTABLE_VECTOR_3], mesh.position);
        }
        case "rotation": {
          var mesh = self.v;
          return Sk.misceval.callsim(mod[MUTABLE_VECTOR_3], mesh.rotation);
        }
        default: {
          throw new Error(name + " is not an attribute of " + MESH);
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
      switch(name) {
        case "overdraw": {
          if (isBoolean(value)) {
            self.v.overdraw = value;
          }
          else if (isNull(value)) {
            self.v.overdraw = null;
          }
          else {
            throw new Error(name + " must be either Boolean or None");
          }
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + MESH);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(MESH);
    });

  }, MESH, []);

  /*
   * Animation API.
   */
   var requestId;
   var clock = new THREE.Clock(false);
   var stats = new Stats();

   function loop() {
    requestId = window.requestAnimationFrame(loop);
    if (Sk.globals['render']) {
      Sk.misceval.callsim(Sk.globals['render'], clock.getDelta(), clock.getElapsedTime());
      stats.update();
    }
  }

  mod.start = new Sk.builtin.func(function() {
    if (!requestId) {
      clock.start();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      document.body.appendChild(stats.domElement);
      loop();
    }
  });

  mod.stop = new Sk.builtin.func(function() {
    if (requestId) {
      clock.stop();
      window.cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  });

  return mod;
}
