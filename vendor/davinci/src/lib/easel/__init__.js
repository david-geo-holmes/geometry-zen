/**
 * Geometric Algebra (e2ga) module.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {

  var EUCLIDEAN_2    = "Euclidean2";
  var PROP_W         = "w";
  var PROP_X         = "x";
  var PROP_Y         = "y";
  var PROP_XY        = "xy";
  var METHOD_CLONE   = "clone";
  var METHOD_LENGTH  = "length";

  var POINT                   = "Point";

  var EASE                    = "Ease";
  var PROP_BOUNCE_OUT         = "bounceOut";

  var GRAPHICS                = "Graphics";
  var METHOD_BEGIN_FILL       = "beginFill";
  var METHOD_BEGIN_STROKE     = "beginStroke";
  var METHOD_DRAW_CIRCLE      = "drawCircle";
  var METHOD_END_FILL         = "endFill";
  var METHOD_END_STROKE       = "endStroke";
  var METHOD_MOVE_TO          = "moveTo";
  var METHOD_LINE_TO          = "lineTo";
  var METHOD_SET_STROKE_STYLE = "setStrokeStyle";

  var MOVIE_CLIP              = "MovieClip";
  var METHOD_GOTO_AND_PLAY    = "gotoAndPlay";

  var PROP_TIMELINE           = "timeline";

  var STAGE              = "Stage";
  var PROP_CANVAS        = "canvas";
  var PROP_AUTO_CLEAR    = "autoClear";
  var PROP_MOUSE_X       = "mouseX";
  var PROP_MOUSE_Y       = "mouseY";
  var METHOD_ADD_CHILD   = "addChild";
  var METHOD_UPDATE      = "update";

  var SHAPE                     = "Shape";
  var PROP_ALPHA                = "alpha";
  var PROP_GRAPHICS             = "graphics";
  var METHOD_HIT_TEST           = "hitTest";
  var METHOD_GLOBAL_TO_LOCAL    = "globalToLocal";

  var TICKER                    = "Ticker";
  var METHOD_ADD_EVENT_LISTENER = "addEventListener";

  var TWEEN                     = "Tween";
  var METHOD_CALL               = "onComplete";
  var METHOD_GET                = "get";
  var METHOD_TO                 = "to";
  var METHOD_WAIT               = "wait";
  var METHOD_ADD_TWEEN          = "addTween";

  var mod = {};

  function isNumber(x)    { return typeof x === 'number'; }

  function remapE2ToPy(x00, x01, x10, x11) {
    return Sk.misceval.callsim(mod[EUCLIDEAN_2],
      Sk.builtin.assk$(x00, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x01, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x10, Sk.builtin.nmber.float$),
      Sk.builtin.assk$(x11, Sk.builtin.nmber.float$));
  }

  function stringFromCoordinates(coordinates, labels, multiplier) {
    var append, i, sb, str, _i, _ref;
    sb = [];
    append = function(number, label) {
      var n;
      if (number !== 0) {
        if (number >= 0) {
          if (sb.length > 0) {
            sb.push("+");
          }
        } else {
          sb.push("-");
        }
        n = Math.abs(number);
        if (n === 1) {
          return sb.push(label);
        } else {
          sb.push(n.toString());
          if (label !== "1") {
            sb.push(multiplier);
            return sb.push(label);
          }
        }
      }
    };
    for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      append(coordinates[i], labels[i]);
    }
    if (sb.length > 0) {
      str = sb.join("");
    } else {
      str = "0";
    }
    return str;
  }

  function divide(a00, a01, a10, a11, b00, b01, b10, b11, x) {
    // r = ~b
    var r00 = +b00;
    var r01 = +b01;
    var r10 = +b10;
    var r11 = -b11;
    // m = b * r
    var m00 = b00 * r00 + b01 * r01 + b10 * r10 - b11 * r11;
    var m01 = 0;
    var m10 = 0;
    var m11 = 0;
    // c = cliffordConjugate(m)
    var c00 = +m00;
    var c01 = -m01;
    var c10 = -m10;
    var c11 = -m11;
    // s = r * c
    var s00 = r00 * c00 + r01 * c01 + r10 * c10 - r11 * c11;
    var s01 = r00 * c01 + r01 * c00 - r10 * c11 + r11 * c10;
    var s10 = r00 * c10 + r01 * c11 + r10 * c00 - r11 * c01;
    var s11 = r00 * c11 + r01 * c10 - r10 * c01 + r11 * c00;
    // k = b * s
    var k00 = b00 * s00 + b01 * s01 + b10 * s10 - b11 * s11;
    // i = inverse(b)
    var i00 = s00/k00;
    var i01 = s01/k00;
    var i10 = s10/k00;
    var i11 = s11/k00;
    // x = a * inverse(b)
    var x00 = a00 * i00 + a01 * i01 + a10 * i10 - a11 * i11;
    var x01 = a00 * i01 + a01 * i00 - a10 * i11 + a11 * i10;
    var x10 = a00 * i10 + a01 * i11 + a10 * i00 - a11 * i01;
    var x11 = a00 * i11 + a01 * i10 - a10 * i01 + a11 * i00;
    if (typeof x !== 'undefined') {
      x[0] = x00;
      x[1] = x01;
      x[2] = x10;
      x[3] = x11;
    }
    else {
      return remapE2ToPy(x00, x01, x10, x11);
    }
  }

  mod[GRAPHICS] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, graphicsPy) {
      self.tp$name = GRAPHICS;
      var graphics = Sk.ffi.remapToJs(graphicsPy);
      if (graphics) {
        self.v = graphics;
      }
      else {
        if (typeof createjs[GRAPHICS] === 'undefined') {
          throw new Error("Missing " + GRAPHICS + " JavaScript implementation.");
        }
        self.v = new createjs[GRAPHICS]();
      }
    });
    $loc.__getattr__ = new Sk.builtin.func(function(graphicsPy, name) {
      var graphics = Sk.ffi.remapToJs(graphicsPy);
      switch(name) {
        case METHOD_BEGIN_FILL: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_BEGIN_FILL;
              self.v = graphics[METHOD_BEGIN_FILL];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, color) {
              color = Sk.ffi.remapToJs(color);
              graphics[METHOD_BEGIN_FILL](color);
              return graphicsPy;
            });
          }, METHOD_BEGIN_FILL, []));
        }
        break;
        case METHOD_BEGIN_STROKE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_BEGIN_STROKE;
              self.v = graphics[METHOD_BEGIN_STROKE];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, color) {
              color = Sk.ffi.remapToJs(color);
              graphics[METHOD_BEGIN_STROKE](color);
              return graphicsPy;
            });
          }, METHOD_BEGIN_STROKE, []));
        }
        break;
        case METHOD_DRAW_CIRCLE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_DRAW_CIRCLE;
              self.v = graphics[METHOD_DRAW_CIRCLE];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, x, y, radius) {
              x = Sk.ffi.remapToJs(x);
              y = Sk.ffi.remapToJs(y);
              radius = Sk.ffi.remapToJs(radius);
              graphics[METHOD_DRAW_CIRCLE](x, y, radius);
              return graphicsPy;
            });
          }, METHOD_DRAW_CIRCLE, []));
        }
        break;
        case METHOD_END_FILL: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_END_FILL;
              self.v = graphics[METHOD_END_FILL];
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              graphics[METHOD_END_FILL]();
              return graphicsPy;
            });
          }, METHOD_END_FILL, []));
        }
        break;
        case METHOD_END_STROKE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_END_STROKE;
              self.v = graphics[METHOD_END_STROKE];
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              graphics[METHOD_END_STROKE]();
              return graphicsPy;
            });
          }, METHOD_END_STROKE, []));
        }
        break;
        case METHOD_LINE_TO: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_LINE_TO;
              self.v = graphics[METHOD_LINE_TO];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, x, y) {
              x = Sk.ffi.remapToJs(x);
              y = Sk.ffi.remapToJs(y);
              graphics[METHOD_LINE_TO](x, y);
              return graphicsPy;
            });
          }, METHOD_LINE_TO, []));
        }
        break;
        case METHOD_MOVE_TO: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_MOVE_TO;
              self.v = graphics[METHOD_MOVE_TO];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, x, y) {
              x = Sk.ffi.remapToJs(x);
              y = Sk.ffi.remapToJs(y);
              graphics[METHOD_MOVE_TO](x, y);
              return graphicsPy;
            });
          }, METHOD_MOVE_TO, []));
        }
        break;
        case METHOD_SET_STROKE_STYLE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_STROKE_STYLE;
              self.v = graphics[METHOD_SET_STROKE_STYLE];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, thickness, caps, joints, miterLimit, ignoreScale) {
              thickness = Sk.ffi.remapToJs(thickness);
              caps = Sk.ffi.remapToJs(caps);
              joints = Sk.ffi.remapToJs(joints);
              miterLimit = Sk.ffi.remapToJs(miterLimit);
              ignoreScale = Sk.ffi.remapToJs(ignoreScale);
              graphics[METHOD_SET_STROKE_STYLE](thickness, caps, joints, miterLimit, ignoreScale);
              return graphicsPy;
            });
          }, METHOD_SET_STROKE_STYLE, []));
        }
        break;
      }
    });
  }, GRAPHICS, []);

  mod[MOVIE_CLIP] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, modePy, startPositionPy, loopPy, labelsPy) {
      var mode = (modePy !== null) ? Sk.ffi.remapToJs(modePy) : null;
      var startPosition = Sk.ffi.remapToJs(startPositionPy);
      var loop = Sk.ffi.remapToJs(loopPy);
      var labels = Sk.ffi.remapToJs(labelsPy);
      self.tp$name = MOVIE_CLIP;
      if (typeof createjs[MOVIE_CLIP] === 'undefined') {
        throw new Error("Missing " + MOVIE_CLIP + " JavaScript implementation.");
      }
      self.v = new createjs[MOVIE_CLIP](mode, startPosition, loop, labels);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(movieClipPy, name) {
      var movieClip = Sk.ffi.remapToJs(movieClipPy);
      switch(name) {
        case PROP_TIMELINE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = PROP_TIMELINE;
              self.v = movieClip.timeline;
            });
            $loc.__getattr__ = new Sk.builtin.func(function(timelinePy, name) {
              var timeline = Sk.ffi.remapToJs(timelinePy);
              switch(name) {
                case METHOD_ADD_TWEEN: {
                  return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                    $loc.__init__ = new Sk.builtin.func(function(self) {
                      self.tp$name = METHOD_ADD_TWEEN;
                      self.v = timeline[METHOD_ADD_TWEEN];
                    });
                    $loc.__call__ = new Sk.builtin.func(function(self, tweenPy) {
                      var tween = Sk.ffi.remapToJs(tweenPy);
                      timeline.addTween(tween);
                    });
                  }, METHOD_ADD_TWEEN, []));
                }
                break;
              }
            });
          }, PROP_TIMELINE, []));
        }
        break;
        case METHOD_GOTO_AND_PLAY: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GOTO_AND_PLAY;
              self.v = movieClip[METHOD_GOTO_AND_PLAY];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, labelPy) {
              var label = Sk.ffi.remapToJs(labelPy);
              movieClip[METHOD_GOTO_AND_PLAY](label);
            });
          }, METHOD_GOTO_AND_PLAY, []));
        }
        break;
       }
    });
  }, MOVIE_CLIP, []);

  mod[SHAPE] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, argPy) {
      self.tp$name = SHAPE;
      if (typeof argPy === 'undefined') {
        self.v = new createjs[SHAPE]();
      }
      else {
        console.log("typeof argPy => " + typeof argPy);
        var name = argPy.tp$name;
        if (typeof name === 'string') {
          switch(name) {
            case SHAPE: {
              self.v = Sk.ffi.remapToJs(argPy);
            }
            break;
            case GRAPHICS: {
              self.v = new createjs[SHAPE](Sk.ffi.remapToJs(argPy));
            }
            break;
            default: {
              throw new Error(name);
            }
          }
        }
        else {
          throw new Error(typeof name);
        }
      }
    });
    $loc.__getattr__ = new Sk.builtin.func(function(shapePy, name) {
      var shape = Sk.ffi.remapToJs(shapePy);
      switch(name) {
        case PROP_GRAPHICS: {
          return Sk.misceval.callsim(mod[GRAPHICS], Sk.ffi.referenceToPy(shape.graphics, GRAPHICS));
        }
        case PROP_ALPHA: {
          return Sk.builtin.assk$(shape[PROP_ALPHA], Sk.builtin.nmber.float$);
        }
        case PROP_X: {
          return Sk.builtin.assk$(shape[PROP_X], Sk.builtin.nmber.int$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(shape[PROP_Y], Sk.builtin.nmber.int$);
        }
        case METHOD_GLOBAL_TO_LOCAL: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GLOBAL_TO_LOCAL;
              self.v = shape[METHOD_GLOBAL_TO_LOCAL];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, x, y) {
              var point = shape[METHOD_GLOBAL_TO_LOCAL](Sk.ffi.remapToJs(x), Sk.ffi.remapToJs(y));
              return Sk.misceval.callsim(mod[POINT], Sk.ffi.referenceToPy(point, POINT));
            });
          }, METHOD_GLOBAL_TO_LOCAL, []));
        }
        case METHOD_HIT_TEST: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_HIT_TEST;
              self.v = shape[METHOD_HIT_TEST];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, x, y) {
              return Sk.ffi.remapToPy(shape[METHOD_HIT_TEST](Sk.ffi.remapToJs(x), Sk.ffi.remapToJs(y)));
            });
          }, METHOD_HIT_TEST, []));
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(shapePy, name, valuePy) {
      var shape = Sk.ffi.remapToJs(shapePy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_ALPHA: {
          shape[PROP_ALPHA] = value;
        }
        break;
        case PROP_X: {
          shape[PROP_X] = value;
        }
        break;
        case PROP_Y: {
          shape[PROP_Y] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a writeable attribute of " + SHAPE);
        }
      }
    });
  }, SHAPE, []);

  mod[STAGE] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, canvasPy) {
      var canvas = Sk.ffi.remapToJs(canvasPy);
      self.tp$name = STAGE;
      if (typeof createjs[STAGE] === 'undefined') {
        throw new Error("Missing " + STAGE + " JavaScript implementation.");
      }
      self.v = new createjs[STAGE](canvas);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(stagePy, name) {
      var stage = Sk.ffi.remapToJs(stagePy);
      switch(name) {
        case PROP_CANVAS: {
          return Sk.builtin.assk$(5, Sk.builtin.nmber.int$);
        }
        break;
        case PROP_MOUSE_X: {
          return Sk.builtin.assk$(stage[PROP_MOUSE_X], Sk.builtin.nmber.int$);
        }
        break;
        case PROP_MOUSE_Y: {
          return Sk.builtin.assk$(stage[PROP_MOUSE_Y], Sk.builtin.nmber.int$);
        }
        break;
        case METHOD_ADD_CHILD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD_CHILD;
              self.v = stage[METHOD_ADD_CHILD];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, childPy) {
              var child = stage.addChild(Sk.ffi.remapToJs(childPy));
              return Sk.misceval.callsim(mod[SHAPE], Sk.ffi.referenceToPy(child, SHAPE));
            });
          }, METHOD_ADD_CHILD, []));
        }
        break;
        case METHOD_UPDATE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_UPDATE;
              self.v = stage[METHOD_UPDATE];
            });
            $loc.__call__ = new Sk.builtin.func(function(updatePy) {
              stage.update();
            });
          }, METHOD_UPDATE, []));
        }
        break;
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(stagePy, name, valuePy) {
      var stage = Sk.ffi.remapToJs(stagePy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_AUTO_CLEAR: {
          stage[PROP_AUTO_CLEAR] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a writeable attribute of " + SHAPE);
        }
      }
    });
  }, STAGE, []);

  mod[TICKER] = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = TICKER;
      self.v = createjs[TICKER];
    });
    $loc.__getattr__ = new Sk.builtin.func(function(tickerPy, name) {
      var ticker = Sk.ffi.remapToJs(tickerPy);
      switch(name) {
        case METHOD_ADD_EVENT_LISTENER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD_EVENT_LISTENER;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, typePy, listenerPy, useCapture) {
              var type = Sk.ffi.remapToJs(typePy);
              var listener = Sk.ffi.remapToJs(listenerPy);
              if (typeof listener === 'object') {
                ticker[METHOD_ADD_EVENT_LISTENER](type, listener, useCapture);
              }
              else {
                var listener = function(event) {
                  Sk.misceval.callsim(listenerPy);
                };
                ticker[METHOD_ADD_EVENT_LISTENER](type, listener, useCapture);
              }
            });
          }, METHOD_ADD_EVENT_LISTENER, []));
        }
        break;
      }
    });
  }, TICKER, []));

  mod[TWEEN] = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = TWEEN;
      self.v = createjs[TWEEN];
    });
    $loc.__getattr__ = new Sk.builtin.func(function(entryPointPy, name) {
      var entryPoint = Sk.ffi.remapToJs(entryPointPy);
      switch(name) {
        case METHOD_GET: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GET;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, target, props, pluginData, override) {
              target = Sk.ffi.remapToJs(target);
              props = Sk.ffi.remapToJs(props);
              pluginData = Sk.ffi.remapToJs(pluginData);
              override = Sk.ffi.remapToJs(override);
              var tween = entryPoint[METHOD_GET](target, props, pluginData, override);
              return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                $loc.__init__ = new Sk.builtin.func(function(self) {
                  self.tp$name = TWEEN;
                  self.v = tween;
                });
                $loc.__getattr__ = new Sk.builtin.func(function(tweenPy, name) {
                  var tween = Sk.ffi.remapToJs(tweenPy);
                  switch(name) {
                    case METHOD_TO: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_TO;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, props, duration, ease) {
                          props = Sk.ffi.remapToJs(props);
                          duration = Sk.ffi.remapToJs(duration);
                          ease = Sk.ffi.remapToJs(ease);
                          tween[METHOD_TO](props, duration, ease);
                          return tweenPy;
                        });
                      }, METHOD_TO, []));
                    }
                    break;
                    case METHOD_CALL: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_CALL;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, callbackPy, argsPy) {
                          var callbackJS = function(argsJs) {
                            Sk.misceval.callsim(callbackPy, Sk.ffi.remapToPy(argsJs));
                          };
                          var argsJs = Sk.ffi.remapToJs(argsPy);
                          tween.call(callbackJS, argsJs);
                          return tweenPy;
                        });
                      }, METHOD_CALL, []));
                    }
                    break;
                    case METHOD_WAIT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_WAIT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, duration) {
                          duration = Sk.ffi.remapToJs(duration);
                          tween[METHOD_WAIT](duration);
                          return tweenPy;
                        });
                      }, METHOD_WAIT, []));
                    }
                    break;
                  }
                });
              }, TWEEN, []));
            });
          }, METHOD_GET, []));
        }
        break;
      }
    });
  }, TWEEN, []));

  mod[EASE] = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = EASE;
      self.v = createjs[EASE];
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case PROP_BOUNCE_OUT: {
          var fn = createjs[EASE][PROP_BOUNCE_OUT];
          return {"v": fn};
        }
      }
    });
  }, EASE, []));

  mod[POINT] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, x, y) {
      Sk.builtin.pyCheckArgs(POINT, arguments, 1, 3);
      self.tp$name = POINT;
      switch(arguments.length) {
        case 1: {
          self.v = new createjs.Point();
        }
        break;
        case 2: {
          x = Sk.ffi.remapToJs(x);
          self.tp$name = POINT;
          self.v = x;
        }
        break;
        case 3: {
          Sk.builtin.pyCheckType("x", "number", Sk.builtin.checkNumber(x));
          Sk.builtin.pyCheckType("y", "number", Sk.builtin.checkNumber(y));
          x = Sk.ffi.remapToJs(x);
          y = Sk.ffi.remapToJs(y);
          self.tp$name = POINT;
          self.v = new createjs.Point(x, y);
        }
        break;
      }
    });
    $loc.__getattr__ = new Sk.builtin.func(function(pointPy, name) {
      var point = Sk.ffi.remapToJs(pointPy);
      switch(name) {
        case PROP_X: {
          return Sk.builtin.assk$(point.x, Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(point.y, Sk.builtin.nmber.float$);
        }
        case METHOD_CLONE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(methodPy) {
              methodPy.tp$name = METHOD_CLONE;
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy) {
              return Sk.misceval.callsim(mod[POINT], Sk.ffi.remapToPy(point.x), Sk.ffi.remapToPy(point.y));
            });
          }, METHOD_CLONE, []));
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(pointPy, name, valuePy) {
      var point = Sk.ffi.remapToJs(pointPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_X: {
          point.x = value;
        }
        break;
        case PROP_Y: {
          point.y = value;
        }
        break;
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(pointPy) {
      var point = Sk.ffi.remapToJs(pointPy);
      return new Sk.builtin.str(POINT + "(" + point.x + ", " + point.y + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(pointPy) {
      var point = Sk.ffi.remapToJs(pointPy);
      return new Sk.builtin.str("[" + point.x + ", " + point.y + "]");
    });
  }, POINT, []);

  mod[EUCLIDEAN_2] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, x00, x01, x10, x11) {
      x00 = Sk.ffi.remapToJs(x00);
      x01 = Sk.ffi.remapToJs(x01);
      x10 = Sk.ffi.remapToJs(x10);
      x11 = Sk.ffi.remapToJs(x11);
      self.tp$name = EUCLIDEAN_2;
      self.v = [x00, x01, x10, x11];
    });
    $loc.__add__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(rhs)) {
        return remapE2ToPy(lhs[0] + rhs, lhs[1], lhs[2], lhs[3]);
      }
      else {
        return remapE2ToPy(lhs[0] + rhs[0], lhs[1] + rhs[1], lhs[2] + rhs[2], lhs[3] + rhs[3]);
      }
    });
    $loc.__radd__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs + rhs[0], rhs[1], rhs[2], rhs[3]);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " + " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__iadd__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self[0] += other;
        return selfPy;
      }
      else {
        self[0] += other[0];
        self[1] += other[1];
        self[2] += other[2];
        self[3] += other[3];
        return selfPy;
      }
    });
    $loc.__sub__ = new Sk.builtin.func(function(lhs, rhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(rhs)) {
        return remapE2ToPy(lhs[0] - rhs, lhs[1], lhs[2], lhs[3]);
      }
      else {
        return remapE2ToPy(lhs[0] - rhs[0], lhs[1] - rhs[1], lhs[2] - rhs[2], lhs[3] - rhs[3]);
      }
    });
    $loc.__rsub__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs - rhs[0], -rhs[1], -rhs[2], -rhs[3]);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " - " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__isub__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self[0] -= other;
        return selfPy;
      }
      else {
        self[0] -= other[0];
        self[1] -= other[1];
        self[2] -= other[2];
        self[3] -= other[3];
        return selfPy;
      }
    });
    $loc.__mul__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE2ToPy(a[0] * b, a[1] * b, a[2] * b, a[3] * b);
      }
      else {
        var a00 = a[0];
        var a01 = a[1];
        var a10 = a[2];
        var a11 = a[3];
        var b00 = b[0];
        var b01 = b[1];
        var b10 = b[2];
        var b11 = b[3];
        var x00 = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        var x01 = a00 * b01 + a01 * b00 - a10 * b11 + a11 * b10;
        var x10 = a00 * b10 + a01 * b11 + a10 * b00 - a11 * b01;
        var x11 = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__rmul__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs[0], lhs * rhs[1], lhs * rhs[2], lhs * rhs[3]);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " * " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__imul__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self[0] *= other;
        self[1] *= other;
        self[2] *= other;
        self[3] *= other;
        return selfPy;
      }
      else {
        var a00 = self[0];
        var a01 = self[1];
        var a10 = self[2];
        var a11 = self[3];
        var b00 = other[0];
        var b01 = other[1];
        var b10 = other[2];
        var b11 = other[3];
        self[0] = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        self[1] = a00 * b01 + a01 * b00 - a10 * b11 + a11 * b10;
        self[2] = a00 * b10 + a01 * b11 + a10 * b00 - a11 * b01;
        self[3] = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
        return selfPy;
      }
    });
    $loc.__div__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return divide(a[0], a[1], a[2], a[3], b, 0, 0, 0);
      }
      else {
        return divide(a[0], a[1], a[2], a[3], b[0], b[1], b[2], b[3]);
      }
    });
    $loc.__rdiv__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return divide(lhs, 0, 0, 0, rhs[0], rhs[1], rhs[2], rhs[3]);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " / " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__idiv__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        divide(self[0], self[1], self[2], self[3], other, 0, 0, 0, self);
        return selfPy;
      }
      else {
        divide(self[0], self[1], self[2], self[3], other[0], other[1], other[2], other[3], self);
        return selfPy;
      }
    });
    $loc.__xor__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE2ToPy(a[0] * b, a[1] * b, a[2] * b, a[3] * b);
      }
      else {
        var a00 = a[0];
        var a01 = a[1];
        var a10 = a[2];
        var a11 = a[3];
        var b00 = b[0];
        var b01 = b[1];
        var b10 = b[2];
        var b11 = b[3];
        var x00 = a00 * b00;
        var x01 = a00 * b01 + a01 * b00;
        var x10 = a00 * b10             + a10 * b00;
        var x11 = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__rxor__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs[0], lhs * rhs[1], lhs * rhs[2], lhs * rhs[3]);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " ^ " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__ixor__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self[0] *= other;
        self[1] *= other;
        self[2] *= other;
        self[3] *= other;
        return selfPy;
      }
      else {
        var a00 = self[0];
        var a01 = self[1];
        var a10 = self[2];
        var a11 = self[3];
        var b00 = other[0];
        var b01 = other[1];
        var b10 = other[2];
        var b11 = other[3];
        self[0] = a00 * b00;
        self[1] = a00 * b01 + a01 * b00;
        self[2] = a00 * b10             + a10 * b00;
        self[3] = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00;
        return selfPy;
      }
    });
    $loc.__lshift__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE2ToPy(a[0] * b, 0, 0, 0);
      }
      else {
        var a00 = a[0];
        var a01 = a[1];
        var a10 = a[2];
        var a11 = a[3];
        var b00 = b[0];
        var b01 = b[1];
        var b10 = b[2];
        var b11 = b[3];
        var x00 = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        var x01 = a00 * b01             - a10 * b11;
        var x10 = a00 * b10 + a01 * b11;
        var x11 = a00 * b11;
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__rlshift__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs[0], lhs * rhs[1], lhs * rhs[2], lhs * rhs[3]);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " << " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__ilshift__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        self[0] *= other;
        self[1] = 0;
        self[2] = 0;
        self[3] = 0;
        return selfPy;
      }
      else {
        var a00 = self[0];
        var a01 = self[1];
        var a10 = self[2];
        var a11 = self[3];
        var b00 = other[0];
        var b01 = other[1];
        var b10 = other[2];
        var b11 = other[3];
        self[0] = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        self[1] = a00 * b01             - a10 * b11;
        self[2] = a00 * b10 + a01 * b11;
        self[3] = a00 * b11;
        return selfPy;
      }
    });
    $loc.__rshift__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      if (isNumber(b)) {
        return remapE2ToPy(a[0] * b, -a[1] * b, -a[2] * b, a[3] * b);
      }
      else {
        var a00 = a[0];
        var a01 = a[1];
        var a10 = a[2];
        var a11 = a[3];
        var b00 = b[0];
        var b01 = b[1];
        var b10 = b[2];
        var b11 = b[3];
        var x00 = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        var x01 =           + a01 * b00             + a11 * b10;
        var x10 =                       + a10 * b00 - a11 * b01;
        var x11 =                                     a11 * b00;
        return remapE2ToPy(x00, x01, x10, x11);
      }
    });
    $loc.__rrshift__ = new Sk.builtin.func(function(rhs, lhs) {
      lhs = Sk.ffi.remapToJs(lhs);
      rhs = Sk.ffi.remapToJs(rhs);
      if (isNumber(lhs)) {
        return remapE2ToPy(lhs * rhs[0], 0, 0, 0);
      }
      else {
        throw new Sk.builtin.AssertionError("" + JSON.stringify(lhs, null, 2) + " >> " + JSON.stringify(rhs, null, 2));
      }
    });
    $loc.__irshift__ = new Sk.builtin.func(function(selfPy, otherPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var other = Sk.ffi.remapToJs(otherPy);
      if (isNumber(other)) {
        var a00 = self[0];
        var a01 = self[1];
        var a10 = self[2];
        var a11 = self[3];
        var b00 = other;
        var b01 = 0;
        var b10 = 0;
        var b11 = 0;
        self[0] *=  other;
        self[1] *= -other;
        self[2] *= -other;
        self[3] *=  other;
        return selfPy;
      }
      else {
        var a00 = self[0];
        var a01 = self[1];
        var a10 = self[2];
        var a11 = self[3];
        var b00 = other[0];
        var b01 = other[1];
        var b10 = other[2];
        var b11 = other[3];
        self[0] = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11;
        self[1] =           + a01 * b00             + a11 * b10;
        self[2] =                       + a10 * b00 - a11 * b01;
        self[3] =                                     a11 * b00;
        return selfPy;
      }
    });
    $loc.nb$negative = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapE2ToPy(-self[0], -self[1], -self[2], -self[3]);
    };
    $loc.nb$positive = function() {
      return this;
    };
    $loc.nb$invert = function() {
      var self = Sk.ffi.remapToJs(this);
      return remapE2ToPy(self[0], self[1], self[2], -self[3]);
    };
    $loc.__getitem__ = new Sk.builtin.func(function(mv, index) {
      mv = Sk.ffi.remapToJs(mv);
      index = Sk.builtin.asnum$(index);
      switch(index) {
        case 0: {
          return remapE2ToPy(mv[0], 0, 0, 0);
        }
        case 1: {
          return remapE2ToPy(0, mv[1], mv[2], 0);
        }
        case 2: {
          return remapE2ToPy(0, 0, 0, mv[3]);
        }
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      return new Sk.builtin.str(EUCLIDEAN_2 + "(" + mv.join(", ") + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(mv) {
      mv = Sk.ffi.remapToJs(mv);
      if (typeof mv !== 'undefined') {
        return new Sk.builtin.str(stringFromCoordinates([mv[0], mv[1], mv[2], mv[3]], ["1", "i", "j", "I"], "*"));
      }
      else {
        return new Sk.builtin.str("<type '" + EUCLIDEAN_2 + "'>");
      }
    });
    $loc.__eq__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2]) && (a[3] === b[3]);
    });
    $loc.__ne__ = new Sk.builtin.func(function(a, b) {
      a = Sk.ffi.remapToJs(a);
      b = Sk.ffi.remapToJs(b);
      return (a[0] !== b[0]) || (a[1] !== b[1]) || (a[2] !== b[2]) || (a[3] !== b[3]);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(mvPy, name) {
      var mv = Sk.ffi.remapToJs(mvPy);
      switch(name) {
        case PROP_W: {
          return Sk.builtin.assk$(mv[0], Sk.builtin.nmber.float$);
        }
        case PROP_X: {
          return Sk.builtin.assk$(mv[1], Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(mv[2], Sk.builtin.nmber.float$);
        }
        case PROP_XY: {
          return Sk.builtin.assk$(mv[3], Sk.builtin.nmber.float$);
        }
        case METHOD_CLONE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(methodPy) {
              methodPy.tp$name = METHOD_CLONE;
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy) {
              return remapE2ToPy(mv[0], mv[1], mv[2], mv[3]);
            });
          }, METHOD_CLONE, []));
        }
        case METHOD_LENGTH: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_LENGTH;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              return Sk.builtin.assk$(4, Sk.builtin.nmber.int$);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_LENGTH);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_LENGTH);
            });
          }, METHOD_LENGTH, []));
        }
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a readable attribute of " + EUCLIDEAN_2);
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(selfPy, name, valuePy) {
      var self = Sk.ffi.remapToJs(selfPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_W: {
          self[0] = value;
        }
        break;
        case PROP_X: {
          self[1] = value;
        }
        break;
        case PROP_Y: {
          self[2] = value;
        }
        break;
        case PROP_XY: {
          self[3] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a writeable attribute of " + EUCLIDEAN_2);
        }
      }
    });
  }, EUCLIDEAN_2, []);

  return mod;
}
