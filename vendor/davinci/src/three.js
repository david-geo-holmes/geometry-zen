(function() {
Sk.builtin.defineThree = function(mod, THREE) {
  Sk.ffi.checkFunctionArgs("defineFractions", arguments, 2, 2);
  var NODE                       = "Node";
  var NUMBER                     = "Number";
  var VECTOR_3                   = "Vector3";

  var QUATERNION                 = "Quaternion";

  var SCENE                      = "Scene";
  var CANVAS_RENDERER            = "CanvasRenderer";
  var WEBGL_RENDERER             = "WebGLRenderer";
  var COLOR                      = "Color";
  var ORTHOGRAPHIC_CAMERA        = "OrthographicCamera";
  var PERSPECTIVE_CAMERA         = "PerspectiveCamera";

  var GEOMETRY                   = "Geometry";
  var OBJECT_3D                  = "Object3D";

  var AMBIENT_LIGHT              = "AmbientLight";
  var DIRECTIONAL_LIGHT          = "DirectionalLight";
  var POINT_LIGHT                = "PointLight";

  var LINE                       = "Line";
  var LINE_BASIC_MATERIAL        = "LineBasicMaterial";

  var MESH                       = "Mesh";
  var MESH_BASIC_MATERIAL        = "MeshBasicMaterial";
  var MESH_LAMBERT_MATERIAL      = "MeshLambertMaterial";
  var MESH_NORMAL_MATERIAL       = "MeshNormalMaterial";
  var MESH_PHONG_MATERIAL        = "MeshPhongMaterial";

  var ARROW_GEOMETRY             = "ArrowGeometry";
  var CIRCLE_GEOMETRY            = "CircleGeometry";
  var CUBE_GEOMETRY              = "CubeGeometry";
  var CYLINDER_GEOMETRY          = "CylinderGeometry";
  var ICOSAHEDRON_GEOMETRY       = "IcosahedronGeometry";
  var LATHE_GEOMETRY             = "LatheGeometry";
  var OCTAHEDRON_GEOMETRY        = "OctahedronGeometry";
  var PLANE_GEOMETRY             = "PlaneGeometry";
  var SPHERE_GEOMETRY            = "SphereGeometry";
  var TEXT_GEOMETRY              = "TextGeometry";
  var TETRAHEDRON_GEOMETRY       = "TetrahedronGeometry";
  var TORUS_GEOMETRY             = "TorusGeometry";

  var WORLD                      = "world";
  var CUBE                       = "cube";
  var CYLINDER                   = "cylinder";
  var SPHERE                     = "sphere";

  var PROP_BOTTOM                = "bottom";
  var PROP_COLOR                 = "color";
  var PROP_DETAIL                = "detail";
  var PROP_EULER_ORDER           = "eulerOrder";
  var PROP_FAR                   = "far";
  var PROP_GEOMETRY              = "geometry";
  var PROP_ID                    = "id";
  var PROP_LEFT                  = "left";
  var PROP_MATERIAL              = "material";
  var PROP_MATRIX_AUTO_UPDATE    = "matrixAutoUpdate";
  var PROP_NAME                  = "name";
  var PROP_NEAR                  = "near";
  var PROP_NEEDS_UPDATE          = "needsUpdate";
  var PROP_OPACITY               = "opacity";
  var PROP_OVERDRAW              = "overdraw";
  var PROP_POSITION              = "position";
  var PROP_QUATERNION            = "quaternion";
  var PROP_RADIUS                = "radius";
  var PROP_RIGHT                 = "right";
  var PROP_ROTATION              = "rotation";
  var PROP_SCALE                 = "scale";
  var PROP_SEGMENTS              = "segments";
  var PROP_THETA_START           = "thetaStart";
  var PROP_THETA_LENGTH          = "thetaLength";
  var PROP_TOP                   = "top";
  var PROP_TRANSPARENT           = "transparent";
  var PROP_TYPE                  = "type";
  var PROP_UP                    = "up";
  var PROP_USE_QUATERNION        = "useQuaternion";
  var PROP_VERTICES              = "vertices";
  var PROP_VISIBLE               = "visible";
  var PROP_WIREFRAME             = "wireframe";
  var PROP_WIREFRAME_LINEWIDTH   = "wireframeLinewidth";

  var PROP_W                     = "w";
  var PROP_X                     = "x";
  var PROP_Y                     = "y";
  var PROP_Z                     = "z";
  var PROP_XY                    = "xy";
  var PROP_YZ                    = "yz";
  var PROP_ZX                    = "zx";
  var PROP_XYZ                   = "xyz";
  var METHOD_SET_X               = "setX";
  var METHOD_SET_Y               = "setY";
  var METHOD_SET_Z               = "setZ";
  var METHOD_GET_COMPONENT       = "getComponent";
  var METHOD_SET_COMPONENT       = "setComponent";
  var METHOD_SET                 = "set";
  var METHOD_SET_FROM_AXIS_ANGLE = "setFromAxisAngle";
  var METHOD_SET_FROM_EULER      = "setFromEuler";
  var METHOD_SET_GEOMETRY        = "setGeometry";
  var METHOD_UPDATE_MATRIX       = "updateMatrix";

  var METHOD_ADD                 = "add";
  var METHOD_CLONE               = "clone";
  var METHOD_CONJUGATE           = "conjugate";
  var METHOD_COPY                = "copy";
  var METHOD_CROSS               = "cross";
  var METHOD_DOT                 = "dot";
  var METHOD_INVERSE             = "inverse";
  var METHOD_LENGTH              = "length";
  var METHOD_LENGTH_SQ           = "lengthSq";
  var METHOD_LOOK_AT             = "lookAt";
  var METHOD_NORMALIZE           = "normalize";
  var METHOD_REMOVE              = "remove";
  var METHOD_SET_RGB             = "setRGB";

  mod[NODE]  = Sk.builtin.buildNodeClass(mod);

  /**
   * @param {string} name
   * @param {Object} valuePy
   * @return {boolean} The JavaScript value of the Python argument.
   */
  function checkArgBoolean(name, valuePy) {
    Sk.ffi.checkArgType(name, 'bool', Sk.ffi.isBoolean(valuePy));
    return Sk.ffi.remapToJs(valuePy);
  }

  function isBoolean(x)   { return typeof x === 'boolean'; }
  function isFunction(x)  { return typeof x === 'function'; }
  function isNumber(x)    { return typeof x === 'number'; }
  function isObject(x)    { return typeof x === 'object'; }
  function isString(x)    { return typeof x === 'string'; }
  function isUndefined(x) { return typeof x === 'undefined'; }

  function isDefined(x)   { return typeof x !== 'undefined'; }
  function isNull(x)      { return typeof x === 'object' && x === null; }

  function isVector(valuePy) {
    return Sk.ffi.isReference(valuePy) && Sk.ffi.typeName(valuePy) === VECTOR_3;
  }

  function methodAdd(target) {
    if (!isObject(target)) {
      throw new Sk.builtin.AssertionError("target must be an object.");
    }
    if (!isFunction(target[METHOD_ADD])) {
      throw new Sk.builtin.AssertionError("target must have an 'add' function.");
    }
    return Sk.ffi.callableToPy(mod, target, METHOD_ADD, function(methodPy, childPy) {
      var child = Sk.ffi.remapToJs(childPy);
      target.add(child);
    });
  }

  function methodRemove(target) {
    if (!isObject(target)) {
      throw new Sk.builtin.AssertionError("target must be an object.");
    }
    if (!isFunction(target[METHOD_REMOVE])) {
      throw new Sk.builtin.AssertionError("target must have a 'remove' function.");
    }
    return Sk.ffi.callableToPy(mod, target, METHOD_ADD, function(methodPy, childPy) {
      var child = Sk.ffi.remapToJs(childPy);
      target.remove(child);
    });
  }

  function verticesPy(vertices) {
    return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
      $loc.__init__ = Sk.ffi.functionPy(function(self) {
        self.tp$name = PROP_VERTICES;
        self.v = vertices;
      });
      $loc.__getattr__ = Sk.ffi.functionPy(function(verticesPy, name) {
        var METHOD_APPEND = "append";
        switch(name) {
          case METHOD_APPEND: {
            return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
              $loc.__init__ = Sk.ffi.functionPy(function(self) {
                self.tp$name = METHOD_APPEND;
              });
              $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy) {
                vertices.push(Sk.ffi.remapToJs(vectorPy));
              });
              $loc.__str__ = Sk.ffi.functionPy(function(self) {
                return Sk.ffi.stringToPy(METHOD_APPEND)
              });
              $loc.__repr__ = Sk.ffi.functionPy(function(self) {
                return Sk.ffi.stringToPy(METHOD_APPEND)
              });
            }, METHOD_APPEND, []));
          }
        }
      });
      $loc.__getitem__ = Sk.ffi.functionPy(function(verticesPy, indexPy) {
        var index = Sk.ffi.remapToJs(indexPy);
        return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(vertices[index], VECTOR_3));
      });
      $loc.mp$length = function() {return vertices.length;};
      $loc.__str__ = Sk.ffi.functionPy(function(self) {
        return Sk.ffi.stringToPy(PROP_VERTICES)
      });
      $loc.__repr__ = Sk.ffi.functionPy(function(self) {
        return Sk.ffi.stringToPy(PROP_VERTICES)
      });
    }, PROP_VERTICES, []));
  }

  /*
   * Deterines whether the argument is a genuine Color reference.
   */
  function isColor(x) {
    if (isDefined(x)) {
      if (x.hasOwnProperty("r") && x.hasOwnProperty("g") && x.hasOwnProperty("b")) {
        return isNumber(x["r"]) && isNumber(x["g"]) && isNumber(x["b"]);
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

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

  function stringFromCoordinates(coordinates, labels) {
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
            sb.push("*");
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
   * @param {boolean=} lax
   */
  function numberFromArg(arg, argName, functionName, lax) {
    if (isUndefined(argName)) {
      throw new Error("argName must be specified")
    }
    if (isUndefined(functionName)) {
      throw new Error("functionName must be specified")
    }
    lax = isUndefined(lax) ? true : (isBoolean(lax) ? lax : true);
    if (isUndefined(arg)) {
      if (lax) {
        return arg;
      }
      else {
        throw new Sk.builtin.TypeError(functionName + "." + argName + " must be convertible to a number, but was Missing.");
      }
    }
    else if (isNull(arg)) {
      if (lax) {
        return arg;
      }
      else {
        throw new Sk.builtin.TypeError(functionName + "." + argName + " must be convertible to a number, but was None.");
      }
    }
    if (isBoolean(arg)) {
      throw new Sk.builtin.TypeError(functionName + "." + argName + " must be convertible to a number, but was a Boolean.");
    }

    if (arg.skType) {
      switch(arg.skType) {
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
        throw new Sk.builtin.TypeError(functionName + "." + argName + " must be convertible to a number, but was a String.");
      }
      else {
        throw new Sk.builtin.AssertionError(functionName + "." + argName + " is unknown.");
      }
    }
    else {
      throw new Sk.builtin.AssertionError(functionName + "." + argName + " is unknown.");
    }
  }

  function numberFromIntegerArg(arg, argName, functionName) {
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
          case 'float': {
            // TODO: Handle coercion to nearest integer.
            return arg.v;
          }
          case 'int': {
            return arg.v;
          }
        }
      }
      throw new Sk.builtin.AssertionError(functionName + "." + argName + " must be an integer.");
    }
  }

  /**
   * @param {number} w
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  function wxyzToPy(w, x, y, z) {
    var wPy = Sk.builtin.assk$(w, Sk.builtin.nmber.float$);
    var xPy = Sk.builtin.assk$(x, Sk.builtin.nmber.float$);
    var yPy = Sk.builtin.assk$(y, Sk.builtin.nmber.float$);
    var zPy = Sk.builtin.assk$(z, Sk.builtin.nmber.float$);
    return Sk.ffi.callsim(mod[QUATERNION], xPy, yPy, zPy, wPy);
  }

  Sk.builtin.defineEuclidean3(mod);
  Sk.builtin.defineVector3(mod, VECTOR_3, function(x, y, z) {return new THREE[VECTOR_3](x, y, z)});

  mod[QUATERNION] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, x, y, z, w) {
      x = Sk.ffi.remapToJs(x);
      y = Sk.ffi.remapToJs(y);
      z = Sk.ffi.remapToJs(z);
      w = Sk.ffi.remapToJs(w);
      if (isObject(x) && isUndefined(y) && isUndefined(z) && isUndefined(w)) {
        self.v = x;
      }
      else {
        self.v = new THREE[QUATERNION](x, y, z, w);
      }
      self.tp$name = QUATERNION;
    });
    $loc.__add__ = Sk.ffi.functionPy(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return wxyzToPy(a.w + b, a.x, a.y, a.z);
      }
      else {
        var w = a.w + b.w;
        var x = a.x + b.x;
        var y = a.y + b.y;
        var z = a.z + b.z;
        return wxyzToPy(w, x, y, z);
      }
    });
    $loc.__radd__ = Sk.ffi.functionPy(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return wxyzToPy(a + b.w, b.x, b.y, b.z);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__iadd__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self.w += other;
      }
      else {
        self.w += other.w;
        self.x += other.x;
        self.y += other.y;
        self.z += other.z;
      }
      return selfPy;
    });
    $loc.__sub__ = Sk.ffi.functionPy(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return wxyzToPy(a.w - b, a.x, a.y, a.z);
      }
      else {
        var w = a.w - b.w;
        var x = a.x - b.x;
        var y = a.y - b.y;
        var z = a.z - b.z;
        return wxyzToPy(w, x, y, z);
      }
    });
    $loc.__rsub__ = Sk.ffi.functionPy(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return wxyzToPy(a - b.w, -b.x, -b.y, -b.z);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__isub__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self.w -= other;
      }
      else {
        self.w -= other.w;
        self.x -= other.x;
        self.y -= other.y;
        self.z -= other.z;
      }
      return selfPy;
    });
    $loc.__mul__ = Sk.ffi.functionPy(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return wxyzToPy(a.w * b, a.x * b, a.y * b, a.z * b);
      }
      else {
        var ab = new THREE[QUATERNION]()['multiplyQuaternions'](a, b);
        return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(ab, QUATERNION));
      }
    });
    $loc.__rmul__ = Sk.ffi.functionPy(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return wxyzToPy(a * b.w, a * b.x, a * b.y, a * b.z);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__imul__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      var a0 = a.w;
      var a1 = a.x;
      var a2 = a.y;
      var a3 = a.z;
      var b0, b1, b2, b3, b4, b5, b6, b7;
      if (isNumber(b)) {
        a.w *= b;
        a.x *= b;
        a.y *= b;
        a.z *= b;
      }
      else {
        a.multiply(b);
      }
      return selfPy;
    });
    $loc.nb$positive = function() {
      return this;
    };
    $loc.nb$negative = function() {
      var mv = Sk.ffi.remapToJs(this);
      return wxyzToPy(-mv.w, -mv.x, -mv.y, -mv.z);
    };
    $loc.__eq__ = Sk.ffi.functionPy(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return a.w === b.w && a.x === b.x && a.y === b.y && a.z === b.z;
    });
    $loc.__ne__ = Sk.ffi.functionPy(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return a.w !== b.w || a.x !== b.x || a.y !== b.y || a.z !== b.z;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(quaternionPy, name) {
      var quaternion = Sk.ffi.remapToJs(quaternionPy);
      switch(name) {
        case PROP_X: {
          return Sk.builtin.assk$(quaternion.x, Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(quaternion.y, Sk.builtin.nmber.float$);
        }
        case PROP_Z: {
          return Sk.builtin.assk$(quaternion.z, Sk.builtin.nmber.float$);
        }
        case PROP_W: {
          return Sk.builtin.assk$(quaternion.w, Sk.builtin.nmber.float$);
        }
        case METHOD_COPY: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_COPY;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, qPy) {
              var q  = Sk.ffi.remapToJs(qPy);
              quaternion.x = q.x;
              quaternion.y = q.y;
              quaternion.z = q.z;
              quaternion.w = q.w;
              return quaternionPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_COPY);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_COPY);
            });
          }, METHOD_COPY, []));
        }
        case METHOD_SET_FROM_AXIS_ANGLE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET_FROM_AXIS_ANGLE;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, axisPy, anglePy) {
              var axis = Sk.ffi.remapToJs(axisPy);
              var angle = Sk.ffi.remapToJs(anglePy);
              quaternion[METHOD_SET_FROM_AXIS_ANGLE](axis, angle);
              return quaternionPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_FROM_AXIS_ANGLE);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_FROM_AXIS_ANGLE);
            });
          }, METHOD_SET_FROM_AXIS_ANGLE, []));
        }
        case METHOD_SET_FROM_EULER: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET_FROM_EULER;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy, orderPy) {
              var vector = Sk.ffi.remapToJs(vectorPy);
              var order = Sk.ffi.remapToJs(orderPy);
              quaternion[METHOD_SET_FROM_EULER](vector, order);
              return quaternionPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_FROM_EULER);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_FROM_EULER);
            });
          }, METHOD_SET_FROM_EULER, []));
        }
        case METHOD_SET: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, x, y, z, w) {
              quaternion.x = Sk.ffi.remapToJs(x);
              quaternion.y = Sk.ffi.remapToJs(y);
              quaternion.z = Sk.ffi.remapToJs(z);
              quaternion.w = Sk.ffi.remapToJs(w);
              return quaternionPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET);
            });
          }, METHOD_SET, []));
        }
        case METHOD_CLONE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_CLONE;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              return wxyzToPy(quaternion.w, quaternion.x, quaternion.y, quaternion.z);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_CLONE);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_CLONE);
            });
          }, METHOD_CLONE, []));
        }
        case METHOD_CONJUGATE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_CONJUGATE;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              quaternion[METHOD_CONJUGATE]();
              return quaternionPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_CONJUGATE);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_CONJUGATE);
            });
          }, METHOD_CONJUGATE, []));
        }
        case METHOD_INVERSE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_INVERSE;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              var k = 1.0 / quaternion[METHOD_LENGTH_SQ]();
              quaternion[METHOD_CONJUGATE]();
              quaternion.w *= k;
              quaternion.x *= k;
              quaternion.y *= k;
              quaternion.z *= k;
              return quaternionPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_INVERSE);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_INVERSE);
            });
          }, METHOD_INVERSE, []));
        }
        case METHOD_LENGTH: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LENGTH;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              return Sk.builtin.assk$(quaternion[METHOD_LENGTH](), Sk.builtin.nmber.float$);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LENGTH);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LENGTH);
            });
          }, METHOD_LENGTH, []));
        }
        case METHOD_LENGTH_SQ: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LENGTH_SQ;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              return Sk.builtin.assk$(quaternion[METHOD_LENGTH_SQ](), Sk.builtin.nmber.float$);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LENGTH_SQ);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LENGTH_SQ);
            });
          }, METHOD_LENGTH_SQ, []));
        }
        case METHOD_NORMALIZE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_NORMALIZE;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              quaternion[METHOD_NORMALIZE]();
              return quaternionPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_NORMALIZE);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_NORMALIZE);
            });
          }, METHOD_NORMALIZE, []));
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(quaternionPy, name, valuePy) {
      var quaternion = Sk.ffi.remapToJs(quaternionPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_X: {
          quaternion.x = value;
        }
        break;
        case PROP_Y: {
          quaternion.y = value;
        }
        break;
        case PROP_Z: {
          quaternion.z = value;
        }
        break;
        case PROP_W: {
          quaternion.w = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not an attribute of " + QUATERNION);
        }
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(quaternionPy) {
      var quaternion = Sk.ffi.remapToJs(quaternionPy);
      var args = [quaternion.x, quaternion.y, quaternion.z, quaternion.w];
      return Sk.ffi.stringToPy(QUATERNION + "(" + args.join(", ") + ")");
    });
    $loc.__str__ = Sk.ffi.functionPy(function(quaternionPy) {
      var quaternion = Sk.ffi.remapToJs(quaternionPy);
      if (isDefined(quaternion)) {
        return Sk.ffi.stringToPy(stringFromCoordinates([quaternion.w, quaternion.x, quaternion.y, quaternion.z], ["1", "i", "j", "k"]));
      }
      else {
        return Sk.ffi.stringToPy("<type '" + QUATERNION + "'>");
      }
    });
  }, QUATERNION, []);

  // Erik Moller's requestAnimationFrame for smart(er) animating
  // Minor formatting changes and use of braces for if conditions.
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // The purpose of this enhanced shim is to 
  /*
  (function(scope) {
    if (isDefined(scope)) {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for(var x = 0; x < vendors.length && !scope.requestAnimationFrame; ++x) {
        scope.requestAnimationFrame = scope[vendors[x]+'RequestAnimationFrame'];
        scope.cancelRequestAnimationFrame = scope[vendors[x]+'CancelRequestAnimationFrame'];
      }

      if (!scope.requestAnimationFrame) {
        scope.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = scope.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!scope.cancelAnimationFrame) {
        scope.cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
      }
    }
  }((typeof window === 'object') ? window : void 0));
  */

  mod[SCENE] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy) {
      Sk.ffi.checkMethodArgs(SCENE, arguments, 0, 0);
      Sk.ffi.referenceToPy(new THREE[SCENE](), SCENE, undefined, selfPy);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(scenePy, name) {
      var scene = Sk.ffi.remapToJs(scenePy);
      switch(name) {
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(scene[PROP_POSITION], VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(scene[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(scene[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(scene[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(scene[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(scene[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return scene[PROP_USE_QUATERNION];
        }
        case METHOD_LOOK_AT: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LOOK_AT;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy) {
              scene[METHOD_LOOK_AT](Sk.ffi.remapToJs(vectorPy));
              return scenePy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
          }, METHOD_LOOK_AT, []));
        }
        case METHOD_ADD: {
          return methodAdd(scene);
        }
        case METHOD_REMOVE: {
          return methodRemove(scene);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(scenePy, name, valuePy) {
      var scene = Sk.ffi.remapToJs(scenePy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_POSITION: {
          scene[PROP_POSITION] = value;
        }
        break;
        case PROP_QUATERNION: {
          scene[PROP_QUATERNION] = value;
        }
        break;
        case PROP_ROTATION: {
          scene[PROP_ROTATION] = value;
        }
        break;
        case PROP_EULER_ORDER: {
          if (isString(value)) {
            scene[PROP_EULER_ORDER] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_SCALE: {
          scene[PROP_SCALE] = value;
        }
        break;
        case PROP_UP: {
          scene[PROP_UP] = value;
        }
        break;
        case PROP_USE_QUATERNION: {
          scene[PROP_USE_QUATERNION] = value;
        }
        break;
        default: {
          throw new Error(name + " is not a write attribute of " + SCENE);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      return Sk.ffi.stringToPy(SCENE);
    });
  }, SCENE, []);

  mod[WORLD] = Sk.ffi.functionPy(function() {
    Sk.ffi.checkFunctionArgs(WORLD, arguments, 0, 0);
    var scenePy = Sk.ffi.callsim(mod[SCENE]);
    var scene = Sk.ffi.remapToJs(scenePy);

    var pointLight = new THREE[POINT_LIGHT](0xFFFFFF);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    var grid = new THREE['GridHelper'](3, 0.5);
    scene.add( grid );

    var axes = new THREE['AxisHelper'](2);
//    axes.material.depthTest = false;
//    axes.material.transparent = false;
//    axes.matrixAutoUpdate = false;
//    axes.visible = true;/*false;*/
    scene.add( axes );

    return scenePy;
  });

  mod[CUBE] = Sk.nativejs.func(function box(width, height, depth) {
    Sk.ffi.checkFunctionArgs(CUBE, arguments, 0, 3);
    var materialPy = Sk.ffi.callsim(mod[MESH_LAMBERT_MATERIAL], Sk.ffi.remapToPy({"color": 0x0000FF}));
    width  = Sk.ffi.remapToJs(width) || 1;
    height = Sk.ffi.remapToJs(height) || 1;
    depth  = Sk.ffi.remapToJs(depth) || 1;
    var geometryPy = Sk.ffi.callsim(mod[CUBE_GEOMETRY], Sk.ffi.remapToPy(width), Sk.ffi.remapToPy(height), Sk.ffi.remapToPy(depth));
    return Sk.ffi.callsim(mod[MESH], geometryPy, materialPy);
  });

  mod[CYLINDER] = Sk.nativejs.func(function box(radiusTop, radiusBottom, height) {
    Sk.ffi.checkFunctionArgs(CYLINDER, arguments, 0, 3);
    var materialPy = Sk.ffi.callsim(mod[MESH_LAMBERT_MATERIAL], Sk.ffi.remapToPy({"color": 0x00FF00}));
    radiusBottom = Sk.ffi.remapToJs(radiusBottom) || 1;
    radiusTop  = Sk.ffi.remapToJs(radiusTop,  radiusBottom);
    height  = Sk.ffi.remapToJs(height) || 1;
    radiusTop          = Sk.ffi.remapToPy(radiusTop);
    radiusBottom       = Sk.ffi.remapToPy(radiusBottom);
    height             = Sk.ffi.remapToPy(height);
    var radialSegments = Sk.ffi.remapToPy(32);
    var geometryPy = Sk.ffi.callsim(mod[CYLINDER_GEOMETRY], radiusTop, radiusBottom, height, radialSegments);
    return Sk.ffi.callsim(mod[MESH], geometryPy, materialPy);
  });

  mod[SPHERE] = Sk.nativejs.func(function box(radius) {
    Sk.ffi.checkFunctionArgs(SPHERE, arguments, 0, 1);
    var materialPy = Sk.ffi.callsim(mod[MESH_LAMBERT_MATERIAL], Sk.ffi.remapToPy({"color": 0xFF0000}));
    radius = Sk.ffi.remapToJs(radius) || 1;
    radius = Sk.ffi.remapToPy(radius);
    var widthSegments = Sk.ffi.remapToPy(24);
    var heightSegments = Sk.ffi.remapToPy(18);
    var geometryPy = Sk.ffi.callsim(mod[SPHERE_GEOMETRY], radius, widthSegments, heightSegments);
    return Sk.ffi.callsim(mod[MESH], geometryPy, materialPy);
  });

  mod[CANVAS_RENDERER] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_AUTO_CLEAR   = "autoClear";
    var PROP_CLEAR_COLOR  = "clearColor";
    var PROP_DOM_ELEMENT  = "domElement";
    var PROP_GAMMA_INPUT  = "gammaInput";
    var PROP_GAMMA_OUTPUT = "gammaOutput";
    var PROP_SORT_OBJECTS = "sortObjects";
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, parametersPy) {
      var parameters = Sk.ffi.remapToJs(parametersPy);
      Sk.ffi.referenceToPy(new THREE[CANVAS_RENDERER](parameters), CANVAS_RENDERER, undefined, selfPy);
    });
    $loc.setSize = Sk.ffi.functionPy(function(self, width, height) {
      self.v.setSize(Sk.builtin.asnum$(width), Sk.builtin.asnum$(height));
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      var METHOD_RENDER = "render";
      var METHOD_GET_CLEAR_COLOR = "getClearColor";
      var METHOD_SET_CLEAR_COLOR = "setClearColor";
      var METHOD_SET_SIZE        = "setSize";
      var renderer  = Sk.ffi.remapToJs(self);
      switch(name) {
        case PROP_AUTO_CLEAR: {
          return renderer[PROP_AUTO_CLEAR];
        }
        case PROP_GAMMA_INPUT: {
          return renderer[PROP_GAMMA_INPUT];
        }
        case PROP_GAMMA_OUTPUT: {
          return renderer[PROP_GAMMA_OUTPUT];
        }
        case PROP_SORT_OBJECTS: {
          return renderer[PROP_SORT_OBJECTS];
        }
        case PROP_DOM_ELEMENT: {
          // TODO: I think duck-typing means that this will work as long as we don't
          // try to do anything more ambitious.
          // TODO: I think we can access the Node now too.
          return {v: renderer[PROP_DOM_ELEMENT]};
        }
        case METHOD_RENDER: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_RENDER;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, scene, camera) {
              scene  = Sk.ffi.remapToJs(scene);
              camera = Sk.ffi.remapToJs(camera);
              renderer[METHOD_RENDER](scene, camera);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_RENDER);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_RENDER);
            })
          }, METHOD_RENDER, []));
        }
        case METHOD_GET_CLEAR_COLOR: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_GET_CLEAR_COLOR;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(renderer[METHOD_GET_CLEAR_COLOR](), COLOR));
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_GET_CLEAR_COLOR);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_GET_CLEAR_COLOR);
            });
          }, METHOD_GET_CLEAR_COLOR, []));
        }
        case METHOD_SET_CLEAR_COLOR: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET_CLEAR_COLOR;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, color, alpha) {
              color  = Sk.ffi.remapToJs(color);
              alpha = Sk.ffi.remapToJs(alpha);
              renderer[METHOD_SET_CLEAR_COLOR](color, alpha);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_CLEAR_COLOR);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_CLEAR_COLOR);
            });
          }, METHOD_SET_CLEAR_COLOR, []));
        }
        case METHOD_SET_SIZE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET_SIZE;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, width, height, updateStyle) {
              width  = Sk.ffi.remapToJs(width);
              height = Sk.ffi.remapToJs(height);
              updateStyle = Sk.ffi.remapToJs(updateStyle);
              renderer.setSize(width, height, updateStyle);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_SIZE);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_SIZE);
            });
          }, METHOD_SET_SIZE, []));
        }
        default: {
          // The framework will raise an AttributeError exception.
          return /* undefined */;
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(self, name, value) {
      var renderer  = Sk.ffi.remapToJs(self);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_AUTO_CLEAR: {
          if (isBoolean(value)) {
            renderer[PROP_AUTO_CLEAR] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_AUTO_CLEAR + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case PROP_GAMMA_INPUT: {
          if (isBoolean(value)) {
            renderer[PROP_GAMMA_INPUT] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_GAMMA_INPUT + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case PROP_GAMMA_OUTPUT: {
          if (isBoolean(value)) {
            renderer[PROP_GAMMA_OUTPUT] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_GAMMA_OUTPUT + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case PROP_SORT_OBJECTS: {
          if (isBoolean(value)) {
            renderer[PROP_SORT_OBJECTS] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_SORT_OBJECTS + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case "size": {
          var width  = Sk.builtin.asnum$(value[0]);
          var height = Sk.builtin.asnum$(value[1]);
          renderer.setSize(width, height);
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + CANVAS_RENDERER);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var renderer = self.v;
      var args = {};
      args[PROP_AUTO_CLEAR] = renderer[PROP_AUTO_CLEAR];
      args[PROP_GAMMA_INPUT] = renderer[PROP_GAMMA_INPUT];
      args[PROP_GAMMA_OUTPUT] = renderer[PROP_GAMMA_OUTPUT];
      return Sk.ffi.stringToPy(CANVAS_RENDERER + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var renderer = self.v;
      var autoClear = renderer[PROP_AUTO_CLEAR];
      // Note: The WebGLRenderer takes only one argument, but it is a dictionary.
      var args = [{"autoClear": autoClear}];
      return Sk.ffi.stringToPy(CANVAS_RENDERER + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, CANVAS_RENDERER, []);

  mod[WEBGL_RENDERER] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_AUTO_CLEAR   = "autoClear";
    var PROP_CLEAR_COLOR  = "clearColor";
    var PROP_DOM_ELEMENT  = "domElement";
    var PROP_GAMMA_INPUT  = "gammaInput";
    var PROP_GAMMA_OUTPUT = "gammaOutput";
    var PROP_SORT_OBJECTS = "sortObjects";
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, parametersPy) {
      if (Sk.ffi.checkMethodArgs(WEBGL_RENDERER, arguments, 0, 1) > 0) {
        Sk.ffi.checkArgType("parameters", "dict" + Sk.ffi.getType(parametersPy), Sk.ffi.isDictionary(parametersPy));
      }
      var parameters = Sk.ffi.remapToJs(parametersPy);
      Sk.ffi.referenceToPy(new THREE[WEBGL_RENDERER](parameters), WEBGL_RENDERER, undefined, selfPy);
    });
    $loc.setSize = Sk.ffi.functionPy(function(self, width, height) {
      self.v.setSize(Sk.builtin.asnum$(width), Sk.builtin.asnum$(height));
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      var METHOD_RENDER = "render";
      var METHOD_GET_CLEAR_COLOR = "getClearColor";
      var METHOD_SET_CLEAR_COLOR = "setClearColor";
      var METHOD_SET_SIZE        = "setSize";
      var renderer  = Sk.ffi.remapToJs(self);
      switch(name) {
        case PROP_AUTO_CLEAR: {
          return Sk.ffi.booleanToPy(renderer[PROP_AUTO_CLEAR]);
        }
        case PROP_GAMMA_INPUT: {
          return Sk.ffi.booleanToPy(renderer[PROP_GAMMA_INPUT]);
        }
        case PROP_GAMMA_OUTPUT: {
          return Sk.ffi.booleanToPy(renderer[PROP_GAMMA_OUTPUT]);
        }
        case PROP_SORT_OBJECTS: {
          return renderer[PROP_SORT_OBJECTS];
        }
        case PROP_DOM_ELEMENT: {
          // TODO: I think duck-typing means that this will work as long as we don't
          // try to do anything more ambitious.
          return {v: renderer[PROP_DOM_ELEMENT]};
        }
        case METHOD_RENDER: {
          return Sk.ffi.callableToPy(mod, renderer, METHOD_RENDER, function(selfPy, scenePy, cameraPy) {
            Sk.ffi.checkMethodArgs(METHOD_GET_CLEAR_COLOR, arguments, 2, 2);
            var scene  = Sk.ffi.remapToJs(scenePy);
            var camera = Sk.ffi.remapToJs(cameraPy);
            return Sk.ffi.remapToPy(renderer[METHOD_RENDER](scene, camera));
          });
        }
        case METHOD_GET_CLEAR_COLOR: {
          return Sk.ffi.callableToPy(mod, renderer, METHOD_GET_CLEAR_COLOR, function(selfPy) {
            Sk.ffi.checkMethodArgs(METHOD_GET_CLEAR_COLOR, arguments, 0, 0);
            return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(renderer[METHOD_GET_CLEAR_COLOR](), COLOR));
          });
        }
        case METHOD_SET_CLEAR_COLOR: {
          return Sk.ffi.callableToPy(mod, renderer, METHOD_SET_CLEAR_COLOR, function(self, color, alpha) {
            Sk.ffi.checkMethodArgs(METHOD_GET_CLEAR_COLOR, arguments, 2, 2);
            color  = Sk.ffi.remapToJs(color);
            alpha = Sk.ffi.remapToJs(alpha);
            return Sk.ffi.remapToPy(renderer[METHOD_SET_CLEAR_COLOR](color, alpha));
          });
        }
        case METHOD_SET_SIZE: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET_SIZE;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, width, height, updateStyle) {
              width  = Sk.ffi.remapToJs(width);
              height = Sk.ffi.remapToJs(height);
              updateStyle = Sk.ffi.remapToJs(updateStyle);
              renderer.setSize(width, height, updateStyle);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_SIZE);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_SIZE);
            });
          }, METHOD_SET_SIZE, []));
        }
        default: {
          // The framework will raise an AttributeError exception.
          return /* undefined */;
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(self, name, value) {
      var renderer  = Sk.ffi.remapToJs(self);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_AUTO_CLEAR: {
          if (isBoolean(value)) {
            renderer[PROP_AUTO_CLEAR] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_AUTO_CLEAR + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case PROP_GAMMA_INPUT: {
          if (isBoolean(value)) {
            renderer[PROP_GAMMA_INPUT] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_GAMMA_INPUT + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case PROP_GAMMA_OUTPUT: {
          if (isBoolean(value)) {
            renderer[PROP_GAMMA_OUTPUT] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_GAMMA_OUTPUT + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case PROP_SORT_OBJECTS: {
          if (isBoolean(value)) {
            renderer[PROP_SORT_OBJECTS] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_SORT_OBJECTS + "' attribute must be a <type 'bool'>.");
          }
        }
        break;
        case "size": {
          var width  = Sk.builtin.asnum$(value[0]);
          var height = Sk.builtin.asnum$(value[1]);
          renderer.setSize(width, height);
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + WEBGL_RENDERER);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var renderer = self.v;
      var args = {};
      args[PROP_AUTO_CLEAR] = renderer[PROP_AUTO_CLEAR];
      args[PROP_GAMMA_INPUT] = renderer[PROP_GAMMA_INPUT];
      args[PROP_GAMMA_OUTPUT] = renderer[PROP_GAMMA_OUTPUT];
      return Sk.ffi.stringToPy(WEBGL_RENDERER + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var renderer = self.v;
      var autoClear = renderer[PROP_AUTO_CLEAR];
      // Note: The WebGLRenderer takes only one argument, but it is a dictionary.
      var args = [{"autoClear": autoClear}];
      return Sk.ffi.stringToPy(WEBGL_RENDERER + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, WEBGL_RENDERER, []);

  mod[COLOR] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_R = "r";
    var PROP_G = "g";
    var PROP_B = "b";
    $loc.__init__ = Sk.ffi.functionPy(function(self, value) {
      value = Sk.ffi.remapToJs(value);
      self.tp$name = COLOR;
      if (isUndefined(value)) {
        self.v = new THREE[COLOR]();
      }
      else {
        if (isNumber(value) || isString(value)) {
          self.v = new THREE[COLOR](value);
        }
        else if (isColor(value)) {
          self.v = new THREE[COLOR](value);
        }
        else {
          throw new Sk.builtin.AssertionError("value must be either a number, string or Color.");
        }
      }
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(colorPy, name) {
      var color = Sk.ffi.remapToJs(colorPy);
      switch(name) {
        case PROP_R: {
          return Sk.builtin.assk$(color[PROP_R], Sk.builtin.nmber.float$);
        }
        case PROP_G: {
          return Sk.builtin.assk$(color[PROP_G], Sk.builtin.nmber.float$);
        }
        case PROP_B: {
          return Sk.builtin.assk$(color[PROP_B], Sk.builtin.nmber.float$);
        }
        case METHOD_SET_RGB: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET_RGB;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, rPy, gPy, bPy) {
              var r  = Sk.ffi.remapToJs(rPy);
              var g  = Sk.ffi.remapToJs(gPy);
              var b  = Sk.ffi.remapToJs(bPy);
              color[METHOD_SET_RGB](r, g, b);
              return colorPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_RGB);
            });
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_RGB);
            });
          }, METHOD_SET_RGB, []));
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(colorPy, name, valuePy) {
      var color = Sk.ffi.remapToJs(colorPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_R: {
          color[PROP_R] = value;
        }
        break;
        case PROP_G: {
          color[PROP_G] = value;
        }
        break;
        case PROP_B: {
          color[PROP_B] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not an attribute of " + COLOR);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var color = self.v;
      var args = {};
      args[PROP_R] = color[PROP_R];
      args[PROP_G] = color[PROP_G];
      args[PROP_B] = color[PROP_B];
      return Sk.ffi.stringToPy(COLOR + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var color = self.v;
      var r = color[PROP_R];
      var g = color[PROP_G];
      var b = color[PROP_B];
      var args = [r, g, b];
      return Sk.ffi.stringToPy(COLOR + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, COLOR, []);

  mod[PERSPECTIVE_CAMERA] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, fov, aspect, near, far) {
      var fieldOfView = Sk.builtin.asnum$(fov)
      var aspectRatio = Sk.builtin.asnum$(aspect)
      var nearPlane = Sk.builtin.asnum$(near)
      var farPlane = Sk.builtin.asnum$(far)
      self.v = new THREE[PERSPECTIVE_CAMERA](fieldOfView, aspectRatio, nearPlane, farPlane);
      self.tp$name = PERSPECTIVE_CAMERA;
    });

    $loc.__getattr__ = Sk.ffi.functionPy(function(cameraPy, name) {
      var camera = Sk.ffi.remapToJs(cameraPy);
      var UPDATE_PROJECTION_MATRIX = "updateProjectionMatrix"
      switch(name) {
        case "aspect": {
          return Sk.builtin.assk$(camera.aspect, Sk.builtin.nmber.float$);
        }
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera.position, VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(camera[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(camera[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return camera[PROP_USE_QUATERNION];
        }
        case METHOD_LOOK_AT: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(methodPy) {
              Sk.ffi.referenceToPy(camera, METHOD_LOOK_AT, undefined, methodPy);
            });
            $loc.__call__ = Sk.ffi.functionPy(function(methodPy, vectorPy) {
              camera[METHOD_LOOK_AT](Sk.ffi.remapToJs(vectorPy));
              return cameraPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
          }, METHOD_LOOK_AT, []));
        }
        case UPDATE_PROJECTION_MATRIX: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = UPDATE_PROJECTION_MATRIX;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              camera[name]();
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(UPDATE_PROJECTION_MATRIX)
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(UPDATE_PROJECTION_MATRIX)
            })
          }, UPDATE_PROJECTION_MATRIX, []));
        }
        default: {
          return;
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(cameraPy, name, valuePy) {
      var camera = Sk.ffi.remapToJs(cameraPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case "aspect": {
          camera.aspect = value;
        }
        break;
        case PROP_POSITION: {
          camera[PROP_POSITION] = value;
        }
        break;
        case PROP_QUATERNION: {
          camera[PROP_QUATERNION] = value;
        }
        break;
        case PROP_ROTATION: {
          camera[PROP_ROTATION] = value;
        }
        break;
        case PROP_EULER_ORDER: {
          if (isString(value)) {
            camera[PROP_EULER_ORDER] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_SCALE: {
          camera[PROP_SCALE] = value;
        }
        break;
        case PROP_UP: {
          camera[PROP_UP] = value;
        }
        break;
        case PROP_USE_QUATERNION: {
          camera[PROP_USE_QUATERNION] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AssertionError(name + " is not an attribute of " + PERSPECTIVE_CAMERA);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      return Sk.ffi.stringToPy(PERSPECTIVE_CAMERA);
    });
  }, PERSPECTIVE_CAMERA, []);

  mod[ORTHOGRAPHIC_CAMERA] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, leftPy, rightPy, topPy, bottomPy, nearPy, farPy) {
      var left = Sk.builtin.asnum$(leftPy)
      var right = Sk.builtin.asnum$(rightPy)
      var top = Sk.builtin.asnum$(topPy)
      var bottom = Sk.builtin.asnum$(bottomPy)
      var near = Sk.builtin.asnum$(nearPy)
      var far = Sk.builtin.asnum$(farPy)
      self.v = new THREE[ORTHOGRAPHIC_CAMERA](left, right, top, bottom, near, far);
      self.tp$name = ORTHOGRAPHIC_CAMERA;
    });

    $loc.__getattr__ = Sk.ffi.functionPy(function(cameraPy, name) {
      var camera = Sk.ffi.remapToJs(cameraPy);
      var UPDATE_PROJECTION_MATRIX = "updateProjectionMatrix"
      switch(name) {
        case "aspect": {
          return Sk.ffi.numberToPy(camera.aspect);
        }
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_POSITION], VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(camera[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(camera[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return camera[PROP_USE_QUATERNION];
        }
        case METHOD_LOOK_AT: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LOOK_AT;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy) {
              camera[METHOD_LOOK_AT](Sk.ffi.remapToJs(vectorPy));
              return cameraPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
          }, METHOD_LOOK_AT, []));
        }
        case UPDATE_PROJECTION_MATRIX: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = UPDATE_PROJECTION_MATRIX;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              camera[name]();
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(UPDATE_PROJECTION_MATRIX)
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(UPDATE_PROJECTION_MATRIX)
            })
          }, UPDATE_PROJECTION_MATRIX, []));
        }
        default: {
          return;
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(cameraPy, name, valuePy) {
      var camera = Sk.ffi.remapToJs(cameraPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_LEFT: {
          camera[PROP_LEFT] = value;
        }
        break;
        case PROP_RIGHT: {
          camera[PROP_RIGHT] = value;
        }
        break;
        case PROP_TOP: {
          camera[PROP_TOP] = value;
        }
        break;
        case PROP_BOTTOM: {
          camera[PROP_BOTTOM] = value;
        }
        break;
        case PROP_POSITION: {
          camera[PROP_POSITION] = value;
        }
        break;
        case PROP_QUATERNION: {
          camera[PROP_QUATERNION] = value;
        }
        break;
        case PROP_ROTATION: {
          camera[PROP_ROTATION] = value;
        }
        break;
        case PROP_EULER_ORDER: {
          if (isString(value)) {
            camera[PROP_EULER_ORDER] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_SCALE: {
          camera[PROP_SCALE] = value;
        }
        break;
        case PROP_UP: {
          camera[PROP_UP] = value;
        }
        break;
        case PROP_USE_QUATERNION: {
          camera[PROP_USE_QUATERNION] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AssertionError(name + " is not an attribute of " + ORTHOGRAPHIC_CAMERA);
        }
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(cameraPy) {
      var camera = Sk.ffi.remapToJs(cameraPy);
      var args = [camera[PROP_LEFT], camera[PROP_RIGHT], camera[PROP_TOP], camera[PROP_BOTTOM], camera[PROP_NEAR], camera[PROP_FAR]];
      return Sk.ffi.stringToPy(ORTHOGRAPHIC_CAMERA + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      return Sk.ffi.stringToPy(ORTHOGRAPHIC_CAMERA);
    });
  }, ORTHOGRAPHIC_CAMERA, []);

  mod[ARROW_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, length, segments, radiusShaft, radiusCone, lengthCone) {
      length = Sk.ffi.remapToJs(length) || 1;
      segments = Sk.ffi.remapToJs(segments);
      radiusShaft = Sk.ffi.remapToJs(radiusShaft) || 0.01;
      radiusCone = Sk.ffi.remapToJs(radiusCone) || 0.08;
      lengthCone = Sk.ffi.remapToJs(lengthCone) || 0.2;
      var lengthShaft = 1 - lengthCone;
      var a = new THREE[VECTOR_3](0, 0, length);
      var b = new THREE[VECTOR_3](radiusCone, 0, lengthShaft);
      var c = new THREE[VECTOR_3](radiusShaft, 0, lengthShaft);
      var d = new THREE[VECTOR_3](radiusShaft, 0, 0);
      var e = new THREE[VECTOR_3](0, 0, 0);
      var points = [a, b, c, d, e];
      self.v = new THREE[LATHE_GEOMETRY](points, segments);
      self.tp$name = ARROW_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(geometryPy, name) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      switch(name) {
        case PROP_ID: {
          return Sk.ffi.numberToIntPy(geometry[PROP_ID]);
        }
        case PROP_NAME: {
          return Sk.ffi.stringToPy(geometry[PROP_NAME]);
        }
        case PROP_VERTICES: {
          return verticesPy(geometry[PROP_VERTICES]);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_NAME: {
          if (isString(value)) {
            geometry[PROP_NAME] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + ARROW_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var geometry = Sk.ffi.remapToJs(self);
      var args = {};
      return Sk.ffi.stringToPy(ARROW_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var geometry = Sk.ffi.remapToJs(self);
      var args = [];
      return Sk.ffi.stringToPy(ARROW_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, ARROW_GEOMETRY, []);

   mod[CIRCLE_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, radius, segments, thetaStart, thetaLength) {
      radius      = numberFromArg(radius,          PROP_RADIUS,       CIRCLE_GEOMETRY);
      segments    = numberFromIntegerArg(segments, PROP_SEGMENTS,     CIRCLE_GEOMETRY);
      thetaStart  = numberFromArg(thetaStart,      PROP_THETA_START,  CIRCLE_GEOMETRY);
      thetaLength = numberFromArg(thetaLength,     PROP_THETA_LENGTH, CIRCLE_GEOMETRY);
      self.v = new THREE[CIRCLE_GEOMETRY](radius, segments, thetaStart, thetaLength);
      self.tp$name = CIRCLE_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        default: {
          throw Sk.ffi.err.attribute(name).isNotGetableOnType(CIRCLE_GEOMETRY);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + CIRCLE_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var sphere = self.v;
      var args = {};
      return Sk.ffi.stringToPy(CIRCLE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var sphere = self.v;
      var args = [];
      return Sk.ffi.stringToPy(CIRCLE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, CIRCLE_GEOMETRY, []);

   mod[CUBE_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_WIDTH           = "width";
    var PROP_HEIGHT          = "height";
    var PROP_DEPTH           = "depth";
    var PROP_WIDTH_SEGMENTS  = "widthSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";
    var PROP_DEPTH_SEGMENTS  = "depthSegments";
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, width, height, depth, widthSegments, heightSegments, depthSegments) {
      Sk.ffi.checkMethodArgs(CUBE_GEOMETRY, arguments, 3, 6);
      width          = numberFromArg(width,                 PROP_WIDTH,           CUBE_GEOMETRY);
      height         = numberFromArg(height,                PROP_HEIGHT,          CUBE_GEOMETRY);
      depth          = numberFromArg(depth,                 PROP_DEPTH,           CUBE_GEOMETRY);
      widthSegments  = numberFromIntegerArg(widthSegments,  PROP_WIDTH_SEGMENTS,  CUBE_GEOMETRY);
      heightSegments = numberFromIntegerArg(heightSegments, PROP_HEIGHT_SEGMENTS, CUBE_GEOMETRY);
      depthSegments  = numberFromIntegerArg(depthSegments,  PROP_DEPTH_SEGMENTS,  CUBE_GEOMETRY);
      Sk.ffi.referenceToPy(new THREE[CUBE_GEOMETRY](width, height, depth, widthSegments, heightSegments, depthSegments), CUBE_GEOMETRY, undefined, selfPy);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_WIDTH: {
          return Sk.builtin.assk$(self.v[PROP_WIDTH], Sk.builtin.nmber.float$);
        }
        case PROP_HEIGHT: {
          return Sk.builtin.assk$(self.v[PROP_HEIGHT], Sk.builtin.nmber.float$);
        }
        case PROP_DEPTH: {
          return Sk.builtin.assk$(self.v[PROP_DEPTH], Sk.builtin.nmber.float$);
        }
        case PROP_WIDTH_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_WIDTH_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_HEIGHT_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_HEIGHT_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_DEPTH_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_DEPTH_SEGMENTS], Sk.builtin.nmber.int$);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + CUBE_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var cube = self.v;
      var args = {};
      args[PROP_WIDTH]  = cube[PROP_WIDTH];
      args[PROP_HEIGHT] = cube[PROP_HEIGHT];
      args[PROP_DEPTH]  = cube[PROP_DEPTH];
      return Sk.ffi.stringToPy(CUBE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var cube = self.v;
      var width          = cube[PROP_WIDTH];
      var height         = cube[PROP_HEIGHT];
      var depth          = cube[PROP_DEPTH];
      var widthSegments  = cube[PROP_WIDTH_SEGMENTS];
      var heightSegments = cube[PROP_HEIGHT_SEGMENTS];
      var depthSegments  = cube[PROP_DEPTH_SEGMENTS];
      var args = [width, height, depth, widthSegments, heightSegments, depthSegments];
      return Sk.ffi.stringToPy(CUBE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, CUBE_GEOMETRY, []);

  mod[CYLINDER_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_RADIUS_TOP      = "radiusTop";
    var PROP_RADIUS_BOTTOM   = "radiusBottom";
    var PROP_HEIGHT          = "height";
    var PROP_RADIUS_SEGMENTS = "radiusSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";
    var PROP_OPEN_ENDED      = "openEnded";
    $loc.__init__ = Sk.ffi.functionPy(function(self, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded) {
      radiusTop      = numberFromArg(radiusTop,             PROP_RADIUS_TOP,      CYLINDER_GEOMETRY);
      radiusBottom   = numberFromArg(radiusBottom,          PROP_RADIUS_BOTTOM,   CYLINDER_GEOMETRY);
      height         = numberFromArg(height,                PROP_HEIGHT,          CYLINDER_GEOMETRY);
      radiusSegments = numberFromIntegerArg(radiusSegments, PROP_RADIUS_SEGMENTS, CYLINDER_GEOMETRY);
      heightSegments = numberFromIntegerArg(heightSegments, PROP_HEIGHT_SEGMENTS, CYLINDER_GEOMETRY);
      openEnded      = Sk.ffi.remapToJs(openEnded);
      self.v = new THREE[CYLINDER_GEOMETRY](radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
      self.tp$name = CYLINDER_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_RADIUS_TOP: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS_TOP], Sk.builtin.nmber.float$);
        }
        case PROP_RADIUS_BOTTOM: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS_BOTTOM], Sk.builtin.nmber.float$);
        }
        case PROP_HEIGHT: {
          return Sk.builtin.assk$(self.v[PROP_HEIGHT], Sk.builtin.nmber.float$);
        }
        case PROP_RADIUS_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_HEIGHT_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_HEIGHT_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_OPEN_ENDED: {
          return self.v[PROP_OPEN_ENDED];
        }
        default: {
          // Framework will take care of the error message.
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + CYLINDER_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var cylinder = self.v;
      var args = {};
      args[PROP_RADIUS_TOP] = cylinder[PROP_RADIUS_TOP];
      args[PROP_RADIUS_BOTTOM] = cylinder[PROP_RADIUS_BOTTOM];
      args[PROP_HEIGHT] = cylinder[PROP_HEIGHT];
      args[PROP_OPEN_ENDED] = cylinder[PROP_OPEN_ENDED];
      // TODO: Need a Python.stringify because Boolean is {True, False} etc.
      return Sk.ffi.stringToPy(CYLINDER_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var cylinder = self.v;
      var radiusTop      = cylinder[PROP_RADIUS_TOP];
      var radiusBottom   = cylinder[PROP_RADIUS_BOTTOM];
      var height         = cylinder[PROP_HEIGHT];
      var radiusSegments = cylinder[PROP_RADIUS_SEGMENTS];
      var heightSegments = cylinder[PROP_HEIGHT_SEGMENTS];
      var openEnded      = cylinder[PROP_OPEN_ENDED];
      var args = [radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded];
      return Sk.ffi.stringToPy(CYLINDER_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, CYLINDER_GEOMETRY, []);

  mod[LATHE_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, pointsPy, segmentsPy, phiStart, phiLength) {
      var points = Sk.ffi.remapToJs(pointsPy);
      var segments = Sk.ffi.remapToJs(segmentsPy);
      phiStart = Sk.ffi.remapToJs(phiStart);
      phiLength = Sk.ffi.remapToJs(phiLength);
      self.v = new THREE[LATHE_GEOMETRY](points, segments, phiStart, phiLength);
      self.tp$name = LATHE_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(geometryPy, name) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      switch(name) {
        case PROP_ID: {
          return Sk.ffi.numberToIntPy(geometry[PROP_ID]);
        }
        case PROP_NAME: {
          return Sk.ffi.stringToPy(geometry[PROP_NAME]);
        }
        case PROP_VERTICES: {
          return verticesPy(geometry[PROP_VERTICES]);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_NAME: {
          if (isString(value)) {
            geometry[PROP_NAME] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + LATHE_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var latheGeometry = self.v;
      var args = {};
      return Sk.ffi.stringToPy(LATHE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var latheGeometry = self.v;
      var args = [];
      return Sk.ffi.stringToPy(LATHE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, LATHE_GEOMETRY, []);

  mod[ICOSAHEDRON_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, radius, detail) {
      radius = numberFromArg(radius,        PROP_RADIUS, ICOSAHEDRON_GEOMETRY);
      detail = numberFromIntegerArg(detail, PROP_DETAIL, ICOSAHEDRON_GEOMETRY);
      self.v = new THREE[ICOSAHEDRON_GEOMETRY](radius, detail);
      self.tp$name = ICOSAHEDRON_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_RADIUS: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS], Sk.builtin.nmber.float$);
        }
        case PROP_DETAIL: {
          return Sk.builtin.assk$(self.v[PROP_DETAIL], Sk.builtin.nmber.int$);
        }
        default: {
          // Framework will take care of the error message.
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + ICOSAHEDRON_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var icosahedron = self.v;
      var args = {};
      args[PROP_RADIUS] = icosahedron[PROP_RADIUS];
      args[PROP_DETAIL] = icosahedron[PROP_DETAIL];
      return Sk.ffi.stringToPy(ICOSAHEDRON_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var icosahedron = self.v;
      var radius = icosahedron[PROP_RADIUS];
      var detail = icosahedron[PROP_DETAIL];
      var args = [radius, detail];
      return Sk.ffi.stringToPy(ICOSAHEDRON_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, ICOSAHEDRON_GEOMETRY, []);

  mod[OCTAHEDRON_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_DETAIL = "detail";
    $loc.__init__ = Sk.ffi.functionPy(function(self, radius, detail) {
      radius = numberFromArg(radius,        PROP_RADIUS, OCTAHEDRON_GEOMETRY);
      detail = numberFromIntegerArg(detail, PROP_DETAIL, OCTAHEDRON_GEOMETRY);
      self.v = new THREE[OCTAHEDRON_GEOMETRY](radius, detail);
      self.v.radius = radius; // workaround for THREE not caching radius.
      self.v.detail = detail; // workaround for THREE not caching detail.
      self.tp$name = OCTAHEDRON_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_RADIUS: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS], Sk.builtin.nmber.float$);
        }
        case PROP_DETAIL: {
          return Sk.builtin.assk$(self.v[PROP_DETAIL], Sk.builtin.nmber.int$);
        }
        default: {
          // Framework will take care of the error message.
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + OCTAHEDRON_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var octahedron = self.v;
      var args = {};
      args[PROP_RADIUS] = octahedron[PROP_RADIUS];
      args[PROP_DETAIL] = octahedron[PROP_DETAIL];
      return Sk.ffi.stringToPy(OCTAHEDRON_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var octahedron = self.v;
      var radius = octahedron[PROP_RADIUS];
      var detail = octahedron[PROP_DETAIL];
      var args = [radius, detail];
      return Sk.ffi.stringToPy(OCTAHEDRON_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, OCTAHEDRON_GEOMETRY, []);

   mod[PLANE_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_WIDTH           = "width";
    var PROP_HEIGHT          = "height";
    var PROP_WIDTH_SEGMENTS  = "widthSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";
    $loc.__init__ = Sk.ffi.functionPy(function(self, width, height, widthSegments, heightSegments) {
      width          = numberFromArg(width,                 PROP_WIDTH,           PLANE_GEOMETRY);
      height         = numberFromArg(height,                PROP_HEIGHT,          PLANE_GEOMETRY);
      widthSegments  = numberFromIntegerArg(widthSegments,  PROP_WIDTH_SEGMENTS,  PLANE_GEOMETRY);
      heightSegments = numberFromIntegerArg(heightSegments, PROP_HEIGHT_SEGMENTS, PLANE_GEOMETRY);
      self.v = new THREE[PLANE_GEOMETRY](width, height, widthSegments, heightSegments);
      self.tp$name = PLANE_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_WIDTH: {
          return Sk.builtin.assk$(self.v[PROP_WIDTH], Sk.builtin.nmber.float$);
        }
        case PROP_HEIGHT: {
          return Sk.builtin.assk$(self.v[PROP_HEIGHT], Sk.builtin.nmber.float$);
        }
        case PROP_WIDTH_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_WIDTH_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_HEIGHT_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_HEIGHT_SEGMENTS], Sk.builtin.nmber.int$);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + PLANE_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var plane = self.v;
      var args = {};
      args[PROP_WIDTH]  = plane[PROP_WIDTH];
      args[PROP_HEIGHT] = plane[PROP_HEIGHT];
      return Sk.ffi.stringToPy(PLANE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var plane = self.v;
      var width          = plane[PROP_WIDTH];
      var height         = plane[PROP_HEIGHT];
      var widthSegments  = plane[PROP_WIDTH_SEGMENTS];
      var heightSegments = plane[PROP_HEIGHT_SEGMENTS];
      var args = [width, height, widthSegments, heightSegments];
      return Sk.ffi.stringToPy(PLANE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, PLANE_GEOMETRY, []);

   mod[SPHERE_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_WIDTH_SEGMENTS  = "widthSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";
    var PROP_PHI_START       = "phiStart";
    var PROP_PHI_LENGTH      = "phiLength";
    $loc.__init__ = Sk.ffi.functionPy(function(self, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
      radius         = numberFromArg(radius,                PROP_RADIUS,          SPHERE_GEOMETRY);
      widthSegments  = numberFromIntegerArg(widthSegments,  PROP_WIDTH_SEGMENTS,  SPHERE_GEOMETRY);
      heightSegments = numberFromIntegerArg(heightSegments, PROP_HEIGHT_SEGMENTS, SPHERE_GEOMETRY);
      phiStart       = numberFromArg(phiStart,              PROP_PHI_START,       SPHERE_GEOMETRY);
      phiLength      = numberFromArg(phiLength,             PROP_PHI_LENGTH,      SPHERE_GEOMETRY);
      thetaStart     = numberFromArg(thetaStart,            PROP_THETA_START,     SPHERE_GEOMETRY);
      thetaLength    = numberFromArg(thetaLength,           PROP_THETA_LENGTH,    SPHERE_GEOMETRY);
      self.v = new THREE[SPHERE_GEOMETRY](radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
      self.tp$name = SPHERE_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_RADIUS: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS], Sk.builtin.nmber.float$);
        }
        case PROP_WIDTH_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_WIDTH_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_HEIGHT_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_HEIGHT_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_PHI_START: {
          return Sk.builtin.assk$(self.v[PROP_PHI_START], Sk.builtin.nmber.float$);
        }
        case PROP_PHI_LENGTH: {
          return Sk.builtin.assk$(self.v[PROP_PHI_LENGTH], Sk.builtin.nmber.float$);
        }
        case PROP_THETA_START: {
          return Sk.builtin.assk$(self.v[PROP_THETA_START], Sk.builtin.nmber.float$);
        }
        case PROP_THETA_LENGTH: {
          return Sk.builtin.assk$(self.v[PROP_THETA_LENGTH], Sk.builtin.nmber.float$);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + SPHERE_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var sphere = self.v;
      var radius = sphere[PROP_RADIUS];
      var args = {};
      args[PROP_RADIUS] = radius;
      return Sk.ffi.stringToPy(SPHERE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var sphere = self.v;
      var radius         = sphere[PROP_RADIUS];
      var widthSegments  = sphere[PROP_WIDTH_SEGMENTS];
      var heightSegments = sphere[PROP_HEIGHT_SEGMENTS];
      var phiStart       = sphere[PROP_PHI_START];
      var phiLength      = sphere[PROP_PHI_LENGTH];
      var thetaStart     = sphere[PROP_THETA_START];
      var thetaLength    = sphere[PROP_THETA_LENGTH];
      var args = [radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength];
      return Sk.ffi.stringToPy(SPHERE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, SPHERE_GEOMETRY, []);

  mod[TETRAHEDRON_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_DETAIL = "detail";
    $loc.__init__ = Sk.ffi.functionPy(function(self, radius, detail) {
      radius = numberFromArg(radius,        PROP_RADIUS, TETRAHEDRON_GEOMETRY);
      detail = numberFromIntegerArg(detail, PROP_DETAIL, TETRAHEDRON_GEOMETRY);
      self.v = new THREE[TETRAHEDRON_GEOMETRY](radius, detail);
      self.v.radius = radius; // workaround for THREE not caching radius.
      self.v.detail = detail; // workaround for THREE not caching detail.
      self.tp$name = TETRAHEDRON_GEOMETRY;
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_RADIUS: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS], Sk.builtin.nmber.float$);
        }
        case PROP_DETAIL: {
          return Sk.builtin.assk$(self.v[PROP_DETAIL], Sk.builtin.nmber.int$);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + TETRAHEDRON_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var tetrahedron = self.v;
      var args = {};
      args[PROP_RADIUS] = tetrahedron[PROP_RADIUS];
      args[PROP_DETAIL] = tetrahedron[PROP_DETAIL];
      return Sk.ffi.stringToPy(TETRAHEDRON_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var tetrahedron = self.v;
      var radius = tetrahedron[PROP_RADIUS];
      var detail = tetrahedron[PROP_DETAIL];
      var args = [radius, detail];
      return Sk.ffi.stringToPy(TETRAHEDRON_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, TETRAHEDRON_GEOMETRY, []);

   mod[TEXT_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, text, parameters) {
      text = Sk.ffi.remapToJs(text);
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[TEXT_GEOMETRY](text, parameters);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        default: {
          throw Sk.ffi.err.attribute(name).isNotGetableOnType(TEXT_GEOMETRY);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + TEXT_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var text = Sk.ffi.remapToJs(self);
      var args = {};
      return Sk.ffi.stringToPy(TEXT_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var text = Sk.ffi.remapToJs(self);
      var args = [];
      return Sk.ffi.stringToPy(TEXT_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, TEXT_GEOMETRY, []);

   mod[TORUS_GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_TUBE             = "tube";
    var PROP_RADIAL_SEGMENTS  = "radialSegments";
    var PROP_TUBULAR_SEGMENTS = "tubularSegments";
    var PROP_ARC              = "arc";
    $loc.__init__ = Sk.ffi.functionPy(function(self, radius, tube, radialSegments, tubularSegments, arc) {
      radius = numberFromArg(radius,                          PROP_RADIUS,           TORUS_GEOMETRY);
      tube = numberFromArg(tube,                              PROP_TUBE,             TORUS_GEOMETRY);
      radialSegments = numberFromIntegerArg(radialSegments,   PROP_RADIAL_SEGMENTS,  TORUS_GEOMETRY);
      tubularSegments = numberFromIntegerArg(tubularSegments, PROP_TUBULAR_SEGMENTS, TORUS_GEOMETRY);
      arc = numberFromArg(arc,                                PROP_ARC,              TORUS_GEOMETRY);
      self.v = new THREE[TORUS_GEOMETRY](radius, tube, radialSegments, tubularSegments, arc);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        case PROP_RADIUS: {
          return Sk.builtin.assk$(self.v[PROP_RADIUS], Sk.builtin.nmber.float$);
        }
        case PROP_TUBE: {
          return Sk.builtin.assk$(self.v[PROP_TUBE], Sk.builtin.nmber.float$);
        }
        case PROP_RADIAL_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_RADIAL_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_TUBULAR_SEGMENTS: {
          return Sk.builtin.assk$(self.v[PROP_TUBULAR_SEGMENTS], Sk.builtin.nmber.int$);
        }
        case PROP_ARC: {
          return Sk.builtin.assk$(self.v[PROP_ARC], Sk.builtin.nmber.float$);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + TORUS_GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      var torus = self.v;
      var args = {};
      args[PROP_RADIUS] = torus[PROP_RADIUS];
      args[PROP_TUBE]   = torus[PROP_TUBE];
      args[PROP_ARC]    = torus[PROP_ARC];
      return Sk.ffi.stringToPy(TORUS_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      var torus = self.v;
      var radius          = torus[PROP_RADIUS];
      var tube            = torus[PROP_TUBE];
      var radialSegments  = torus[PROP_RADIAL_SEGMENTS];
      var tubularSegments = torus[PROP_TUBULAR_SEGMENTS];
      var arc             = torus[PROP_ARC];
      var args = [radius, tube, radialSegments, tubularSegments, arc];
      return Sk.ffi.stringToPy(TORUS_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, TORUS_GEOMETRY, []);

   mod[GEOMETRY] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, geometryPy) {
      if (isDefined(geometryPy)) {
        self.v = Sk.ffi.remapToJs(geometryPy);
        self.tp$name = geometryPy.tp$name;
      }
      else {
        self.v = new THREE[GEOMETRY]();
        self.tp$name = GEOMETRY;
      }
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(geometryPy, name) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      switch(name) {
        case PROP_ID: {
          return Sk.ffi.numberToIntPy(geometry[PROP_ID]);
        }
        case PROP_NAME: {
          return Sk.ffi.stringToPy(geometry[PROP_NAME]);
        }
        case PROP_VERTICES: {
          return verticesPy(geometry[PROP_VERTICES]);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(geometryPy, name, valuePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + GEOMETRY);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(geometryPy) {
      var geometry = Sk.ffi.remapToJs(geometryPy);
      if (isDefined(geometry)) {
        var args = {};
        return Sk.ffi.stringToPy(GEOMETRY + "(" + JSON.stringify(args) + ")");
      }
      else {
        return Sk.ffi.stringToPy("<type '" + GEOMETRY + "'>");
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(geometry) {
      geometry = Sk.ffi.remapToJs(geometry);
      var args = [];
      return Sk.ffi.stringToPy(GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, GEOMETRY, []);

  mod[OBJECT_3D] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self) {
      self.tp$name = OBJECT_3D;
      self.v = new THREE[OBJECT_3D]();
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(objPy, name) {
      var obj = Sk.ffi.remapToJs(objPy);
      switch(name) {
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(obj[PROP_POSITION], VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(obj[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(obj[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(obj[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(obj[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(obj[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return obj[PROP_USE_QUATERNION];
        }
        case METHOD_ADD: {
          return methodAdd(obj);
        }
        case METHOD_REMOVE: {
          return methodRemove(obj);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(obj, name, value) {
      obj = Sk.ffi.remapToJs(obj);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_POSITION: {
          obj[PROP_POSITION] = value;
        }
        break;
        case PROP_QUATERNION: {
          obj[PROP_QUATERNION] = value;
        }
        break;
        case PROP_ROTATION: {
          obj[PROP_ROTATION] = value;
        }
        break;
        case PROP_EULER_ORDER: {
          if (isString(value)) {
            obj[PROP_EULER_ORDER] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_SCALE: {
          obj[PROP_SCALE] = value;
        }
        break;
        case PROP_UP: {
          obj[PROP_UP] = value;
        }
        break;
        case PROP_USE_QUATERNION: {
          obj[PROP_USE_QUATERNION] = value;
        }
        break;
        default: {
          throw new Error(name + " is not an settable attribute of " + OBJECT_3D);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(obj) {
      obj = Sk.ffi.remapToJs(obj);
      if (isDefined(obj)) {
        var args = {};
        return Sk.ffi.stringToPy(OBJECT_3D + "(" + JSON.stringify(args) + ")");
      }
      else {
        return Sk.ffi.stringToPy("<type '" + OBJECT_3D + "'>");
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(obj) {
      obj = Sk.ffi.remapToJs(obj);
      var args = [];
      return Sk.ffi.stringToPy(OBJECT_3D + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, OBJECT_3D, []);

  mod[AMBIENT_LIGHT] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, color) {
      self.tp$name = AMBIENT_LIGHT;
      color = Sk.ffi.remapToJs(color);
      self.v = new THREE[AMBIENT_LIGHT](color);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(lightPy, name) {
      var light = Sk.ffi.remapToJs(lightPy);
      switch(name) {
        case PROP_COLOR: {
          return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(light[PROP_COLOR], COLOR));
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(lightPy, name, valuePy) {
      var light = Sk.ffi.remapToJs(lightPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_COLOR: {
          light[PROP_COLOR] = new THREE[COLOR](value);
        }
        break;
        default: {
          throw new Error(name + " is not an settable attribute of " + AMBIENT_LIGHT);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(light) {
      light = Sk.ffi.remapToJs(light);
      if (isDefined(light)) {
        var args = {};
        args[PROP_COLOR] = light[PROP_COLOR];
        return Sk.ffi.stringToPy(AMBIENT_LIGHT + "(" + JSON.stringify(args) + ")");
      }
      else {
        return Sk.ffi.stringToPy("<type '" + AMBIENT_LIGHT + "'>");
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(light) {
      light = Sk.ffi.remapToJs(light);
      var args = [light[PROP_COLOR]];
      return Sk.ffi.stringToPy(AMBIENT_LIGHT + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, AMBIENT_LIGHT, []);

  mod[DIRECTIONAL_LIGHT] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_INTENSITY = "intensity";
    var PROP_DISTANCE = "distance";
    $loc.__init__ = Sk.ffi.functionPy(function(self, color, intensity, distance) {
      self.tp$name = DIRECTIONAL_LIGHT;
      color = Sk.ffi.remapToJs(color);
      intensity = Sk.ffi.remapToJs(intensity);
      distance = Sk.ffi.remapToJs(distance);
      self.v = new THREE[DIRECTIONAL_LIGHT](color, intensity, distance);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(lightPy, name) {
      var light = Sk.ffi.remapToJs(lightPy);
      switch(name) {
        case PROP_COLOR: {
          return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(light[PROP_COLOR], COLOR));
        }
        case PROP_DISTANCE: {
          return Sk.ffi.numberToPy(light[PROP_DISTANCE]);
        }
        case PROP_INTENSITY: {
          return Sk.ffi.numberToPy(light[PROP_INTENSITY]);
        }
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_POSITION], VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(light[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(light[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return light[PROP_USE_QUATERNION];
        }
        case METHOD_LOOK_AT: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LOOK_AT;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy) {
              light[METHOD_LOOK_AT](Sk.ffi.remapToJs(vectorPy));
              return lightPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
          }, METHOD_LOOK_AT, []));
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(light, name, value) {
      light = Sk.ffi.remapToJs(light);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_COLOR: {
          light[PROP_COLOR] = new THREE[COLOR](value);
        }
        break;
        case PROP_DISTANCE: {
          if (isNumber(value)) {
            light[PROP_DISTANCE] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_DISTANCE + "' attribute must be a <type 'float'>.");
          }
        }
        break;
        case PROP_INTENSITY: {
          if (isNumber(value)) {
            light[PROP_INTENSITY] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_INTENSITY + "' attribute must be a <type 'float'>.");
          }
        }
        break;
        case PROP_POSITION: {
          light[PROP_POSITION] = value;
        }
        break;
        case PROP_QUATERNION: {
          light[PROP_QUATERNION] = value;
        }
        break;
        case PROP_ROTATION: {
          light[PROP_ROTATION] = value;
        }
        break;
        case PROP_EULER_ORDER: {
          if (isString(value)) {
            light[PROP_EULER_ORDER] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_SCALE: {
          light[PROP_SCALE] = value;
        }
        break;
        case PROP_UP: {
          light[PROP_UP] = value;
        }
        break;
        case PROP_USE_QUATERNION: {
          light[PROP_USE_QUATERNION] = value;
        }
        break;
        default: {
          throw new Error(name + " is not an settable attribute of " + DIRECTIONAL_LIGHT);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(light) {
      light = Sk.ffi.remapToJs(light);
      if (isDefined(light)) {
        var args = {};
        args[PROP_COLOR] = light[PROP_COLOR];
        args[PROP_INTENSITY] = light[PROP_INTENSITY];
        args[PROP_DISTANCE] = light[PROP_DISTANCE];
        return Sk.ffi.stringToPy(DIRECTIONAL_LIGHT + "(" + JSON.stringify(args) + ")");
      }
      else {
        return Sk.ffi.stringToPy("<type '" + DIRECTIONAL_LIGHT + "'>");
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(light) {
      light = Sk.ffi.remapToJs(light);
      var args = [light[PROP_COLOR], light[PROP_INTENSITY], light[PROP_DISTANCE]];
      return Sk.ffi.stringToPy(DIRECTIONAL_LIGHT + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, DIRECTIONAL_LIGHT, []);

  mod[POINT_LIGHT] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    var PROP_INTENSITY = "intensity";
    var PROP_DISTANCE = "distance";
    $loc.__init__ = Sk.ffi.functionPy(function(self, color, intensity, distance) {
      self.tp$name = POINT_LIGHT;
      color = Sk.ffi.remapToJs(color);
      intensity = Sk.ffi.remapToJs(intensity);
      distance = Sk.ffi.remapToJs(distance);
      self.v = new THREE[POINT_LIGHT](color, intensity, distance);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(lightPy, name) {
      var light = Sk.ffi.remapToJs(lightPy);
      switch(name) {
        case PROP_COLOR: {
          return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(light[PROP_COLOR], COLOR));
        }
        case PROP_DISTANCE: {
          return Sk.ffi.numberToPy(light[PROP_DISTANCE]);
        }
        case PROP_INTENSITY: {
          return Sk.ffi.numberToPy(light[PROP_INTENSITY]);
        }
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_POSITION], VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(light[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(light[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return light[PROP_USE_QUATERNION];
        }
        case METHOD_LOOK_AT: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LOOK_AT;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy) {
              light[METHOD_LOOK_AT](Sk.ffi.remapToJs(vectorPy));
              return lightPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
          }, METHOD_LOOK_AT, []));
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(light, name, value) {
      light = Sk.ffi.remapToJs(light);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_COLOR: {
          light[PROP_COLOR] = new THREE[COLOR](value);
        }
        break;
        case PROP_DISTANCE: {
          if (isNumber(value)) {
            light[PROP_DISTANCE] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_DISTANCE + "' attribute must be a <type 'float'>.");
          }
        }
        break;
        case PROP_INTENSITY: {
          if (isNumber(value)) {
            light[PROP_INTENSITY] = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_INTENSITY + "' attribute must be a <type 'float'>.");
          }
        }
        break;
        case PROP_POSITION: {
          light[PROP_POSITION] = value;
        }
        break;
        case PROP_QUATERNION: {
          light[PROP_QUATERNION] = value;
        }
        break;
        case PROP_ROTATION: {
          light[PROP_ROTATION] = value;
        }
        break;
        case PROP_EULER_ORDER: {
          if (isString(value)) {
            light[PROP_EULER_ORDER] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_SCALE: {
          light[PROP_SCALE] = value;
        }
        break;
        case PROP_UP: {
          light[PROP_UP] = value;
        }
        break;
        case PROP_USE_QUATERNION: {
          light[PROP_USE_QUATERNION] = value;
        }
        break;
        default: {
          throw new Error(name + " is not an settable attribute of " + POINT_LIGHT);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(light) {
      light = Sk.ffi.remapToJs(light);
      if (isDefined(light)) {
        var args = {};
        args[PROP_COLOR] = light[PROP_COLOR];
        args[PROP_INTENSITY] = light[PROP_INTENSITY];
        args[PROP_DISTANCE] = light[PROP_DISTANCE];
        return Sk.ffi.stringToPy(POINT_LIGHT + "(" + JSON.stringify(args) + ")");
      }
      else {
        return Sk.ffi.stringToPy("<type '" + POINT_LIGHT + "'>");
      }
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(light) {
      light = Sk.ffi.remapToJs(light);
      var args = [light[PROP_COLOR], light[PROP_INTENSITY], light[PROP_DISTANCE]];
      return Sk.ffi.stringToPy(POINT_LIGHT + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, POINT_LIGHT, []);

  mod[LINE] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, geometryPy, materialPy, typePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy)
      var material = Sk.ffi.remapToJs(materialPy)
      var type = Sk.ffi.remapToJs(typePy)
      self.v = new THREE[LINE](geometry, material, type);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(linePy, name) {
      var line = Sk.ffi.remapToJs(linePy);
      switch(name) {
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(line[PROP_POSITION], VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(line[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(line[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(line[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(line[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(line[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return line[PROP_USE_QUATERNION];
        }
        case METHOD_LOOK_AT: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LOOK_AT;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy) {
              line[METHOD_LOOK_AT](Sk.ffi.remapToJs(vectorPy));
              return linePy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
          }, METHOD_LOOK_AT, []));
        }
        case PROP_TYPE: {
          return Sk.ffi.numberToIntPy(line[PROP_TYPE]);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(linePy, name, value) {
      var line = Sk.ffi.remapToJs(linePy);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_TYPE: {
          if (isNumber(value)) {
            line[PROP_TYPE] = value;
          }
          else {
            throw new Error(PROP_TYPE + " must be either LineStrip or LinePieces");
          }
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + LINE);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(self) {
      return Sk.ffi.stringToPy(LINE);
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(self) {
      return Sk.ffi.stringToPy(LINE);
    });
  }, LINE, []);

  mod[LINE_BASIC_MATERIAL] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, parameters) {
      self.tp$name = LINE_BASIC_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[LINE_BASIC_MATERIAL](parameters);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(material, name) {
      material = Sk.ffi.remapToJs(material);
      switch(name) {
        case PROP_COLOR: {
          return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(material[PROP_COLOR], COLOR));
        }
        case PROP_OPACITY: {
          return Sk.ffi.numberToPy(material[PROP_OPACITY]);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(material, name, value) {
      material = Sk.ffi.remapToJs(material);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_COLOR: {
          if (isColor(value)) {
            material.color = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_OPACITY + "' attribute must be a <type '" + COLOR + "'>.");
          }
        }
        break;
        case PROP_OPACITY: {
          if (isNumber(value)) {
            material.opacity = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_OPACITY + "' attribute must be a <type 'float'>.");
          }
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + LINE_BASIC_MATERIAL);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
      args[PROP_COLOR] = material[PROP_COLOR];
      args[PROP_OPACITY] = material[PROP_OPACITY];
      return Sk.ffi.stringToPy(LINE_BASIC_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return Sk.ffi.stringToPy(LINE_BASIC_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, LINE_BASIC_MATERIAL, []);

  mod[MESH] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, geometryPy, materialPy) {
      Sk.ffi.checkMethodArgs(MESH, arguments, 1, 2);
      Sk.ffi.checkArgType("geometry", "Geometry", Sk.ffi.isObjectRef(geometryPy));
      Sk.ffi.referenceToPy(new THREE[MESH](Sk.ffi.remapToJs(geometryPy), Sk.ffi.remapToJs(materialPy)), MESH, undefined, selfPy);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(meshPy, name) {
      var mesh = Sk.ffi.remapToJs(meshPy);
      switch(name) {
        case PROP_ID: {
          return Sk.ffi.numberToIntPy(mesh[PROP_ID]);
        }
        case PROP_GEOMETRY: {
          var geometry = mesh[PROP_GEOMETRY];
          return Sk.ffi.callsim(mod[GEOMETRY], Sk.ffi.referenceToPy(mesh[PROP_GEOMETRY], GEOMETRY));
        }
        case PROP_MATRIX_AUTO_UPDATE: {
          return mesh[PROP_MATRIX_AUTO_UPDATE];
        }
        case PROP_NAME: {
          return Sk.ffi.stringToPy(mesh[PROP_NAME]);
        }
        case PROP_OVERDRAW: {
          if (isBoolean(mesh[PROP_OVERDRAW])) {
            return mesh[PROP_OVERDRAW];
          }
          else {
            return null;
          }
        }
        case PROP_POSITION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(mesh[PROP_POSITION], VECTOR_3));
        }
        case PROP_QUATERNION: {
          return Sk.ffi.callsim(mod[QUATERNION], Sk.ffi.referenceToPy(mesh[PROP_QUATERNION], QUATERNION));
        }
        case PROP_ROTATION: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(mesh[PROP_ROTATION], VECTOR_3));
        }
        case PROP_EULER_ORDER: {
          return Sk.ffi.stringToPy(mesh[PROP_EULER_ORDER]);
        }
        case PROP_SCALE: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(mesh[PROP_SCALE], VECTOR_3));
        }
        case PROP_UP: {
          return Sk.ffi.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(mesh[PROP_UP], VECTOR_3));
        }
        case PROP_USE_QUATERNION: {
          return mesh[PROP_USE_QUATERNION];
        }
        case PROP_VISIBLE: {
          return mesh[PROP_VISIBLE];
        }
        case METHOD_LOOK_AT: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_LOOK_AT;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, vectorPy) {
              mesh[METHOD_LOOK_AT](Sk.ffi.remapToJs(vectorPy));
              return meshPy;
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_LOOK_AT);
            })
          }, METHOD_LOOK_AT, []));
        }
        case METHOD_SET_GEOMETRY: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_SET_GEOMETRY;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self, geometryPy) {
              var geometry = Sk.ffi.remapToJs(geometryPy);
              mesh[METHOD_SET_GEOMETRY](geometry);
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_GEOMETRY)
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_SET_GEOMETRY)
            })
          }, METHOD_SET_GEOMETRY, []));
        }
        case METHOD_UPDATE_MATRIX: {
          return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = Sk.ffi.functionPy(function(self) {
              self.tp$name = METHOD_UPDATE_MATRIX;
            });
            $loc.__call__ = Sk.ffi.functionPy(function(self) {
              mesh[METHOD_UPDATE_MATRIX]();
            });
            $loc.__str__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_UPDATE_MATRIX)
            })
            $loc.__repr__ = Sk.ffi.functionPy(function(self) {
              return Sk.ffi.stringToPy(METHOD_UPDATE_MATRIX)
            })
          }, METHOD_UPDATE_MATRIX, []));
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(meshPy, name, valuePy) {
      var mesh = Sk.ffi.remapToJs(meshPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_MATRIX_AUTO_UPDATE: {
          mesh[PROP_MATRIX_AUTO_UPDATE] = checkArgBoolean(PROP_MATRIX_AUTO_UPDATE, valuePy);
        }
        break;
        case PROP_NAME: {
          Sk.ffi.checkArgType(PROP_NAME, 'string', Sk.ffi.isString(valuePy));
          mesh[PROP_NAME] = value;
        }
        break;
        case PROP_OVERDRAW: {
          if (isBoolean(value)) {
            mesh[PROP_OVERDRAW] = value;
          }
          else if (isNull(value)) {
            mesh[PROP_OVERDRAW] = null;
          }
          else {
            throw new Error(name + " must be either Boolean or None");
          }
        }
        break;
        case PROP_POSITION: {
          Sk.ffi.checkArgType(PROP_POSITION, VECTOR_3, isVector(valuePy));
          mesh[PROP_POSITION] = value;
        }
        break;
        case PROP_QUATERNION: {
          mesh[PROP_QUATERNION] = value;
        }
        break;
        case PROP_ROTATION: {
          mesh[PROP_ROTATION] = value;
        }
        break;
        case PROP_EULER_ORDER: {
          if (isString(value)) {
            mesh[PROP_EULER_ORDER] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_SCALE: {
          mesh[PROP_SCALE] = value;
        }
        break;
        case PROP_UP: {
          mesh[PROP_UP] = value;
        }
        break;
        case PROP_USE_QUATERNION: {
          mesh[PROP_USE_QUATERNION] = value;
        }
        break;
        case PROP_VISIBLE: {
          Sk.ffi.checkArgType(PROP_VISIBLE, 'bool', Sk.ffi.isBoolean(valuePy));
          mesh[PROP_VISIBLE] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AssertionError(name + " is not an attribute of " + MESH);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(mesh) {
      mesh = Sk.ffi.remapToJs(mesh);
      var args = {};
      args[PROP_ID] = mesh[PROP_ID];
      args[PROP_NAME] = mesh[PROP_NAME];
      return Sk.ffi.stringToPy(MESH + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(mesh) {
      mesh = Sk.ffi.remapToJs(mesh);
      var args = [/*mesh[PROP_GEOMETRY], mesh[PROP_MATERIAL]*/];
      return Sk.ffi.stringToPy(MESH + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH, []);

  mod[MESH_BASIC_MATERIAL] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, parameters) {
      self.tp$name = MESH_BASIC_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[MESH_BASIC_MATERIAL](parameters);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(materialPy, name) {
      var material = Sk.ffi.remapToJs(materialPy);
      switch(name) {
        case PROP_ID: {
          return Sk.ffi.numberToIntPy(material[PROP_ID]);
        }
        case PROP_NAME: {
          return Sk.ffi.stringToPy(material[PROP_NAME]);
        }
        case PROP_COLOR: {
          return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(material[PROP_COLOR], COLOR));
        }
        case PROP_NEEDS_UPDATE: {
          return material[PROP_NEEDS_UPDATE];
        }
        case PROP_OPACITY: {
          return Sk.ffi.numberToPy(material[PROP_OPACITY]);
        }
        case PROP_OVERDRAW: {
          return material[PROP_OVERDRAW];
        }
        case PROP_TRANSPARENT: {
          return material[PROP_TRANSPARENT];
        }
        case PROP_WIREFRAME: {
          return material[PROP_WIREFRAME];
        }
        case PROP_WIREFRAME_LINEWIDTH: {
          return Sk.ffi.numberToPy(material[PROP_WIREFRAME_LINEWIDTH]);
        }
        case PROP_VISIBLE: {
          return material[PROP_VISIBLE];
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(materialPy, name, valuePy) {
      var material = Sk.ffi.remapToJs(materialPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_COLOR: {
          material[PROP_COLOR] = new THREE[COLOR](value);
        }
        break;
        case PROP_NAME: {
          if (isString(value)) {
            material[PROP_NAME] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_NEEDS_UPDATE: {
          if (isBoolean(value)) {
            material[PROP_NEEDS_UPDATE] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_OPACITY: {
          if (isNumber(value)) {
            material.opacity = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_OPACITY + "' attribute must be a <type 'float'>.");
          }
        }
        break;
        case PROP_OVERDRAW: {
          if (isBoolean(value)) {
            material[PROP_OVERDRAW] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_TRANSPARENT: {
          if (isBoolean(value)) {
            material[PROP_TRANSPARENT] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_WIREFRAME: {
          if (isBoolean(value)) {
            material[PROP_WIREFRAME] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_WIREFRAME_LINEWIDTH: {
          if (isNumber(value)) {
            material[PROP_WIREFRAME_LINEWIDTH] = value;
          }
          else {
            throw new Error(name + " must be a number");
          }
        }
        break;
        case PROP_VISIBLE: {
          if (isBoolean(value)) {
            material[PROP_VISIBLE] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + MESH_BASIC_MATERIAL);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(materialPy) {
      var material = Sk.ffi.remapToJs(materialPy);
      var args = {};
      args[PROP_COLOR] = material[PROP_COLOR];
      args[PROP_WIREFRAME] = material[PROP_WIREFRAME];
      args[PROP_WIREFRAME_LINEWIDTH] = material[PROP_WIREFRAME_LINEWIDTH];
      return Sk.ffi.stringToPy(MESH_BASIC_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var parameters = {};
      parameters[PROP_COLOR] = material[PROP_COLOR];
      parameters[PROP_WIREFRAME] = material[PROP_WIREFRAME];
      parameters[PROP_WIREFRAME_LINEWIDTH] = material[PROP_WIREFRAME_LINEWIDTH];
      var args = [parameters];
      return Sk.ffi.stringToPy(MESH_BASIC_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_BASIC_MATERIAL, []);

  mod[MESH_LAMBERT_MATERIAL] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, parametersPy) {
      Sk.ffi.checkMethodArgs(MESH_LAMBERT_MATERIAL, arguments, 0, 1);
      var parameters = Sk.ffi.remapToJs(parametersPy);
      Sk.ffi.referenceToPy(new THREE[MESH_LAMBERT_MATERIAL](parameters), MESH_LAMBERT_MATERIAL, undefined, self);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(materialPy, name) {
      var material = Sk.ffi.remapToJs(materialPy);
      switch(name) {
        case PROP_ID: {
          return Sk.ffi.numberToIntPy(material[PROP_ID]);
        }
        case PROP_COLOR: {
          return Sk.ffi.callsim(mod[COLOR], Sk.ffi.referenceToPy(material[PROP_COLOR], COLOR));
        }
        case PROP_NAME: {
          return Sk.ffi.stringToPy(material[PROP_NAME]);
        }
        case PROP_NEEDS_UPDATE: {
          return material[PROP_NEEDS_UPDATE];
        }
        case PROP_OPACITY: {
          return Sk.ffi.numberToPy(material[PROP_OPACITY]);
        }
        case PROP_OVERDRAW: {
          return material[PROP_OVERDRAW];
        }
        case PROP_TRANSPARENT: {
          return material[PROP_TRANSPARENT];
        }
        case PROP_VISIBLE: {
          return material[PROP_VISIBLE];
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(materialPy, name, valuePy) {
      var material = Sk.ffi.remapToJs(materialPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_COLOR: {
          material[PROP_COLOR] = new THREE[COLOR](value);
        }
        break;
        case PROP_NAME: {
          if (isString(value)) {
            material[PROP_NAME] = value;
          }
          else {
            throw new Error(name + " must be a string");
          }
        }
        break;
        case PROP_NEEDS_UPDATE: {
          if (isBoolean(value)) {
            material[PROP_NEEDS_UPDATE] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_OPACITY: {
          if (isNumber(value)) {
            material.opacity = value;
          }
          else {
            throw new Sk.builtin.TypeError("'" + PROP_OPACITY + "' attribute must be a <type 'float'>.");
          }
        }
        break;
        case PROP_OVERDRAW: {
          if (isBoolean(value)) {
            material[PROP_OVERDRAW] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_TRANSPARENT: {
          if (isBoolean(value)) {
            material[PROP_TRANSPARENT] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_WIREFRAME: {
          if (isBoolean(value)) {
            material[PROP_WIREFRAME] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        case PROP_WIREFRAME_LINEWIDTH: {
          if (isNumber(value)) {
            material[PROP_WIREFRAME_LINEWIDTH] = value;
          }
          else {
            throw new Error(name + " must be a number");
          }
        }
        break;
        case PROP_VISIBLE: {
          if (isBoolean(value)) {
            material[PROP_VISIBLE] = value;
          }
          else {
            throw new Error(name + " must be Boolean");
          }
        }
        break;
        default: {
          throw new Error(name + " is not an attribute of " + MESH_LAMBERT_MATERIAL);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
      return Sk.ffi.stringToPy(MESH_LAMBERT_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var parameters = {};
      parameters[PROP_COLOR] = material[PROP_COLOR];
      var args = [parameters];
      return Sk.ffi.stringToPy(MESH_LAMBERT_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_LAMBERT_MATERIAL, []);

  mod[MESH_NORMAL_MATERIAL] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, parameters) {
      self.tp$name = MESH_NORMAL_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[MESH_NORMAL_MATERIAL](parameters);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + MESH_NORMAL_MATERIAL);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
      return Sk.ffi.stringToPy(MESH_NORMAL_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return Sk.ffi.stringToPy(MESH_NORMAL_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_NORMAL_MATERIAL, []);

  mod[MESH_PHONG_MATERIAL] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(self, parameters) {
      self.tp$name = MESH_PHONG_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[MESH_PHONG_MATERIAL](parameters);
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(self, name) {
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + MESH_PHONG_MATERIAL);
        }
      }
    });
    $loc.__setattr__ = Sk.ffi.functionPy(function(materialPy, name, valuePy) {
      var material = Sk.ffi.remapToJs(materialPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + MESH_PHONG_MATERIAL);
        }
      }
    });
    $loc.__str__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
      return Sk.ffi.stringToPy(MESH_PHONG_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return Sk.ffi.stringToPy(MESH_PHONG_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_PHONG_MATERIAL, []);

  if (typeof THREE !== 'undefined') {
    mod.LineStrip  = Sk.builtin.assk$(THREE.LineStrip,  Sk.builtin.nmber.int$);
    mod.LinePieces = Sk.builtin.assk$(THREE.LinePieces, Sk.builtin.nmber.int$);

    mod.FlatShading   = Sk.builtin.assk$(THREE.FlatShading,   Sk.builtin.nmber.int$);
    mod.NoShading     = Sk.builtin.assk$(THREE.NoShading,     Sk.builtin.nmber.int$);
    mod.SmoothShading = Sk.builtin.assk$(THREE.SmoothShading, Sk.builtin.nmber.int$);
  }
};
}).call(this);
