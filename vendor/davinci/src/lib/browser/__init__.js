/*
 * 'browser' Python module
 *
 * Exposes the window and document variables.
 */
var $builtinmodule = function(name) {

  var mod = {};

  var EVENT                    = 'Event';
  var FUNCTION                 = 'function';
  var NODE                     = 'Node';
  var WINDOW                   = 'Window';
  var WINDOW_ANIMATION_RUNNER  = 'WindowAnimationRunner';
  var METHOD_START             = 'start';

  mod[EVENT] = Sk.builtin.buildEventClass(mod);

  mod[NODE]  = Sk.builtin.buildNodeClass(mod);

  mod['window'] = Sk.ffi.callsim(Sk.builtin.buildWindowClass(mod));

  mod['document'] = Sk.ffi.callsim(Sk.builtin.buildDocumentClass(mod));

  mod[WINDOW_ANIMATION_RUNNER] = Sk.ffi.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = Sk.ffi.functionPy(function(selfPy, windowPy, tickPy, terminatePy, setUpPy, tearDownPy) {
      Sk.ffi.checkMethodArgs(WINDOW_ANIMATION_RUNNER, arguments, 5, 5);
      Sk.ffi.checkArgType("window",    WINDOW,   Sk.ffi.isObjectRef(windowPy) && Sk.ffi.typeName(windowPy) === WINDOW);
      Sk.ffi.checkArgType("tick",      FUNCTION, Sk.ffi.isFunction(tickPy));
      Sk.ffi.checkArgType("terminate", FUNCTION, Sk.ffi.isFunction(terminatePy));
      Sk.ffi.checkArgType("setUp",     FUNCTION, Sk.ffi.isFunction(setUpPy));
      Sk.ffi.checkArgType("tearDown",  FUNCTION, Sk.ffi.isFunction(tearDownPy));
      var WindowAnimationRunner = function() {
        this.window    = Sk.ffi.remapToJs(windowPy);
        this.tick      = Sk.ffi.remapToJs(tickPy);
        this.terminate = Sk.ffi.remapToJs(terminatePy);
        this.setUp     = Sk.ffi.remapToJs(setUpPy);
        this.tearDown  = Sk.ffi.remapToJs(tearDownPy);
        this.startTime = null;
        this.elapsed   = null;
        this.requestID = null;
      };
      WindowAnimationRunner.prototype = {
        constructor: WindowAnimationRunner,
        start: function() {
          var war = this;
          war.setUp();
          var animate = function(timestamp) {
            if (war.startTime) {
              war.elapsed = timestamp - war.startTime;
            }
            else {
              if (timestamp) {
                war.startTime = timestamp;
              }
              else {
                war.elapsed = 0;
              }
            }
            if (war.terminate(war.elapsed)) {
              war.window.cancelAnimationFrame(war.requestID);
              war.tearDown();
            }
            else {
              war.requestID = war.window.requestAnimationFrame(animate);
              war.tick(war.elapsed);
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
    $loc.__getattr__ = Sk.ffi.functionPy(function(selfPy, name) {
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
    $loc.__str__ = Sk.ffi.functionPy(function(selfPy) {
      return Sk.ffi.stringToPy(WINDOW_ANIMATION_RUNNER);
    });
    $loc.__repr__ = Sk.ffi.functionPy(function(selfPy) {
      return Sk.ffi.stringToPy(WINDOW_ANIMATION_RUNNER + "(" + ")");
    });
  }, WINDOW_ANIMATION_RUNNER, []);

  return mod;
}
