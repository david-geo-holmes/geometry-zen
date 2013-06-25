/**
 * three.js wrapper module for Skulpt Python.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {
  
  var VECTOR_3 = "Vector3";
  var EUCLIDEAN_3 = "Euclidean3";

  var SCENE                 = "Scene";
  var WEBGL_RENDERER        = "WebGLRenderer";
  var COLOR                 = "Color";
  var PERSPECTIVE_CAMERA    = "PerspectiveCamera";

  var GEOMETRY              = "Geometry";
  var OBJECT_3D             = "Object3D";

  var POINT_LIGHT           = "PointLight";

  var LINE_BASIC_MATERIAL   = "LineBasicMaterial";
  var MESH_LAMBERT_MATERIAL = "MeshLambertMaterial";
  var MESH_NORMAL_MATERIAL  = "MeshNormalMaterial";
  var MESH_PHONG_MATERIAL   = "MeshPhongMaterial";

  var LINE                  = "Line";
  var MESH                  = "Mesh";

  var CUBE_GEOMETRY         = "CubeGeometry";
  var CYLINDER_GEOMETRY     = "CylinderGeometry";
  var ICOSAHEDRON_GEOMETRY  = "IcosahedronGeometry";
  var OCTAHEDRON_GEOMETRY   = "OctahedronGeometry";
  var PLANE_GEOMETRY        = "PlaneGeometry";
  var SPHERE_GEOMETRY       = "SphereGeometry";
  var TETRAHEDRON_GEOMETRY  = "TetrahedronGeometry";
  var TORUS_GEOMETRY        = "TorusGeometry";

  var mod = {};

  function isNumber(x)    { return typeof x === 'number'; }
  function isString(x)    { return typeof x === 'string'; }
  function isBoolean(x)   { return typeof x === 'boolean'; }
  function isNull(x)      { return typeof x === 'object' && x === null; }
  function isUndefined(x) { return typeof x === 'undefined'; }
  function isDefined(x)   { return typeof x !== 'undefined'; }

  /*
   * Deterines whether the argument is a genuine THREE.Color reference.
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

  function isNumberAssignableFromArg(arg, argName, functionName) {
    if (isNull(arg)) {
      return false;
    }
    if (isBoolean(arg)) {
      return false;
    }

    if (arg.skType) {
      switch(arg.skType) {
        case 'float': {
          return true;
        }
        case 'int': {
          return true;
        }
        case EUCLIDEAN_3: {
          // TODO: Perhaps we should check that we're not throwing away other blades?
          return true;;
        }
        default: {
          return false;
        }
      }
    }
    else if (arg.v) {
      if (isString(arg.v)) {
        return false;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  function booleanFromArg(arg, argName, functionName, lax) {
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
        throw new Sk.builtin.TypeError(functionName + "." + argName + " must be convertible to a Boolean, but was Missing.");
      }
    }
    else if (isNull(arg)) {
      if (lax) {
        return arg;
      }
      else {
        throw new Sk.builtin.TypeError(functionName + "." + argName + " must be convertible to a Boolean, but was None.");
      }
    }
    if (isBoolean(arg)) {
      return arg;
    }
    else {
      throw new Sk.builtin.TypeError(functionName + "." + argName + " must be a Boolean.");
    }
  }

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
        case EUCLIDEAN_3: {
          // TODO: Perhaps we should check that we're not throwing away other blades?
          return arg.v.coordinate(0);
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
            // TODO: Handle coercion to nearest integer (THREE does not protect itself)
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

  /*
   * It is important to note that this wrapper class keeps a reference to
   * the original argument which is expected to have come from the THREE.Vector3
   */
   mod[VECTOR_3] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_X = "x";
    var PROP_Y = "y";
    var PROP_Z = "z";

    $loc.__init__ = new Sk.builtin.func(function(self, vector, y, z) {
      vector = Sk.ffi.remapToJs(vector);
      y = Sk.ffi.remapToJs(y);
      z = Sk.ffi.remapToJs(z);
      if (isNumber(vector) && isNumber(y) && isNumber(z)) {
        self.v = new THREE.Vector3(vector, y, z);
      }
      else if (isDefined(vector) && isUndefined(y) && isUndefined(z)) {
        self.v = vector;
      }
      else if (isUndefined(vector) && isUndefined(y) && isUndefined(z)) {
        self.v = new THREE.Vector3();
      }
      else {
        throw new Sk.builtin.AssertionError("constructor arguments for " + VECTOR_3);
      }
      self.tp$name = VECTOR_3;
    });

    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      var x = a.v.x + b.v.x;
      var y = a.v.y + b.v.y;
      var z = a.v.z + b.v.z;
      var vector = new THREE.Vector3(x, y, z);
      return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(vector));
    });

    $loc.__sub__ = new Sk.builtin.func(function(a, b) {
      var x = a.v.x - b.v.x;
      var y = a.v.y - b.v.y;
      var z = a.v.z - b.v.z;
      var vector = new THREE.Vector3(x, y, z);
      return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(vector));
    });

    $loc.__mul__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(rhs)) {
        var vector = new THREE.Vector3(lhs.x * rhs, lhs.y * rhs, lhs.z * rhs);
        return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(vector));
      }
      else {
        throw new Sk.builtin.AssertionError("rhs is not a number");
      }
    });

    $loc.__rmul__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        var vector = new THREE.Vector3(lhs * rhs.x, lhs * rhs.y, lhs * rhs.z);
        return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(vector));
      }
      else {
        throw new Sk.builtin.AssertionError("lhs is not a number");
      }
    });

    $loc.__getattr__ = new Sk.builtin.func(function(vectorPy, name) {
      var METHOD_SET_X = "setX";
      var METHOD_SET_Y = "setY";
      var METHOD_SET_Z = "setZ";
      var METHOD_GET_COMPONENT = "getComponent";
      var METHOD_SET_COMPONENT = "setComponent";
      var METHOD_SET = "set";
      vector = Sk.ffi.remapToJs(vectorPy);
      switch(name) {
        case PROP_X: {
          return Sk.builtin.assk$(vector[PROP_X], Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(vector[PROP_Y], Sk.builtin.nmber.float$);
        }
        case PROP_Z: {
          return Sk.builtin.assk$(vector[PROP_Z], Sk.builtin.nmber.float$);
        }
        case METHOD_SET_X: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_X;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, x) {
              x  = Sk.ffi.remapToJs(x);
              vector.setX(x);
              return vectorPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_X);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_X);
            })
          }, METHOD_SET_X, []));
        }
        case METHOD_SET_Y: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_Y;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, y) {
              y  = Sk.ffi.remapToJs(y);
              vector.setY(y);
              return vectorPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Y);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Y);
            })
          }, METHOD_SET_Y, []));
        }
        case METHOD_SET_Z: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_Z;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, z) {
              z  = Sk.ffi.remapToJs(z);
              vector.setZ(z);
              return vectorPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Z);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Z);
            })
          }, METHOD_SET_Z, []));
        }
        case METHOD_GET_COMPONENT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GET_COMPONENT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, index) {
              index  = Sk.ffi.remapToJs(index);
              return Sk.builtin.assk$(vector.getComponent(index), Sk.builtin.nmber.float$);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_COMPONENT);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_COMPONENT);
            })
          }, METHOD_GET_COMPONENT, []));
        }
        case METHOD_SET_COMPONENT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_COMPONENT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, index, value) {
              index  = Sk.ffi.remapToJs(index);
              value  = Sk.ffi.remapToJs(value);
              vector.setComponent(index, value);
              return vectorPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_COMPONENT);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_COMPONENT);
            })
          }, METHOD_SET_COMPONENT, []));
        }
        case METHOD_SET: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, x, y, z) {
              x  = Sk.ffi.remapToJs(x);
              y  = Sk.ffi.remapToJs(y);
              z  = Sk.ffi.remapToJs(z);
              vector.set(x, y, z);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET);
            })
          }, METHOD_SET, []));
        }
        default: {
          // Framework will handle it.
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(vector, name, value) {
      vector = Sk.ffi.remapToJs(vector);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_X: {
          vector[PROP_X] = value;
        }
        break;
        case PROP_Y: {
          vector[PROP_Y] = value;
        }
        break;
        case PROP_Z: {
          vector[PROP_Z] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not an attribute of " + VECTOR_3);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(vector) {
      vector = Sk.ffi.remapToJs(vector);
      if (isDefined(vector)) {
        return new Sk.builtin.str(BLADE.Euclidean3.fromCartesian(0, vector[PROP_X], vector[PROP_Y], vector[PROP_Z], 0, 0, 0, 0).toStringIJK());
      }
      else {
        return new Sk.builtin.str("<type '" + VECTOR_3 + "'>");
      }
    });

    $loc.__repr__ = new Sk.builtin.func(function(vector) {
      vector = Sk.ffi.remapToJs(vector);
      return new Sk.builtin.str(VECTOR_3 + "(" + vector[PROP_X] + "," + vector[PROP_Y] + "," + vector[PROP_Z] + ")");
    });

  }, VECTOR_3, []);

  // Erik Moller's requestAnimationFrame for smart(er) animating
  // Minor formatting changes and use of braces for if conditions.
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // The purpose of this enhanced shim is to 
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

   mod[WEBGL_RENDERER] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var PROP_AUTO_CLEAR   = "autoClear";
    var PROP_CLEAR_COLOR  = "clearColor";
    var PROP_DOM_ELEMENT  = "domElement";
    var PROP_GAMMA_INPUT  = "gammaInput";
    var PROP_GAMMA_OUTPUT = "gammaOutput";
    $loc.__init__ = new Sk.builtin.func(function(self, parameters) {
      self.tp$name = WEBGL_RENDERER;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[WEBGL_RENDERER](parameters);
    });
    $loc.setSize = new Sk.builtin.func(function(self, width, height) {
      self.v.setSize(Sk.builtin.asnum$(width), Sk.builtin.asnum$(height));
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      var METHOD_RENDER = "render";
      var METHOD_GET_CLEAR_COLOR = "getClearColor";
      var METHOD_SET_CLEAR_COLOR = "setClearColor";
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
        case PROP_DOM_ELEMENT: {
          // TODO: I think duck-typing means that this will work as long as we don't
          // try to do anything more ambitious.
          // Sk.ffi.remapToPy
          return {v: renderer.domElement};
        }
        case METHOD_RENDER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_RENDER;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, scene, camera) {
              scene  = Sk.ffi.remapToJs(scene);
              camera = Sk.ffi.remapToJs(camera);
              renderer.render(scene, camera);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_RENDER);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_RENDER);
            })
          }, METHOD_RENDER, []));
        }
        case METHOD_GET_CLEAR_COLOR: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GET_CLEAR_COLOR;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              return Sk.misceval.callsim(mod[COLOR], Sk.ffi.remapToPy(renderer.getClearColor().getHex()));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_CLEAR_COLOR);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_CLEAR_COLOR);
            })
          }, METHOD_GET_CLEAR_COLOR, []));
        }
        case METHOD_SET_CLEAR_COLOR: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_CLEAR_COLOR;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, color, alpha) {
              color  = Sk.ffi.remapToJs(color);
              alpha = Sk.ffi.remapToJs(alpha);
              renderer.setClearColor(color, alpha);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_CLEAR_COLOR);
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_CLEAR_COLOR);
            })
          }, METHOD_SET_CLEAR_COLOR, []));
        }
        default: {
          // The framework will raise an AttributeError exception.
          return /* undefined */;
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
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
        case "size": {
          // TODO: Unwrapping should be recursive.
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
    $loc.__str__ = new Sk.builtin.func(function(self) {
      var renderer = self.v;
      var args = {};
      args[PROP_AUTO_CLEAR] = renderer[PROP_AUTO_CLEAR];
      args[PROP_GAMMA_INPUT] = renderer[PROP_GAMMA_INPUT];
      args[PROP_GAMMA_OUTPUT] = renderer[PROP_GAMMA_OUTPUT];
      return new Sk.builtin.str(WEBGL_RENDERER + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var renderer = self.v;
      var autoClear = renderer[PROP_AUTO_CLEAR];
      // Note: The WebGLRenderer takes only one argument, but it is a dictionary.
      var args = [{"autoClear": autoClear}];
      return new Sk.builtin.str(WEBGL_RENDERER + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, WEBGL_RENDERER, []);

  mod[COLOR] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_R = "r";
    var PROP_G = "g";
    var PROP_B = "b";

    $loc.__init__ = new Sk.builtin.func(function(self, value) {
      value = Sk.ffi.remapToJs(value);
      self.tp$name = COLOR;
      if (isUndefined(value)) {
        self.v = new THREE.Color();
      }
      else {
        if (isNumber(value) || isString(value)) {
          self.v = new THREE.Color(value);
        }
        else if (isColor(value)) {
          self.v = new THREE.Color(value);
        }
        else {
          throw new Sk.builtin.AssertionError("value must be either a number, string or Color.");
        }
      }
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case PROP_R: {
          return Sk.builtin.assk$(self.v[PROP_R], Sk.builtin.nmber.float$);
        }
        case PROP_G: {
          return Sk.builtin.assk$(self.v[PROP_G], Sk.builtin.nmber.float$);
        }
        case PROP_B: {
          return Sk.builtin.assk$(self.v[PROP_B], Sk.builtin.nmber.float$);
        }
        default: {
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
      switch(name) {
        case PROP_R: {
          self.v[PROP_R] = numberFromArg(value, name, COLOR, false);
        }
        break;
        case PROP_G: {
          self.v[PROP_G] = numberFromArg(value, name, COLOR, false);
        }
        break;
        case PROP_B: {
          self.v[PROP_B] = numberFromArg(value, name, COLOR, false);
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not an attribute of " + COLOR);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var color = self.v;
      var args = {};
      args[PROP_R] = color[PROP_R];
      args[PROP_G] = color[PROP_G];
      args[PROP_B] = color[PROP_B];
      return new Sk.builtin.str(COLOR + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var color = self.v;
      var r = color[PROP_R];
      var g = color[PROP_G];
      var b = color[PROP_B];
      var args = [r, g, b];
      return new Sk.builtin.str(COLOR + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, COLOR, []);

   mod[PERSPECTIVE_CAMERA] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var PROP_POSITION = "position";
    var PROP_ROTATION = "rotation";
    $loc.__init__ = new Sk.builtin.func(function(self, fov, aspect, near, far) {
      var fieldOfView = Sk.builtin.asnum$(fov)
      var aspectRatio = Sk.builtin.asnum$(aspect)
      var nearPlane = Sk.builtin.asnum$(near)
      var farPlane = Sk.builtin.asnum$(far)
      self.v = new THREE[PERSPECTIVE_CAMERA](fieldOfView, aspectRatio, nearPlane, farPlane);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(camera, name) {
      camera = Sk.ffi.remapToJs(camera);
      var UPDATE_PROJECTION_MATRIX = "updateProjectionMatrix"
      switch(name) {
        case "aspect": {
          return Sk.builtin.assk$(camera.aspect, Sk.builtin.nmber.float$);
        }
        case PROP_POSITION: {
          return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_POSITION]));
        }
        case PROP_ROTATION: {
          return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(camera[PROP_ROTATION]));
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
          self.v.aspect = numberFromArg(value, "rhs", name, false);
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

   mod[CUBE_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_WIDTH           = "width";
    var PROP_HEIGHT          = "height";
    var PROP_DEPTH           = "depth";
    var PROP_WIDTH_SEGMENTS  = "widthSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";
    var PROP_DEPTH_SEGMENTS  = "depthSegments";

    $loc.__init__ = new Sk.builtin.func(function(self, width, height, depth, widthSegments, heightSegments, depthSegments) {
      width          = numberFromArg(width,                 PROP_WIDTH,           CUBE_GEOMETRY);
      height         = numberFromArg(height,                PROP_HEIGHT,          CUBE_GEOMETRY);
      depth          = numberFromArg(depth,                 PROP_DEPTH,           CUBE_GEOMETRY);
      widthSegments  = numberFromIntegerArg(widthSegments,  PROP_WIDTH_SEGMENTS,  CUBE_GEOMETRY);
      heightSegments = numberFromIntegerArg(heightSegments, PROP_HEIGHT_SEGMENTS, CUBE_GEOMETRY);
      depthSegments  = numberFromIntegerArg(depthSegments,  PROP_DEPTH_SEGMENTS,  CUBE_GEOMETRY);
      self.v = new THREE[CUBE_GEOMETRY](width, height, depth, widthSegments, heightSegments, depthSegments);
      self.tp$name = CUBE_GEOMETRY;
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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
        default: {
          // Framework will take care of the error message.
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var cube = self.v;
      var args = {};
      args[PROP_WIDTH]  = cube[PROP_WIDTH];
      args[PROP_HEIGHT] = cube[PROP_HEIGHT];
      args[PROP_DEPTH]  = cube[PROP_DEPTH];
      return new Sk.builtin.str(CUBE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var cube = self.v;
      var width          = cube[PROP_WIDTH];
      var height         = cube[PROP_HEIGHT];
      var depth          = cube[PROP_DEPTH];
      var widthSegments  = cube[PROP_WIDTH_SEGMENTS];
      var heightSegments = cube[PROP_HEIGHT_SEGMENTS];
      var depthSegments  = cube[PROP_DEPTH_SEGMENTS];
      var args = [width, height, depth, widthSegments, heightSegments, depthSegments];
      return new Sk.builtin.str(CUBE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, CUBE_GEOMETRY, []);

  mod[CYLINDER_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_RADIUS_TOP      = "radiusTop";
    var PROP_RADIUS_BOTTOM   = "radiusBottom";
    var PROP_HEIGHT          = "height";
    var PROP_RADIUS_SEGMENTS = "radiusSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";
    var PROP_OPEN_ENDED      = "openEnded";

    $loc.__init__ = new Sk.builtin.func(function(self, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded) {
      radiusTop      = numberFromArg(radiusTop,             PROP_RADIUS_TOP,      CYLINDER_GEOMETRY);
      radiusBottom   = numberFromArg(radiusBottom,          PROP_RADIUS_BOTTOM,   CYLINDER_GEOMETRY);
      height         = numberFromArg(height,                PROP_HEIGHT,          CYLINDER_GEOMETRY);
      radiusSegments = numberFromIntegerArg(radiusSegments, PROP_RADIUS_SEGMENTS, CYLINDER_GEOMETRY);
      heightSegments = numberFromIntegerArg(heightSegments, PROP_HEIGHT_SEGMENTS, CYLINDER_GEOMETRY);
      openEnded      = booleanFromArg(openEnded,            PROP_OPEN_ENDED,      CYLINDER_GEOMETRY);
      self.v = new THREE[CYLINDER_GEOMETRY](radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
      self.tp$name = CYLINDER_GEOMETRY;
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var cylinder = self.v;
      var args = {};
      args[PROP_RADIUS_TOP] = cylinder[PROP_RADIUS_TOP];
      args[PROP_RADIUS_BOTTOM] = cylinder[PROP_RADIUS_BOTTOM];
      args[PROP_HEIGHT] = cylinder[PROP_HEIGHT];
      args[PROP_OPEN_ENDED] = cylinder[PROP_OPEN_ENDED];
      // TODO: Need a Python.stringify because Boolean is {True, False} etc.
      return new Sk.builtin.str(CYLINDER_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var cylinder = self.v;
      var radiusTop      = cylinder[PROP_RADIUS_TOP];
      var radiusBottom   = cylinder[PROP_RADIUS_BOTTOM];
      var height         = cylinder[PROP_HEIGHT];
      var radiusSegments = cylinder[PROP_RADIUS_SEGMENTS];
      var heightSegments = cylinder[PROP_HEIGHT_SEGMENTS];
      var openEnded      = cylinder[PROP_OPEN_ENDED];
      var args = [radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded];
      return new Sk.builtin.str(CYLINDER_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, CYLINDER_GEOMETRY, []);

  mod[ICOSAHEDRON_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_RADIUS = "radius";
    var PROP_DETAIL = "detail";

    $loc.__init__ = new Sk.builtin.func(function(self, radius, detail) {
      radius = numberFromArg(radius,        PROP_RADIUS, ICOSAHEDRON_GEOMETRY);
      detail = numberFromIntegerArg(detail, PROP_DETAIL, ICOSAHEDRON_GEOMETRY);
      self.v = new THREE[ICOSAHEDRON_GEOMETRY](radius, detail);
      self.tp$name = ICOSAHEDRON_GEOMETRY;
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var icosahedron = self.v;
      var args = {};
      args[PROP_RADIUS] = icosahedron[PROP_RADIUS];
      args[PROP_DETAIL] = icosahedron[PROP_DETAIL];
      return new Sk.builtin.str(ICOSAHEDRON_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var icosahedron = self.v;
      var radius = icosahedron[PROP_RADIUS];
      var detail = icosahedron[PROP_DETAIL];
      var args = [radius, detail];
      return new Sk.builtin.str(ICOSAHEDRON_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, ICOSAHEDRON_GEOMETRY, []);

  mod[OCTAHEDRON_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_RADIUS = "radius";
    var PROP_DETAIL = "detail";

    $loc.__init__ = new Sk.builtin.func(function(self, radius, detail) {
      radius = numberFromArg(radius,        PROP_RADIUS, OCTAHEDRON_GEOMETRY);
      detail = numberFromIntegerArg(detail, PROP_DETAIL, OCTAHEDRON_GEOMETRY);
      self.v = new THREE[OCTAHEDRON_GEOMETRY](radius, detail);
      self.v.radius = radius; // workaround for THREE not caching radius.
      self.v.detail = detail; // workaround for THREE not caching detail.
      self.tp$name = OCTAHEDRON_GEOMETRY;
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var octahedron = self.v;
      var args = {};
      args[PROP_RADIUS] = octahedron[PROP_RADIUS];
      args[PROP_DETAIL] = octahedron[PROP_DETAIL];
      return new Sk.builtin.str(OCTAHEDRON_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var octahedron = self.v;
      var radius = octahedron[PROP_RADIUS];
      var detail = octahedron[PROP_DETAIL];
      var args = [radius, detail];
      return new Sk.builtin.str(OCTAHEDRON_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, OCTAHEDRON_GEOMETRY, []);

   mod[PLANE_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_WIDTH           = "width";
    var PROP_HEIGHT          = "height";
    var PROP_WIDTH_SEGMENTS  = "widthSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";

    $loc.__init__ = new Sk.builtin.func(function(self, width, height, widthSegments, heightSegments) {
      width          = numberFromArg(width,                 PROP_WIDTH,           PLANE_GEOMETRY);
      height         = numberFromArg(height,                PROP_HEIGHT,          PLANE_GEOMETRY);
      widthSegments  = numberFromIntegerArg(widthSegments,  PROP_WIDTH_SEGMENTS,  PLANE_GEOMETRY);
      heightSegments = numberFromIntegerArg(heightSegments, PROP_HEIGHT_SEGMENTS, PLANE_GEOMETRY);
      self.v = new THREE[PLANE_GEOMETRY](width, height, widthSegments, heightSegments);
      self.tp$name = PLANE_GEOMETRY;
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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
        default: {
          // Framework will take care of the error message.
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var plane = self.v;
      var args = {};
      args[PROP_WIDTH]  = plane[PROP_WIDTH];
      args[PROP_HEIGHT] = plane[PROP_HEIGHT];
      return new Sk.builtin.str(PLANE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var plane = self.v;
      var width          = plane[PROP_WIDTH];
      var height         = plane[PROP_HEIGHT];
      var widthSegments  = plane[PROP_WIDTH_SEGMENTS];
      var heightSegments = plane[PROP_HEIGHT_SEGMENTS];
      var args = [width, height, widthSegments, heightSegments];
      return new Sk.builtin.str(PLANE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, PLANE_GEOMETRY, []);

   mod[SPHERE_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_RADIUS          = "radius";
    var PROP_WIDTH_SEGMENTS  = "widthSegments";
    var PROP_HEIGHT_SEGMENTS = "heightSegments";
    var PROP_PHI_START       = "phiStart";
    var PROP_PHI_LENGTH      = "phiLength";
    var PROP_THETA_START     = "thetaStart";
    var PROP_THETA_LENGTH    = "thetaLength";

    $loc.__init__ = new Sk.builtin.func(function(self, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
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

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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
        default: {
          // Framework will take care of the error message.
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var sphere = self.v;
      var radius         = sphere[PROP_RADIUS];
      var args = {};
      args[PROP_RADIUS] = radius;
      return new Sk.builtin.str(SPHERE_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var sphere = self.v;
      var radius         = sphere[PROP_RADIUS];
      var widthSegments  = sphere[PROP_WIDTH_SEGMENTS];
      var heightSegments = sphere[PROP_HEIGHT_SEGMENTS];
      var phiStart       = sphere[PROP_PHI_START];
      var phiLength      = sphere[PROP_PHI_LENGTH];
      var thetaStart     = sphere[PROP_THETA_START];
      var thetaLength    = sphere[PROP_THETA_LENGTH];
      var args = [radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength];
      return new Sk.builtin.str(SPHERE_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, SPHERE_GEOMETRY, []);

  mod[TETRAHEDRON_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_RADIUS = "radius";
    var PROP_DETAIL = "detail";

    $loc.__init__ = new Sk.builtin.func(function(self, radius, detail) {
      radius = numberFromArg(radius,        PROP_RADIUS, TETRAHEDRON_GEOMETRY);
      detail = numberFromIntegerArg(detail, PROP_DETAIL, TETRAHEDRON_GEOMETRY);
      self.v = new THREE[TETRAHEDRON_GEOMETRY](radius, detail);
      self.v.radius = radius; // workaround for THREE not caching radius.
      self.v.detail = detail; // workaround for THREE not caching detail.
      self.tp$name = TETRAHEDRON_GEOMETRY;
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var tetrahedron = self.v;
      var args = {};
      args[PROP_RADIUS] = tetrahedron[PROP_RADIUS];
      args[PROP_DETAIL] = tetrahedron[PROP_DETAIL];
      return new Sk.builtin.str(TETRAHEDRON_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var tetrahedron = self.v;
      var radius = tetrahedron[PROP_RADIUS];
      var detail = tetrahedron[PROP_DETAIL];
      var args = [radius, detail];
      return new Sk.builtin.str(TETRAHEDRON_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, TETRAHEDRON_GEOMETRY, []);

   mod[TORUS_GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {

    var PROP_RADIUS           = "radius";
    var PROP_TUBE             = "tube";
    var PROP_RADIAL_SEGMENTS  = "radialSegments";
    var PROP_TUBULAR_SEGMENTS = "tubularSegments";
    var PROP_ARC              = "arc";

    $loc.__init__ = new Sk.builtin.func(function(self, radius, tube, radialSegments, tubularSegments, arc) {
      radius = numberFromArg(radius,                          PROP_RADIUS,           TORUS_GEOMETRY);
      tube = numberFromArg(tube,                              PROP_TUBE,             TORUS_GEOMETRY);
      radialSegments = numberFromIntegerArg(radialSegments,   PROP_RADIAL_SEGMENTS,  TORUS_GEOMETRY);
      tubularSegments = numberFromIntegerArg(tubularSegments, PROP_TUBULAR_SEGMENTS, TORUS_GEOMETRY);
      arc = numberFromArg(arc,                                PROP_ARC,              TORUS_GEOMETRY);
      self.v = new THREE[TORUS_GEOMETRY](radius, tube, radialSegments, tubularSegments, arc);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
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
        default: {
          // Framework will take care of the error message.
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var torus = self.v;
      var args = {};
      args[PROP_RADIUS] = torus[PROP_RADIUS];
      args[PROP_TUBE]   = torus[PROP_TUBE];
      args[PROP_ARC]    = torus[PROP_ARC];
      return new Sk.builtin.str(TORUS_GEOMETRY + "(" + JSON.stringify(args) + ")");
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      var torus = self.v;
      var radius          = torus[PROP_RADIUS];
      var tube            = torus[PROP_TUBE];
      var radialSegments  = torus[PROP_RADIAL_SEGMENTS];
      var tubularSegments = torus[PROP_TUBULAR_SEGMENTS];
      var arc             = torus[PROP_ARC];
      var args = [radius, tube, radialSegments, tubularSegments, arc];
      return new Sk.builtin.str(TORUS_GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, TORUS_GEOMETRY, []);

   mod[GEOMETRY] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var PROP_VERTICES = "vertices";
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.v = new THREE[GEOMETRY]();
    });

    $loc.__getattr__ = new Sk.builtin.func(function(geometry, name) {
      geometry = Sk.ffi.remapToJs(geometry);
      switch(name) {
        case PROP_VERTICES: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = PROP_VERTICES;
              self.v = geometry.vertices;
            });
            $loc.__getattr__ = new Sk.builtin.func(function(vertices, name) {
              vertices = Sk.ffi.remapToJs(vertices);
              var METHOD_APPEND = "append";
              switch(name) {
                case METHOD_APPEND: {
                  return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                    $loc.__init__ = new Sk.builtin.func(function(self) {
                      self.tp$name = METHOD_APPEND;
                    });
                    $loc.__call__ = new Sk.builtin.func(function(self, x) {
                      x = Sk.ffi.remapToJs(x);
                      vertices.push(x);
                    });
                    $loc.__str__ = new Sk.builtin.func(function(self) {
                      return new Sk.builtin.str(METHOD_APPEND)
                    })
                    $loc.__repr__ = new Sk.builtin.func(function(self) {
                      return new Sk.builtin.str(METHOD_APPEND)
                    })
                  }, METHOD_APPEND, []));
                }
                default: {
                  // Framework will take care of the error message.
                }
              }
            });
            $loc.__getitem__ = new Sk.builtin.func(function(verticesPy, indexPy) {
              var vertices = Sk.ffi.remapToJs(verticesPy);
              var index = Sk.ffi.remapToJs(indexPy);
              return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(vertices[index]));
            });
            $loc.mp$length = function() {return geometry.vertices.length;};
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(PROP_VERTICES)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(PROP_VERTICES)
            })
          }, PROP_VERTICES, []));
        }
        default: {
          // Framework will take care of the error message.
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(geometry) {
      geometry = Sk.ffi.remapToJs(geometry);
      if (isDefined(geometry)) {
        var args = {};
        return new Sk.builtin.str(GEOMETRY + "(" + JSON.stringify(args) + ")");
      }
      else {
        return new Sk.builtin.str("<type '" + GEOMETRY + "'>");
      }
    });

    $loc.__repr__ = new Sk.builtin.func(function(geometry) {
      geometry = Sk.ffi.remapToJs(geometry);
      var args = [];
      return new Sk.builtin.str(GEOMETRY + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });

  }, GEOMETRY, []);

  mod[OBJECT_3D] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = OBJECT_3D;
      self.v = new THREE[OBJECT_3D]();
    });
    $loc.__getattr__ = new Sk.builtin.func(function(objPy, name) {
      var obj = Sk.ffi.remapToJs(objPy);
      var METHOD_ADD = "add";
      switch(name) {
        case METHOD_ADD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, childPy) {
              var child = Sk.ffi.remapToJs(childPy);
              obj.add(child);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD)
            })
          }, METHOD_ADD, []));
        }
        default: {
          // Framework will handle it.
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(obj, name, value) {
      obj = Sk.ffi.remapToJs(obj);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        default: {
          throw new Error(name + " is not an settable attribute of " + OBJECT_3D);
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(obj) {
      obj = Sk.ffi.remapToJs(obj);
      if (isDefined(obj)) {
        var args = {};
        return new Sk.builtin.str(OBJECT_3D + "(" + JSON.stringify(args) + ")");
      }
      else {
        return new Sk.builtin.str("<type '" + OBJECT_3D + "'>");
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(obj) {
      obj = Sk.ffi.remapToJs(obj);
      var args = [];
      return new Sk.builtin.str(OBJECT_3D + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, OBJECT_3D, []);

  mod[POINT_LIGHT] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var PROP_COLOR = "color";
    var PROP_INTENSITY = "intensity";
    var PROP_DISTANCE = "distance";
    var PROP_POSITION = "position";
    var PROP_ROTATION = "rotation";
    $loc.__init__ = new Sk.builtin.func(function(self, color, intensity, distance) {
      self.tp$name = POINT_LIGHT;
      color = Sk.ffi.remapToJs(color);
      intensity = Sk.ffi.remapToJs(intensity);
      distance = Sk.ffi.remapToJs(distance);
      self.v = new THREE[POINT_LIGHT](color, intensity, distance);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(light, name) {
      light = Sk.ffi.remapToJs(light);
      switch(name) {
        case PROP_COLOR: {
          return Sk.misceval.callsim(mod[COLOR], Sk.ffi.referenceToPy(light[PROP_COLOR]));
        }
        case PROP_DISTANCE: {
          return Sk.builtin.nmber(light[PROP_DISTANCE], Sk.builtin.nmber.float$);
        }
        case PROP_INTENSITY: {
          return Sk.builtin.nmber(light[PROP_INTENSITY], Sk.builtin.nmber.float$);
        }
        case PROP_POSITION: {
          return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_POSITION]));
        }
        case PROP_ROTATION: {
          return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(light[PROP_ROTATION]));
        }
        default: {
          // Framework will handle it.
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(light, name, value) {
      light = Sk.ffi.remapToJs(light);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_COLOR: {
          light[PROP_COLOR] = new THREE.Color(value);
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
        case PROP_ROTATION: {
          light[PROP_ROTATION] = value;
        }
        break;
        default: {
          throw new Error(name + " is not an settable attribute of " + POINT_LIGHT);
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(light) {
      light = Sk.ffi.remapToJs(light);
      if (isDefined(light)) {
        var args = {};
        args[PROP_COLOR] = light[PROP_COLOR];
        args[PROP_INTENSITY] = light[PROP_INTENSITY];
        args[PROP_DISTANCE] = light[PROP_DISTANCE];
        return new Sk.builtin.str(POINT_LIGHT + "(" + JSON.stringify(args) + ")");
      }
      else {
        return new Sk.builtin.str("<type '" + POINT_LIGHT + "'>");
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(light) {
      light = Sk.ffi.remapToJs(light);
      var args = [light[PROP_COLOR], light[PROP_INTENSITY], light[PROP_DISTANCE]];
      return new Sk.builtin.str(POINT_LIGHT + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, POINT_LIGHT, []);

  mod[LINE_BASIC_MATERIAL] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var PROP_COLOR = "color";
    var PROP_OPACITY = "opacity";
    $loc.__init__ = new Sk.builtin.func(function(self, parameters) {
      self.tp$name = LINE_BASIC_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[LINE_BASIC_MATERIAL](parameters);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(material, name) {
      material = Sk.ffi.remapToJs(material);
      switch(name) {
        case PROP_COLOR: {
          return Sk.misceval.callsim(mod[COLOR], Sk.ffi.referenceToPy(material.color));
        }
        case PROP_OPACITY: {
          return Sk.builtin.nmber(material.opacity, Sk.builtin.nmber.float$);
        }
        default: {
          throw new Error(name + " is not an attribute of " + LINE_BASIC_MATERIAL);
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(material, name, value) {
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
    $loc.__str__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
      args[PROP_COLOR] = material[PROP_COLOR];
      args[PROP_OPACITY] = material[PROP_OPACITY];
      return new Sk.builtin.str(LINE_BASIC_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return new Sk.builtin.str(LINE_BASIC_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, LINE_BASIC_MATERIAL, []);

  mod[MESH_LAMBERT_MATERIAL] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, parameters) {
      self.tp$name = MESH_LAMBERT_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[MESH_LAMBERT_MATERIAL](parameters);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + MESH_LAMBERT_MATERIAL);
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
      return new Sk.builtin.str(MESH_LAMBERT_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return new Sk.builtin.str(MESH_LAMBERT_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_LAMBERT_MATERIAL, []);

  mod[MESH_NORMAL_MATERIAL] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, parameters) {
      self.tp$name = MESH_NORMAL_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[MESH_NORMAL_MATERIAL](parameters);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + MESH_NORMAL_MATERIAL);
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
      return new Sk.builtin.str(MESH_NORMAL_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return new Sk.builtin.str(MESH_NORMAL_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_NORMAL_MATERIAL, []);

  mod[MESH_PHONG_MATERIAL] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, parameters) {
      self.tp$name = MESH_PHONG_MATERIAL;
      parameters = Sk.ffi.remapToJs(parameters);
      self.v = new THREE[MESH_PHONG_MATERIAL](parameters);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + MESH_PHONG_MATERIAL);
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = {};
//      args[PROP_AUTO_CLEAR] = material[PROP_AUTO_CLEAR];
      return new Sk.builtin.str(MESH_PHONG_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return new Sk.builtin.str(MESH_PHONG_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_PHONG_MATERIAL, []);

  mod[MESH] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var PROP_OVERDRAW = "overdraw";
    var PROP_POSITION = "position";
    var PROP_ROTATION = "rotation";
    $loc.__init__ = new Sk.builtin.func(function(self, geometry, material) {
      self.v = new THREE[MESH](geometry.v, material.v);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(mesh, name) {
      mesh = Sk.ffi.remapToJs(mesh);
      switch(name) {
        case PROP_OVERDRAW: {
          if (isBoolean(mesh[PROP_OVERDRAW])) {
            return mesh[PROP_OVERDRAW];
          }
          else {
            return null;
          }
        }
        case PROP_POSITION: {
          return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(mesh[PROP_POSITION]));
        }
        case PROP_ROTATION: {
          return Sk.misceval.callsim(mod[VECTOR_3], Sk.ffi.referenceToPy(mesh[PROP_ROTATION]));
        }
        default: {
          throw new Error(name + " is not an attribute of " + MESH);
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(mesh, name, value) {
      mesh = Sk.ffi.remapToJs(mesh);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
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
          mesh.position.x = value.coordinate(1);
          mesh.position.y = value.coordinate(2);
          mesh.position.z = value.coordinate(3);
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
    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(MESH);
    });
  }, MESH, []);

  mod[LINE] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, geometryPy, materialPy, typePy) {
      var geometry = Sk.ffi.remapToJs(geometryPy)
      var material = Sk.ffi.remapToJs(materialPy)
      var type = Sk.ffi.remapToJs(typePy)
      self.v = new THREE[LINE](geometry, material, type);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(linePy, name) {
      var line = Sk.ffi.remapToJs(linePy);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + LINE);
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(linePy, name, value) {
      var line = Sk.ffi.remapToJs(linePy);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        default: {
          throw new Error(name + " is not an attribute of " + LINE);
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(LINE);
    });
    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(LINE);
    });
  }, LINE, []);

  return mod;
}
