Sk.ffi = Sk.ffi || {};

/**
 * Usage:
 *
 * return Sk.ffi.booleanToJs(valueJs);
 *
 * @param {Object|string|number|boolean} valueJs
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
}
goog.exportSymbol("Sk.ffi.booleanToPy", Sk.ffi.booleanToPy);

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
}
goog.exportSymbol("Sk.ffi.numberToPy", Sk.ffi.numberToPy);

Sk.ffi.remapNumberToIntPy = function(valueJs)
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
}
goog.exportSymbol("Sk.ffi.remapNumberToIntPy", Sk.ffi.remapNumberToIntPy);

Sk.ffi.stringToPy = function(valueJs)
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
    else
    {
        goog.asserts.fail("50730498-9d4c-4a28-ab50-fd6127dd6d8c");
    }
}
goog.exportSymbol("Sk.ffi.stringToPy", Sk.ffi.stringToPy);

/**
 * Wraps a JavaScript class 
 * Usage:
 *
 * valuePy = Sk.ffi.referenceToPy(valueJs, "Classname");
 *
 * @param {Object|string|number|boolean} valueJs
 * @param {string} tp$name
 */
Sk.ffi.referenceToPy = function(valueJs, tp$name)
{
    var t = typeof valueJs;
    if (t === 'object')
    {
        if (typeof tp$name === 'string')
        {
            return {"v": valueJs, "tp$name": tp$name};
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
}
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
 */
Sk.ffi.remapToPy = function(valueJs, className)
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
            return Sk.ffi.referenceToPy(valueJs, className);
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
        return Sk.ffi.stringToPy(valueJs);
    }
    else if (t === 'number')
    {
        return Sk.ffi.numberToPy(valueJs);
    }
    else if (t === 'boolean')
    {
        return Sk.ffi.booleanToPy(valueJs);
    }
    else
    {
        goog.asserts.fail("unhandled remapToPy type " + t);
    }
};
goog.exportSymbol("Sk.ffi.remapToPy", Sk.ffi.remapToPy);

/**
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
}
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
}
goog.exportSymbol("Sk.ffi.numberToJs", Sk.ffi.numberToJs);

/**
 * Usage:
 *
 * valueJs = Sk.ffi.remapToJs(valuePy);
 */
Sk.ffi.remapToJs = function(valuePy)
{
    if (typeof valuePy === 'undefined')
    {
        // TODO: Probably should ultimately be an assertion since Python has no concept of undefined.
        return valuePy;
    }
    else if (valuePy instanceof Sk.builtin.dict)
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
    else if (valuePy instanceof Sk.builtin.list)
    {
        var ret = [];
        for (var i = 0; i < valuePy.v.length; ++i)
        {
            ret.push(Sk.ffi.remapToJs(valuePy.v[i]));
        }
        return ret;
    }
    else if (valuePy instanceof Sk.builtin.nmber)
    {
        return Sk.builtin.asnum$(valuePy);
    }
    else if (valuePy instanceof Sk.builtin.lng)
    {
        return Sk.builtin.asnum$(valuePy);
    }
    else if (valuePy === Sk.builtin.bool.true$)
    {
        return Sk.ffi.booleanToJs(valuePy);
    }
    else if (valuePy === Sk.builtin.bool.false$)
    {
        return Sk.ffi.booleanToJs(valuePy);
    }
    else if (typeof valuePy.v !== 'undefined')
    {
        // TODO: This is being exercised, but we should assert the tp$name.
        // I think the pattern here suggests that we have a Sk.builtin.something
        return valuePy.v;
    }
    else
    {
        // The following statement is provided because the proper representation of Python types in Skulpt is 'incorrect'.
        // You might see JavaScript 'boolean' and 'string' values stored in the 'v' property.
        return valuePy.v;
    }
};
goog.exportSymbol("Sk.ffi.remapToJs", Sk.ffi.remapToJs);

// TODO: Deprecate and/or rename to remapFunctionToPy?
Sk.ffi.callback = function(fn)
{
    if (fn === undefined) return fn;
    return function() {
        return Sk.misceval.apply(fn, undefined, undefined, undefined, Array.prototype.slice.call(arguments, 0));
    };
};
goog.exportSymbol("Sk.ffi.callback", Sk.ffi.callback);
