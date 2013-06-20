var $builtinmodule = function(argName) {

  /**
   * Unpack the module name for identification when creating logging messages.
   */
  var moduleName = argName.v;

  var CARTESIAN_3 = "Cartesian3";

  var mod = {};

  function isNumber(x) {
    return typeof x === 'number';
  }

  function isString(x) {
    return typeof x === 'string';
  }

  function unboxArg3(arg, name) {
    if (isNumber(arg.w) && 
      isNumber(arg.x) && 
      isNumber(arg.y) && 
      isNumber(arg.z) && 
      isNumber(arg.xy) && 
      isNumber(arg.yz) && 
      isNumber(arg.zx) && 
      isNumber(arg.xyz)) {
      return {w: arg.w, x: arg.x, y: arg.y, z: arg.z, xy: arg.xy, yz: arg.yz, zx: arg.zx, xyz: arg.xyz}; 
    }
    else if (isNumber(arg.v)) {
      return {w: arg.v, x: 0, y: 0, z: 0, xy: 0, yz: 0, zx: 0, xyz: 0}; 
    }
    else if (isNumber(arg)) {
      return {w: arg, x: 0, y: 0, z: 0, xy: 0, yz: 0, zx: 0, xyz: 0}; 
    }
    else if (isString(arg.v)) {
      throw new Error("Illegal argument: " + name + " must be either " + CARTESIAN_3 + " or a number.");
    }
    else {
      throw new Error("Illegal argument: " + name + " is " + JSON.stringify(arg));
    }
  }

  var Cartesian3 = function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, w, x, y, z, xy, yz, zx, xyz) {
      self.w = Sk.builtin.asnum$(w);
      self.x = Sk.builtin.asnum$(x);
      self.y = Sk.builtin.asnum$(y);
      self.z = Sk.builtin.asnum$(z);
      self.xy = Sk.builtin.asnum$(xy);
      self.yz = Sk.builtin.asnum$(yz);
      self.zx = Sk.builtin.asnum$(zx);
      self.xyz = Sk.builtin.asnum$(xyz);
    });

    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      a = unboxArg3(a, "lhs of addition operator");
      b = unboxArg3(b, "rhs of addition operator");
      return Sk.misceval.callsim(mod[CARTESIAN_3], 
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
      return Sk.misceval.callsim(mod[CARTESIAN_3], 
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
      return Sk.misceval.callsim(mod[CARTESIAN_3], w, x, y, z, xy, yz, zx, xyz);
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
      return Sk.misceval.callsim(mod[CARTESIAN_3], w, x, y, z, xy, yz, zx, xyz);
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
      return Sk.misceval.callsim(mod[CARTESIAN_3], w, x, y, z, xy, yz, zx, xyz);
    });

    // Unary minus.
    $loc.nb$negative = function() {
      return Sk.misceval.callsim(mod[CARTESIAN_3], -this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz);
    };

    // Unary plus.
    $loc.nb$positive = function() {
      return Sk.misceval.callsim(mod[CARTESIAN_3], this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz);
    };

    $loc.__div__ = new Sk.builtin.func(function(v, w) {
      var factor = w.x * w.x + w.y * w.y;
      var x = (v.x * w.x + v.y * w.y) / factor;
      var y = (v.y * w.x - v.x * w.y) / factor;
      return Sk.misceval.callsim(mod[CARTESIAN_3], x, y);
    });

    $loc.grade = new Sk.builtin.func(function(self, n) {
      var grade = Sk.builtin.asnum$(n);
      if (grade === 0) {
        return Sk.misceval.callsim(mod[CARTESIAN_3], self.w, 0, 0, 0, 0, 0, 0, 0);
      }
      else if (grade === 1) {
        return Sk.misceval.callsim(mod[CARTESIAN_3], 0, self.x, self.y, self.z, 0, 0, 0, 0);
      }
      else if (grade === 2) {
        return Sk.misceval.callsim(mod[CARTESIAN_3], 0, 0, 0, 0, self.xy, self.yz, self.zx, 0);
      }
      else if (grade === 3) {
        return Sk.misceval.callsim(mod[CARTESIAN_3], 0, 0, 0, 0, 0, 0, 0, self.xyz);
      }
      else {
        throw new Error(grade + " is not a valid " + CARTESIAN_3 + " grade.");
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
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
      append(self.w, "1");
      append(self.x, "e1");
      append(self.y, "e2");
      append(self.z, "e3");
      append(self.xy, "e12");
      append(self.yz, "e23");
      append(self.zx, "e31");
      append(self.xyz, "e123");
      var str;
      if (sb.length > 0) {
        var str = sb.join("");
      }
      else {
        str = "0";
      }
      return new Sk.builtin.str(str);
    });

    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(CARTESIAN_3 + '(' + self.w + ', ' + self.x + ', ' + self.y + ', ' + self.z + ', ' + self.xy + ', ' + self.yz + ', ' + self.zx + ', ' + self.xyz + ')');
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
        return self.w;
      }
      else if (key === 'x') {
        return self.x;
      }
      else if (key === 'y') {
        return self.y;
      }
      else if (key === 'z') {
        return self.z;
      }
      else if (key === 'xy') {
        return self.xy;
      }
      else if (key === 'yz') {
        return self.yz;
      }
      else if (key === 'zx') {
        return self.zx;
      }
      else if (key === 'xyz') {
        return self.xyz;
      }
      else {
        throw new Error(key + " is not a valid " + CARTESIAN_3 + " attribute.");
      }
    });

  };

  mod[CARTESIAN_3] = Sk.misceval.buildClass(mod, Cartesian3, CARTESIAN_3, []);

  mod.Scalar3 = new Sk.builtin.func(function(arg) {
    var w = Sk.builtin.asnum$(arg);
    return Sk.misceval.callsim(mod[CARTESIAN_3], w, 0, 0, 0, 0, 0, 0, 0);
  });

  mod.Vector3 = new Sk.builtin.func(function(argX, argY, argZ) {
    var x = Sk.builtin.asnum$(argX);
    var y = Sk.builtin.asnum$(argY);
    var z = Sk.builtin.asnum$(argZ);
    return Sk.misceval.callsim(mod[CARTESIAN_3], 0, x, y, z, 0, 0, 0, 0);
  });

  mod.Bivector3 = new Sk.builtin.func(function(argXY, argYZ, argZX) {
    var xy = Sk.builtin.asnum$(argXY);
    var yz = Sk.builtin.asnum$(argYZ);
    var zx = Sk.builtin.asnum$(argZX);
    return Sk.misceval.callsim(mod[CARTESIAN_3], 0, 0, 0, 0, xy, yz, zx, 0);
  });

  mod.Pseudoscalar3 = new Sk.builtin.func(function(arg) {
    var xyz = Sk.builtin.asnum$(arg);
    return Sk.misceval.callsim(mod[CARTESIAN_3], 0, 0, 0, 0, 0, 0, 0, xyz);
  });

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

  function render() {
    var delta = clock.getDelta();
    if (Sk.globals['render']) {
      Sk.misceval.callsim(Sk.globals['render'], delta);
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

  var requestId;

  function loop() {
    requestId = window.requestAnimationFrame(loop);
    render();
  }

  mod.start = new Sk.builtin.func(function() {
    if (!requestId) {
      clock.start();
      loop();
    }
  });

  mod.stop = new Sk.builtin.func(function() {
    if (requestId) {
//      clock.stop();
      window.cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  });

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

  windowResize = function(canvas, renderer, camera) {
    var callback  = function(){ 
      // notify the renderer of the size change
      renderer.setSize(canvas.parentNode.clientWidth, canvas.parentNode.clientHeight);
      // update the camera
      camera.aspect = canvas.parentNode.clientWidth / canvas.parentNode.clientHeight;
      camera.updateProjectionMatrix();
    }
    // bind the resize event
    window.addEventListener('resize', callback, false);
    // return .stop() the function to stop watching window resize
    return {
      /**
       * Stop watching window resize
      */
      stop  : function(){
        window.removeEventListener('resize', callback);
      }
    };
  }

  function init() {
    var canvas = document.getElementById(Sk.canvasWebGL);
    if (canvas) {
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      var aspectRatio = canvasWidth / canvasHeight;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 10000);
      camera.position.set( -15, 10, 10 );
      camera.up.x = 0;
      camera.up.y = 0;
      camera.up.z = 1;
      scene.add(camera);

      var detectedWebGL = Detector.webgl;
      renderer = detectedWebGL ? new THREE.WebGLRenderer({"canvas": canvas, "antialias": true}) : new THREE.CanvasRenderer({"canvas": canvas, "antialias": true});
      renderer.autoClear = true;
      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.setClearColor(new THREE.Color(0x080808), 1.0);

      renderer.setSize(canvas.parentNode.clientWidth, canvas.parentNode.clientHeight);
      camera.aspect = canvas.parentNode.clientWidth / canvas.parentNode.clientHeight;
      camera.updateProjectionMatrix();

      renderer.sortObjects = false;

      addLights(scene);
      addAxes(scene);
      addMainGrid(scene, 60);
      addFadingGrid(scene, 60, 50);

      windowResize(canvas, renderer, camera);
    }
    else {

    }
  }

  var Detector = {

    canvas: !! window.CanvasRenderingContext2D,
    webgl: ( function () {
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
      catch( e ) {
        return false;
      }
    })(),
    workers: !! window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,

    getWebGLErrorMessage: function () {

      var element = document.createElement( 'div' );
      element.id = 'webgl-error-message';
      element.style.fontFamily = 'monospace';
      element.style.fontSize = '13px';
      element.style.fontWeight = 'normal';
      element.style.textAlign = 'center';
      element.style.background = '#fff';
      element.style.color = '#000';
      element.style.padding = '1.5em';
      element.style.width = '400px';
      element.style.margin = '5em auto 0';

      if ( ! this.webgl ) {

        element.innerHTML = window.WebGLRenderingContext ? [
          'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
          'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
        ].join( '\n' ) : [
          'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
          'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
        ].join( '\n' );

      }

      return element;

    },

    addGetWebGLMessage: function ( parameters ) {

      var parent, id, element;

      parameters = parameters || {};

      parent = parameters.parent !== undefined ? parameters.parent : document.body;
      id = parameters.id !== undefined ? parameters.id : 'oldie';

      element = Detector.getWebGLErrorMessage();
      element.id = id;

      parent.appendChild( element );

    }

  };

  try {
    init();
  }
  catch(e) {
    alert(e);
  }

  return mod;
}
