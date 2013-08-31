var $builtinmodule = function(name)
{
    var mod = {};

    var FUNCTION_PARSE     = "parse";
    var FUNCTION_STRINGIFY = "stringify";

    mod[FUNCTION_PARSE] = Sk.ffi.defineFunction(function(textPy, reviverPy) {
        Sk.ffi.checkArgCount(FUNCTION_PARSE, arguments, 1, 1);
        Sk.ffi.checkArgType("text",    "string",   Sk.ffi.isString(textPy));
        Sk.ffi.checkArgType("reviver", "function", Sk.ffi.isUndefined(reviverPy) || isFunction(reviverPy));
        var text = Sk.ffi.remapToJs(textPy);
        var reviver = Sk.ffi.remapToJs(reviverPy);
        return Sk.ffi.remapToPy(JSON.parse(text, reviver));
    });

    mod[FUNCTION_STRINGIFY] = Sk.ffi.defineFunction(function(valuePy, replacerPy, spacePy) {
        Sk.ffi.checkArgCount(FUNCTION_STRINGIFY, arguments, 1, 3);
        Sk.ffi.checkArgType("value",    "dict",     Sk.ffi.isDictionary(valuePy));
        Sk.ffi.checkArgType("replacer", "function", Sk.ffi.isUndefined(replacerPy) || Sk.ffi.isNone(replacerPy) || Sk.ffi.isFunction(replacerPy));
        Sk.ffi.checkArgType("space",    "int",      Sk.ffi.isUndefined(spacePy)    || Sk.ffi.isInt(spacePy));
        var value = Sk.ffi.remapToJs(valuePy);
        var replacer = Sk.ffi.remapToJs(replacerPy);
        var space = Sk.ffi.remapToJs(spacePy);
        return Sk.ffi.remapToPy(JSON.stringify(value, replacer, space));
    });

    return mod;
}