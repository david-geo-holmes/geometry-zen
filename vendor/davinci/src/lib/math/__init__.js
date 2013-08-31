var $builtinmodule = function(name)
{
    var mod = {};

    mod.pi = Sk.ffi.numberToPy(Math.PI);
    mod.e  = Sk.ffi.numberToPy(Math.E);

    mod.fabs = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("fabs", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        return Sk.ffi.numberToPy(Math.abs(Sk.ffi.numberToJs(x)));
    });

    mod.asin = Sk.ffi.defineFunction(function(rad) {
        Sk.ffi.checkArgCount("asin", arguments, 1, 1);
        Sk.ffi.checkArgType("rad", "number", Sk.builtin.checkNumber(rad));
        return new Sk.builtin.nmber(Math.asin(Sk.builtin.asnum$(rad)), Sk.builtin.nmber.float$);
    });

    mod.acos = Sk.ffi.defineFunction(function(rad) {
        Sk.ffi.checkArgCount("acos", arguments, 1, 1);
        Sk.ffi.checkArgType("rad", "number", Sk.builtin.checkNumber(rad));
        return new Sk.builtin.nmber(Math.acos(Sk.builtin.asnum$(rad)), Sk.builtin.nmber.float$);
    });

    mod.atan = Sk.ffi.defineFunction(function(rad) {
        Sk.ffi.checkArgCount("atan", arguments, 1, 1);
        Sk.ffi.checkArgType("rad", "number", Sk.builtin.checkNumber(rad));
        return new Sk.builtin.nmber(Math.atan(Sk.builtin.asnum$(rad)), Sk.builtin.nmber.float$);
    });

    mod.atan2 = Sk.ffi.defineFunction(function(y, x) {
        Sk.ffi.checkArgCount("atan2", arguments, 2, 2);
        Sk.ffi.checkArgType("y", "number", Sk.builtin.checkNumber(y));
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        return new Sk.builtin.nmber(Math.atan2(Sk.builtin.asnum$(y), Sk.builtin.asnum$(x)), Sk.builtin.nmber.float$);
    });

    mod.sin = Sk.ffi.defineFunction(function(rad) {
        Sk.ffi.checkArgCount("sin", arguments, 1, 1);
        Sk.ffi.checkArgType("rad", "number", Sk.builtin.checkNumber(rad));
        return new Sk.builtin.nmber(Math.sin(Sk.builtin.asnum$(rad)), Sk.builtin.nmber.float$);
    });

    mod.cos = Sk.ffi.defineFunction(function(rad) {
        Sk.ffi.checkArgCount("cos", arguments, 1, 1);
        Sk.ffi.checkArgType("rad", "number", Sk.builtin.checkNumber(rad));
        return new Sk.builtin.nmber(Math.cos(Sk.builtin.asnum$(rad)), Sk.builtin.nmber.float$);
    });

    mod.tan = Sk.ffi.defineFunction(function(rad) {
        Sk.ffi.checkArgCount("tan", arguments, 1, 1);
        Sk.ffi.checkArgType("rad", "number", Sk.builtin.checkNumber(rad));
        return new Sk.builtin.nmber(Math.tan(Sk.builtin.asnum$(rad)), Sk.builtin.nmber.float$);
    });

    mod.asinh = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("asinh", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        x = Sk.builtin.asnum$(x);

        var L = x + Math.sqrt(x*x+1);

        return new Sk.builtin.nmber(Math.log(L), Sk.builtin.nmber.float$);
    });

    mod.acosh = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("acosh", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        x = Sk.builtin.asnum$(x);

        var L = x + Math.sqrt(x*x-1);

        return new Sk.builtin.nmber(Math.log(L), Sk.builtin.nmber.float$);
    });

    mod.atanh = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("atanh", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        x = Sk.builtin.asnum$(x);

        var L = (1+x)/(1-x);

        return new Sk.builtin.nmber(Math.log(L)/2, Sk.builtin.nmber.float$);
    });

    mod.sinh = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("sinh", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        x = Sk.builtin.asnum$(x);

        var e = Math.E;
        var p = Math.pow(e, x);
        var n = 1/p;
        var result = (p-n)/2;

        return new Sk.builtin.nmber(result, Sk.builtin.nmber.float$);
    });

    mod.cosh = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("cosh", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        x = Sk.builtin.asnum$(x);

        var e = Math.E;
        var p = Math.pow(e, x);
        var n = 1/p;
        var result = (p+n)/2;

        return new Sk.builtin.nmber(result, Sk.builtin.nmber.float$);
    });

    mod.tanh = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("tanh", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        x = Sk.builtin.asnum$(x);

        var e = Math.E;
        var p = Math.pow(e, x);
        var n = 1/p;
        var result = ((p-n)/2)/((p+n)/2);

        return new Sk.builtin.nmber(result, Sk.builtin.nmber.float$);
    });

    mod.ceil = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("ceil", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        return new Sk.builtin.nmber(Math.ceil(Sk.builtin.asnum$(x)), Sk.builtin.nmber.float$);
    });

    mod.floor = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("floor", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        return new Sk.builtin.nmber(Math.floor(Sk.builtin.asnum$(x)), Sk.builtin.nmber.float$);
    });

    mod.sqrt = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("sqrt", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        return new Sk.builtin.nmber(Math.sqrt(Sk.builtin.asnum$(x)), Sk.builtin.nmber.float$);
    });

    mod.trunc = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("trunc", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        return new Sk.builtin.nmber(Sk.builtin.asnum$(x)|0, Sk.builtin.nmber.float$);
    });

    mod.log = Sk.ffi.defineFunction(function(x, base) {
        Sk.ffi.checkArgCount("log", arguments, 1, 2);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        if (base === undefined) {
            return new Sk.builtin.nmber(Math.log(Sk.builtin.asnum$(x)), Sk.builtin.nmber.float$);
        } else {
            Sk.ffi.checkArgType("base", "number", Sk.builtin.checkNumber(base));
            var ret = Math.log(Sk.builtin.asnum$(x)) / Math.log(Sk.builtin.asnum$(base));
            return new Sk.builtin.nmber(ret, Sk.builtin.nmber.float$);
        }
    });

    mod.log10 = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("log10", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        var ret = Math.log(Sk.builtin.asnum$(x)) / Math.log(10);
        return new Sk.builtin.nmber(ret, Sk.builtin.nmber.float$);
    });

    mod.exp = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("exp", arguments, 1, 1);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        return new Sk.builtin.nmber(Math.exp(Sk.builtin.asnum$(x)), Sk.builtin.nmber.float$);
    });

    mod.pow = Sk.ffi.defineFunction(function(x,y) {
        Sk.ffi.checkArgCount("pow", arguments, 2, 2);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        Sk.ffi.checkArgType("y", "number", Sk.builtin.checkNumber(y));

        return new Sk.builtin.nmber(Math.pow(Sk.builtin.asnum$(x), Sk.builtin.asnum$(y)), Sk.builtin.nmber.float$);
    });

    mod.radians = Sk.ffi.defineFunction(function(deg) {
        Sk.ffi.checkArgCount("radians", arguments, 1, 1);
        Sk.ffi.checkArgType("deg", "number", Sk.builtin.checkNumber(deg));

        var ret = Math.PI / 180.0 * Sk.builtin.asnum$(deg);
        return new Sk.builtin.nmber(ret, Sk.builtin.nmber.float$);
    });

    mod.degrees = Sk.ffi.defineFunction(function(rad) {
        Sk.ffi.checkArgCount("degrees", arguments, 1, 1);
        Sk.ffi.checkArgType("rad", "number", Sk.builtin.checkNumber(rad));

        var ret = 180.0 / Math.PI * Sk.builtin.asnum$(rad);
        return new Sk.builtin.nmber(ret, Sk.builtin.nmber.float$);
    });

    mod.hypot = Sk.ffi.defineFunction(function(x, y) {
        Sk.ffi.checkArgCount("hypot", arguments, 2, 2);
        Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));
        Sk.ffi.checkArgType("y", "number", Sk.builtin.checkNumber(y));

        x = Sk.builtin.asnum$(x);
        y = Sk.builtin.asnum$(y);
        return new Sk.builtin.nmber(Math.sqrt((x*x)+(y*y)), Sk.builtin.nmber.float$);
    });

    mod.factorial = Sk.ffi.defineFunction(function(x) {
        Sk.ffi.checkArgCount("factorial", arguments, 1, 1);
            Sk.ffi.checkArgType("x", "number", Sk.builtin.checkNumber(x));

        x = Math.floor(Sk.builtin.asnum$(x));
        var r = 1;
        for (var i = 2; i <= x; i++)
            r *= i;
        return new Sk.builtin.nmber(r, Sk.builtin.nmber.int$);
    });

    return mod;
}