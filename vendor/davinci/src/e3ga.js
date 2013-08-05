/**
 * Convenience function for incorporating a Euclidean3 class into a module.
 *
 * Usage:
 *
 * Sk.builtin.defineEuclidean3(mod);
 */
Sk.builtin.defineEuclidean3 = function(mod) {

  var EUCLIDEAN_3                = "Euclidean3";
  var SCALAR_3                   = "Scalar3";
  var VECTOR_3                   = "Vector3";
  var BIVECTOR_3                 = "Bivector3";
  var PSEUDOSCALAR_3             = "Pseudoscalar3";

  var PROP_W                     = "w";
  var PROP_X                     = "x";
  var PROP_Y                     = "y";
  var PROP_Z                     = "z";
  var PROP_XY                    = "xy";
  var PROP_YZ                    = "yz";
  var PROP_ZX                    = "zx";
  var PROP_XYZ                   = "xyz";

  var METHOD_ADD                 = "add";
  var METHOD_CLONE               = "clone";
  var METHOD_CROSS               = "cross";
  var METHOD_DOT                 = "dot";
  var METHOD_LENGTH              = "length";
  var METHOD_NORMALIZE           = "normalize";
  var METHOD_SET                 = "set";
  var METHOD_SET_X               = "setX";
  var METHOD_SET_Y               = "setY";
  var METHOD_SET_Z               = "setZ";
  var METHOD_GET_COMPONENT       = "getComponent";
  var METHOD_SET_COMPONENT       = "setComponent";

  /**
   * Emulate ThreeJS Vector3 here to get interoperability.
   *
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
  Vector3.prototype = {
    constructor: Vector3,
    set: function (x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    },
    setX: function (x) {
      this.x = x;
      return this;
    },
    setY: function (y) {
      this.y = y;
      return this;
    },
    setZ: function (z) {
      this.z = z;
      return this;
    },
    setComponent: function (index, value) {
      switch (index) {
        case 0: this.x = value; break;
        case 1: this.y = value; break;
        case 2: this.z = value; break;
        default: throw new Error("index is out of range: " + index);
      }
    },

    getComponent: function ( index ) {
      switch ( index ) {
        case 0: return this.x;
        case 1: return this.y;
        case 2: return this.z;
        default: throw new Error("index is out of range: " + index);
      }
    },
    copy: function (v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    },
    add: function (v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
    },
    addScalar: function (s) {
      this.x += s;
      this.y += s;
      this.z += s;
      return this;
    },
    addVectors: function (a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
    },
    sub: function (v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      return this;
    },
    subVectors: function (a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
    },
    multiply: function (v) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      return this;
    },
    multiplyScalar: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    },
    multiplyVectors: function (a, b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      this.z = a.z * b.z;
      return this;
    },
    applyMatrix3: function (m) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6] * z;
      this.y = e[1] * x + e[4] * y + e[7] * z;
      this.z = e[2] * x + e[5] * y + e[8] * z;
      return this;
    },
    applyMatrix4: function (m) {
      var x = this.x, y = this.y, z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8]  * z + e[12];
      this.y = e[1] * x + e[5] * y + e[9]  * z + e[13];
      this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
      return this;
    },
    applyProjection: function (m) {
      var x = this.x, y = this.y, z = this.z;
      var e = m.elements;
      var d = 1 / ( e[3] * x + e[7] * y + e[11] * z + e[15] ); // perspective divide
      this.x = ( e[0] * x + e[4] * y + e[8]  * z + e[12] ) * d;
      this.y = ( e[1] * x + e[5] * y + e[9]  * z + e[13] ) * d;
      this.z = ( e[2] * x + e[6] * y + e[10] * z + e[14] ) * d;
      return this;
    },
    applyQuaternion: function (q) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var qx = q.x;
      var qy = q.y;
      var qz = q.z;
      var qw = q.w;
      // calculate quat * vector
      var ix =  qw * x + qy * z - qz * y;
      var iy =  qw * y + qz * x - qx * z;
      var iz =  qw * z + qx * y - qy * x;
      var iw = -qx * x - qy * y - qz * z;
      // calculate result * inverse quat
      this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
      return this;
    },
    transformDirection: function (m) {
      // vector interpreted as a direction
      var x = this.x, y = this.y, z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8]  * z;
      this.y = e[1] * x + e[5] * y + e[9]  * z;
      this.z = e[2] * x + e[6] * y + e[10] * z;
      this.normalize();
      return this;
    },
    divide: function (v) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
      return this;
    },
    divideScalar: function ( scalar ) {
      if ( scalar !== 0 ) {
        var invScalar = 1 / scalar;
        this.x *= invScalar;
        this.y *= invScalar;
        this.z *= invScalar;
      } else {
        this.x = 0;
        this.y = 0;
        this.z = 0;
      }
      return this;
    },
    min: function ( v ) {
      if ( this.x > v.x ) {
        this.x = v.x;
      }
      if ( this.y > v.y ) {
        this.y = v.y;
      }
      if ( this.z > v.z ) {
        this.z = v.z;
      }
      return this;
    },
    max: function ( v ) {
      if ( this.x < v.x ) {
        this.x = v.x;
      }
      if ( this.y < v.y ) {
        this.y = v.y;
      }
      if ( this.z < v.z ) {
        this.z = v.z;
      }
      return this;
    },
    clamp: function ( min, max ) {
      // This function assumes min < max, if this assumption isn't true it will not operate correctly
      if ( this.x < min.x ) {
        this.x = min.x;
      } else if ( this.x > max.x ) {
        this.x = max.x;
      }
      if ( this.y < min.y ) {
        this.y = min.y;
      } else if ( this.y > max.y ) {
        this.y = max.y;
      }
      if ( this.z < min.z ) {
        this.z = min.z;
      } else if ( this.z > max.z ) {
        this.z = max.z;
      }
      return this;
    },
    negate: function () {
      return this.multiplyScalar( - 1 );
    },
    dot: function ( v ) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    lengthSq: function () {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    length: function () {
      return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    },
    lengthManhattan: function () {
      return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );
    },
    normalize: function () {
      return this.divideScalar( this.length() );
    },
    setLength: function ( l ) {
      var oldLength = this.length();
      if ( oldLength !== 0 && l !== oldLength  ) {
        this.multiplyScalar( l / oldLength );
      }
      return this;
    },
    lerp: function ( v, alpha ) {
      this.x += ( v.x - this.x ) * alpha;
      this.y += ( v.y - this.y ) * alpha;
      this.z += ( v.z - this.z ) * alpha;
      return this;
    },
    cross: function (v) {
      var x = this.x, y = this.y, z = this.z;
      this.x = y * v.z - z * v.y;
      this.y = z * v.x - x * v.z;
      this.z = x * v.y - y * v.x;
      return this;
    },
    crossVectors: function ( a, b ) {
      this.x = a.y * b.z - a.z * b.y;
      this.y = a.z * b.x - a.x * b.z;
      this.z = a.x * b.y - a.y * b.x;
      return this;
    },
    angleTo: function ( v ) {
      var theta = this.dot( v ) / ( this.length() * v.length() );
      // clamp, to handle numerical problems
      return Math.acos( clamp( theta, -1, 1 ) );
    },
    distanceTo: function ( v ) {
      return Math.sqrt( this.distanceToSquared( v ) );
    },
    distanceToSquared: function ( v ) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      var dz = this.z - v.z;
      return dx * dx + dy * dy + dz * dz;
    },
    getPositionFromMatrix: function ( m ) {
      this.x = m.elements[12];
      this.y = m.elements[13];
      this.z = m.elements[14];
      return this;
    },
    getScaleFromMatrix: function ( m ) {
      var sx = this.set( m.elements[0], m.elements[1], m.elements[2] ).length();
      var sy = this.set( m.elements[4], m.elements[5], m.elements[6] ).length();
      var sz = this.set( m.elements[8], m.elements[9], m.elements[10] ).length();
      this.x = sx;
      this.y = sy;
      this.z = sz;
      return this;
    },
    getColumnFromMatrix: function ( index, matrix ) {
      var offset = index * 4;
      var me = matrix.elements;
      this.x = me[ offset ];
      this.y = me[ offset + 1 ];
      this.z = me[ offset + 2 ];
      return this;
    },
    equals: function ( v ) {
      return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );
    },
    fromArray: function ( array ) {
      this.x = array[ 0 ];
      this.y = array[ 1 ];
      this.z = array[ 2 ];
      return this;
    },
    toArray: function () {
      return [ this.x, this.y, this.z ];
    },
    clone: function () {
      return new Vector3( this.x, this.y, this.z );
    }
  };

  function clamp( x, a, b ) { return ( x < a ) ? a : ( ( x > b ) ? b : x ); }
  function isNumber(x)    { return typeof x === 'number'; }
  function isUndefined(x) { return typeof x === 'undefined'; }
  function isDefined(x)   { return typeof x !== 'undefined'; }

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

  function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index|0;
    var x = 0.0;
    switch(~(~index)) {
      case 0: {
        x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
      }
      break;
      case 1: {
        x = +(a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5);
      }
      break;
      case 2: {
        x = +(a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6);
      }
      break;
      case 3: {
        x = +(a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4);
      }
      break;
      case 4: {
        x = +(a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3);
      }
      break;
      case 5: {
        x = +(a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1);
      }
      break;
      case 6: {
        x = +(a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2);
      }
      break;
      case 7: {
        x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
      }
      break;
      default: {
      }
    }
    return +x;
  }

  function extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index|0;
    var x = 0.0;
    switch(~(~index)) {
      case 0: {
        x = +(a0 * b0);
      }
      break;
      case 1: {
        x = +(a0 * b1 + a1 * b0);
      }
      break;
      case 2: {
        x = +(a0 * b2           + a2 * b0);
      }
      break;
      case 3: {
        x = +(a0 * b3                     + a3 * b0);
      }
      break;
      case 4: {
        x = +(a0 * b4 + a1 * b2 - a2 * b1           + a4* b0);
      }
      break;
      case 5: {
        x = +(a0 * b5           + a2 * b3 - a3 * b2           + a5 * b0);
      }
      break;
      case 6: {
        x = +(a0 * b6 - a1 * b3           + a3 * b1                     + a6 * b0);
      }
      break;
      case 7: {
        x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
      }
      break;
      default: {
      }
    }
    return +x;
  }

  function lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index|0;
    var x = 0.0;
    switch(~(~index)) {
      case 0: {
        x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
      }
      break;
      case 1: {
        x = +(a0 * b1           - a2 * b4 + a3 * b6           - a5 * b7);
      }
      break;
      case 2: {
        x = +(a0 * b2 + a1 * b4           - a3 * b5                     - a6 * b7);
      }
      break;
      case 3: {
        x = +(a0 * b3 - a1 * b6 + a2 * b5           - a4 * b7);
      }
      break;
      case 4: {
        x = +(a0 * b4                     + a3 * b7);
      }
      break;
      case 5: {
        x = +(a0 * b5 + a1 * b7);
      }
      break;
      case 6: {
        x = +(a0 * b6           + a2 * b7);
      }
      break;
      case 7: {
        x = +(a0 * b7);
      }
      break;
      default: {
      }
    }
    return +x;
  }

  function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index|0;
    var x = 0.0;
    switch(~(~index)) {
      case 0: {
        x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
      }
      break;
      case 1: {
        x = +(        + a1 * b0                     + a4 * b2           - a6 * b3 - a7 * b5);
      }
      break;
      case 2: {
        x = +(                  + a2 * b0           - a4 * b1 + a5 * b3           - a7 * b6);
      }
      break;
      case 3: {
        x = +(                            + a3 * b0           - a5 * b2 + a6 * b1 - a7 * b4);
      }
      break;
      case 4: {
        x = +(                                      + a4 * b0                     + a7 * b3);
      }
      break;
      case 5: {
        x = +(                                                + a5 * b0           + a7 * b1);
      }
      break;
      case 6: {
        x = +(                                                          + a6 * b0 + a7 * b2);
      }
      break;
      case 7: {
        x = +(                                                                    + a7 * b0);
      }
      break;
      default: {
      }
    }
    return +x;
  }

  function divide(a000, a001, a010, a011, a100, a101, a110, a111, b000, b001, b010, b011, b100, b101, b110, b111, dst) {
    // WARNING! bladeASM.mulE2 uses w,x,y,z,xy,yz,zx,xyz representation. Notice the ordering and sign change.
    // TODO: Move everything to the more systematic bitmap representation.
    // r = ~b = reverse(b)
    var r000 = +b000; // w,   grade 0(+)
    var r001 = +b001; // x,   grade 1(+)
    var r010 = +b010; // y,   grade 1(+)
    var r011 = -b011; // xy,  grade 2(-)
    var r100 = +b100; // z,   grade 1(+)
    var r101 = -b101; // yz,  grade 2(-)
    var r110 = -b110; // yz,  grade 2(-)
    var r111 = -b111; // xyz, grade 3(-)
    // m = b * r = b * (~b)
    // The grade 2 and grade 3 components evaluate to zero.
    var m000 =  mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
    var m001 =  mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
    var m010 =  mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
    var m011 =  0;//mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 4);
    var m100 =  mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
    var m101 =  0;//-mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 6);
    var m110 =  0;//mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 5);
    var m111 =  0;//mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 7);
    // c = cliffordConjugate(m)
    var c000 = +m000; // w,   grade 0(+)
    var c001 = -m001; // x,   grade 1(-)
    var c010 = -m010; // y,   grade 1(-)
    var c011 = -m011; // xy,  grade 2(-)
    var c100 = -m100; // z,   grade 1(-)
    var c101 = -m101; // -zx, grade 2(-)
    var c110 = -m110; // yz,  grade 2(-)
    var c111 = +m111; // xyz, grade 3(+)
    // s = r * c
    // TODO: Presumably there is some simplified computation on account of the c's being sparse.
    var s000 =  mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
    var s001 =  mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
    var s010 =  mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
    var s011 =  mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
    var s100 =  mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
    var s101 = -mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
    var s110 =  mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
    var s111 =  mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
    // k = b * s
    var k000 =  mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
    // i = inverse(b)
    var i000 = s000/k000;
    var i001 = s001/k000;
    var i010 = s010/k000;
    var i011 = s011/k000;
    var i100 = s100/k000;
    var i101 = s101/k000;
    var i110 = s110/k000;
    var i111 = s111/k000;
    // x = a * inverse(b)
    var x000 =  mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
    var x001 =  mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
    var x010 =  mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
    var x011 =  mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
    var x100 =  mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
    var x101 = -mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
    var x110 =  mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
    var x111 =  mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
    // translate bitmap representation to Cartesian.
    var w   =  x000;
    var x   =  x001;
    var y   =  x010;
    var z   =  x100;
    var xy  =  x011;
    var yz  =  x110;
    var zx  = -x101;
    var xyz =  x111;
    // return or populate the optional dst parameter.
    if (typeof dst !== 'undefined') {
      dst.w   = w;
      dst.x   = x;
      dst.y   = y;
      dst.z   = z;
      dst.xy  = xy;
      dst.yz  = yz;
      dst.zx  = zx;
      dst.xyz = xyz;
    }
    else {
      return remapE3ToPy(w, x, y, z, xy, yz, zx, xyz);
    }
  }

  function multiVector3(w, vector, xy, yz, zx, xyz) {
    vector.w = w;
    vector.xy = xy;
    vector.yz = yz;
    vector.zx = zx;
    vector.xyz = xyz;
    return vector;
  }

  function remapE3ToPy(w, x, y, z, xy, yz, zx, xyz) {
    w = Sk.builtin.assk$(w, Sk.builtin.nmber.float$);
    x = Sk.builtin.assk$(x, Sk.builtin.nmber.float$);
    y = Sk.builtin.assk$(y, Sk.builtin.nmber.float$);
    z = Sk.builtin.assk$(z, Sk.builtin.nmber.float$);
    xy = Sk.builtin.assk$(xy, Sk.builtin.nmber.float$);
    yz = Sk.builtin.assk$(yz, Sk.builtin.nmber.float$);
    zx = Sk.builtin.assk$(zx, Sk.builtin.nmber.float$);
    xyz = Sk.builtin.assk$(xyz, Sk.builtin.nmber.float$);
    return Sk.misceval.callsim(mod[EUCLIDEAN_3], w, x, y, z, xy, yz, zx, xyz);
  }

  function coord(mv, index) {
    switch(index) {
      case 0: {
        return mv.w;
      }
      case 1: {
        return mv.x;
      }
      case 2: {
        return mv.y;
      }
      case 3: {
        return mv.z;
      }
      case 4: {
        return mv.xy;
      }
      case 5: {
        return mv.yz;
      }
      case 6: {
        return mv.zx;
      }
      case 7: {
        return mv.xyz;
      }
      default: {
        throw new Sk.builtin.AssertionError("" + index + " is not a valid multivector coordinate index");
      }
    }
  }

  function compute(f, a, b, coord, pack) {
    var a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, x0, x1, x2, x3, x4, x5, x6, x7;
    a0 = a.w;
    a1 = a.x;
    a2 = a.y;
    a3 = a.z;
    a4 = a.xy;
    a5 = a.yz;
    a6 = a.zx;
    a7 = a.xyz;
    b0 = b.w;
    b1 = b.x;
    b2 = b.y;
    b3 = b.z;
    b4 = b.xy;
    b5 = b.yz;
    b6 = b.zx;
    b7 = b.xyz;
    x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
    x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
    x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
    x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
    x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
    x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
    x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
    x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
    return pack(x0, x1, x2, x3, x4, x5, x6, x7);
  }

  mod[EUCLIDEAN_3] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, w, x, y, z, xy, yz, zx, xyz) {
      w = Sk.ffi.remapToJs(w);
      x = Sk.ffi.remapToJs(x);
      y = Sk.ffi.remapToJs(y);
      z = Sk.ffi.remapToJs(z);
      xy = Sk.ffi.remapToJs(xy);
      yz = Sk.ffi.remapToJs(yz);
      zx = Sk.ffi.remapToJs(zx);
      xyz = Sk.ffi.remapToJs(xyz);
      if (isNumber(w) && isNumber(x) && isNumber(y) && isNumber(z) && isNumber(xy) && isNumber(yz) && isNumber(zx) && isNumber(xyz)) {
        self.v = multiVector3(w, new Vector3(x, y, z), xy, yz, zx, xyz);
      }
      else if (isDefined(w) && isUndefined(x) && isUndefined(y) && isUndefined(z) && isUndefined(xy) && isUndefined(yz) && isUndefined(zx) && isUndefined(xyz)) {
        self.v = multiVector3(w.w || 0, w, w.xy || 0, w.yz || 0, w.zx|| 0, w.xyz || 0);
      }
      else if (isDefined(w) && isUndefined(x) && isUndefined(y) && isUndefined(z) && isDefined(xy) && isDefined(yz) && isDefined(zx) && isDefined(xyz)) {
        self.v = multiVector3(w, new Vector3(0, 0, 0), xy, yz, zx, xyz);
      }
      else if (isUndefined(w) && isUndefined(x) && isUndefined(y) && isUndefined(z) && isUndefined(xy) && isUndefined(yz) && isUndefined(zx) && isUndefined(xyz)) {
        self.v = multiVector3(0, new Vector3(0, 0, 0), 0, 0, 0, 0);
      }
      else {
        throw new Sk.builtin.AssertionError(EUCLIDEAN_3);
      }
      self.tp$name = EUCLIDEAN_3;
    });
    $loc.__add__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE3ToPy(a.w + b, a.x, a.y, a.z, a.xy, a.yz, a.zx, a.xyz);
      }
      else {
        var w = a.w + b.w;
        var x = a.x + b.x;
        var y = a.y + b.y;
        var z = a.z + b.z;
        var xy = a.xy + b.xy;
        var yz = a.yz + b.yz;
        var zx = a.zx + b.zx;
        var xyz = a.xyz + b.xyz;
        return remapE3ToPy(w, x, y, z, xy, yz, zx, xyz);
      }
    });
    $loc.__radd__ = new Sk.builtin.func(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return remapE3ToPy(a + b.w, b.x, b.y, b.z, b.xy, b.yz, b.zx, b.xyz);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__iadd__ = new Sk.builtin.func(function(selfPy, otherPy) {
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
        self.xy += other.xy;
        self.yz += other.yz;
        self.zx += other.zx;
        self.xyz += other.xyz;
      }
      return selfPy;
    });
    $loc.__sub__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE3ToPy(a.w - b, a.x, a.y, a.z, a.xy, a.yz, a.zx, a.xyz);
      }
      else {
        var w = a.w - b.w;
        var x = a.x - b.x;
        var y = a.y - b.y;
        var z = a.z - b.z;
        var xy = a.xy - b.xy;
        var yz = a.yz - b.yz;
        var zx = a.zx - b.zx;
        var xyz = a.xyz - b.xyz;
        return remapE3ToPy(w, x, y, z, xy, yz, zx, xyz);
      }
    });
    $loc.__rsub__ = new Sk.builtin.func(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return remapE3ToPy(a - b.w, -b.x, -b.y, -b.z, -b.xy, -b.yz, -b.zx, -b.xyz);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__isub__ = new Sk.builtin.func(function(selfPy, otherPy) {
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
        self.xy -= other.xy;
        self.yz -= other.yz;
        self.zx -= other.zx;
        self.xyz -= other.xyz;
      }
      return selfPy;
    });
    $loc.__mul__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE3ToPy(a.w * b, a.x * b, a.y * b, a.z * b, a.xy * b, a.yz * b, a.zx * b, a.xyz * b);
      }
      else {
        return compute(mulE3, a, b, coord, remapE3ToPy);
      }
    });
    $loc.__rmul__ = new Sk.builtin.func(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return remapE3ToPy(a * b.w, a * b.x, a * b.y, a * b.z, a * b.xy, a * b.yz, a * b.zx, a * b.xyz);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__imul__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      var a0 = a.w;
      var a1 = a.x;
      var a2 = a.y;
      var a3 = a.z;
      var a4 = a.xy;
      var a5 = a.yz;
      var a6 = a.zx;
      var a7 = a.xyz;
      var b0, b1, b2, b3, b4, b5, b6, b7;
      if (isNumber(b)) {
        b0 = b;
        b1 = 0;
        b2 = 0;
        b3 = 0;
        b4 = 0;
        b5 = 0;
        b6 = 0;
        b7 = 0;
      }
      else {
        b0 = b.w;
        b1 = b.x;
        b2 = b.y;
        b3 = b.z;
        b4 = b.xy;
        b5 = b.yz;
        b6 = b.zx;
        b7 = b.xyz;
      }
      a.w   = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
      a.x   = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
      a.y   = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
      a.z   = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
      a.xy  = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
      a.yz  = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
      a.zx  = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
      a.xyz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
      return selfPy;
    });
    $loc.__div__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return divide(a.w, a.x, a.y, a.xy, a.z, -a.zx, a.yz, a.xyz, b, 0, 0, 0, 0, 0, 0, 0, undefined);
      }
      else {
        return divide(a.w, a.x, a.y, a.xy, a.z, -a.zx, a.yz, a.xyz, b.w, b.x, b.y, b.xy, b.z, -b.zx, b.yz, b.xyz, undefined);
      }
    });
    $loc.__rdiv__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return divide(lhs, 0, 0, 0, 0, 0, 0, 0, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, undefined);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " / " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__idiv__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      if (isNumber(b)) {
        divide(a.w, a.x, a.y, a.xy, a.z, -a.zx, a.yz, a.xyz, b, 0, 0, 0, 0, 0, 0, 0, a);
        return selfPy;
      }
      else {
        divide(a.w, a.x, a.y, a.xy, a.z, -a.zx, a.yz, a.xyz, b.w, b.x, b.y, b.xy, b.z, -b.zx, b.yz, b.xyz, a);
        return selfPy;
      }
    });
    $loc.__xor__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE3ToPy(a.w * b, a.x * b, a.y * b, a.z * b, a.xy * b, a.yz * b, a.zx * b, a.xyz * b);
      }
      else {
        return compute(extE3, a, b, coord, remapE3ToPy);
      }
    });
    $loc.__rxor__ = new Sk.builtin.func(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return remapE3ToPy(a * b.w, a * b.x, a * b.y, a * b.z, a * b.xy, a * b.yz, a * b.zx, a * b.xyz);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__ixor__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      var a0 = a.w;
      var a1 = a.x;
      var a2 = a.y;
      var a3 = a.z;
      var a4 = a.xy;
      var a5 = a.yz;
      var a6 = a.zx;
      var a7 = a.xyz;
      var b0, b1, b2, b3, b4, b5, b6, b7;
      if (isNumber(b)) {
        b0 = b;
        b1 = 0;
        b2 = 0;
        b3 = 0;
        b4 = 0;
        b5 = 0;
        b6 = 0;
        b7 = 0;
      }
      else {
        b0 = b.w;
        b1 = b.x;
        b2 = b.y;
        b3 = b.z;
        b4 = b.xy;
        b5 = b.yz;
        b6 = b.zx;
        b7 = b.xyz;
      }
      a.w   = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
      a.x   = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
      a.y   = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
      a.z   = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
      a.xy  = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
      a.yz  = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
      a.zx  = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
      a.xyz = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
      return selfPy;
    });
    $loc.__lshift__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE3ToPy(a.w * b, 0, 0, 0, 0, 0, 0, 0);
      }
      else {
        return compute(lcoE3, a, b, coord, remapE3ToPy);
      }
    });
    $loc.__rlshift__ = new Sk.builtin.func(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return remapE3ToPy(a * b.w, a * b.x, a * b.y, a * b.z, a * b.xy, a * b.yz, a * b.zx, a * b.xyz);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__ilshift__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      var a0 = a.w;
      var a1 = a.x;
      var a2 = a.y;
      var a3 = a.z;
      var a4 = a.xy;
      var a5 = a.yz;
      var a6 = a.zx;
      var a7 = a.xyz;
      var b0, b1, b2, b3, b4, b5, b6, b7;
      if (isNumber(b)) {
        b0 = b;
        b1 = 0;
        b2 = 0;
        b3 = 0;
        b4 = 0;
        b5 = 0;
        b6 = 0;
        b7 = 0;
      }
      else {
        b0 = b.w;
        b1 = b.x;
        b2 = b.y;
        b3 = b.z;
        b4 = b.xy;
        b5 = b.yz;
        b6 = b.zx;
        b7 = b.xyz;
      }
      a.w   = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
      a.x   = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
      a.y   = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
      a.z   = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
      a.xy  = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
      a.yz  = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
      a.zx  = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
      a.xyz = lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
      return selfPy;
    });
    $loc.__rshift__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE3ToPy(a.w * b, a.x * b, a.y * b, a.z * b, a.xy * b, a.yz * b, a.zx * b, a.xyz * b);
      }
      else {
        return compute(rcoE3, a, b, coord, remapE3ToPy);
      }
    });
    $loc.__rrshift__ = new Sk.builtin.func(function(b, a) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(a)) {
        return remapE3ToPy(a * b.w, 0, 0, 0, 0, 0, 0, 0);
      }
      else {
        throw new Sk.builtin.AssertionError();
      }
    });
    $loc.__irshift__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var a = Sk.ffi.remapToJs(selfPy);
      var b = Sk.ffi.remapToJs(otherPy);
      var a0 = a.w;
      var a1 = a.x;
      var a2 = a.y;
      var a3 = a.z;
      var a4 = a.xy;
      var a5 = a.yz;
      var a6 = a.zx;
      var a7 = a.xyz;
      var b0, b1, b2, b3, b4, b5, b6, b7;
      if (isNumber(b)) {
        b0 = b;
        b1 = 0;
        b2 = 0;
        b3 = 0;
        b4 = 0;
        b5 = 0;
        b6 = 0;
        b7 = 0;
      }
      else {
        b0 = b.w;
        b1 = b.x;
        b2 = b.y;
        b3 = b.z;
        b4 = b.xy;
        b5 = b.yz;
        b6 = b.zx;
        b7 = b.xyz;
      }
      a.w   = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
      a.x   = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
      a.y   = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
      a.z   = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
      a.xy  = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
      a.yz  = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
      a.zx  = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
      a.xyz = rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
      return selfPy;
    });
    $loc.nb$positive = function() {
      return this;
    };
    $loc.nb$negative = function() {
      var mv = Sk.ffi.remapToJs(this);
      return remapE3ToPy(-mv.w, -mv.x, -mv.y, -mv.z, -mv.xy, -mv.yz, -mv.zx, -mv.xyz);
    };
    $loc.nb$invert = function() {
      var mv = Sk.ffi.remapToJs(this);
      return remapE3ToPy(mv.w, mv.x, mv.y, mv.z, -mv.xy, -mv.yz, -mv.zx, -mv.xyz);
    };
    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return a.w === b.w && a.x === b.x && a.y === b.y && a.z === b.z && a.xy === b.xy && a.yz === b.yz && a.zx === b.zx && a.xyz === b.xyz;
    });
    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return a.w !== b.w || a.x !== b.x || a.y !== b.y || a.z !== b.z || a.xy !== b.xy || a.yz !== b.yz || a.zx !== b.zx || a.xyz !== b.xyz;
    });
    $loc.__getitem__ = new Sk.builtin.func(function(mv, index) {
      mv = Sk.ffi.remapToJs(mv);
      index = Sk.builtin.asnum$(index);
      switch(index) {
        case 0: {
          return remapE3ToPy(mv.w, 0, 0, 0, 0, 0, 0, 0);
        }
        case 1: {
          return remapE3ToPy(0, mv.x, mv.y, mv.z, 0, 0, 0, 0);
        }
        case 2: {
          return remapE3ToPy(0, 0, 0, 0, mv.xy, mv.yz, mv.zx, 0);
        }
        case 3: {
          return remapE3ToPy(0, 0, 0, 0, 0, 0, 0, mv.xyz);
        }
      }
    });
    $loc.__getattr__ = new Sk.builtin.func(function(mvPy, name) {
      var mv = Sk.ffi.remapToJs(mvPy);
      switch(name) {
        case PROP_W: {
          return Sk.builtin.assk$(mv.w, Sk.builtin.nmber.float$);
        }
        case PROP_X: {
          return Sk.builtin.assk$(mv.x, Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(mv.y, Sk.builtin.nmber.float$);
        }
        case PROP_Z: {
          return Sk.builtin.assk$(mv.z, Sk.builtin.nmber.float$);
        }
        case PROP_XY: {
          return Sk.builtin.assk$(mv.xy, Sk.builtin.nmber.float$);
        }
        case PROP_YZ: {
          return Sk.builtin.assk$(mv.yz, Sk.builtin.nmber.float$);
        }
        case PROP_ZX: {
          return Sk.builtin.assk$(mv.zx, Sk.builtin.nmber.float$);
        }
        case PROP_XYZ: {
          return Sk.builtin.assk$(mv.xyz, Sk.builtin.nmber.float$);
        }
        case METHOD_ADD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, arg) {
              arg  = Sk.ffi.remapToJs(arg);
              mv.w += arg.w;
              mv.x += arg.x;
              mv.y += arg.y;
              mv.z += arg.z;
              mv.xy += arg.xy;
              mv.yz += arg.yz;
              mv.zx += arg.zx;
              mv.xyz += arg.xyz;
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD);
            });
          }, METHOD_ADD, []));
        }
        case METHOD_CROSS: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_CROSS;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, vPy) {
              var v  = Sk.ffi.remapToJs(vPy);
              mv.w = 0;
              mv[METHOD_CROSS](v);
//            mv.x  = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
//            mv.y  = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
//            mv.z  = extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
              mv.xy = 0;
              mv.yz = 0;
              mv.zx = 0;
              mv.xyz = 0;
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CROSS);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CROSS);
            });
          }, METHOD_CROSS, []));
        }
        case METHOD_DOT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_DOT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, vPy) {
              var v  = Sk.ffi.remapToJs(vPy);
              return Sk.builtin.assk$(mv[METHOD_DOT](v), Sk.builtin.nmber.float$);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_DOT);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_DOT);
            });
          }, METHOD_DOT, []));
        }
        case METHOD_SET_X: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_X;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, x) {
              x  = Sk.ffi.remapToJs(x);
              mv[METHOD_SET_X](x);
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_X);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_X);
            });
          }, METHOD_SET_X, []));
        }
        case METHOD_SET_Y: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_Y;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, y) {
              y  = Sk.ffi.remapToJs(y);
              mv[METHOD_SET_Y](y);
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Y);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Y);
            });
          }, METHOD_SET_Y, []));
        }
        case METHOD_SET_Z: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_Z;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, z) {
              z  = Sk.ffi.remapToJs(z);
              mv[METHOD_SET_Z](z);
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Z);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_Z);
            });
          }, METHOD_SET_Z, []));
        }
        case METHOD_GET_COMPONENT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GET_COMPONENT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, index) {
              index  = Sk.ffi.remapToJs(index);
              return Sk.builtin.assk$(mv[METHOD_GET_COMPONENT](index), Sk.builtin.nmber.float$);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_COMPONENT);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_COMPONENT);
            });
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
              mv[METHOD_SET_COMPONENT](index, value);
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_COMPONENT);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_COMPONENT);
            });
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
              mv[METHOD_SET](x, y, z);
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET);
            });
          }, METHOD_SET, []));
        }
        case METHOD_CLONE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_CLONE;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              return remapE3ToPy(mv.w, mv.x, mv.y, mv.z, mv.xy, mv.yz, mv.zx, mv.xyz);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CLONE);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CLONE);
            });
          }, METHOD_CLONE, []));
        }
        case METHOD_LENGTH: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_LENGTH;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              return Sk.builtin.assk$(mv[METHOD_LENGTH](), Sk.builtin.nmber.float$);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_LENGTH);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_LENGTH);
            });
          }, METHOD_LENGTH, []));
        }
        case METHOD_NORMALIZE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_NORMALIZE;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              mv[METHOD_NORMALIZE]();
              return mvPy;
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_NORMALIZE);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_NORMALIZE);
            });
          }, METHOD_NORMALIZE, []));
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(mv, name, value) {
      mv = Sk.ffi.remapToJs(mv);
      value = Sk.ffi.remapToJs(value);
      switch(name) {
        case PROP_W: {
          mv.w = value;
        }
        break;
        case PROP_X: {
          mv.x = value;
        }
        break;
        case PROP_Y: {
          mv.y = value;
        }
        break;
        case PROP_Z: {
          mv.z = value;
        }
        break;
        case PROP_XY: {
          mv.xy = value;
        }
        break;
        case PROP_YZ: {
          mv.yz = value;
        }
        break;
        case PROP_ZX: {
          mv.zx = value;
        }
        break;
        case PROP_XYZ: {
          mv.xyz = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not an attribute of " + EUCLIDEAN_3);
        }
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(m) {
      m = Sk.ffi.remapToJs(m);
      var grade0 = m.w !== 0;
      var grade1 = m.x !== 0 || m.y != 0 || m.z !== 0;
      var grade2 = m.xy !== 0 || m.yz !== 0 || m.zx !== 0;
      var grade3 = m.xyz !== 0;
      if (grade0 && !grade1 && !grade2 && !grade3) {
        var args = [m.w];
        return new Sk.builtin.str(SCALAR_3 + "(" + args.join(", ") + ")");
      }
      else if (!grade0 && grade1 && !grade2 && !grade3) {
        var args = [m.x, m.y, m.z];
        return new Sk.builtin.str(VECTOR_3 + "(" + args.join(", ") + ")");
      }
      else if (!grade0 && !grade1 && grade2 && !grade3) {
        var args = [m.xy, m.yz, m.zx];
        return new Sk.builtin.str(BIVECTOR_3 + "(" + args.join(", ") + ")");
      }
      else if (!grade0 && !grade1 && !grade2 && grade3) {
        var args = [m.xyz];
        return new Sk.builtin.str(PSEUDOSCALAR_3 + "(" + args.join(", ") + ")");
      }
      else {
        var args = [m.w, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.xyz];
        return new Sk.builtin.str(EUCLIDEAN_3 + "(" + args.join(", ") + ")");
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      if (isDefined(mv)) {
        return new Sk.builtin.str(stringFromCoordinates([mv.w, mv.x, mv.y, mv.z, mv.xy, mv.yz, mv.zx, mv.xyz], ["1", "i", "j", "k", "ij", "jk", "ki", "I"]));
      }
      else {
        return new Sk.builtin.str("<type '" + EUCLIDEAN_3 + "'>");
      }
    });
  }, EUCLIDEAN_3, []);
};
