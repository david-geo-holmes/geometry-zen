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
        goog.asserts.fail("f5008183-bfce-4842-9496-30b936ff73f3");
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
        goog.asserts.fail("3c68a6b8-0314-49ab-99ac-a818324417d8");
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
        goog.asserts.fail("b451b411-151c-4430-82f2-d548e5514303");
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
        return new Sk.builtin.str(valueJs);
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
            throw new Sk.builtin.AssertionError("f8db3019-c641-4ab2-8bbe-50aa9bfa8b39, defaultJs must be a string");
        }
    }
    else
    {
        throw new Sk.builtin.AssertionError("50730498-9d4c-4a28-ab50-fd6127dd6d8c, typeof valueJs => '" + t + "'");
    }
};
goog.exportSymbol("Sk.ffi.stringToPy", Sk.ffi.stringToPy);

/**
 * Wraps a JavaScript class 
 * Usage:
 *
 * valuePy = Sk.ffi.referenceToPy(valueJs, "Classname");
 *
 * @param {Object|string|number|boolean} valueJs
 * @param {string} tp$name
 * @param {Object=} custom Custom metadata that the caller wishes to retain.
 */
Sk.ffi.referenceToPy = function(valueJs, tp$name, custom)
{
    var t = typeof valueJs;
    if (t === 'object')
    {
        if (typeof tp$name === 'string')
        {
            return {"v": valueJs, "tp$name": tp$name, "custom": custom};
        }
        else
        {
            goog.asserts.fail("9fad4b9e-4845-4a06-9bce-0aa7c68e1f03");
        }
    }
    else
    {
        goog.asserts.fail("306f31df-f0a9-40a0-895b-d01308df8d6e");
    }
};
goog.exportSymbol("Sk.ffi.referenceToPy", Sk.ffi.referenceToPy);

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
            var arr = [];
            for (var i = 0; i < valueJs.length; ++i) {
                arr.push(Sk.ffi.remapToPy(valueJs[i]));
            }
            return new Sk.builtin.list(arr);
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
            var kvs = [];
            for (var k in valueJs)
            {
                kvs.push(Sk.ffi.remapToPy(k));
                kvs.push(Sk.ffi.remapToPy(valueJs[k]));
            }
            return new Sk.builtin.dict(kvs);
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

Sk.ffi.isDictionary = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.DICTIONARY; };
goog.exportSymbol("Sk.ffi.isDictionary", Sk.ffi.isDictionary);

Sk.ffi.isFunction = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.CALLBACK; };
goog.exportSymbol("Sk.ffi.isFunction", Sk.ffi.isFunction);

Sk.ffi.isInt = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.INT; };
goog.exportSymbol("Sk.ffi.isInt", Sk.ffi.isInt);

Sk.ffi.isNone = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.NONE; };
goog.exportSymbol("Sk.ffi.isNone", Sk.ffi.isNone);

Sk.ffi.isNumber = function(valuePy) { return Sk.builtin.checkNumber(valuePy); };
goog.exportSymbol("Sk.ffi.isNumber", Sk.ffi.isNumber);

Sk.ffi.isReferencePy = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.REFERENCE; };
goog.exportSymbol("Sk.ffi.isReferencePy", Sk.ffi.isReferencePy);

Sk.ffi.isString = function(valuePy) { return Sk.builtin.checkString(valuePy); };
goog.exportSymbol("Sk.ffi.isString", Sk.ffi.isString);

Sk.ffi.isUndefined = function(valuePy) { return Sk.ffi.getType(valuePy) === Sk.ffi.PyType.UNDEFINED; };
goog.exportSymbol("Sk.ffi.isUndefined", Sk.ffi.isUndefined);

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
 * Convenience function for asserting the number of arguments.
 *
 * @param {string} name the name of the function
 * @param {Object} args the args passed to the function
 * @param {number} minargs the minimum number of allowable arguments
 * @param {number=} maxargs optional maximum number of allowable
 * arguments (default: Infinity)
 * @param {boolean=} kwargs optional true if kwargs, false otherwise
 * (default: false)
 * @param {boolean=} free optional true if free vars, false otherwise
 * (default: false)
 */
Sk.ffi.checkArgCount = function(name, args, minargs, maxargs, kwargs, free)
{
    return Sk.builtin.pyCheckArgs(name, args, minargs, maxargs, kwargs, free);
};
goog.exportSymbol("Sk.ffi.checkArgCount", Sk.ffi.checkArgCount);

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
        throw new Sk.builtin.TypeError(name + " must be a " + expectedType);
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
    'BOOL':       3,
    'FLOAT':      4,
    'INT':        5,
    'LONG':       6,
    'STRING':     7,
    'REFERENCE':  8,
    'NONE':       9,
    'FUNCTION':  10,
    'CALLBACK':  11
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
                return Sk.ffi.PyType.REFERENCE;
            }
            else if (x === 'function')
            {
                return Sk.ffi.PyType.FUNCTION;
            }
            else
            {
                throw new Sk.builtin.AssertionError("bb971bb0-3751-49bb-ac24-8dab8a4bcd29 (x:'" + x + "')");
            }
        }
        else
        {
            // TODO: It works, but why functions and callbacks?
            return Sk.ffi.PyType.CALLBACK;
        }
    }
};
goog.exportSymbol("Sk.ffi.getType", Sk.ffi.getType);

Sk.ffi.typeName = function(valuePy)
{
    switch(Sk.ffi.getType(valuePy))
    {
        case Sk.ffi.PyType.REFERENCE:
        {
            return Sk.abstr.typeName(valuePy);
        }
        default:
        {
            goog.asserts.fail("Sk.ffi.typeName(valuePy) must be Sk.ffi.PyType.REFERENCE");
        }
    }
};
goog.exportSymbol("Sk.ffi.typeName", Sk.ffi.typeName);

/**
 * Usage:
 *
 * valueJs = Sk.ffi.remapToJs(valuePy);
 *
 * @param {Object} valuePy The Python value to be mapped.
 * @param {Object=} targetPy An optional destination for mapping reference types.
 */
Sk.ffi.remapToJs = function(valuePy, targetPy)
{
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
        case Sk.ffi.PyType.REFERENCE:
        {
            if (typeof targetPy !== 'undefined')
            {
                targetPy.tp$name = valuePy.tp$name;
                targetPy.v       = valuePy.v;
            }
            // TODO: This is being exercised, but we should assert the tp$name.
            // I think the pattern here suggests that we have a Sk.builtin.something
            return valuePy.v;
        }
        case Sk.ffi.PyType.FUNCTION:
        {
            return valuePy.v;
        }
        case Sk.ffi.PyType.UNDEFINED:
        {
            return undefined;
        }
        case Sk.ffi.PyType.NONE:
        {
            return null;
        }
        case Sk.ffi.PyType.CALLBACK: {
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
 * Defines the implementation of a Python function in the internal representation.
 *
 * @param {function()} code The implementation of the function.
 */
Sk.ffi.defineFunction = function(code)
{
    return new Sk.builtin.func(code);
};
goog.exportSymbol("Sk.ffi.defineFunction", Sk.ffi.defineFunction);

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
