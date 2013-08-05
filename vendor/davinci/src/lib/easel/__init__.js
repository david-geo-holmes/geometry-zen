/**
 * Geometric Algebra (e2ga) module.
 *
 * David Holmes (david.geo.holmes@gmail.com)
 */
var $builtinmodule = function(name) {

  var CONTAINER                  = "Container";
  var EASE                       = "Ease";
  var EUCLIDEAN_2                = "Euclidean2";
  var EVENT                      = "Event";
  var GRAPHICS                   = "Graphics";
  var MOVIE_CLIP                 = "MovieClip";
  var POINT                      = "Point";
  var SHAPE                      = "Shape";
  var STAGE                      = "Stage";
  var TEXT                       = "Text";
  var TICKER                     = "Ticker";
  var TWEEN                      = "Tween";

  var PROP_ALPHA                 = "alpha";
  var PROP_AUTO_CLEAR            = "autoClear";
  var PROP_BOUNCE_OUT            = "bounceOut";
  var PROP_CANVAS                = "canvas";
  var PROP_GRAPHICS              = "graphics";
  var PROP_HIT_AREA              = "hitArea";
  var PROP_MOUSE_IN_BOUNDS       = "mouseInBounds";
  var PROP_MOUSE_MOVE_OUTSIDE    = "mouseMoveOutside";
  var PROP_MOUSE_X               = "mouseX";
  var PROP_MOUSE_Y               = "mouseY";
  var PROP_NAME                  = "name";
  var PROP_ROTATION              = "rotation";
  var PROP_TEXT                  = "text";
  var PROP_TEXT_ALIGN            = "textAlign";
  var PROP_TIMELINE              = "timeline";
  var PROP_W                     = "w";
  var PROP_X                     = "x";
  var PROP_Y                     = "y";
  var PROP_XY                    = "xy";

  var METHOD_ADD_CHILD           = "addChild";
  var METHOD_ADD_EVENT_LISTENER  = "addEventListener";
  var METHOD_ADD_TWEEN           = "addTween";
  var METHOD_BEGIN_FILL          = "beginFill";
  var METHOD_BEGIN_STROKE        = "beginStroke";
  var METHOD_CALL                = "onComplete";
  var METHOD_CLONE               = "clone";
  var METHOD_DRAW_CIRCLE         = "drawCircle";
  var METHOD_DRAW_RECT           = "drawRect";
  var METHOD_ENABLE_MOUSE_OVER   = "enableMouseOver";
  var METHOD_END_FILL            = "endFill";
  var METHOD_END_STROKE          = "endStroke";
  var METHOD_GET                 = "get";
  var METHOD_GET_CHILD_AT        = "getChildAt";
  var METHOD_GET_NUM_CHILDREN    = "getNumChildren";
  var METHOD_GET_MEASURED_HEIGHT = "getMeasuredHeight";
  var METHOD_GET_MEASURED_WIDTH  = "getMeasuredWidth";
  var METHOD_GLOBAL_TO_LOCAL     = "globalToLocal";
  var METHOD_GOTO_AND_PLAY       = "gotoAndPlay";
  var METHOD_HIT_TEST            = "hitTest";
  var METHOD_LENGTH              = "length";
  var METHOD_LOCAL_TO_LOCAL      = "localToLocal";
  var METHOD_LINE_TO             = "lineTo";
  var METHOD_MOVE_TO             = "moveTo";
  var METHOD_SET_STROKE_STYLE    = "setStrokeStyle";
  var METHOD_TO                  = "to";
  var METHOD_UPDATE              = "update";
  var METHOD_WAIT                = "wait";

  var mod = {};

  mod[EVENT] = Sk.builtin.buildEventClass(mod);

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
        case METHOD_DRAW_RECT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_DRAW_RECT;
              self.v = graphics[METHOD_DRAW_RECT];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, x, y, w, h) {
              x = Sk.ffi.remapToJs(x);
              y = Sk.ffi.remapToJs(y);
              w = Sk.ffi.remapToJs(w);
              h = Sk.ffi.remapToJs(h);
              graphics[METHOD_DRAW_RECT](x, y, w, h);
              return graphicsPy;
            });
          }, METHOD_DRAW_RECT, []));
        }
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
    $loc.__init__ = new Sk.builtin.func(function(shapePy, argPy) {
      shapePy.tp$name = SHAPE;
      if (typeof argPy === 'undefined') {
        shapePy.v = new createjs[SHAPE]();
      }
      else {
        var name = argPy.tp$name;
        if (typeof name === 'string') {
          switch(name) {
            case SHAPE: {
              shapePy.v = Sk.ffi.remapToJs(argPy);
            }
            break;
            case GRAPHICS: {
              shapePy.v = new createjs[SHAPE](Sk.ffi.remapToJs(argPy));
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
        case PROP_ALPHA: {
          return Sk.builtin.assk$(shape[PROP_ALPHA], Sk.builtin.nmber.float$);
        }
        case PROP_GRAPHICS: {
          return Sk.misceval.callsim(mod[GRAPHICS], Sk.ffi.referenceToPy(shape.graphics, GRAPHICS));
        }
        case PROP_NAME: {
          return new Sk.builtin.str(shape[PROP_NAME]);
        }
        case PROP_X: {
          return Sk.builtin.assk$(shape[PROP_X], Sk.builtin.nmber.int$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(shape[PROP_Y], Sk.builtin.nmber.int$);
        }
        case PROP_ROTATION: {
          return Sk.builtin.assk$(shape[PROP_ROTATION], Sk.builtin.nmber.float$);
        }
        case METHOD_ADD_EVENT_LISTENER: {
          return Sk.builtin.addEventListener(mod, shape);
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
        case METHOD_LOCAL_TO_LOCAL: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_LOCAL_TO_LOCAL;
              self.v = shape[METHOD_LOCAL_TO_LOCAL];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, x, y, target) {
              var point = shape[METHOD_LOCAL_TO_LOCAL](Sk.ffi.remapToJs(x), Sk.ffi.remapToJs(y), Sk.ffi.remapToJs(target));
              return Sk.misceval.callsim(mod[POINT], Sk.ffi.referenceToPy(point, POINT));
            });
          }, METHOD_LOCAL_TO_LOCAL, []));
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
        case PROP_NAME: {
          shape[PROP_NAME] = value;
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
        case PROP_ROTATION: {
          shape[PROP_ROTATION] = value;
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
        case PROP_MOUSE_IN_BOUNDS: {
          return Sk.ffi.remapToPy(stage[PROP_MOUSE_IN_BOUNDS]);
        }
        case PROP_MOUSE_MOVE_OUTSIDE: {
          return Sk.ffi.remapToPy(stage[PROP_MOUSE_MOVE_OUTSIDE]);
        }
        case PROP_MOUSE_X: {
          return Sk.builtin.assk$(stage[PROP_MOUSE_X], Sk.builtin.nmber.int$);
        }
        case PROP_MOUSE_Y: {
          return Sk.builtin.assk$(stage[PROP_MOUSE_Y], Sk.builtin.nmber.int$);
        }
        case METHOD_ADD_CHILD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD_CHILD;
              self.v = stage[METHOD_ADD_CHILD];
            });
            $loc.__call__ = new Sk.builtin.func(function(self, childPy) {
              var child = stage.addChild(Sk.ffi.remapToJs(childPy));
              return Sk.misceval.callsim(mod[childPy.tp$name], Sk.ffi.referenceToPy(child, childPy.tp$name));
            });
          }, METHOD_ADD_CHILD, []));
        }
        case METHOD_ENABLE_MOUSE_OVER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ENABLE_MOUSE_OVER;
              self.v = stage[METHOD_ENABLE_MOUSE_OVER];
            });
            $loc.__call__ = new Sk.builtin.func(function(updatePy) {
              stage[METHOD_ENABLE_MOUSE_OVER]();
            });
          }, METHOD_ENABLE_MOUSE_OVER, []));
        }
        case METHOD_UPDATE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_UPDATE;
              self.v = stage[METHOD_UPDATE];
            });
            $loc.__call__ = new Sk.builtin.func(function(updatePy) {
              stage[METHOD_UPDATE]();
            });
          }, METHOD_UPDATE, []));
        }
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
        case PROP_MOUSE_MOVE_OUTSIDE: {
          stage[PROP_MOUSE_MOVE_OUTSIDE] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a writeable attribute of " + STAGE);
        }
      }
    });
  }, STAGE, []);

  mod[TEXT] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(selfPy, textPy, fontPy, colorPy) {
      selfPy.tp$name = TEXT;
      var text = Sk.ffi.remapToJs(textPy);
      var font = Sk.ffi.remapToJs(fontPy);
      var color = Sk.ffi.remapToJs(colorPy);
      selfPy.v = new createjs[TEXT](text, font, color);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(textPy, name) {
      var text = Sk.ffi.remapToJs(textPy);
      switch(name) {
        case PROP_ALPHA: {
          return Sk.builtin.assk$(text[PROP_ALPHA], Sk.builtin.nmber.float$);
        }
        case PROP_X: {
          return Sk.builtin.assk$(text[PROP_X], Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(text[PROP_Y], Sk.builtin.nmber.float$);
        }
        case PROP_ROTATION: {
          return Sk.builtin.assk$(text[PROP_ROTATION], Sk.builtin.nmber.float$);
        }
        case PROP_TEXT: {
          return new Sk.builtin.str(text[PROP_TEXT]);
        }
        case PROP_TEXT_ALIGN: {
          return new Sk.builtin.str(text[PROP_TEXT_ALIGN]);
        }
        case METHOD_ADD_EVENT_LISTENER: {
          return Sk.builtin.addEventListener(mod, text);
        }
        case METHOD_GET_MEASURED_WIDTH: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(methodPy) {
              methodPy.tp$name = METHOD_GET_MEASURED_WIDTH;
              methodPy.v = text[METHOD_GET_MEASURED_WIDTH];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, childPy) {
              return Sk.builtin.assk$(text[METHOD_GET_MEASURED_WIDTH](), Sk.builtin.nmber.float$);
            });
          }, METHOD_GET_MEASURED_WIDTH, []));
        }
        case METHOD_GET_MEASURED_HEIGHT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(methodPy) {
              methodPy.tp$name = METHOD_GET_MEASURED_HEIGHT;
              methodPy.v = text[METHOD_GET_MEASURED_HEIGHT];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, childPy) {
              return Sk.builtin.assk$(text[METHOD_GET_MEASURED_HEIGHT](), Sk.builtin.nmber.float$);
            });
          }, METHOD_GET_MEASURED_HEIGHT, []));
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(textPy, name, valuePy) {
      var text = Sk.ffi.remapToJs(textPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_ALPHA: {
          Sk.builtin.pyCheckType(PROP_ALPHA, "Number", Sk.builtin.checkNumber(valuePy));
          text[PROP_ALPHA] = value;
        }
        break;
        case PROP_HIT_AREA: {
          text[PROP_HIT_AREA] = value;
        }
        break;
        case PROP_X: {
          text[PROP_X] = value;
        }
        break;
        case PROP_Y: {
          text[PROP_Y] = value;
        }
        break;
        case PROP_ROTATION: {
          text[PROP_ROTATION] = value;
        }
        break;
        case PROP_TEXT: {
          text[PROP_TEXT] = value;
        }
        break;
        case PROP_TEXT_ALIGN: {
          text[PROP_TEXT_ALIGN] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a writeable attribute of " + TEXT);
        }
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(selfPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      return new Sk.builtin.str(TEXT + "(" + self.x + ", " + self.y + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(selfPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      return new Sk.builtin.str("[" + self.x + ", " + self.y + "]");
    });
  }, TEXT, []);

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

  mod[CONTAINER] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(containerPy, argPy) {
      containerPy.tp$name = CONTAINER;
      if (typeof argPy === 'undefined') {
        containerPy.v = new createjs[CONTAINER]();
      }
      else {
        var name = argPy.tp$name;
        if (typeof name === 'string') {
          switch(name) {
            case CONTAINER: {
              containerPy.v = Sk.ffi.remapToJs(argPy);
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
    $loc.__getattr__ = new Sk.builtin.func(function(containerPy, name) {
      var container = Sk.ffi.remapToJs(containerPy);
      switch(name) {
        case PROP_NAME: {
          return new Sk.builtin.str(container[PROP_NAME]);
        }
        case PROP_X: {
          return Sk.builtin.assk$(container[PROP_X], Sk.builtin.nmber.float$);
        }
        case PROP_Y: {
          return Sk.builtin.assk$(container[PROP_Y], Sk.builtin.nmber.float$);
        }
        case PROP_ROTATION: {
          return Sk.builtin.assk$(container[PROP_ROTATION], Sk.builtin.nmber.float$);
        }
        case METHOD_ADD_CHILD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(methodPy) {
              methodPy.tp$name = METHOD_ADD_CHILD;
              methodPy.v = container[METHOD_ADD_CHILD];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, childPy) {
              var child = container.addChild(Sk.ffi.remapToJs(childPy));
              return Sk.misceval.callsim(mod[childPy.tp$name], Sk.ffi.referenceToPy(child, childPy.tp$name));
            });
          }, METHOD_ADD_CHILD, []));
        }
        case METHOD_ADD_EVENT_LISTENER: {
          return Sk.builtin.addEventListener(mod, container);
        }
        case METHOD_GET_CHILD_AT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(methodPy) {
              methodPy.tp$name = METHOD_GET_CHILD_AT;
              methodPy.v = container[METHOD_GET_CHILD_AT];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, indexPy) {
              var child = container[METHOD_GET_CHILD_AT](Sk.ffi.remapToJs(indexPy));
              return Sk.misceval.callsim(mod[SHAPE], Sk.ffi.referenceToPy(child, SHAPE));
            });
          }, METHOD_GET_CHILD_AT, []));
        }
        case METHOD_GET_NUM_CHILDREN: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(methodPy) {
              methodPy.tp$name = METHOD_GET_NUM_CHILDREN;
              methodPy.v = container[METHOD_GET_NUM_CHILDREN];
            });
            $loc.__call__ = new Sk.builtin.func(function(methodPy, childPy) {
              return Sk.builtin.assk$(container[METHOD_GET_NUM_CHILDREN](), Sk.builtin.nmber.int$);
            });
          }, METHOD_GET_NUM_CHILDREN, []));
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(containerPy, name, valuePy) {
      var container = Sk.ffi.remapToJs(containerPy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_NAME: {
          container[PROP_NAME] = value;
        }
        break;
        case PROP_X: {
          container[PROP_X] = value;
        }
        break;
        case PROP_Y: {
          container[PROP_Y] = value;
        }
        break;
        case PROP_ROTATION: {
          container[PROP_ROTATION] = value;
        }
        break;
        default: {
          throw new Sk.builtin.AttributeError(name + " is not a writeable attribute of " + CONTAINER);
        }
      }
    });
    $loc.__repr__ = new Sk.builtin.func(function(selfPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      return new Sk.builtin.str(CONTAINER + "(" + self.x + ", " + self.y + ")");
    });
    $loc.__str__ = new Sk.builtin.func(function(selfPy) {
      var self = Sk.ffi.remapToJs(selfPy);
      return new Sk.builtin.str("[" + self.x + ", " + self.y + "]");
    });
  }, CONTAINER, []);

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

  Sk.builtin.defineEuclidean2(mod);

  mod['getHSL'] = new Sk.builtin.func(function(hue, saturation, lightness, alpha) {
    hue = Sk.ffi.remapToJs(hue);
    saturation = Sk.ffi.remapToJs(saturation);
    lightness = Sk.ffi.remapToJs(lightness);
    alpha = Sk.ffi.remapToJs(alpha);
    return new Sk.builtin.str(createjs[GRAPHICS].getHSL(hue, saturation, lightness, alpha));
  });

  return mod;
}
