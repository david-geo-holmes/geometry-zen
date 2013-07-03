Sk.abstr = {};

//
//
//
//
// Number
//
//
//
//

Sk.abstr.binop_type_error = function(lhs, rhs, name) {
  throw new TypeError("unsupported operand type(s) for " + name + ": '" + lhs.tp$name + "' and '" + rhs.tp$name + "'");
};

Sk.abstr.boNameToSlotFuncLhs_ = function(obj, name) {
  switch (name) {
    case "Add":      return obj.nb$add ? obj.nb$add :                   obj['__add__'];
    case "Sub":      return obj.nb$subtract ? obj.nb$subtract :         obj['__sub__'];
    case "Mult":     return obj.nb$multiply ? obj.nb$multiply :         obj['__mul__'];
    case "Div":      return obj.nb$divide ? obj.nb$divide :             obj['__div__'];
    case "FloorDiv": return obj.nb$floor_divide ? obj.nb$floor_divide : obj['__floordiv__'];
    case "Mod":      return obj.nb$remainder ? obj.nb$remainder :       obj['__mod__'];
    case "Pow":      return obj.nb$power ? obj.nb$power :               obj['__pow__'];
    case "LShift":   return obj.nb$lshift ? obj.nb$lshift :             obj['__lshift__'];
    case "RShift":   return obj.nb$rshift ? obj.nb$rshift :             obj['__rshift__'];
    case "BitAnd":   return obj.nb$and ? obj.nb$and :                   obj['__and__'];
    case "BitXor":   return obj.nb$xor ? obj.nb$xor :                   obj['__xor__'];
    case "BitOr":    return obj.nb$or ? obj.nb$or :                     obj['__or__'];
  }
};

Sk.abstr.boNameToSlotFuncRhs_ = function(obj, name) {
  switch (name) {
    case "Add":      return obj.nb$add          ? obj.nb$add :          obj['__radd__'];
    case "Sub":      return obj.nb$subtract     ? obj.nb$subtract :     obj['__rsub__'];
    case "Mult":     return obj.nb$multiply     ? obj.nb$multiply :     obj['__rmul__'];
    case "Div":      return obj.nb$divide       ? obj.nb$divide :       obj['__rdiv__'];
    case "FloorDiv": return obj.nb$floor_divide ? obj.nb$floor_divide : obj['__rfloordiv__'];
    case "Mod":      return obj.nb$remainder    ? obj.nb$remainder :    obj['__rmod__'];
    case "Pow":      return obj.nb$power        ? obj.nb$power :        obj['__rpow__'];
    case "LShift":   return obj.nb$lshift       ? obj.nb$lshift :       obj['__rlshift__'];
    case "RShift":   return obj.nb$rshift       ? obj.nb$rshift :       obj['__rrshift__'];
    case "BitAnd":   return obj.nb$and          ? obj.nb$and :          obj['__rand__'];
    case "BitXor":   return obj.nb$xor          ? obj.nb$xor :          obj['__rxor__'];
    case "BitOr":    return obj.nb$or           ? obj.nb$or :           obj['__ror__'];
  }
};

Sk.abstr.iboNameToSlotFunc_ = function(obj, name) {
  switch (name) {
    case "Add":      return obj.nb$inplace_add          ? obj.nb$inplace_add          : obj['__iadd__'];
    case "Sub":      return obj.nb$inplace_sub          ? obj.nb$inplace_sub          : obj['__isub__'];
    case "Mult":     return obj.nb$inplace_mul          ? obj.nb$inplace_mul          : obj['__imul__'];
    case "Div":      return obj.nb$inplace_divide;
    case "FloorDiv": return obj.nb$inplace_floor_divide ? obj.nb$inplace_floor_divide : obj['__ifloordiv__'];
    case "Mod":      return obj.nb$inplace_remainder;
    case "Pow":      return obj.nb$inplace_power;
    case "LShift":   return obj.nb$lshift               ? obj.nb$lshift               : obj['__lshift__'];
    case "RShift":   return obj.nb$rshift               ? obj.nb$rshift               : obj['__rshift__'];
    case "BitAnd":   return obj.nb$and;
    case "BitOr":    return obj.nb$or;
    case "BitXor":   return obj.nb$xor                  ? obj.nb$xor                  : obj['__ixor__'];
  }
};

Sk.abstr.binary_op_ = function(v, w, opname) {
  var ret;
  var vop = Sk.abstr.boNameToSlotFuncLhs_(v, opname);
  if (vop !== undefined) {
    if (vop.call) {
      ret = vop.call(v, w);
    }
    else {
      ret = Sk.misceval.callsim(vop, v, w)
    }
    if (ret !== undefined) return ret;
  }
  var wop = Sk.abstr.boNameToSlotFuncRhs_(w, opname);
  if (wop !== undefined) {
    if (wop.call) {
      ret = wop.call(w, v);
    }
    else {
      ret = Sk.misceval.callsim(wop, w, v)
    }
    if (ret !== undefined) return ret;
  }

  if (opname === "Add" && v.sq$concat) {
    return v.sq$concat(w);
  }
  else if (opname === "Mult" && v.sq$repeat) {
    return Sk.abstr.sequenceRepeat(v.sq$repeat, v, w);
  }
  else if (opname === "Mult" && w.sq$repeat) {
    return Sk.abstr.sequenceRepeat(w.sq$repeat, w, v);
  }

  Sk.abstr.binop_type_error(v, w, opname);
};

Sk.abstr.binary_iop_ = function(v, w, opname)
{
    var ret;
    var vop = Sk.abstr.iboNameToSlotFunc_(v, opname);
    if (vop !== undefined)
    {
		if (vop.call) {
        	ret = vop.call(v, w);
		} else {  // assume that vop is an __xxx__ type method
			ret = Sk.misceval.callsim(vop,v,w);	//	added to be like not-in-place... is this okay?
		}
        if (ret !== undefined) return ret;
    }
    var wop = Sk.abstr.iboNameToSlotFunc_(w, opname);
    if (wop !== undefined)
    {
		if (wop.call) {
        	ret = wop.call(w, v);
		} else { // assume that wop is an __xxx__ type method
			ret = Sk.misceval.callsim(wop,w,v);	//	added to be like not-in-place... is this okay?
		}
        if (ret !== undefined) return ret;
    }

    if (opname === "Add")
    {
        if (v.sq$inplace_concat)
            return v.sq$inplace_concat(w);
        else if (v.sq$concat)
            return v.sq$concat(w);
    }
    else if (opname === "Mult")
    {
        if (v.sq$inplace_repeat)
            return Sk.abstr.sequenceRepeat(v.sq$inplace_repeat, v, w);
        else if (v.sq$repeat)
            return Sk.abstr.sequenceRepeat(v.sq$repeat, v, w);
        // note, don't use w inplace_repeat because we don't want to mutate rhs
        else if (w.sq$repeat)
            return Sk.abstr.sequenceRepeat(w.sq$repeat, w, v);
    }

    Sk.abstr.binop_type_error(v, w, opname);
};

//
// handle upconverting a/b from number to long if op causes too big/small a
// result, or if either of the ops are already longs
Sk.abstr.numOpAndPromote = function(a, b, opfn) {
  if (typeof a === "number" && typeof b === "number") {
    a = new Sk.builtin.nmber(a, undefined);
    b = new Sk.builtin.nmber(b, undefined);
  }
  else if (a === undefined || b === undefined) {
    throw new Sk.builtin.NameError('Undefined variable in expression')
  }

  if (a.constructor === Sk.builtin.lng) {
//		if (b.constructor == Sk.builtin.nmber)
//			if (b.skType == Sk.builtin.nmber.float$) {
//				var tmp = new Sk.builtin.nmber(a.tp$str(), Sk.builtin.nmber.float$);
//				return [tmp, b];
//			} else
//				return [a, b.v];
    return [a, b];
  }
  else if (a.constructor === Sk.builtin.nmber) {
    return [a, b];
  }
  else if (typeof a === "number") {
    var tmp = new Sk.builtin.nmber(a, undefined);
    return [tmp, b];
  }
  else {
    return undefined;
  }
};

Sk.abstr.boNumPromote_ = {
  "Add": function(a, b) { return a + b; },
  "Sub": function(a, b) { return a - b; },
  "Mult": function(a, b) { return a * b; },
  "Mod": function(a, b) { return (b < 0 ? -1 : 1) * (Math.abs(a) % b); },
  "Div": function(a, b) {
    if (b === 0) {
      throw new Sk.builtin.ZeroDivisionError("integer division or modulo by zero");
    }
    else {
      return a / b;
    }
  },
  "FloorDiv": function(a, b) { return Math.floor(a / b); }, // todo; wrong? neg?
  "Pow": function(a, b) {
    if (a < 0 && b % 1 != 0)
      throw new Sk.builtin.NegativePowerError("cannot raise a negative number to a fractional power");
    else if (a == 0 && b < 0)
      throw new Sk.builtin.NegativePowerError("cannot raise zero to a negative power");
    else
      return Math.pow(a, b);
  },
  "BitAnd": function(a, b) { return a & b; },
  "BitOr": function(a, b) { return a | b; },
  "BitXor": function(a, b) { return a ^ b; },
  "LShift": function(a, b) { return a << b; },
  "RShift": function(a, b) { return a >> b; }
};

Sk.abstr.numberBinOp = function(v, w, op) {
  var numPromoteFunc = Sk.abstr.boNumPromote_[op];
  if (numPromoteFunc !== undefined) {
    var tmp = Sk.abstr.numOpAndPromote(v, w, numPromoteFunc);
    if (typeof tmp === "number") {
      return tmp;
    }
    else if (tmp !== undefined &&  tmp.constructor === Sk.builtin.nmber) {
      return tmp;
    }
    else if (tmp !== undefined && tmp.constructor === Sk.builtin.lng) {
      return tmp;
    }
    else if (tmp !== undefined) {
      v = tmp[0];
      w = tmp[1];
    }
  }
  return Sk.abstr.binary_op_(v, w, op);
};
goog.exportSymbol("Sk.abstr.numberBinOp", Sk.abstr.numberBinOp);

Sk.abstr.numberInplaceBinOp = function(v, w, op)
{
    var numPromoteFunc = Sk.abstr.boNumPromote_[op];
    if (numPromoteFunc !== undefined)
    {
        var tmp = Sk.abstr.numOpAndPromote(v, w, numPromoteFunc);
		if (typeof tmp === "number")
        {
            return tmp;
        }
		else if (tmp !== undefined &&  tmp.constructor === Sk.builtin.nmber)
		{
            return tmp;
		}
		else if (tmp !== undefined && tmp.constructor === Sk.builtin.lng)
		{
            return tmp;
		}
        else if (tmp !== undefined)
        {
            v = tmp[0];
            w = tmp[1];
        }
    }

    return Sk.abstr.binary_iop_(v, w, op);
};
goog.exportSymbol("Sk.abstr.numberInplaceBinOp", Sk.abstr.numberInplaceBinOp);

Sk.abstr.numberUnaryOp = function(v, op)
{
    if (op === "Not") return Sk.misceval.isTrue(v) ? false : true;
    else if (typeof v === "number" || typeof v === "boolean")
    {
        if (op === "USub") return -v;
        if (op === "UAdd") return v;
        if (op === "Invert") return ~v;
    }
    else
    {
        if (op === "USub" && v.nb$negative) return v.nb$negative();
        if (op === "UAdd" && v.nb$positive) return v.nb$positive();
        //todo; if (op === "Invert" && v.nb$positive) return v.nb$invert();
    }
    throw new TypeError("unsupported operand type for " + op + " '" + v.tp$name + "'");
};
goog.exportSymbol("Sk.abstr.numberUnaryOp", Sk.abstr.numberUnaryOp);

//
//
//
//
// Sequence
//
//
//
//

Sk.abstr.fixSeqIndex_ = function(seq, i)
{
    if (i < 0 && seq.sq$length)
        i += seq.sq$length();
    return i;
};

Sk.abstr.sequenceContains = function(seq, ob)
{
    if (seq.sq$contains) return seq.sq$contains(ob);

    if (!seq.tp$iter) throw new TypeError("argument of type '" + seq.tp$name + "' is not iterable");
    
    for (var it = seq.tp$iter(), i = it.tp$iternext(); i !== undefined; i = it.tp$iternext())
    {
        if (Sk.misceval.richCompareBool(i, ob, "Eq"))
            return true;
    }
    return false;
};

Sk.abstr.sequenceGetItem = function(seq, i)
{
    goog.asserts.fail();
};

Sk.abstr.sequenceSetItem = function(seq, i, x)
{
    goog.asserts.fail();
};

Sk.abstr.sequenceDelItem = function(seq, i)
{
	i = Sk.builtin.asnum$(i);
    if (seq.sq$ass_item)
    {
        i = Sk.abstr.fixSeqIndex_(seq, i);
        return seq.sq$ass_item(i, null);
    }
    throw new TypeError("'" + seq.tp$name + "' object does not support item deletion");
};

Sk.abstr.sequenceRepeat = function(f, seq, n)
{
	n = Sk.builtin.asnum$(n);
    var count = Sk.misceval.asIndex(n);
    if (count === undefined)
    {
        throw new TypeError("can't multiply sequence by non-int of type '" + n.tp$name + "'");
    }
    return f.call(seq, n);
};

Sk.abstr.sequenceGetSlice = function(seq, i1, i2)
{
	i1 = Sk.builtin.asnum$(i1);
	i2 = Sk.builtin.asnum$(i2);
    if (seq.sq$slice)
    {
        i1 = Sk.abstr.fixSeqIndex_(seq, i1);
        i2 = Sk.abstr.fixSeqIndex_(seq, i2);
        return seq.sq$slice(i1, i2);
    }
    else if (seq.mp$subscript)
    {
        return seq.mp$subscript(new Sk.builtin.slice(i1, i2));
    }
    throw new TypeError("'" + seq.tp$name + "' object is unsliceable");
};

Sk.abstr.sequenceDelSlice = function(seq, i1, i2)
{
	i1 = Sk.builtin.asnum$(i1);
	i2 = Sk.builtin.asnum$(i2);
    if (seq.sq$ass_slice)
    {
        i1 = Sk.abstr.fixSeqIndex_(seq, i1);
        i2 = Sk.abstr.fixSeqIndex_(seq, i2);
        return seq.sq$ass_slice(i1, i2, null);
    }
    throw new TypeError("'" + seq.tp$name + "' doesn't support slice deletion");
};

Sk.abstr.sequenceSetSlice = function(seq, i1, i2, x)
{
	i1 = Sk.builtin.asnum$(i1);
	i2 = Sk.builtin.asnum$(i2);
    if (seq.sq$ass_slice)
    {
        i1 = Sk.abstr.fixSeqIndex_(seq, i1);
        i2 = Sk.abstr.fixSeqIndex_(seq, i2);
        seq.sq$ass_slice(i1, i2, x);
    }
    else if (seq.mp$ass_subscript)
    {
        seq.mp$ass_subscript(new Sk.builtin.slice(i1, i2), x);
    }
    else
    {
        throw new TypeError("'" + seq.tp$name + "' object doesn't support slice assignment");
    }
};



//
//
//
//
// Object
//
//
//
//

Sk.abstr.objectDelItem = function(o, key)
{
    if (o.mp$ass_subscript) {
        var kf = Sk.builtin.hash;
        var k = kf(key)
        if (o[k] !== undefined) {
            o.size -= 1;
            delete o[k];
            return;
        }
        return o.mp$ass_subscript(key, null);
    }
    if (o.sq$ass_item)
    {
        var keyValue = Sk.misceval.asIndex(key);
        if (keyValue === undefined)
            throw new TypeError("sequence index must be integer, not '" + key.tp$name + "'");
        return Sk.abstr.sequenceDelItem(o, keyValue);
    }
    // if o is a slice do something else...
    throw new TypeError("'" + o.tp$name + "' object does not support item deletion");
};
goog.exportSymbol("Sk.abstr.objectDelItem", Sk.abstr.objectDelItem);

Sk.abstr.objectGetItem = function(o, key) {
  if (o.mp$subscript) {
    return o.mp$subscript(key);
  }
  else if (Sk.misceval.isIndex(key) && o.sq$item) {
    return Sk.abstr.sequenceGetItem(o, Sk.misceval.asIndex(key));
  }
  else if (o.__getitem__ !== undefined) {
    return Sk.misceval.callsim(o.__getitem__, o, key);
  }
  else {
    throw new TypeError("'" + o.tp$name + "' does not support indexing");
  }
};
goog.exportSymbol("Sk.abstr.objectGetItem", Sk.abstr.objectGetItem);

Sk.abstr.objectSetItem = function(o, key, v)
{
    if (o.mp$ass_subscript)
        return o.mp$ass_subscript(key, v);
    else if (Sk.misceval.isIndex(key) && o.sq$ass_item)
        return Sk.abstr.sequenceSetItem(o, Sk.misceval.asIndex(key), v);
    throw new TypeError("'" + o.tp$name + "' does not support item assignment");
};
goog.exportSymbol("Sk.abstr.objectSetItem", Sk.abstr.objectSetItem);

Sk.abstr.gattr = function(obj, nameJS) {
  var ret;
  if(obj['__getattr__']) {
    // ? Since this is callsim, shouldn't the name follow the wrapped string convention?
    ret = Sk.misceval.callsim(obj['__getattr__'], obj, nameJS);
    if (ret !== undefined) {
      return ret;
    }
    else {
      throw new Sk.builtin.AttributeError("'" + obj.tp$name + "' object has no attribute getter '" + nameJS + "'.");
    }
  }
  else {
    if (obj.tp$getattr && typeof obj.tp$getattr === 'function') {
      ret = obj.tp$getattr(nameJS);
      if (ret !== undefined) {
        return ret;
      }
      else {
        throw new Sk.builtin.AttributeError("'" + obj.tp$name + "' object has no attribute getter '" + nameJS + "'.");
      }
    }
    else {
      throw new Sk.builtin.AttributeError("'" + obj.tp$name + "' object has no attribute getters.");
    }
  }
  throw new Sk.builtin.AssertionError();
};
goog.exportSymbol("Sk.abstr.gattr", Sk.abstr.gattr);

Sk.abstr.sattr = function(obj, nameJS, data) {
  if(obj['__setattr__']) {
    Sk.misceval.callsim(obj['__setattr__'],obj, nameJS, data);
  }
  else {
    obj.tp$setattr(nameJS, data);
  }
};

goog.exportSymbol("Sk.abstr.sattr", Sk.abstr.sattr);

Sk.abstr.iter = function(obj)
{
    return obj.tp$iter();
};
goog.exportSymbol("Sk.abstr.iter", Sk.abstr.iter);

Sk.abstr.iternext = function(it)
{
    return it.tp$iternext();
};
goog.exportSymbol("Sk.abstr.iternext", Sk.abstr.iternext);
