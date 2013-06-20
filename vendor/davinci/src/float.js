Sk.builtin.float_ = function(x) {
  function toNumberJS(x) {
    if (x instanceof Sk.builtin.str) {
      if (x.v === "inf") return Infinity;
      else if (x.v === "-inf") return -Infinity;
      else if (!isNaN(x.v)) return parseFloat(x.v);
      else {
        throw new Sk.builtin.ValueError("float: Argument: " + x.v + " is not number");
      }
    }
    else {
      return Sk.builtin.asnum$(x);
    }
  }
  return new Sk.builtin.nmber(toNumberJS(x), Sk.builtin.nmber.float$);
};

Sk.builtin.float_.prototype.tp$name = "float";
Sk.builtin.float_.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("float", Sk.builtin.float_);
