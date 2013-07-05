var THREE = {};

THREE.Vector3 = function (x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};

THREE.Vector3.prototype = {
    cross: function ( v, w ) {
    if ( w !== undefined ) {
      console.warn("DEPRECATED: Vector3's .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.");
      return this.crossVectors(v, w);
    }
    var x = this.x, y = this.y, z = this.z;
    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;
    return this;
  },
  dot: function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
};
