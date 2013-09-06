var $builtinmodule = function(name) {
  var mod = {};
  Sk.builtin.defineComplex(mod, "complex");
  return mod;
};
