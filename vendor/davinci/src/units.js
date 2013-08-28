/**
 * Convenience function for incorporating units into a module.
 *
 * Usage:
 *
 * Sk.builtin.defineUnits(mod);
 */
(function() {
this.BLADE = this.BLADE || {};
var BLADE = this.BLADE;
Sk.builtin.defineUnits = function(mod) {

  var DIMENSIONS = "Dimensions";
  var MEASURE    = "Measure";
  var RATIONAL   = "Rational";
  var UNIT       = "Unit";
  var VARIANT    = "Variant";

  var PROP_QUANTITY   = "quantity";
  var PROP_UOM        = "uom";
  var PROP_SCALE      = "scale";
  var PROP_DIMENSIONS = "dimensions";
  var PROP_LABELS     = "labels";
  var PROP_M          = "M";
  var PROP_L          = "L";
  var PROP_T          = "T";
  var PROP_C          = "C";

  var KILOGRAM   = "kilogram";
  var METER      = "meter";
  var SECOND     = "second";
  var COULOMB    = "coulomb";
  var SI_LABELS  = ["kg", "m", "s", "C"];
  var NEWTON     = "newton";
  var JOULE      = "joule";
  var WATT       = "watt";

  mod[RATIONAL] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, numer, denom) {
      self.tp$name = RATIONAL;
      if (typeof denom === 'undefined') {
        Sk.builtin.pyCheckArgs(RATIONAL, arguments, 2, 2);
        Sk.builtin.pyCheckType("numer", RATIONAL, numer.tp$name === RATIONAL);
        self.v = Sk.ffi.remapToJs(numer);
      }
      else {
        Sk.builtin.pyCheckArgs(RATIONAL, arguments, 3, 3);
        Sk.builtin.pyCheckType("numer", "int", Sk.builtin.checkInt(numer));
        Sk.builtin.pyCheckType("denom", "int", Sk.builtin.checkInt(denom));
        self.v = new BLADE.Rational(Sk.ffi.remapToJs(numer), Sk.ffi.remapToJs(denom));
      }
    });
    $loc.__add__ = new Sk.builtin.func(function(aPy, bPy) {
      Sk.builtin.pyCheckArgs("+", arguments, 2, 2);
      Sk.builtin.pyCheckType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.add(b), RATIONAL));
    });
    $loc.__sub__ = new Sk.builtin.func(function(aPy, bPy) {
      Sk.builtin.pyCheckArgs("+", arguments, 2, 2);
      Sk.builtin.pyCheckType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.sub(b), RATIONAL));
    });
    $loc.__mul__ = new Sk.builtin.func(function(aPy, bPy) {
      Sk.builtin.pyCheckArgs("+", arguments, 2, 2);
      Sk.builtin.pyCheckType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      if (typeof b === 'number') {
        Sk.builtin.pyCheckType("rhs", "int", Sk.builtin.checkInt(bPy));
        numer = a.numer * b;
        denom = a.denom;
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.numberToIntPy(numer), Sk.ffi.numberToIntPy(denom));
      }
      else {
        Sk.builtin.pyCheckType("rhs", RATIONAL, bPy.tp$name === RATIONAL);
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.mul(b), RATIONAL));
      }
    });
    $loc.__div__ = new Sk.builtin.func(function(aPy, bPy) {
      Sk.builtin.pyCheckArgs("+", arguments, 2, 2);
      Sk.builtin.pyCheckType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      if (typeof b === 'number') {
        Sk.builtin.pyCheckType("rhs", "int", Sk.builtin.checkInt(bPy));
        numer = a.numer;
        denom = a.denom * b;
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.numberToIntPy(numer), Sk.ffi.numberToIntPy(denom));
      }
      else {
        Sk.builtin.pyCheckType("rhs", RATIONAL, bPy.tp$name === RATIONAL);
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.div(b), RATIONAL));
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(rationalPy) {
      var rational = Sk.ffi.remapToJs(rationalPy);
      return Sk.ffi.remapToPy(RATIONAL + "(" + rational.numer + "," + rational.denom + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(rationalPy) {
      var rational = Sk.ffi.remapToJs(rationalPy);
      return Sk.ffi.remapToPy("" + rational);
    });
  }, RATIONAL, []);
  
  mod[DIMENSIONS] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, M, L, T) {
      Sk.builtin.pyCheckArgs(MEASURE, arguments, 2, 4);
      Sk.builtin.pyCheckType("M", [RATIONAL, DIMENSIONS].join(" or "), Sk.ffi.typeofPy(M) === Sk.ffi.PY_TYPE_REFERENCE);
      self.tp$name = DIMENSIONS;
      switch(Sk.ffi.typeName(M)) {
        case RATIONAL: {
          self.v = new BLADE.Dimensions(Sk.ffi.remapToJs(M), Sk.ffi.remapToJs(L), Sk.ffi.remapToJs(T));
        }
        break;
        case DIMENSIONS: {
          self.v = Sk.ffi.remapToJs(M);
        }
        break;
        default: {
          Sk.builtin.pyCheckType("M", [RATIONAL, DIMENSIONS].join(" or "), false);
        }
      }
    });
    $loc.__getattr__ = new Sk.builtin.func(function(dimensionsPy, name) {
      var dimensions = Sk.ffi.remapToJs(dimensionsPy);
      switch(name) {
        case PROP_M: {
          return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_M], RATIONAL));
        }
        break;
        case PROP_L: {
          return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_L], RATIONAL));
        }
        break;
        case PROP_T: {
          return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_T], RATIONAL));
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a readable attribute of " + DIMENSIONS);
        }
      }
    });
    $loc.__mul__ = new Sk.builtin.func(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var c = a.mul(b);
      return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(c.M, RATIONAL), Sk.ffi.remapToPy(c.L, RATIONAL), Sk.ffi.remapToPy(c.T, RATIONAL));
    });
    $loc.__div__ = new Sk.builtin.func(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var c = a.div(b);
      return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(c.M, RATIONAL), Sk.ffi.remapToPy(c.L, RATIONAL), Sk.ffi.remapToPy(c.T, RATIONAL));
    });
    $loc.__pow__ = new Sk.builtin.func(function(basePy, exponentPy) {
      Sk.builtin.pyCheckArgs("**", arguments, 2, 2);
      var base = Sk.ffi.remapToJs(basePy);
      var exponent = Sk.ffi.remapToJs(exponentPy);
      var x = base.pow(exponent);
      return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(x.M, RATIONAL), Sk.ffi.remapToPy(x.L, RATIONAL), Sk.ffi.remapToPy(x.T, RATIONAL));
    });
    $loc.__str__ = new Sk.builtin.func(function(dimensionsPy) {
      var dimensions = Sk.ffi.remapToJs(dimensionsPy);
      return Sk.ffi.remapToPy("" + dimensions);
    });
    $loc.__repr__ = new Sk.builtin.func(function(dimensionsPy) {
      var names = [PROP_M, PROP_L, PROP_T];
      var attrs = names.map(function(name) { return Sk.abstr.gattr(dimensionsPy, name); });
      var reprs = attrs.map(function(attr) { return Sk.ffi.remapToJs(Sk.misceval.callsim(attr["__repr__"], attr)); });
      return Sk.ffi.remapToPy(DIMENSIONS + "(" + reprs.join(" , ")  + ")");
    });
  }, DIMENSIONS, []);

  mod[UNIT] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, variantPy, dimensions, labels) {
      self.tp$name = UNIT;
      Sk.builtin.pyCheckArgs(UNIT, arguments, 2, 4);
      switch(Sk.ffi.typeofPy(variantPy)) {
        case Sk.ffi.PY_TYPE_FLOAT: {
          Sk.builtin.pyCheckArgs(UNIT, arguments, 4, 4);
          self.v = new BLADE.Unit(Sk.ffi.remapToJs(variantPy), Sk.ffi.remapToJs(dimensions), Sk.ffi.remapToJs(labels));
        }
        break;
        case Sk.ffi.PY_TYPE_REFERENCE: {
          Sk.builtin.pyCheckArgs(UNIT, arguments, 2, 2);
          self.v = Sk.ffi.remapToJs(variantPy);
        }
        break;
        default: {
          throw new Error(UNIT + " (__init__) " + Sk.ffi.typeofPy(variantPy));
        }
      }
    });
    $loc.__getattr__ = new Sk.builtin.func(function(unitPy, name) {
      var unit = Sk.ffi.remapToJs(unitPy);
      switch(name) {
        case PROP_SCALE: {
          return Sk.ffi.remapToPy(unit[PROP_SCALE]);
        }
        break;
        case PROP_DIMENSIONS: {
          return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(unit[PROP_DIMENSIONS], DIMENSIONS));
        }
        break;
        case PROP_LABELS: {
          return Sk.ffi.remapToPy(unit[PROP_LABELS]);
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a readable attribute of " + UNIT);
        }
      }
    });
    $loc.__mul__ = new Sk.builtin.func(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.mul(rhs);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__rmul__ = new Sk.builtin.func(function(rhsPy, lhsPy) {
      Sk.builtin.pyCheckType("lhs", "number", Sk.builtin.checkNumber(lhsPy));
      Sk.builtin.pyCheckType("rhs", UNIT, rhsPy.tp$name === UNIT);
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(lhs * rhs.scale), Sk.ffi.remapToPy(rhs.dimensions, DIMENSIONS), Sk.ffi.remapToPy(rhs.labels));
    });
    $loc.__div__ = new Sk.builtin.func(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.div(rhs);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__pow__ = new Sk.builtin.func(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.pow(rhs);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__str__ = new Sk.builtin.func(function(unitPy) {
      var unit = Sk.ffi.remapToJs(unitPy);
      return Sk.ffi.remapToPy("" + unit);
    });
    $loc.__repr__ = new Sk.builtin.func(function(unitPy) {
      var props = [{"name":PROP_DIMENSIONS,"kind":"__repr__"}];
      var attrs = props.map(function(prop) { return {"value": Sk.abstr.gattr(unitPy, prop.name), "prop":prop}; });
      var reprs = attrs.map(function(attr) { return Sk.ffi.remapToJs(Sk.misceval.callsim(attr.value[attr.prop.kind], attr.value)); });
      var unit = Sk.ffi.remapToJs(unitPy);
      var scale = "" + unit.scale;
      var dimensions = reprs[0];
      var labels = "[" + unit.labels.map(function(label) {return "'" + label + "'";}).join(" , ") + "]";
      return Sk.ffi.remapToPy(UNIT + "(" + [scale, dimensions, labels].join(" , ") + ")");
    });
  }, UNIT, []);

  mod[MEASURE] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, quantityPy, unitPy) {
      Sk.builtin.pyCheckArgs(MEASURE, arguments, 2, 3);
      Sk.builtin.pyCheckType("quantityPy", ["Reference", MEASURE].join(" or "), Sk.ffi.typeofPy(quantityPy) === Sk.ffi.PY_TYPE_REFERENCE);
      if (Sk.ffi.typeName(quantityPy) === MEASURE)
      {
        // TODO: Notice that remapToJs could/should return the tuple. 
        self.tp$name = MEASURE;
        self.v = Sk.ffi.remapToJs(quantityPy);
        self.custom =  quantityPy.custom;
      }
      else
      {
        self.tp$name = MEASURE;
        self.v = new BLADE.Measure(Sk.ffi.remapToJs(quantityPy), Sk.ffi.remapToJs(unitPy));
        self.custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      }
    });
    $loc.__getattr__ = new Sk.builtin.func(function(measurePy, name) {
      var measure = Sk.ffi.remapToJs(measurePy);
      switch(name) {
        case PROP_QUANTITY: {
          return Sk.misceval.callsim(mod[measurePy.custom[PROP_QUANTITY]], Sk.ffi.remapToPy(measure[PROP_QUANTITY], measurePy.custom[PROP_QUANTITY]));
        }
        break;
        case PROP_UOM: {
          return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(measure[PROP_UOM], UNIT));
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a readable attribute of " + MEASURE);
        }
      }
    });
    $loc.__mul__ = new Sk.builtin.func(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.abstr.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      return Sk.misceval.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.mul(b), MEASURE, custom));
    });
    $loc.__div__ = new Sk.builtin.func(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.abstr.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      return Sk.misceval.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.div(b), MEASURE, custom));
    });
    $loc.__str__ = new Sk.builtin.func(function(measurePy) {
      var measure = Sk.ffi.remapToJs(measurePy);
      return Sk.ffi.remapToPy("" + measure);
    });
    $loc.__repr__ = new Sk.builtin.func(function(measurePy) {
      var measure = Sk.ffi.remapToJs(measurePy);
      var quantityPy = Sk.abstr.gattr(measurePy, PROP_QUANTITY);
      var quantityRepr = Sk.ffi.remapToJs(Sk.misceval.callsim(quantityPy["__repr__"], quantityPy));
      var uomPy = Sk.abstr.gattr(measurePy, PROP_UOM);
      var uomRepr = Sk.ffi.remapToJs(Sk.misceval.callsim(uomPy["__repr__"], uomPy));
      return Sk.ffi.remapToPy(MEASURE + "(" + quantityRepr + ", " + uomRepr + ")");
    });
  }, MEASURE, []);

  mod[VARIANT] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, variantPy) {
      Sk.builtin.pyCheckArgs(VARIANT, arguments, 2, 2);
      Sk.builtin.pyCheckType("variantPy", VARIANT, Sk.ffi.typeofPy(variantPy) === Sk.ffi.PY_TYPE_REFERENCE);
      self.tp$name = VARIANT;
      self.v = Sk.ffi.remapToJs(variantPy);
    });
    $loc.__str__ = new Sk.builtin.func(function(variantPy) {
      var variantJs = Sk.ffi.remapToJs(variantPy);
      return Sk.ffi.remapToPy("" + variantJs);
    });
    $loc.__repr__ = new Sk.builtin.func(function(variantPy) {
      var variantJs = Sk.ffi.remapToJs(variantPy);
      return Sk.ffi.remapToPy(VARIANT + "(" + variantJs + ")");
    });
  }, VARIANT, []);

  mod[KILOGRAM] = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 0, 0),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[METER]    = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 1, 0),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[SECOND]   = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 0, 1),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[NEWTON]   = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 1, -2), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[JOULE]    = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 2, -2), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[WATT]     = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 2, -3), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
};
}).call(this);
