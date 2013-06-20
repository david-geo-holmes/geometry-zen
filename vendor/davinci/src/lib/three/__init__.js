/**
 * three.js wrapper module for Skulpt Python.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {
  
  var VECTOR_3 = "Vector3";
  var EUCLIDEAN_3 = "Euclidean3";

  var SCENE                = "Scene";
  var WEBGL_RENDERER       = "WebGLRenderer";
  var COLOR                = "Color";
  var PERSPECTIVE_CAMERA   = "PerspectiveCamera";

  var LINE_BASIC_MATERIAL  = "LineBasicMaterial";
  var MESH_NORMAL_MATERIAL = "MeshNormalMaterial";

  var MESH                 = "Mesh";
  var CUBE_GEOMETRY        = "CubeGeometry";
  var CYLINDER_GEOMETRY    = "CylinderGeometry";
  var ICOSAHEDRON_GEOMETRY = "IcosahedronGeometry";
  var OCTAHEDRON_GEOMETRY  = "OctahedronGeometry";
  var PLANE_GEOMETRY       = "PlaneGeometry";
  var SPHERE_GEOMETRY      = "SphereGeometry";
  var TETRAHEDRON_GEOMETRY = "TetrahedronGeometry";
  var TORUS_GEOMETRY       = "TorusGeometry";

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
      if (isNumberAssignableFromArg(vector) && isNumberAssignableFromArg(y) && isNumberAssignableFromArg(z)) {
        self.v = new THREE.Vector3(numberFromArg(vector, PROP_X, VECTOR_3, false), numberFromArg(y, PROP_Y, VECTOR_3), numberFromArg(z, PROP_Z, VECTOR_3));
      }
      else if (isDefined(vector) && isUndefined(y) && isUndefined(z)) {
        self.v = vector;
      }
      else {
        throw new Sk.builtin.AssertionError("constructor arguments for " + VECTOR_3);
      }
      self.tp$name = VECTOR_3;
      self.skType  = VECTOR_3;
    });

    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      var x = a.v.x + b.v.x;
      var y = a.v.y + b.v.y;
      var z = a.v.z + b.v.z;
      var vector = new THREE.Vector3(x, y, z);
      return Sk.misceval.callsim(mod[VECTOR_3], vector);
    });

    $loc.__sub__ = new Sk.builtin.func(function(a, b) {
      var x = a.v.x - b.v.x;
      var y = a.v.y - b.v.y;
      var z = a.v.z - b.v.z;
      var vector = new THREE.Vector3(x, y, z);
      return Sk.misceval.callsim(mod[VECTOR_3], vector);
    });

    $loc.__mul__ = new Sk.builtin.func(function(a, b) {
      var x = 0;
      var y = 0;
      var z = 0;
      var vector = new THREE.Vector3(x, y, z);
      return Sk.misceval.callsim(mod[VECTOR_3], vector);
    });

    $loc.__rmul__ = new Sk.builtin.func(function(rhs, lhs) {
      var x = 0;
      var y = 0;
      var z = 0;
      var vector = new THREE.Vector3(x, y, z);
      return Sk.misceval.callsim(mod[VECTOR_3], vector);
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case PROP_X: {
          return Sk.builtin.assk$(self.v[PROP_X], Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(self.v[PROP_Y], Sk.builtin.nmber.float$);
        }
        case PROP_Z: {
          return Sk.builtin.assk$(self.v[PROP_Z], Sk.builtin.nmber.float$);
        }
        default: {
          throw new Sk.builtin.AttributeError(name + " is not an attribute of " + VECTOR_3);
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
      switch(name) {
        case PROP_X: {
          self.v.setX(numberFromArg(value, name, VECTOR_3, false));
        }
        break;
        case PROP_Y: {
          self.v.setY(numberFromArg(value, name, VECTOR_3, false));
        }
        break;
        case PROP_Z: {
          self.v.setZ(numberFromArg(value, name, VECTOR_3, false));
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not an attribute of " + VECTOR_3);
        }
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(BLADE.Euclidean3.fromCartesian(0, self.v[PROP_X], self.v[PROP_Y], self.v[PROP_Z], 0, 0, 0, 0).toStringIJK());
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(VECTOR_3 + "(" + self.v[PROP_X] + "," + self.v[PROP_Y] + "," + self.v[PROP_Z] + ")");
    });

  }, VECTOR_3, []);

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
          return Sk.misceval.callsim(mod[VECTOR_3], camera.position);
        }
        case "rotation": {
          return Sk.misceval.callsim(mod[VECTOR_3], camera.rotation);
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
//      args[PROP_AUTO_CLEAR] = material[PROP_AUTO_CLEAR];
      return new Sk.builtin.str(MESH_NORMAL_MATERIAL + "(" + JSON.stringify(args) + ")");
    });
    $loc.__repr__ = new Sk.builtin.func(function(material) {
      material = Sk.ffi.remapToJs(material);
      var args = [{}];
      return new Sk.builtin.str(MESH_NORMAL_MATERIAL + "(" + args.map(function(x) {return JSON.stringify(x);}).join(", ") + ")");
    });
  }, MESH_NORMAL_MATERIAL, []);

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
          return Sk.misceval.callsim(mod[VECTOR_3], mesh.position);
        }
        case "rotation": {
          var mesh = self.v;
          return Sk.misceval.callsim(mod[VECTOR_3], mesh.rotation);
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
        case "position": {
          var mesh = self.v;
          mesh.position.x = value.v.coordinate(1);
          mesh.position.y = value.v.coordinate(2);
          mesh.position.z = value.v.coordinate(3);
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

  return mod;
}
