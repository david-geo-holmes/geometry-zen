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

  var DIMENSIONS      = "Dimensions";
  var MEASURE         = "Measure";
  var RATIONAL        = "Rational";
  var UNIT            = "Unit";

  var PROP_QUANTITY   = "quantity";
  var PROP_UOM        = "uom";
  var PROP_SCALE      = "scale";
  var PROP_DIMENSIONS = "dimensions";
  var PROP_LABELS     = "labels";
  var PROP_M          = "M";
  var PROP_L          = "L";
  var PROP_T          = "T";
  var PROP_C          = "C";

  var KILOGRAM        = "kilogram";
  var METER           = "meter";
  var SECOND          = "second";
  var COULOMB         = "coulomb";
  var SI_LABELS       = ["kg", "m", "s", "C"];
  var NEWTON          = "newton";
  var JOULE           = "joule";
  var WATT            = "watt";

  mod[RATIONAL] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.defineFunction(function(self, numer, denom) {
      self.tp$name = RATIONAL;
      if (typeof denom === 'undefined') {
        Sk.ffi.checkArgCount(RATIONAL, arguments, 2, 2);
        Sk.ffi.checkArgType("numer", RATIONAL, numer.tp$name === RATIONAL);
        self.v = Sk.ffi.remapToJs(numer);
      }
      else {
        Sk.ffi.checkArgCount(RATIONAL, arguments, 3, 3);
        Sk.ffi.checkArgType("numer", "<type 'int'>", Sk.ffi.isInt(numer));
        Sk.ffi.checkArgType("denom", "<type 'int'>", Sk.ffi.isInt(denom));
        self.v = new BLADE.Rational(Sk.ffi.remapToJs(numer), Sk.ffi.remapToJs(denom));
      }
    });
    $loc.__add__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      Sk.ffi.checkArgCount("+", arguments, 2, 2);
      Sk.ffi.checkArgType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.add(b), RATIONAL));
    });
    $loc.__sub__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      Sk.ffi.checkArgCount("+", arguments, 2, 2);
      Sk.ffi.checkArgType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.sub(b), RATIONAL));
    });
    $loc.__mul__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      Sk.ffi.checkArgCount("+", arguments, 2, 2);
      Sk.ffi.checkArgType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      if (typeof b === 'number') {
        Sk.ffi.checkArgType("rhs", "<type 'int'>", Sk.ffi.isInt(bPy));
        numer = a.numer * b;
        denom = a.denom;
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.numberToIntPy(numer), Sk.ffi.numberToIntPy(denom));
      }
      else {
        Sk.ffi.checkArgType("rhs", RATIONAL, bPy.tp$name === RATIONAL);
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.mul(b), RATIONAL));
      }
    });
    $loc.__div__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      Sk.ffi.checkArgCount("+", arguments, 2, 2);
      Sk.ffi.checkArgType("lhs", RATIONAL, aPy.tp$name === RATIONAL);
      var numer, denom;
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      if (typeof b === 'number') {
        Sk.ffi.checkArgType("rhs", "<type 'int'>", Sk.ffi.isInt(bPy));
        numer = a.numer;
        denom = a.denom * b;
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.numberToIntPy(numer), Sk.ffi.numberToIntPy(denom));
      }
      else {
        Sk.ffi.checkArgType("rhs", RATIONAL, bPy.tp$name === RATIONAL);
        return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(a.div(b), RATIONAL));
      }
    });
    $loc.__repr__ = Sk.ffi.defineFunction(function(rationalPy) {
      var rational = Sk.ffi.remapToJs(rationalPy);
      return Sk.ffi.remapToPy(RATIONAL + "(" + rational.numer + "," + rational.denom + ")");
    });
    $loc.__str__ = Sk.ffi.defineFunction(function(rationalPy) {
      var rational = Sk.ffi.remapToJs(rationalPy);
      return Sk.ffi.remapToPy("" + rational);
    });
  }, RATIONAL, []);
  
  mod[DIMENSIONS] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.defineFunction(function(self, M, L, T) {
      Sk.ffi.checkArgCount(MEASURE, arguments, 2, 4);
      Sk.ffi.checkArgType("M", [RATIONAL, DIMENSIONS].join(" or "), Sk.ffi.isReferencePy(M));
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
          Sk.ffi.checkArgType("M", [RATIONAL, DIMENSIONS].join(" or "), false);
        }
      }
    });
    $loc.__getattr__ = Sk.ffi.defineFunction(function(dimensionsPy, name) {
      var dimensions = Sk.ffi.remapToJs(dimensionsPy);
      switch(name) {
        case PROP_M: {
          return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_M], RATIONAL));
        }
        case PROP_L: {
          return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_L], RATIONAL));
        }
        case PROP_T: {
          return Sk.misceval.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_T], RATIONAL));
        }
      }
    });
    $loc.__mul__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var c = a.mul(b);
      return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(c.M, RATIONAL), Sk.ffi.remapToPy(c.L, RATIONAL), Sk.ffi.remapToPy(c.T, RATIONAL));
    });
    $loc.__div__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var c = a.div(b);
      return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(c.M, RATIONAL), Sk.ffi.remapToPy(c.L, RATIONAL), Sk.ffi.remapToPy(c.T, RATIONAL));
    });
    $loc.__pow__ = Sk.ffi.defineFunction(function(basePy, exponentPy) {
      Sk.ffi.checkArgCount("**", arguments, 2, 2);
      var base = Sk.ffi.remapToJs(basePy);
      var exponent = Sk.ffi.remapToJs(exponentPy);
      var x = base.pow(exponent);
      return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(x.M, RATIONAL), Sk.ffi.remapToPy(x.L, RATIONAL), Sk.ffi.remapToPy(x.T, RATIONAL));
    });
    $loc.__str__ = Sk.ffi.defineFunction(function(dimensionsPy) {
      var dimensions = Sk.ffi.remapToJs(dimensionsPy);
      return Sk.ffi.remapToPy("" + dimensions);
    });
    $loc.__repr__ = Sk.ffi.defineFunction(function(dimensionsPy) {
      var names = [PROP_M, PROP_L, PROP_T];
      var attrs = names.map(function(name) { return Sk.abstr.gattr(dimensionsPy, name); });
      var reprs = attrs.map(function(attr) { return Sk.ffi.remapToJs(Sk.misceval.callsim(attr["__repr__"], attr)); });
      return Sk.ffi.remapToPy(DIMENSIONS + "(" + reprs.join(" , ")  + ")");
    });
  }, DIMENSIONS, []);

  mod[UNIT] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.defineFunction(function(self, scalePy, dimensionsPy, labelsPy) {
      self.tp$name = UNIT;
      Sk.ffi.checkArgCount(UNIT, arguments, 2, 4);
      switch(Sk.ffi.getType(scalePy)) {
        case Sk.ffi.PyType.FLOAT: {
          Sk.ffi.checkArgCount(UNIT, arguments, 4, 4);
          self.v = new BLADE.Unit(Sk.ffi.remapToJs(scalePy), Sk.ffi.remapToJs(dimensionsPy), Sk.ffi.remapToJs(labelsPy));
        }
        break;
        case Sk.ffi.PyType.REFERENCE: {
          Sk.ffi.checkArgCount(UNIT, arguments, 2, 2);
          self.v = Sk.ffi.remapToJs(scalePy);
        }
        break;
        default: {
          throw new Error(UNIT + " (__init__) " + Sk.ffi.getType(scalePy));
        }
      }
    });
    $loc.__getattr__ = Sk.ffi.defineFunction(function(unitPy, name) {
      var unit = Sk.ffi.remapToJs(unitPy);
      switch(name) {
        case PROP_SCALE: {
          return Sk.ffi.remapToPy(unit[PROP_SCALE]);
        }
        case PROP_DIMENSIONS: {
          return Sk.misceval.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(unit[PROP_DIMENSIONS], DIMENSIONS));
        }
        case PROP_LABELS: {
          return Sk.ffi.remapToPy(unit[PROP_LABELS]);
        }
      }
    });
    $loc.__mul__ = Sk.ffi.defineFunction(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.mul(rhs);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__rmul__ = Sk.ffi.defineFunction(function(rhsPy, lhsPy) {
      Sk.ffi.checkArgType("lhs", "Number", Sk.ffi.isNumber(lhsPy));
      Sk.ffi.checkArgType("rhs", UNIT, rhsPy.tp$name === UNIT);
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(lhs * rhs.scale), Sk.ffi.remapToPy(rhs.dimensions, DIMENSIONS), Sk.ffi.remapToPy(rhs.labels));
    });
    $loc.__div__ = Sk.ffi.defineFunction(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.div(rhs);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__pow__ = Sk.ffi.defineFunction(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.pow(rhs);
      return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__str__ = Sk.ffi.defineFunction(function(unitPy) {
      var unit = Sk.ffi.remapToJs(unitPy);
      return Sk.ffi.remapToPy("" + unit);
    });
    $loc.__repr__ = Sk.ffi.defineFunction(function(unitPy) {
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

  mod[MEASURE] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.defineFunction(function(self, quantityPy, unitPy) {
      Sk.ffi.checkArgCount(MEASURE, arguments, 2, 3);
      Sk.ffi.checkArgType("quantityPy", ["Reference", MEASURE].join(" or "), Sk.ffi.isReferencePy(quantityPy));
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
    $loc.__getattr__ = Sk.ffi.defineFunction(function(measurePy, name) {
      var measure = Sk.ffi.remapToJs(measurePy);
      switch(name) {
        case PROP_QUANTITY: {
          return Sk.misceval.callsim(mod[measurePy.custom[PROP_QUANTITY]], Sk.ffi.remapToPy(measure[PROP_QUANTITY], measurePy.custom[PROP_QUANTITY]));
        }
        case PROP_UOM: {
          return Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(measure[PROP_UOM], UNIT));
        }
      }
    });
    $loc.__mul__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.abstr.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      return Sk.misceval.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.mul(b), MEASURE, custom));
    });
    $loc.__div__ = Sk.ffi.defineFunction(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.abstr.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      return Sk.misceval.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.div(b), MEASURE, custom));
    });
    $loc.__str__ = Sk.ffi.defineFunction(function(measurePy) {
      var quantityPy = Sk.abstr.gattr(measurePy, PROP_QUANTITY);
      var quantityStr = Sk.ffi.remapToJs(Sk.misceval.callsim(quantityPy["__str__"], quantityPy));
      var uomPy = Sk.abstr.gattr(measurePy, PROP_UOM);
      var uomStr = Sk.ffi.remapToJs(Sk.misceval.callsim(uomPy["__str__"], uomPy));
      return Sk.ffi.remapToPy("" + quantityStr + " " + uomStr);
    });
    $loc.__repr__ = Sk.ffi.defineFunction(function(measurePy) {
      var quantityPy = Sk.abstr.gattr(measurePy, PROP_QUANTITY);
      var quantityRepr = Sk.ffi.remapToJs(Sk.misceval.callsim(quantityPy["__repr__"], quantityPy));

      var uomPy = Sk.abstr.gattr(measurePy, PROP_UOM);
      var uomRepr = Sk.ffi.remapToJs(Sk.misceval.callsim(uomPy["__repr__"], uomPy));

      return Sk.ffi.remapToPy(MEASURE + "(" + quantityRepr + ", " + uomRepr + ")");
    });
  }, MEASURE, []);

  mod[KILOGRAM] = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 0, 0),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[METER]    = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 1, 0),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[SECOND]   = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 0, 1),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[NEWTON]   = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 1, -2), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[JOULE]    = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 2, -2), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[WATT]     = Sk.misceval.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 2, -3), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
};
}).call(this);
