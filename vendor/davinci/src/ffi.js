Sk.ffi = Sk.ffi || {};

/**
 * Converts a JavaScript boolean or null to the internal Python bool representation.
 *
 * @param {?boolean} valueJs
 */
Sk.ffi.booleanToPy = function(valueJs)
{
    var t = typeof valueJs;
    if (t === 'boolean')
    {
        return valueJs ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
    }
    else if (t === 'object' && valueJs === null)
    {
        return Sk.builtin.none.none$;
    }
    else
    {
        throw Sk.ffi.assertionError("f5008183-bfce-4842-9496-30b936ff73f3");
    }
};
goog.exportSymbol("Sk.ffi.booleanToPy", Sk.ffi.booleanToPy);

/**
 * Converts a JavaScript number or null to the internal Python float representation.
 *
 * @param {?number} valueJs
 */
Sk.ffi.numberToPy = function(valueJs)
{
    var t = typeof valueJs;
    if (t === 'number')
    {
        return new Sk.builtin.nmber(valueJs, Sk.builtin.nmber.float$);
    }
    else if (t === 'object' && valueJs === null)
    {
        return Sk.builtin.none.none$;
    }
    else
    {
        throw Sk.ffi.assertionError("3c68a6b8-0314-49ab-99ac-a818324417d8");
    }
};
goog.exportSymbol("Sk.ffi.numberToPy", Sk.ffi.numberToPy);

/**
 * Converts a JavaScript number or null to the internal Python int representation.
 *
 * @param {?number} valueJs
 */
Sk.ffi.numberToIntPy = function(valueJs)
{
    var t = typeof valueJs;
    if (t === 'number')
    {
        return new Sk.builtin.nmber(valueJs, Sk.builtin.nmber.int$);
    }
    else if (t === 'object' && valueJs === null)
    {
        return Sk.builtin.none.none$;
    }
    else
    {
        throw Sk.ffi.assertionError("b451b411-151c-4430-82f2-d548e5514303");
    }
};
goog.exportSymbol("Sk.ffi.numberToIntPy", Sk.ffi.numberToIntPy);

/**
 * Converts a JavaScript string or null to the internal Python string representation.
 *
 * @param {?string} valueJs
 * @param {string=} defaultJs
 */
Sk.ffi.stringToPy = function(valueJs, defaultJs)
{
    var t = typeof valueJs;
    if (t === 'string')
    {
        if (valueJs.length > 0)
        {
            return new Sk.builtin.str(valueJs);
        }
        else
        {
            return Sk.builtin.str.$emptystr;
        }
    }
    else if (t === 'object' && valueJs === null)
    {
        return Sk.builtin.none.none$;
    }
    else if (t === 'undefined')
    {
        if (typeof defaultJs === 'string')
        {
            return Sk.ffi.stringToPy(defaultJs);
        }
        else
        {
            throw Sk.ffi.assertionError("f8db3019-c641-4ab2-8bbe-50aa9bfa8b39, defaultJs must be a string");
        }
    }
    else
    {
        throw Sk.ffi.assertionError("50730498-9d4c-4a28-ab50-fd6127dd6d8c, typeof valueJs => '" + t + "'");
    }
};
goog.exportSymbol("Sk.ffi.stringToPy", Sk.ffi.stringToPy);

/**
 * Wraps a JavaScript class 
 * Usage:
 *
 * valuePy = Sk.ffi.referenceToPy(valueJs, "Classname", custom);
 *
 * - This form is useful when calling a constructor to wrap a JavaScript object.
 *
 * or
 *
 * Sk.ffi.referenceToPy(valueJs, "Classname", custom, selfPy);
 *
 * - This form is useful in initialization functions.
 *
 * @param {Object|string|number|boolean} valueJs
 * @param {string} tp$name
 * @param {Object=} custom Custom metadata that the caller wishes to retain.
 * @param {Object=} targetPy An optional destination for mapping reference types.
 */
Sk.ffi.referenceToPy = function(valueJs, tp$name, custom, targetPy)
{
    var t = typeof valueJs;
    if (t === 'object' || t === 'function')
    {
        if (typeof tp$name === 'string')
        {
            if (targetPy) {
                targetPy.v = valueJs;
                targetPy.tp$name = tp$name;
                targetPy.custom = custom;
            }
            else {
                return {"v": valueJs, "tp$name": tp$name, "custom": custom};
            }
        }
        else
        {
            throw Sk.ffi.assertionError("9fad4b9e-4845-4a06-9bce-0aa7c68e1f03");
        }
    }
    else
    {
        throw Sk.ffi.assertionError("306f31df-f0a9-40a0-895b-d01308df8d6e typeof valueJs => " + t);
    }
};
goog.exportSymbol("Sk.ffi.referenceToPy", Sk.ffi.referenceToPy);

/**
 * Constructs a Python function.
 *
 * @param {function()} code The implementation of the function.
 */
Sk.ffi.functionPy = function(code)
{
    return new Sk.builtin.func(code);
};
goog.exportSymbol("Sk.ffi.functionPy", Sk.ffi.functionPy);

/**
 * Constructs a Python list.
 *
 * @param {Array.<Object>=} valuesPy A JavaScript array of Python values.
 */
Sk.ffi.listPy = function(valuesPy)
{
    return new Sk.builtin.list(valuesPy);
}
goog.exportSymbol("Sk.ffi.listPy", Sk.ffi.listPy);

/**
 * Constructs a Python tuple.
 *
 * @param {Array.<Object>|Object} valuesPy A JavaScript array of Python values.
 */
Sk.ffi.tuplePy = function(valuesPy)
{
    return new Sk.builtin.tuple(valuesPy);
}
goog.exportSymbol("Sk.ffi.tuplePy", Sk.ffi.tuplePy);

/**
 * Wraps a JavaScript Object instance.
 * 
 * Usage:
 *
 * valuePy = Sk.ffi.remapToPy(valueJs, className);
 *
 * @param {Object|string|number|boolean} valueJs The JavaScript value that must be represented in Python.
 * @param {string=} className The name of the class when wrapping a JavaScript object.
 * @param {Object=} custom Custom metadata that the caller wishes to retain.
 */
Sk.ffi.remapToPy = function(valueJs, className, custom)
{
    var t = typeof valueJs;
    if (t === 'object') {
        if (Object.prototype.toString.call(valueJs) === "[object Array]")
        {
            var valuesPy = [];
            for (var i = 0; i < valueJs.length; ++i) {
                valuesPy.push(Sk.ffi.remapToPy(valueJs[i]));
            }
            return Sk.ffi.listPy(valuesPy);
        }
        else if (typeof className === 'string')
        {
            return Sk.ffi.referenceToPy(valueJs, className, custom);
        }
        else if (t === 'object' && valueJs === null)
        {
            return Sk.builtin.none.none$;
        }
        else
        {
            var kvsPy = [];
            for (var k in valueJs)
            {
                kvsPy.push(Sk.ffi.remapToPy(k));
                kvsPy.push(Sk.ffi.remapToPy(valueJs[k]));
            }
            return new Sk.builtin.dict(kvsPy);
        }
    }
    else if (t === 'string')
    {
        return Sk.ffi.stringToPy(String(valueJs));
    }
    else if (t === 'number')
    {
        return Sk.ffi.numberToPy(Number(valueJs));
    }
    else if (t === 'boolean')
    {
        return Sk.ffi.booleanToPy(valueJs ? true : false);
    }
    else
    {
        goog.asserts.fail("unhandled remapToPy type " + t);
    }
};
goog.exportSymbol("Sk.ffi.remapToPy", Sk.ffi.remapToPy);

Sk.ffi.isDictionary = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.DICTIONARY; };
goog.exportSymbol("Sk.ffi.isDictionary", Sk.ffi.isDictionary);

Sk.ffi.isFunction = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.FUNCTION; };
goog.exportSymbol("Sk.ffi.isFunction", Sk.ffi.isFunction);

Sk.ffi.isInt = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.INT; };
goog.exportSymbol("Sk.ffi.isInt", Sk.ffi.isInt);

Sk.ffi.isNone = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.NONE; };
goog.exportSymbol("Sk.ffi.isNone", Sk.ffi.isNone);

Sk.ffi.isNumber = function(valuePy) { return Sk.builtin.checkNumber(valuePy); };
goog.exportSymbol("Sk.ffi.isNumber", Sk.ffi.isNumber);

Sk.ffi.isObjectRef = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.OBJREF; };
goog.exportSymbol("Sk.ffi.isObjectRef", Sk.ffi.isObjectRef);

Sk.ffi.isFunctionRef = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.FUNREF; };
goog.exportSymbol("Sk.ffi.isFunctionRef", Sk.ffi.isFunctionRef);

Sk.ffi.isReference = function(valuePy) { return Sk.ffi.isObjectRef(valuePy) || Sk.ffi.isFunctionRef(valuePy); };
goog.exportSymbol("Sk.ffi.isReference", Sk.ffi.isReference);

Sk.ffi.isString = function(valuePy) { return Sk.builtin.checkString(valuePy); };
goog.exportSymbol("Sk.ffi.isString", Sk.ffi.isString);

Sk.ffi.isUndefined = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.UNDEFINED; };
goog.exportSymbol("Sk.ffi.isUndefined", Sk.ffi.isUndefined);

/**
 * Convenience function for asserting the number of arguments to a function.
 *
 * Returns the number of arguments if within the specified bounds.
 *
 * Use this function whenever there is no self argument.
 *
 * @param {string} name the name of the attribute
 * @param {{length: number}} args the args passed to the attribute
 * @param {number} minargs the minimum number of allowable arguments
 * @param {number=} maxargs optional maximum number of allowable
 * arguments (default: Infinity)
 * @param {boolean=} kwargs optional true if kwargs, false otherwise
 * (default: false)
 * @param {boolean=} free optional true if free vars, false otherwise
 * (default: false)
 * @return {number} The number of arguments.
 */
Sk.ffi.checkFunctionArgs = function(name, args, minargs, maxargs, kwargs, free)
{
    var nargs = args.length;
    var msg = "";

    if (maxargs === undefined) { maxargs = Infinity; }
    if (kwargs) { nargs -= 1; }
    if (free) { nargs -= 1; }
    if (nargs < minargs || nargs > maxargs)
    {
        if (minargs === maxargs)
        {
            msg = name + "() takes exactly " + minargs + " arguments";
        }
        else if (nargs < minargs)
        {
            msg = name + "() takes at least " + minargs + " arguments";
        }
        else
        {
            msg = name + "() takes at most " + maxargs + " arguments";
        }
        msg += " (" + nargs + " given)";
        throw new Sk.builtin.AssertionError(msg);
    }
    else
    {
        return nargs;
    }
};
goog.exportSymbol("Sk.ffi.checkFunctionArgs", Sk.ffi.checkFunctionArgs);

/**
 * Convenience function for asserting the number of arguments to a method (callable attribute).
 *
 * Returns the number of arguments if within the specified bounds.
 *
 * Use this function whenever you want to ignore the first (self) argument.
 *
 * @param {string} name the name of the attribute
 * @param {{length: number}} args the args passed to the attribute
 * @param {number} minargs the minimum number of allowable arguments
 * @param {number=} maxargs optional maximum number of allowable
 * arguments (default: Infinity)
 * @param {boolean=} kwargs optional true if kwargs, false otherwise
 * (default: false)
 * @param {boolean=} free optional true if free vars, false otherwise
 * (default: false)
 * @return {number} The number of arguments.
 */
Sk.ffi.checkMethodArgs = function(name, args, minargs, maxargs, kwargs, free)
{
    return Sk.ffi.checkFunctionArgs(name, Array.prototype.slice.call(args, 1), minargs, maxargs, kwargs, free);
};
goog.exportSymbol("Sk.ffi.checkMethodArgs", Sk.ffi.checkMethodArgs);

/**
 * Convenience function for asserting the type of an argument.
 *
 * @param {string} name The argument name.
 * @param {string} expectedType A string representation of the expected type.
 * @param {boolean} condition The condition that must be true for the check to pass.
 */
Sk.ffi.checkArgType = function(name, expectedType, condition)
{
    if (!condition)
    {
        throw Sk.ffi.err.argument(name).mustBeA(expectedType);
    }
};
goog.exportSymbol("Sk.ffi.checkArgType", Sk.ffi.checkArgType);

/**
 * Enumeration for internal Python types.
 *
 * @enum {number}
 */
Sk.ffi.PyType = {
    'UNDEFINED':  0,
    'DICTIONARY': 1,
    'LIST':       2,
    'TUPLE':      3,
    'BOOL':       4,
    'FLOAT':      5,
    'INT':        6,
    'LONG':       7,
    'STRING':     8,
    'OBJREF':     9,
    'FUNREF':    10,
    'NONE':      11,
    'FUNCTION':  12
};

/**
 * Computes the internal Python representation type for the provided value.
 *
 * @return {Sk.ffi.PyType} The Python type enumeration value.
 */
Sk.ffi.getType = function(valuePy)
{
    if (typeof valuePy === 'undefined')
    {
        return Sk.ffi.PyType.UNDEFINED;
    }
    else if (valuePy instanceof Sk.builtin.dict)
    {
        return Sk.ffi.PyType.DICTIONARY;
    }
    else if (valuePy instanceof Sk.builtin.list)
    {
        return Sk.ffi.PyType.LIST;
    }
    else if (valuePy instanceof Sk.builtin.tuple)
    {
        return Sk.ffi.PyType.TUPLE;
    }
    else if (valuePy instanceof Sk.builtin.nmber)
    {
        if (valuePy.skType === Sk.builtin.nmber.float$)
        {
            return Sk.ffi.PyType.FLOAT;
        }
        else if (valuePy.skType === Sk.builtin.nmber.int$)
        {
            return Sk.ffi.PyType.INT;
        }
        else
        {
            throw new Sk.builtin.AssertionError("typeofPy(" + valuePy + ") (Sk.builtin.nmber) skType=" + valuePy.skType);
        }
    }
    else if (valuePy instanceof Sk.builtin.lng)
    {
        return Sk.ffi.PyType.LONG;
    }
    else if (valuePy === Sk.builtin.bool.true$)
    {
        return Sk.ffi.PyType.BOOL;
    }
    else if (valuePy === Sk.builtin.bool.false$)
    {
        return Sk.ffi.PyType.BOOL;
    }
    else if (valuePy === Sk.builtin.none.none$)
    {
        return Sk.ffi.PyType.NONE;
    }
    else
    {
        var x = typeof valuePy.v;
        if (x !== 'undefined')
        {
            if (x === 'string')
            {
                return Sk.ffi.PyType.STRING;
            }
            else if (x === 'object')
            {
                if (valuePy.tp$name)
                {
                    return Sk.ffi.PyType.OBJREF;
                }
                else
                {
                    throw new Sk.builtin.AssertionError("0a459acc-9540-466b-ba1a-333f8215b61e");
                }
            }
            else if (x === 'function')
            {
                return Sk.ffi.PyType.FUNREF;
            }
            else
            {
                throw new Sk.builtin.AssertionError("bb971bb0-3751-49bb-ac24-8dab8a4bcd29 (x:'" + x + "')");
            }
        }
        else
        {
            // TODO: It works, but why are there two ways of doing it?
            return Sk.ffi.PyType.FUNCTION;
        }
    }
};
goog.exportSymbol("Sk.ffi.getType", Sk.ffi.getType);

Sk.ffi.typeName = function(valuePy)
{
    switch(Sk.ffi.getType(valuePy))
    {
        case Sk.ffi.PyType.OBJREF:
        {
            return Sk.abstr.typeName(valuePy);
        }
        default:
        {
            goog.asserts.fail("Sk.ffi.typeName(valuePy) must be Sk.ffi.PyType.OBJREF");
        }
    }
};
goog.exportSymbol("Sk.ffi.typeName", Sk.ffi.typeName);

/**
 * Converts the internal Python string representation to a JavaScript string.
 *
 * Usage:
 *
 * valueJs = Sk.ffi.booleanToJs(valuePy, "foo must be a <type 'bool'>");
 *
 * @param {Object} valuePy
 * @param {string=} message
 */
Sk.ffi.booleanToJs = function(valuePy, message)
{
    if (valuePy === Sk.builtin.bool.true$)
    {
        return true;
    }
    else if (valuePy === Sk.builtin.bool.false$)
    {
        return false;
    }
    else
    {
        throw new Sk.builtin.AssertionError(message);
    }
};
goog.exportSymbol("Sk.ffi.booleanToJs", Sk.ffi.booleanToJs);

/**
 * @param {string=} message Optional customizable assertion message.
 *
 * @return {number}
 */
Sk.ffi.numberToJs = function(valuePy, message)
{
    if (valuePy instanceof Sk.builtin.nmber)
    {
        return Sk.builtin.asnum$(valuePy);
    }
    else
    {
        if (typeof message === 'string')
        {
            throw new Sk.builtin.AssertionError(message);
        }
        else
        {
            goog.asserts.fail("e55f4353-0403-42f5-bd12-ec48459b3d2c");
        }
    }
};
goog.exportSymbol("Sk.ffi.numberToJs", Sk.ffi.numberToJs);

/**
 * Usage:
 *
 * valueJs = Sk.ffi.remapToJs(valuePy);
 *
 * @param {Object} valuePy The Python value to be mapped.
 * @param {Object=} defaultJs The optional default JavaScript value to use when the type of the value is undefined.
 */
Sk.ffi.remapToJs = function(valuePy, defaultJs)
{
    Sk.ffi.checkFunctionArgs("Sk.ffi.remapToJs", arguments, 1, 2);
    switch(Sk.ffi.getType(valuePy))
    {
        case Sk.ffi.PyType.STRING:
        {
            return valuePy.v;
        }
        case Sk.ffi.PyType.DICTIONARY:
        {
            var ret = {};
            for (var iter = valuePy.tp$iter(), k = iter.tp$iternext(); k !== undefined; k = iter.tp$iternext())
            {
                var v = valuePy.mp$subscript(k);
                if (v === undefined) {
                    v = null;
                }
                var kAsJs = Sk.ffi.remapToJs(k);
                ret[kAsJs] = Sk.ffi.remapToJs(v);
            }
            return ret;
        }
        case Sk.ffi.PyType.LIST:
        {
            var ret = [];
            for (var i = 0; i < valuePy.v.length; ++i)
            {
                ret.push(Sk.ffi.remapToJs(valuePy.v[i]));
            }
            return ret;
        }
        case Sk.ffi.PyType.TUPLE:
        {
            var ret = [];
            for (var i = 0; i < valuePy.v.length; ++i)
            {
                ret.push(Sk.ffi.remapToJs(valuePy.v[i]));
            }
            return ret;
        }
        case Sk.ffi.PyType.BOOL:
        {
            if (valuePy === Sk.builtin.bool.true$)
            {
                return true;
            }
            else if (valuePy === Sk.builtin.bool.false$)
            {
                return false;
            }
            else
            {
                throw new Sk.builtin.AssertionError("5fd1f529-f9b2-4d0c-9775-36e782973986");
            }
        }
        case Sk.ffi.PyType.FLOAT:
        case Sk.ffi.PyType.INT:
        case Sk.ffi.PyType.LONG:
        {
            return Sk.builtin.asnum$(valuePy);
        }
        case Sk.ffi.PyType.OBJREF:
        {
            // TODO: This is being exercised, but we should assert the tp$name.
            // I think the pattern here suggests that we have a Sk.builtin.something
            return valuePy.v;
        }
        case Sk.ffi.PyType.FUNREF:
        {
            return valuePy.v;
        }
        case Sk.ffi.PyType.UNDEFINED:
        {
            return defaultJs;
        }
        case Sk.ffi.PyType.NONE:
        {
            return null;
        }
        case Sk.ffi.PyType.FUNCTION: {
            return function() {
                var argsPy = Array.prototype.slice.call(arguments, 0).map(function(argJs) {return Sk.ffi.remapToPy(argJs);});
                return Sk.ffi.remapToJs(Sk.misceval.apply(valuePy, undefined, undefined, undefined, argsPy));
            };
        }
        default:
        {
            throw new Sk.builtin.AssertionError("20be4da2-63e8-4fff-9359-7ab46eba4702 " + Sk.ffi.getType(valuePy));
        }
    }
};
goog.exportSymbol("Sk.ffi.remapToJs", Sk.ffi.remapToJs);

Sk.ffi.buildClass = function(globals, func, name, bases)
{
    return Sk.misceval.buildClass(globals, func, name, bases);
};
goog.exportSymbol("Sk.ffi.buildClass", Sk.ffi.buildClass);

/**
 * 
 * @param {Object} func the thing to call
 * @param {...*} args stuff to pass it
 */
Sk.ffi.callsim = function(func, args)
{
    var args = Array.prototype.slice.call(arguments, 1);
    return Sk.misceval.apply(func, undefined, undefined, undefined, args);
};
goog.exportSymbol("Sk.ffi.callsim", Sk.ffi.callsim);

/**
 * Convenience function for implementing callable attributes.
 */
Sk.ffi.callableToPy = function(mod, targetJs, nameJs, functionJs)
{
    return Sk.ffi.callsim(Sk.ffi.buildClass(mod, function($gbl, $loc)
    {
      $loc.__init__ = Sk.ffi.functionPy(function(selfPy)
      {
        // Tucking away the reference is not critical. Other approaches are possible.
        // Would be nice to have a default implementation that maps the arguments.
        if (targetJs[nameJs]) {
            Sk.ffi.referenceToPy(targetJs[nameJs], nameJs, undefined, selfPy);
        }
        else {
            throw Sk.ffi.assertionError("c308ee41-f856-41a4-9aef-abd302b6a5aa nameJs => " + nameJs);
        }
      });
      $loc.__call__ = Sk.ffi.functionPy(functionJs);
      $loc.__str__ = Sk.ffi.functionPy(function(self)
      {
        return Sk.ffi.stringToPy(nameJs);
      });
      $loc.__repr__ = Sk.ffi.functionPy(function(self)
      {
        return Sk.ffi.stringToPy(nameJs);
      });
    }, nameJs, []));
};
goog.exportSymbol("Sk.ffi.callableToPy", Sk.ffi.callableToPy);

/**
 *
 */
Sk.ffi.gattr = function(objectPy, name)
{
    return Sk.abstr.gattr(objectPy, name);
}
goog.exportSymbol("Sk.ffi.gattr", Sk.ffi.gattr);

/**
 * @param {...*} args
 * @return {!Sk.builtin.AssertionError}
 */
Sk.ffi.assertionError = function(args)
{
    return new Sk.builtin.AssertionError(args);
};
goog.exportSymbol("Sk.ffi.assertionError", Sk.ffi.assertionError);

/**
 * @param {...*} args
 * @return {!Sk.builtin.IndexError}
 */
Sk.ffi.indexError = function(args)
{
    return new Sk.builtin.IndexError(args);
};
goog.exportSymbol("Sk.ffi.indexError", Sk.ffi.indexError);

/**
 * @param {...*} args
 * @return {!Sk.builtin.TypeError}
 */
Sk.ffi.typeError = function(args)
{
    return new Sk.builtin.TypeError(args);
};
goog.exportSymbol("Sk.ffi.typeError", Sk.ffi.typeError);

/**
 * @param {...*} args
 * @return {!Sk.builtin.ValueError}
 */
Sk.ffi.valueError = function(args)
{
    return new Sk.builtin.ValueError(args);
};
goog.exportSymbol("Sk.ffi.valueError", Sk.ffi.valueError);

/**
 * Fluid API for building messages.
 *
 * TODO: Localization.
 */
Sk.ffi.err =
{
    argument: function(name) {
        return {
            mustBeA: function(expectedType) {
                return Sk.ffi.typeError(name + " must be a " + expectedType);
            }
        };
    },
    expectArg: function(name) {
        return {
            toHaveType: function(expectedType) {
                return Sk.ffi.typeError("Expecting argument '" + name + "' to have type '" + expectedType + "'.");
            }
        };
    }
}
goog.exportSymbol("Sk.ffi.message", Sk.ffi.message);

/**
 * @deprecated Use Sk.ffi.remapToJs
 */
Sk.ffi.callback = function(functionPy) { return Sk.ffi.remapToJs(functionPy); };
goog.exportSymbol("Sk.ffi.callback", Sk.ffi.callback);

/**
 * @deprecated Use Sk.ffi.referenceToPy (carefully).
 */
Sk.ffi.stdwrap = function(type, towrap)
{
    var inst = new type();
    inst['v'] = towrap;
    return inst;
};
goog.exportSymbol("Sk.ffi.stdwrap", Sk.ffi.stdwrap);

/**
 * @deprecated Use Sk.ffi.remapToPy
 */
Sk.ffi.basicwrap = function(obj) { return Sk.ffi.remapToPy(obj); };
goog.exportSymbol("Sk.ffi.basicwrap", Sk.ffi.basicwrap);

/**
 * @deprecated Use Sk.ffi.remapToJs
 */
Sk.ffi.unwrapo = function(obj) { return Sk.ffi.remapToJs(obj); };
goog.exportSymbol("Sk.ffi.unwrapo", Sk.ffi.unwrapo);

/**
 * @deprecated Use Sk.ffi.remapToJs
 */
Sk.ffi.unwrapn = function(obj) { return Sk.ffi.remapToJs(obj); };
goog.exportSymbol("Sk.ffi.unwrapn", Sk.ffi.unwrapn);
