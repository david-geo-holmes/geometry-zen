/**
 * Convenience function for incorporating units into a module.
 *
 * Usage:
 *
 * Sk.builtin.defineUnits(mod);
 */
(function() {

this.BLADE = this.BLADE || {};
var  BLADE = this.BLADE;

Sk.builtin.defineUnits = function(mod) {

  var DIMENSIONS       = "Dimensions";
  var MEASURE          = "Measure";
  var RATIONAL         = "Rational";
  var UNIT             = "Unit";
  var INT              = "int";
  var NUMBER           = "Number";

  var PROP_QUANTITY    = "quantity";
  var PROP_UOM         = "uom";
  var PROP_SCALE       = "scale";
  var PROP_DIMENSIONS  = "dimensions";
  var PROP_LABELS      = "labels";
  var PROP_M           = "M";
  var PROP_L           = "L";
  var PROP_T           = "T";
  var PROP_Q           = "Q";

  var KILOGRAM         = "kilogram";
  var METER            = "meter";
  var SECOND           = "second";
  var COULOMB          = "coulomb";
  var SI_LABELS        = ["kg", "m", "s", "C"];
  var NEWTON           = "newton";
  var JOULE            = "joule";
  var WATT             = "watt";
  var AMPERE           = "ampere";
  var VOLT             = "volt";
  var TESLA            = "tesla";

  var isUnit = function(valuePy) {
    return Sk.ffi.isObjectRef(valuePy) && Sk.ffi.typeName(valuePy) === UNIT;
  }

  Sk.builtin.defineFractions(mod, RATIONAL, function(n, d) {return new BLADE.Rational(n, d)});

  mod[DIMENSIONS] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, M, L, T, Q) {
      Sk.ffi.checkMethodArgs(MEASURE, arguments, 1, 4);
      Sk.ffi.checkArgType("M", [RATIONAL, DIMENSIONS].join(" or "), Sk.ffi.isReference(M));
      switch(Sk.ffi.typeName(M)) {
        case RATIONAL: {
          Sk.ffi.referenceToPy(new BLADE.Dimensions(Sk.ffi.remapToJs(M), Sk.ffi.remapToJs(L), Sk.ffi.remapToJs(T), Sk.ffi.remapToJs(Q)), DIMENSIONS, undefined, selfPy);
        }
        break;
        case DIMENSIONS: {
          Sk.ffi.referenceToPy(Sk.ffi.remapToJs(M), DIMENSIONS, undefined, selfPy);
        }
        break;
        default: {
          Sk.ffi.checkArgType("M", [RATIONAL, DIMENSIONS].join(" or "), false);
        }
      }
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(dimensionsPy, name) {
      var dimensions = Sk.ffi.remapToJs(dimensionsPy);
      switch(name) {
        case PROP_M: {
          return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_M], RATIONAL));
        }
        case PROP_L: {
          return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_L], RATIONAL));
        }
        case PROP_T: {
          return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_T], RATIONAL));
        }
        case PROP_Q: {
          return Sk.ffi.callsim(mod[RATIONAL], Sk.ffi.remapToPy(dimensions[PROP_Q], RATIONAL));
        }
      }
    });
    $loc.__mul__ = Sk.ffi.functionPy(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var c = a.mul(b);
      return Sk.ffi.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(c.M, RATIONAL), Sk.ffi.remapToPy(c.L, RATIONAL), Sk.ffi.remapToPy(c.T, RATIONAL), Sk.ffi.remapToPy(c.Q, RATIONAL));
    });
    $loc.__div__ = Sk.ffi.functionPy(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var c = a.div(b);
      return Sk.ffi.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(c.M, RATIONAL), Sk.ffi.remapToPy(c.L, RATIONAL), Sk.ffi.remapToPy(c.T, RATIONAL, Sk.ffi.remapToPy(c.Q, RATIONAL)));
    });
    $loc.__pow__ = Sk.ffi.functionPy(function(basePy, exponentPy) {
      Sk.ffi.checkFunctionArgs("**", arguments, 2, 2);
      var base = Sk.ffi.remapToJs(basePy);
      var exponent = Sk.ffi.remapToJs(exponentPy);
      var x = base.pow(exponent);
      return Sk.ffi.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(x.M, RATIONAL), Sk.ffi.remapToPy(x.L, RATIONAL), Sk.ffi.remapToPy(x.T, RATIONAL, Sk.ffi.remapToPy(x.Q, RATIONAL)));
    });
    $loc.__str__ = Sk.ffi.functionPy(function(dimensionsPy) {
      var dimensions = Sk.ffi.remapToJs(dimensionsPy);
      return Sk.ffi.remapToPy("" + dimensions);
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(dimensionsPy) {
      var names = [PROP_M, PROP_L, PROP_T, PROP_Q];
      var attrs = names.map(function(name) { return Sk.ffi.gattr(dimensionsPy, name); });
      var reprs = attrs.map(function(attr) { return Sk.ffi.remapToJs(Sk.ffi.callsim(attr["__repr__"], attr)); });
      return Sk.ffi.remapToPy(DIMENSIONS + "(" + reprs.join(" , ")  + ")");
    });
  }, DIMENSIONS, []);

  mod[UNIT] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, scalePy, dimensionsPy, labelsPy) {
      Sk.ffi.checkMethodArgs(UNIT, arguments, 1, 3);
      switch(Sk.ffi.getType(scalePy)) {
        case Sk.ffi.PyType.FLOAT:
        case Sk.ffi.PyType.INT:
        case Sk.ffi.PyType.LONG: {
          Sk.ffi.checkMethodArgs(UNIT, arguments, 3, 3);
          var scale = Sk.ffi.remapToJs(scalePy);
          var dimensions = Sk.ffi.remapToJs(dimensionsPy);
          var labels = Sk.ffi.remapToJs(labelsPy);
          Sk.ffi.referenceToPy(new BLADE.Unit(scale, dimensions, labels), UNIT, undefined, selfPy);
        }
        break;
        case Sk.ffi.PyType.OBJREF: {
          Sk.ffi.checkMethodArgs(UNIT, arguments, 1, 1);
          Sk.ffi.referenceToPy(Sk.ffi.remapToJs(scalePy), UNIT, undefined, selfPy);
        }
        break;
        default: {
          throw new Error(UNIT + " (__init__) " + Sk.ffi.getType(scalePy));
        }
      }
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(unitPy, name) {
      var unit = Sk.ffi.remapToJs(unitPy);
      switch(name) {
        case PROP_SCALE: {
          return Sk.ffi.remapToPy(unit[PROP_SCALE]);
        }
        case PROP_DIMENSIONS: {
          return Sk.ffi.callsim(mod[DIMENSIONS], Sk.ffi.remapToPy(unit[PROP_DIMENSIONS], DIMENSIONS));
        }
        case PROP_LABELS: {
          return Sk.ffi.remapToPy(unit[PROP_LABELS]);
        }
      }
    });
    $loc.__add__ = Sk.ffi.functionPy(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      try {
        var c = lhs.add(rhs);
        return Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
      }
      catch(e) {
        throw Sk.ffi.assertionError(e.message)
      }
    });
    $loc.__mul__ = Sk.ffi.functionPy(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.mul(rhs);
      return Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__rmul__ = Sk.ffi.functionPy(function(selfPy, otherPy) {
      Sk.ffi.checkArgType("other", NUMBER, Sk.ffi.isNumber(otherPy));
      Sk.ffi.checkArgType("self",  UNIT, isUnit(selfPy));
      var lhs = Sk.ffi.remapToJs(otherPy);
      var rhs = Sk.ffi.remapToJs(selfPy);
      return Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(lhs * rhs.scale), Sk.ffi.remapToPy(rhs.dimensions, DIMENSIONS), Sk.ffi.remapToPy(rhs.labels));
    });
    $loc.__div__ = Sk.ffi.functionPy(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.div(rhs);
      return Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__pow__ = Sk.ffi.functionPy(function(lhsPy, rhsPy) {
      var lhs = Sk.ffi.remapToJs(lhsPy);
      var rhs = Sk.ffi.remapToJs(rhsPy);
      var c = lhs.pow(rhs);
      return Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(c.scale), Sk.ffi.remapToPy(c.dimensions, DIMENSIONS), Sk.ffi.remapToPy(c.labels));
    });
    $loc.__str__ = Sk.ffi.functionPy(function(unitPy) {
      var unit = Sk.ffi.remapToJs(unitPy);
      return Sk.ffi.remapToPy("" + unit);
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(unitPy) {
      var props = [{"name":PROP_DIMENSIONS, "kind":"__repr__"}];
      var attrs = props.map(function(prop) { return {"value": Sk.ffi.gattr(unitPy, prop.name), "prop":prop}; });
      var reprs = attrs.map(function(attr) { return Sk.ffi.remapToJs(Sk.ffi.callsim(attr.value[attr.prop.kind], attr.value)); });
      var unit = Sk.ffi.remapToJs(unitPy);
      var scale = "" + unit.scale;
      var dimensions = reprs[0];
      var labels = "[" + unit.labels.map(function(label) {return "'" + label + "'";}).join(" , ") + "]";
      return Sk.ffi.remapToPy(UNIT + "(" + [scale, dimensions, labels].join(" , ") + ")");
    });
  }, UNIT, []);

  mod[MEASURE] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, quantityPy, unitPy) {
      Sk.ffi.checkMethodArgs(MEASURE, arguments, 1, 2);
      Sk.ffi.checkArgType("quantityPy", ["Reference", MEASURE].join(" or "), Sk.ffi.isReference(quantityPy));
      if (Sk.ffi.typeName(quantityPy) === MEASURE)
      {
        Sk.ffi.referenceToPy(Sk.ffi.remapToJs(quantityPy), MEASURE, quantityPy.custom, selfPy);
      }
      else
      {
        Sk.ffi.referenceToPy(new BLADE.Measure(Sk.ffi.remapToJs(quantityPy), Sk.ffi.remapToJs(unitPy)), MEASURE, {"quantity": Sk.ffi.typeName(quantityPy)}, selfPy);
      }
    });
    $loc.__getattr__ = Sk.ffi.functionPy(function(measurePy, name) {
      var measure = Sk.ffi.remapToJs(measurePy);
      switch(name) {
        case PROP_QUANTITY: {
          return Sk.ffi.callsim(mod[measurePy.custom[PROP_QUANTITY]], Sk.ffi.remapToPy(measure[PROP_QUANTITY], measurePy.custom[PROP_QUANTITY]));
        }
        case PROP_UOM: {
          return Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(measure[PROP_UOM], UNIT));
        }
      }
    });
    $loc.__add__ = Sk.ffi.functionPy(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.ffi.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      try {
        return Sk.ffi.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.add(b), MEASURE, custom));
      }
      catch(e) {
        throw Sk.ffi.assertionError(e.message);
      }
    });
    $loc.__sub__ = Sk.ffi.functionPy(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.ffi.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      try {
        return Sk.ffi.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.sub(b), MEASURE, custom));
      }
      catch(e) {
        throw Sk.ffi.assertionError(e.message);
      }
    });
    $loc.__mul__ = Sk.ffi.functionPy(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.ffi.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      return Sk.ffi.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.mul(b), MEASURE, custom));
    });
    $loc.__div__ = Sk.ffi.functionPy(function(aPy, bPy) {
      var a = Sk.ffi.remapToJs(aPy);
      var b = Sk.ffi.remapToJs(bPy);
      var quantityPy = Sk.ffi.gattr(aPy, PROP_QUANTITY);
      var custom = {"quantity": Sk.ffi.typeName(quantityPy)};
      return Sk.ffi.callsim(mod[MEASURE], Sk.ffi.remapToPy(a.div(b), MEASURE, custom));
    });
    $loc.__str__ = Sk.ffi.functionPy(function(measurePy) {
      var quantityPy = Sk.ffi.gattr(measurePy, PROP_QUANTITY);
      var quantityStr = Sk.ffi.remapToJs(Sk.ffi.callsim(quantityPy["__str__"], quantityPy));
      var uomPy = Sk.ffi.gattr(measurePy, PROP_UOM);
      var uomStr = Sk.ffi.remapToJs(Sk.ffi.callsim(uomPy["__str__"], uomPy));
      return Sk.ffi.remapToPy("" + quantityStr + " " + uomStr);
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(measurePy) {
      var quantityPy = Sk.ffi.gattr(measurePy, PROP_QUANTITY);
      var quantityRepr = Sk.ffi.remapToJs(Sk.ffi.callsim(quantityPy["__repr__"], quantityPy));

      var uomPy = Sk.ffi.gattr(measurePy, PROP_UOM);
      var uomRepr = Sk.ffi.remapToJs(Sk.ffi.callsim(uomPy["__repr__"], uomPy));

      return Sk.ffi.remapToPy(MEASURE + "(" + quantityRepr + ", " + uomRepr + ")");
    });
  }, MEASURE, []);

  mod[KILOGRAM] = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 0, 0, 0),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[METER]    = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 1, 0, 0),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[SECOND]   = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 0, 1, 0),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[COULOMB]  = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 0, 0, 1),  DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));

  mod[NEWTON]   = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 1, -2,  0), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[JOULE]    = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 2, -2,  0), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[WATT]     = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 2, -3,  0), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[AMPERE]   = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(0, 0, -1,  1), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[VOLT]     = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 2, -2, -1), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
  mod[TESLA]    = Sk.ffi.callsim(mod[UNIT], Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(new BLADE.Dimensions(1, 1, -2, -1), DIMENSIONS), Sk.ffi.remapToPy(SI_LABELS));
};
}).call(this);
