/*
 * 'browser' Python module
 *
 * Exposes the window and document variables.
 */
var $builtinmodule = function(name) {

  var mod = {};

  var EVENT                    = 'Event';
  var NODE                     = 'Node';
  var WINDOW                   = 'Window';
  var WINDOW_ANIMATION_RUNNER  = 'WindowAnimationRunner';
  var METHOD_START             = 'start';

  mod[EVENT] = Sk.builtin.buildEventClass(mod);

  mod[NODE]  = Sk.builtin.buildNodeClass(mod);

  mod['window'] = Sk.ffi.callsim(Sk.builtin.buildWindowClass(mod));

  mod['document'] = Sk.ffi.callsim(Sk.builtin.buildDocumentClass(mod));

  mod[WINDOW_ANIMATION_RUNNER] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.defineFunction(function(selfPy, windowPy, renderPy) {
      Sk.ffi.checkMethodArgs(WINDOW_ANIMATION_RUNNER, arguments, 2, 2);
      Sk.ffi.checkArgType("window", WINDOW,     Sk.ffi.isObjectRef(windowPy) && Sk.ffi.typeName(windowPy) === WINDOW);
      Sk.ffi.checkArgType("render", "function", Sk.ffi.isFunction(renderPy));
      var WindowAnimationRunner = function() {
        this.window      = Sk.ffi.remapToJs(windowPy);
        this.render      = Sk.ffi.remapToJs(renderPy);
        this.startTime   = null;
        this.progress    = null;
        this.requestID   = null;
        this.progressEnd = 6000;
      };
      WindowAnimationRunner.prototype = {
        constructor: WindowAnimationRunner,
        start: function() {
          var war = this;
          var animate = function(timestamp) {
            if (war.startTime) {
              war.progress = timestamp - war.startTime;
            }
            else {
              if (timestamp) {
                war.startTime = timestamp;
              }
              else {
                war.progress = 0;
              }
            }
            if (war.progress < war.progressEnd) {
              war.requestID = war.window.requestAnimationFrame(animate);
              war.render(timestamp);
            }
            else {
              war.window.cancelAnimationFrame(war.requestID);
            }
          };
          animate(null);
        },
        toString: function() {
          return WINDOW_ANIMATION_RUNNER;
        }
      };
      Sk.ffi.referenceToPy(new WindowAnimationRunner(), WINDOW_ANIMATION_RUNNER, undefined, selfPy);
    });
    $loc.__getattr__ = Sk.ffi.defineFunction(function(selfPy, name) {
      var war = Sk.ffi.remapToJs(selfPy);
      switch(name) {
        case METHOD_START: {
          return Sk.ffi.callableToPy(mod, war, METHOD_START, function(methodPy) {
            Sk.ffi.checkMethodArgs(METHOD_START, arguments, 0, 0);
            war.start();
          });
        }
      }
    });
    $loc.__str__ = Sk.ffi.defineFunction(function(selfPy) {
      return Sk.ffi.stringToPy(WINDOW_ANIMATION_RUNNER);
    });
    $loc.__repr__ = Sk.ffi.defineFunction(function(selfPy) {
      return Sk.ffi.stringToPy(WINDOW_ANIMATION_RUNNER + "(" + ")");
    });
  }, WINDOW_ANIMATION_RUNNER, []);

  return mod;
}
