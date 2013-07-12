/*
 * browser Python module
 *
 * Exposes the window and document variables.
 */
var $builtinmodule = function(name) {

  var mod = {};

  var CANVAS_GRADIENT_CLASS       = "CanvasGradient";
  var CANVAS_RENDERING_CONTEXT_2D = "CanvasRenderingContext2D";
  var DOCUMENT_CLASS              = "Document";
  var EVENT                 = "Event";
  var NODE                        = "Node";
  var WINDOW_CLASS                = "Window";
  
  var PROP_ALT_KEY                          = "altKey";
  var PROP_ANIMATION_TIME                   = "animationTime";
  var PROP_BODY                             = "body";
  var PROP_BUBBLES                          = "bubbles";
  var PROP_BUTTON                           = "button";
  var PROP_CANCELABLE                       = "cancelable";
  var PROP_CLIENT_X                         = "clientX";
  var PROP_CLIENT_Y                         = "clientY";
  var PROP_CTRL_KEY                         = "ctrlKey";
  var PROP_CURRENT_TRANSFORM                = "currentTransform";
  var PROP_DEFAULT_PREVENTED                = "defaultPrevented";
  var PROP_DEVICE_PIXEL_RATIO               = "devicePixelRatio";
  var PROP_DIR                              = "dir";
  var PROP_DOCUMENT                         = "document";
  var PROP_FONT                             = "font";
  var PROP_FILL_STYLE                       = "fillStyle";
  var PROP_FIRST_CHILD                      = "firstChild";
  var PROP_HEIGHT                           = "height";
  var PROP_KEY_CODE                         = "keyCode";
  var PROP_LAST_CHILD                       = "lastChild";
  var PROP_LEFT                             = "left";
  var PROP_LINE_CAP                         = "lineCap";
  var PROP_LINE_JOIN                        = "lineJoin";
  var PROP_LINE_WIDTH                       = "lineWidth";
  var PROP_NEXT_SIBLING                     = "nextSibling";
  var PROP_PARENT_NODE                      = "parentNode";
  var PROP_POSITION                         = "position";
  var PROP_PREVIOUS_SIBLING                 = "previousSibling";
  var PROP_SCREEN_X                         = "screenX";
  var PROP_SCREEN_Y                         = "screenY";
  var PROP_SHADOW_BLUR                      = "shadowBlur";
  var PROP_SHADOW_COLOR                     = "shadowColor";
  var PROP_SHADOW_OFFSET_X                  = "shadowOffsetX";
  var PROP_SHADOW_OFFSET_Y                  = "shadowOffsetY";
  var PROP_SHIFT_KEY                        = "shiftKey";
  var PROP_STROKE_STYLE                     = "strokeStyle";
  var PROP_STYLE                            = "style";
  var PROP_TEXT_ALIGN                       = "textAlign";
  var PROP_TEXT_BASELINE                    = "textBaseline";
  var PROP_TOP                              = "top";
  var PROP_WEBKIT_BACKING_STORE_PIXEL_RATIO = "webkitBackingStorePixelRatio";
  var PROP_WEBKIT_HIDDEN                    = "webkitHidden";
  var PROP_WIDTH                            = "width";
  var PROP_WINDOW                           = "window";

  var METHOD_ADD_EVENT_LISTENER         = "addEventListener";
  var METHOD_ADD_COLOR_STOP             = "addColorStop";
  var METHOD_APPEND_CHILD               = "appendChild";
  var METHOD_ARC                        = "arc";
  var METHOD_ARC_TO                     = "arcTo";
  var METHOD_BEGIN_PATH                 = "beginPath";
  var METHOD_BEZIER_CURVE_TO            = "bezierCurveTo";
  var METHOD_CANCEL_ANIMATION_FRAME     = "cancelAnimationFrame";
  var METHOD_CLEAR_RECT                 = "clearRect";
  var METHOD_CLIP                       = "clip";
  var METHOD_CLOSE_PATH                 = "closePath";
  var METHOD_CREATE_ELEMENT             = "createElement";
  var METHOD_CREATE_LINEAR_GRADIENT     = "createLinearGradient";
  var METHOD_FILL                       = "fill";
  var METHOD_FILL_RECT                  = "fillRect";
  var METHOD_FILL_TEXT                  = "fillText";
  var METHOD_GET_CONTEXT                = "getContext";
  var METHOD_GET_ELEMENT_BY_ID          = "getElementById";
  var METHOD_GET_ELEMENTS_BY_TAG_NAME   = "getElementsByTagName";
  var METHOD_INSERT_BEFORE              = "insertBefore";
  var METHOD_INVERSE                    = "inverse";
  var METHOD_LINE_TO                    = "lineTo";
  var METHOD_MOVE_TO                    = "moveTo";
  var METHOD_PREVENT_DEFAULT            = "preventDefault";
  var METHOD_QUADRATIC_CURVE_TO         = "quadraticCurveTo";
  var METHOD_RECT                       = "rect";
  var METHOD_REMOVE_CHILD               = "removeChild";
  var METHOD_REMOVE_EVENT_LISTENER      = "removeEventListener";
  var METHOD_REQUEST_ANIMATION_FRAME    = "requestAnimationFrame";
  var METHOD_RESTORE                    = "restore";
  var METHOD_ROTATE                     = "rotate";
  var METHOD_SAVE                       = "save";
  var METHOD_SCALE                      = "scale";
  var METHOD_SET_ATTRIBUTE              = "setAttribute";
  var METHOD_SET_TIMEOUT                = "setTimeout";
  var METHOD_SET_TRANSFORM              = "setTransform";
  var METHOD_STOP_IMMEDIATE_PROPAGATION = "stopImmediatePropagation";
  var METHOD_STOP_PROPAGATION           = "stopPropagation";
  var METHOD_STROKE                     = "stroke";
  var METHOD_STROKE_RECT                = "strokeRect";
  var METHOD_STROKE_TEXT                = "strokeText";
  var METHOD_TRANSFORM                  = "transform";
  var METHOD_TRANSLATE                  = "translate";
  // We must be able to track the JavaScript listener functions.
  // TODO: This should include both the typoe and the useCapture flag.
  var winListeners = {};
  var docListeners = {};

  var wrapNode = function(node) {
    if (node) {
      return Sk.misceval.callsim(mod[NODE], node);
    }
    else {
      return null;
    }
  }

  var wrapNumber = function(n) {
    if (typeof n === 'number') {
      return Sk.builtin.assk$(n, Sk.builtin.nmber.float$);
    }
    else {
      return null;
    }
  }

  var wrapString = function(s) {
    if (typeof s === 'string') {
      return new Sk.builtin.str(s)
    }
    else {
      return null;
    }
  }

  var nodeFromArg = function(arg) {
    if (arg) {
      return arg.v;
    }
    else {
      return null;
    }
  }

  var numberFromArg = function(arg) {
    if (arg) {
      return arg.v;
    }
    else {
      return null;
    }
  }

  var stringFromArg = function(arg) {
    if (arg) {
      return arg.v;
    }
    else {
      return null;
    }
  }
  /*
  mod.getElementsByTagName = new Sk.builtin.func(function(tag) {
    var elements = document.getElementsByTagName(stringFromArg(tag))
    var reslist = [];
    for (var i = elements.length - 1; i >= 0; i--) {
      reslist.push(Sk.misceval.callsim(mod[NODE], elements[i]));
    }
    return new Sk.builtin.list(reslist)
  });

  mod.getElementsByClassName = new Sk.builtin.func(function(cname) {
    var r = document.getElementsByClassName(stringFromArg(cname));
    var reslist = [];
    for (var i = 0; i < r.length; i++) {
      reslist.push(Sk.misceval.callsim(mod[NODE], r[i]));
    };
    return new Sk.builtin.list(reslist);
  });

  mod.getElementsByName = new Sk.builtin.func(function(cname) {
    var r = document.getElementsByName(stringFromArg(cname));
    var reslist = [];
    for (var i = 0; i < r.length; i++) {
      reslist.push(Sk.misceval.callsim(mod[NODE], r[i]));
    };
    return new Sk.builtin.list(reslist);
  });
  */
  mod[EVENT] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, eventPy) {
      self.tp$name = EVENT;
      self.v = Sk.ffi.remapToJs(eventPy);
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case PROP_ALT_KEY: {
          return event[PROP_ALT_KEY];
        }
        case PROP_BUBBLES: {
          return event[PROP_BUBBLES];
        }
        case PROP_BUTTON: {
          return Sk.builtin.assk$(event[PROP_BUTTON], Sk.builtin.nmber.int$);
        }
        case PROP_CANCELABLE: {
          return event[PROP_CANCELABLE];
        }
        case PROP_CLIENT_X: {
          return Sk.builtin.assk$(event[PROP_CLIENT_X], Sk.builtin.nmber.int$);
        }
        case PROP_CLIENT_Y: {
          return Sk.builtin.assk$(event[PROP_CLIENT_Y], Sk.builtin.nmber.int$);
        }
        case PROP_CTRL_KEY: {
          return event[PROP_CTRL_KEY];
        }
        case PROP_DEFAULT_PREVENTED: {
          return event[PROP_DEFAULT_PREVENTED];
        }
        case PROP_KEY_CODE: {
          return Sk.builtin.assk$(event[PROP_KEY_CODE], Sk.builtin.nmber.int$);
        }
        case PROP_SCREEN_X: {
          return Sk.builtin.assk$(event[PROP_SCREEN_X], Sk.builtin.nmber.int$);
        }
        case PROP_SCREEN_Y: {
          return Sk.builtin.assk$(event[PROP_SCREEN_Y], Sk.builtin.nmber.int$);
        }
        case PROP_SHIFT_KEY: {
          return event[PROP_SHIFT_KEY];
        }
        case METHOD_PREVENT_DEFAULT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_PREVENT_DEFAULT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              event[METHOD_PREVENT_DEFAULT]();
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_PREVENT_DEFAULT)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_PREVENT_DEFAULT)
            })
          }, METHOD_PREVENT_DEFAULT, []));
        }
        case METHOD_STOP_IMMEDIATE_PROPAGATION: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_STOP_IMMEDIATE_PROPAGATION;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              event[METHOD_STOP_IMMEDIATE_PROPAGATION]();
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_STOP_IMMEDIATE_PROPAGATION)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_STOP_IMMEDIATE_PROPAGATION)
            })
          }, METHOD_STOP_IMMEDIATE_PROPAGATION, []));
        }
        case METHOD_STOP_PROPAGATION: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_STOP_PROPAGATION;
            });
            $loc.__call__ = new Sk.builtin.func(function(self) {
              event[METHOD_STOP_PROPAGATION]();
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_STOP_PROPAGATION)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_STOP_PROPAGATION)
            })
          }, METHOD_STOP_PROPAGATION, []));
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(EVENT)
    })
    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(EVENT)
    })
  }, EVENT, []);

  mod[NODE] = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, node) {
      self.tp$name = NODE;
      self.v = node;
    });
    $loc.__getattr__ = new Sk.builtin.func(function(nodePy, name) {
      var node = Sk.ffi.remapToJs(nodePy);
      switch(name) {
        case 'clientHeight': {
          return wrapNumber(node[name]);
        }
        case 'clientWidth': {
          return wrapNumber(node[name]);
        }
        case PROP_DIR: {
          return new Sk.builtin.str(node[PROP_DIR]);
        }
        case PROP_FIRST_CHILD: {
          return wrapNode(node[PROP_FIRST_CHILD]);
        }
        case PROP_LAST_CHILD: {
          return wrapNode(node[PROP_LAST_CHILD]);
        }
        case PROP_NEXT_SIBLING: {
          return wrapNode(node[PROP_NEXT_SIBLING]);
        }
        case PROP_PARENT_NODE: {
          return wrapNode(node[PROP_PARENT_NODE]);
        }
        case PROP_PREVIOUS_SIBLING: {
          return wrapNode(node[PROP_PREVIOUS_SIBLING]);
        }
        case PROP_HEIGHT: {
          return Sk.builtin.assk$(node[PROP_HEIGHT], Sk.builtin.nmber.int$);
        }
        case PROP_WIDTH: {
          return Sk.builtin.assk$(node[PROP_WIDTH], Sk.builtin.nmber.int$);
        }
        case PROP_STYLE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = PROP_STYLE;
              self.v = node.style;
            });
            $loc.__getattr__ = new Sk.builtin.func(function(stylePy, name) {
              var style = Sk.ffi.remapToJs(stylePy);
              switch(name) {
                case PROP_HEIGHT: {
                  return new Sk.builtin.str(style[PROP_HEIGHT]);
                }
                case PROP_LEFT: {
                  return new Sk.builtin.str(style[PROP_LEFT]);
                }
                case PROP_POSITION: {
                  return new Sk.builtin.str(style[PROP_POSITION]);
                }
                case PROP_TOP: {
                  return new Sk.builtin.str(style[PROP_TOP]);
                }
                case PROP_WIDTH: {
                  return new Sk.builtin.str(style[PROP_WIDTH]);
                }
              }
            })
            $loc.__setattr__ = new Sk.builtin.func(function(stylePy, name, valuePy) {
              var style = Sk.ffi.remapToJs(stylePy);
              var value = Sk.ffi.remapToJs(valuePy);
              switch(name) {
                case PROP_HEIGHT: {
                  style[PROP_HEIGHT] = value;
                }
                break;
                case PROP_LEFT: {
                  style[PROP_LEFT] = value;
                }
                break;
                case PROP_POSITION: {
                  style[PROP_POSITION] = value;
                }
                break;
                case PROP_TOP: {
                  style[PROP_TOP] = value;
                }
                break;
                case PROP_WIDTH: {
                  style[PROP_WIDTH] = value;
                }
                break;
                default: {
                  throw new Sk.builtin.AssertionError(name + " is not a writeable attribute of " + PROP_STYLE);
                }
              }
            })
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(PROP_STYLE);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(PROP_STYLE);
            });
          }, PROP_STYLE, []));
        }
        case METHOD_APPEND_CHILD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_APPEND_CHILD;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, childNode) {
              return wrapNode(node.appendChild(nodeFromArg(childNode)));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_APPEND_CHILD);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_APPEND_CHILD);
            });
          }, METHOD_APPEND_CHILD, []));
        }
        case METHOD_GET_CONTEXT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GET_CONTEXT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, contextIdPy, contextAttributePy) {
              var contextId = Sk.ffi.remapToJs(contextIdPy);
              var contextAttribute = Sk.ffi.remapToJs(contextAttributePy);
              var context = node.getContext(contextId, contextAttribute);
              return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                $loc.__init__ = new Sk.builtin.func(function(self) {
                  self.tp$name = CANVAS_RENDERING_CONTEXT_2D;
                  self.v = context;
                });
                $loc.__getattr__ = new Sk.builtin.func(function(contextPy, name) {
                  switch(name) {
                    case PROP_FILL_STYLE: {
                      return new Sk.builtin.str(context[PROP_FILL_STYLE]);
                    }
                    case PROP_FONT: {
                      return new Sk.builtin.str(context[PROP_FONT]);
                    }
                    case PROP_LINE_CAP: {
                      return new Sk.builtin.str(context[PROP_LINE_CAP]);
                    }
                    case PROP_LINE_JOIN: {
                      return new Sk.builtin.str(context[PROP_LINE_JOIN]);
                    }
                    case PROP_LINE_WIDTH: {
                      return Sk.builtin.assk$(context[PROP_LINE_WIDTH], Sk.builtin.nmber.int$);
                    }
                    case PROP_SHADOW_BLUR: {
                      return Sk.builtin.assk$(context[PROP_SHADOW_BLUR], Sk.builtin.nmber.int$);
                    }
                    case PROP_SHADOW_COLOR: {
                      return new Sk.builtin.str(context[PROP_SHADOW_COLOR]);
                    }
                    case PROP_SHADOW_OFFSET_X: {
                      return Sk.builtin.assk$(context[PROP_SHADOW_OFFSET_X], Sk.builtin.nmber.int$);
                    }
                    case PROP_SHADOW_OFFSET_Y: {
                      return Sk.builtin.assk$(context[PROP_SHADOW_OFFSET_Y], Sk.builtin.nmber.int$);
                    }
                    case PROP_STROKE_STYLE: {
                      return new Sk.builtin.str(context[PROP_STROKE_STYLE]);
                    }
                    case PROP_TEXT_ALIGN: {
                      return new Sk.builtin.str(context[PROP_TEXT_ALIGN]);
                    }
                    case PROP_TEXT_BASELINE: {
                      return new Sk.builtin.str(context[PROP_TEXT_BASELINE]);
                    }
                    case PROP_WEBKIT_BACKING_STORE_PIXEL_RATIO: {
                      return Sk.builtin.assk$(context[PROP_WEBKIT_BACKING_STORE_PIXEL_RATIO], Sk.builtin.nmber.int$);
                    }
                    case METHOD_ARC: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_ARC;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y, radius, startAngle, endAngle, anticlockwise) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          radius = Sk.ffi.remapToJs(radius);
                          startAngle = Sk.ffi.remapToJs(startAngle);
                          endAngle = Sk.ffi.remapToJs(endAngle);
                          anticlockwise = Sk.ffi.remapToJs(anticlockwise);
                          context[METHOD_ARC](x, y, radius, startAngle, endAngle, anticlockwise);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_ARC);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_ARC);
                        });
                      }, METHOD_ARC, []));
                    }
                    case METHOD_ARC_TO: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_ARC_TO;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x1, y1, x2, y2, radiusX, radiusY, rotation) {
                          x1 = Sk.ffi.remapToJs(x1);
                          y1 = Sk.ffi.remapToJs(y1);
                          x2 = Sk.ffi.remapToJs(x2);
                          y2 = Sk.ffi.remapToJs(y2);
                          radiusX = Sk.ffi.remapToJs(radiusX);
                          radiusY = Sk.ffi.remapToJs(radiusY);
                          rotation = Sk.ffi.remapToJs(rotation);
                          context[METHOD_ARC_TO](x1, y1, x2, y2, radiusX, radiusY, rotation);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_ARC_TO);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_ARC_TO);
                        });
                      }, METHOD_ARC_TO, []));
                    }
                    case METHOD_BEGIN_PATH: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_BEGIN_PATH;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self) {
                          context[METHOD_BEGIN_PATH]();
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_BEGIN_PATH);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_BEGIN_PATH);
                        });
                      }, METHOD_BEGIN_PATH, []));
                    }
                    case METHOD_BEZIER_CURVE_TO: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_BEZIER_CURVE_TO;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, cp1x, cp1y, cp2x, cp2y, x, y) {
                          cp1x = Sk.ffi.remapToJs(cp1x);
                          cp1y = Sk.ffi.remapToJs(cp1y);
                          cp2x = Sk.ffi.remapToJs(cp2x);
                          cp2y = Sk.ffi.remapToJs(cp2y);
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          context[METHOD_BEZIER_CURVE_TO](cp1x, cp1y, cp2x, cp2y, x, y);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_BEZIER_CURVE_TO);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_BEZIER_CURVE_TO);
                        });
                      }, METHOD_BEZIER_CURVE_TO, []));
                    }
                    case METHOD_CLEAR_RECT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_CLEAR_RECT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y, w, h) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          w = Sk.ffi.remapToJs(w);
                          h = Sk.ffi.remapToJs(h);
                          context[METHOD_CLEAR_RECT](x, y, w, h);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CLEAR_RECT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CLEAR_RECT);
                        });
                      }, METHOD_CLEAR_RECT, []));
                    }
                    case METHOD_CLIP: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_CLIP;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self) {
                          context[METHOD_CLIP]();
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CLIP);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CLIP);
                        });
                      }, METHOD_CLIP, []));
                    }
                    case METHOD_CLOSE_PATH: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_CLOSE_PATH;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self) {
                          context[METHOD_CLOSE_PATH]();
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CLOSE_PATH);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CLOSE_PATH);
                        });
                      }, METHOD_CLOSE_PATH, []));
                    }
                    case METHOD_CREATE_LINEAR_GRADIENT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_CREATE_LINEAR_GRADIENT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x0, y0, x1, y1) {
                          x0 = Sk.ffi.remapToJs(x0);
                          y0 = Sk.ffi.remapToJs(y0);
                          x1 = Sk.ffi.remapToJs(x1);
                          y1 = Sk.ffi.remapToJs(y1);
                          var gradient = context[METHOD_CREATE_LINEAR_GRADIENT](x0, y0, x1, y1);
                          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                            $loc.__init__ = new Sk.builtin.func(function(self) {
                              self.tp$name = CANVAS_GRADIENT_CLASS;
                              self.v = gradient;
                            });
                            $loc.__getattr__ = new Sk.builtin.func(function(gradientPy, name) {
                              switch(name) {
                                case METHOD_ADD_COLOR_STOP: {
                                  return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                                    $loc.__init__ = new Sk.builtin.func(function(self) {
                                      self.tp$name = METHOD_ADD_COLOR_STOP;
                                    });
                                    $loc.__call__ = new Sk.builtin.func(function(self, offset, color) {
                                      offset = Sk.ffi.remapToJs(offset);
                                      color = Sk.ffi.remapToJs(color);
                                      gradient[METHOD_ADD_COLOR_STOP](offset, color);
                                    });
                                    $loc.__str__ = new Sk.builtin.func(function(self) {
                                      return new Sk.builtin.str(METHOD_ADD_COLOR_STOP);
                                    });
                                    $loc.__repr__ = new Sk.builtin.func(function(self) {
                                      return new Sk.builtin.str(METHOD_ADD_COLOR_STOP);
                                    });
                                  }, METHOD_ADD_COLOR_STOP, []));
                                }
                              }
                            })
                            $loc.__setattr__ = new Sk.builtin.func(function(gradientPy, name, valuePy) {
                              var value = Sk.ffi.remapToJs(valuePy);
                              switch(name) {
                                default: {
                                  throw new Sk.builtin.AssertionError(name + " is not a writeable attribute of " + CANVAS_GRADIENT_CLASS);
                                }
                              }
                            })
                            $loc.__str__ = new Sk.builtin.func(function(self) {
                              return new Sk.builtin.str(CANVAS_GRADIENT_CLASS);
                            });
                            $loc.__repr__ = new Sk.builtin.func(function(self) {
                              return new Sk.builtin.str(CANVAS_GRADIENT_CLASS);
                            });
                          }, CANVAS_GRADIENT_CLASS, []));
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CREATE_LINEAR_GRADIENT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_CREATE_LINEAR_GRADIENT);
                        });
                      }, METHOD_CREATE_LINEAR_GRADIENT, []));
                    }
                    case METHOD_FILL: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_FILL;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self) {
                          context[METHOD_FILL]();
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_FILL);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_FILL);
                        });
                      }, METHOD_FILL, []));
                    }
                    case METHOD_FILL_RECT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_FILL_RECT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y, w, h) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          w = Sk.ffi.remapToJs(w);
                          h = Sk.ffi.remapToJs(h);
                          context[METHOD_FILL_RECT](x, y, w, h);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_FILL_RECT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_FILL_RECT);
                        });
                      }, METHOD_FILL_RECT, []));
                    }
                    case METHOD_FILL_TEXT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_FILL_TEXT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, text, x, y, maxWidthPy) {
                          text = Sk.ffi.remapToJs(text);
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          var maxWidth = Sk.ffi.remapToJs(maxWidthPy);
                          if (typeof maxWidth === 'undefined') {
                            context[METHOD_FILL_TEXT](text, x, y);
                          }
                          else if (typeof maxWidth === 'number') {
                            context[METHOD_FILL_TEXT](text, x, y, maxWidth);
                          }
                          else {
                            throw new Sk.builtin.TypeError("maxWidth");
                          }
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_FILL_TEXT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_FILL_TEXT);
                        });
                      }, METHOD_FILL_TEXT, []));
                    }
                    case METHOD_LINE_TO: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_LINE_TO;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          context[METHOD_LINE_TO](x, y);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_LINE_TO);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_LINE_TO);
                        });
                      }, METHOD_LINE_TO, []));
                    }
                    case METHOD_MOVE_TO: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_MOVE_TO;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          context[METHOD_MOVE_TO](x, y);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_MOVE_TO);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_MOVE_TO);
                        });
                      }, METHOD_MOVE_TO, []));
                    }
                    case METHOD_QUADRATIC_CURVE_TO: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_QUADRATIC_CURVE_TO;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, cpx, cpy, x, y) {
                          cpx = Sk.ffi.remapToJs(cpx);
                          cpy = Sk.ffi.remapToJs(cpy);
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          context[METHOD_QUADRATIC_CURVE_TO](cpx, cpy, x, y);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_QUADRATIC_CURVE_TO);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_QUADRATIC_CURVE_TO);
                        });
                      }, METHOD_QUADRATIC_CURVE_TO, []));
                    }
                    case METHOD_RECT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_RECT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y, w, h) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          w = Sk.ffi.remapToJs(w);
                          h = Sk.ffi.remapToJs(h);
                          context[METHOD_RECT](x, y, w, h);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_RECT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_RECT);
                        });
                      }, METHOD_RECT, []));
                    }
                    case METHOD_RESTORE: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_RESTORE;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self) {
                          context[METHOD_RESTORE]();
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_RESTORE);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_RESTORE);
                        });
                      }, METHOD_RESTORE, []));
                    }
                    case METHOD_ROTATE: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_ROTATE;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, angle) {
                          angle = Sk.ffi.remapToJs(angle);
                          context[METHOD_ROTATE](angle);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_ROTATE);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_ROTATE);
                        });
                      }, METHOD_ROTATE, []));
                    }
                    case METHOD_SAVE: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_SAVE;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self) {
                          context[METHOD_SAVE]();
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_SAVE);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_SAVE);
                        });
                      }, METHOD_SAVE, []));
                    }
                    case METHOD_SCALE: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_SCALE;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          context[METHOD_SCALE](x, y);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_SCALE);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_SCALE);
                        });
                      }, METHOD_SCALE, []));
                    }
                    case METHOD_SET_TRANSFORM: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_SET_TRANSFORM;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, a, b, c, d, e, f) {
                          a = Sk.ffi.remapToJs(a);
                          b = Sk.ffi.remapToJs(b);
                          c = Sk.ffi.remapToJs(c);
                          d = Sk.ffi.remapToJs(d);
                          e = Sk.ffi.remapToJs(e);
                          f = Sk.ffi.remapToJs(f);
                          context[METHOD_SET_TRANSFORM](a, b, c, d, e, f);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_SET_TRANSFORM);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_SET_TRANSFORM);
                        });
                      }, METHOD_SET_TRANSFORM, []));
                    }
                    case METHOD_STROKE: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_STROKE;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self) {
                          context[METHOD_STROKE]();
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE);
                        });
                      }, METHOD_STROKE, []));
                    }
                    case METHOD_STROKE_RECT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_STROKE_RECT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y, w, h) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          w = Sk.ffi.remapToJs(w);
                          h = Sk.ffi.remapToJs(h);
                          context[METHOD_STROKE_RECT](x, y, w, h);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE_RECT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE_RECT);
                        });
                      }, METHOD_STROKE_RECT, []));
                    }
                    case METHOD_STROKE_TEXT: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_STROKE_TEXT;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, text, x, y, maxWidthPy) {
                          text = Sk.ffi.remapToJs(text);
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          var maxWidth = Sk.ffi.remapToJs(maxWidthPy);
                          if (typeof maxWidth === 'undefined') {
                            context[METHOD_STROKE_TEXT](text, x, y);
                          }
                          else if (typeof maxWidth === 'number') {
                            context[METHOD_STROKE_TEXT](text, x, y, maxWidth);
                          }
                          else {
                            throw new Sk.builtin.TypeError("maxWidth");
                          }
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE_TEXT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE_TEXT);
                        });
                      }, METHOD_STROKE_TEXT, []));
                    }
                    case METHOD_TRANSFORM: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_TRANSFORM;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, a, b, c, d, e, f) {
                          a = Sk.ffi.remapToJs(a);
                          b = Sk.ffi.remapToJs(b);
                          c = Sk.ffi.remapToJs(c);
                          d = Sk.ffi.remapToJs(d);
                          e = Sk.ffi.remapToJs(e);
                          f = Sk.ffi.remapToJs(f);
                          context[METHOD_TRANSFORM](a, b, c, d, e, f);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_TRANSFORM);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_TRANSFORM);
                        });
                      }, METHOD_TRANSFORM, []));
                    }
                    case METHOD_TRANSLATE: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_TRANSLATE;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, x, y) {
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          context[METHOD_TRANSLATE](x, y);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_TRANSLATE);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_TRANSLATE);
                        });
                      }, METHOD_TRANSLATE, []));
                    }
                  }
                })
                $loc.__setattr__ = new Sk.builtin.func(function(contextPy, name, valuePy) {
                  var context = Sk.ffi.remapToJs(contextPy);
                  var value = Sk.ffi.remapToJs(valuePy);
                  switch(name) {
                    case PROP_FILL_STYLE: {
                      context[PROP_FILL_STYLE] = value;
                    }
                    break;
                    case PROP_FONT: {
                      context[PROP_FONT] = value;
                    }
                    break;
                    case PROP_LINE_CAP: {
                      context[PROP_LINE_CAP] = value;
                    }
                    break;
                    case PROP_LINE_JOIN: {
                      context[PROP_LINE_JOIN] = value;
                    }
                    break;
                    case PROP_LINE_WIDTH: {
                      context[PROP_LINE_WIDTH] = value;
                    }
                    break;
                    case PROP_SHADOW_BLUR: {
                      context[PROP_SHADOW_BLUR] = value;
                    }
                    break;
                    case PROP_SHADOW_COLOR: {
                      context[PROP_SHADOW_COLOR] = value;
                    }
                    break;
                    case PROP_SHADOW_OFFSET_X: {
                      context[PROP_SHADOW_OFFSET_X] = value;
                    }
                    break;
                    case PROP_SHADOW_OFFSET_Y: {
                      context[PROP_SHADOW_OFFSET_Y] = value;
                    }
                    break;
                    case PROP_STROKE_STYLE: {
                      context[PROP_STROKE_STYLE] = value;
                    }
                    break;
                    case PROP_TEXT_ALIGN: {
                      context[PROP_TEXT_ALIGN] = value;
                    }
                    break;
                    case PROP_TEXT_BASELINE: {
                      context[PROP_TEXT_BASELINE] = value;
                    }
                    break;
                    default: {
                      throw new Sk.builtin.AssertionError(name + " is not a writeable attribute of " + CANVAS_RENDERING_CONTEXT_2D);
                    }
                  }
                })
                $loc.__str__ = new Sk.builtin.func(function(self) {
                  return new Sk.builtin.str(CANVAS_RENDERING_CONTEXT_2D);
                });
                $loc.__repr__ = new Sk.builtin.func(function(self) {
                  return new Sk.builtin.str(CANVAS_RENDERING_CONTEXT_2D);
                });
              }, CANVAS_RENDERING_CONTEXT_2D, []));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_CONTEXT);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_CONTEXT);
            });
          }, METHOD_GET_CONTEXT, []));
        }
        case METHOD_INSERT_BEFORE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_INSERT_BEFORE;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, newNode, refNode) {
              return wrapNode(node.insertBefore(nodeFromArg(newNode), nodeFromArg(refNode)));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_INSERT_BEFORE)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_INSERT_BEFORE)
            })
          }, METHOD_INSERT_BEFORE, []));
        }
        case METHOD_REMOVE_CHILD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_REMOVE_CHILD;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, childNode) {
              return wrapNode(node.removeChild(nodeFromArg(childNode)));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REMOVE_CHILD);
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REMOVE_CHILD);
            });
          }, METHOD_REMOVE_CHILD, []));
        }
        case METHOD_SET_ATTRIBUTE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_ATTRIBUTE;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, name, value) {
              node.setAttribute(stringFromArg(name), stringFromArg(value));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_ATTRIBUTE)
            });
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_ATTRIBUTE);
            });
          }, METHOD_SET_ATTRIBUTE, []));
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(nodePy, name, valuePy) {
      var node = Sk.ffi.remapToJs(nodePy);
      var value = Sk.ffi.remapToJs(valuePy);
      switch(name) {
        case PROP_DIR: {
          node[PROP_DIR] = value;
        }
        break;
        case 'id': {
          node.setAttribute(name, value);
        }
        break;
        case PROP_HEIGHT: {
          node[PROP_HEIGHT] = value;
        }
        break;
        case PROP_WIDTH: {
          node[PROP_WIDTH] = value;
        }
        break;
        default: {
          node.setAttribute(name, stringFromArg(value));
        }
      }
    });
    $loc.getCSS = new Sk.builtin.func(function(self,key) {
      return new Sk.builtin.str(self.v.style[key.v]);
    });
    $loc.setCSS = new Sk.builtin.func(function(self, attr, value) {
      self.v.style[attr.v] = value.v
    });
    $loc.getAttribute = new Sk.builtin.func(function(self, key) {
      var res = self.v.getAttribute(key.v)
      if (res) {
        return new Sk.builtin.str(res)
      }
      else {
        return null;
      }
    });
    $loc.setAttribute = new Sk.builtin.func(function(self, attr, value) {
      self.v.setAttribute(attr.v,value.v)
    });
    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(self.v.tagName)
    })
    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(NODE)
    })
  }, NODE, []);

  mod[PROP_WINDOW] = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = WINDOW_CLASS;
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case PROP_ANIMATION_TIME: {
          return wrapNumber(window[PROP_ANIMATION_TIME]);
        }
        case PROP_DOCUMENT: {
          return mod[PROP_DOCUMENT];
        }
        case "innerHeight": {
          return wrapNumber(window[name]);
        }
        case "innerWidth": {
          return wrapNumber(window[name]);
        }
        case PROP_DEVICE_PIXEL_RATIO: {
          return Sk.builtin.assk$(window[PROP_DEVICE_PIXEL_RATIO], Sk.builtin.nmber.int$);
        }
        case METHOD_ADD_EVENT_LISTENER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD_EVENT_LISTENER;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, typePy, listenerPy, useCapture) {
              var type = Sk.ffi.remapToJs(typePy);
              var listener = function(event) {
                var eventPy = Sk.misceval.callsim(mod[EVENT], Sk.ffi.referenceToPy(event));
                Sk.misceval.callsim(listenerPy, eventPy);
              };
              winListeners[type] = listener;
              window[METHOD_ADD_EVENT_LISTENER](type, listener, useCapture);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD_EVENT_LISTENER)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD_EVENT_LISTENER)
            })
          }, METHOD_ADD_EVENT_LISTENER, []));
        }
        case METHOD_REMOVE_EVENT_LISTENER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_REMOVE_EVENT_LISTENER;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, typePy, listener, useCapture) {
              var type = Sk.ffi.remapToJs(typePy);
              var listener = winListeners[type];
              delete winListeners[type];
              window[METHOD_REMOVE_EVENT_LISTENER](type, listener, useCapture);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REMOVE_EVENT_LISTENER)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REMOVE_EVENT_LISTENER)
            })
          }, METHOD_REMOVE_EVENT_LISTENER, []));
        }
        case METHOD_CANCEL_ANIMATION_FRAME: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_CANCEL_ANIMATION_FRAME;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, requestID) {
              if (requestID) {
                window[METHOD_CANCEL_ANIMATION_FRAME](numberFromArg(requestID));
              }
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CANCEL_ANIMATION_FRAME)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CANCEL_ANIMATION_FRAME)
            })
          }, METHOD_CANCEL_ANIMATION_FRAME, []));
        }
        case METHOD_REQUEST_ANIMATION_FRAME: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_REQUEST_ANIMATION_FRAME;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, callback) {
              var requestID = window[METHOD_REQUEST_ANIMATION_FRAME](function(timestamp) {
                Sk.misceval.callsim(callback, wrapNumber(timestamp));
              });
              return wrapNumber(requestID);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REQUEST_ANIMATION_FRAME)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REQUEST_ANIMATION_FRAME)
            })
          }, METHOD_REQUEST_ANIMATION_FRAME, []));
        }
        case METHOD_SET_TIMEOUT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_SET_TIMEOUT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, funcPy, delayPy, paramsPy) {
              var delay = Sk.ffi.remapToJs(delayPy);
              var params = Sk.ffi.remapToJs(paramsPy);
              var timeoutID = window[METHOD_SET_TIMEOUT](function() {
                Sk.misceval.callsim(funcPy);
              }, delay, params);
              return wrapNumber(timeoutID);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_TIMEOUT)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_SET_TIMEOUT)
            })
          }, METHOD_SET_TIMEOUT, []));
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(WINDOW_CLASS)
    })
    $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
      return new Sk.builtin.str(WINDOW_CLASS)
    })
  }, WINDOW_CLASS, []));

  mod[PROP_DOCUMENT] = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = DOCUMENT_CLASS;
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      switch(name) {
        case PROP_BODY: {
          return Sk.misceval.callsim(mod[NODE], document[PROP_BODY]);
        }
        case PROP_WEBKIT_HIDDEN: {
          return document[PROP_WEBKIT_HIDDEN];
        }
        case METHOD_ADD_EVENT_LISTENER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD_EVENT_LISTENER;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, typePy, listenerPy, useCapture) {
              var type = Sk.ffi.remapToJs(typePy);
              var listener = function(event) {
                var eventPy = Sk.misceval.callsim(mod[EVENT], Sk.ffi.referenceToPy(event));
                Sk.misceval.callsim(listenerPy, eventPy);
              };
              docListeners[type] = listener;
              document[METHOD_ADD_EVENT_LISTENER](type, listener, useCapture);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD_EVENT_LISTENER)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD_EVENT_LISTENER)
            })
          }, METHOD_ADD_EVENT_LISTENER, []));
        }
        case METHOD_REMOVE_EVENT_LISTENER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_REMOVE_EVENT_LISTENER;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, typePy, listener, useCapture) {
              var type = Sk.ffi.remapToJs(typePy);
              var listener = docListeners[type];
              delete docListeners[type];
              document[METHOD_REMOVE_EVENT_LISTENER](type, listener, useCapture);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REMOVE_EVENT_LISTENER)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_REMOVE_EVENT_LISTENER)
            })
          }, METHOD_REMOVE_EVENT_LISTENER, []));
        }
        case METHOD_CREATE_ELEMENT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_CREATE_ELEMENT;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, tagName, attributes) {
              var element = document.createElement(stringFromArg(tagName));
              if (attributes instanceof Sk.builtin.dict) {
                for (var iter = attributes.tp$iter(), k = iter.tp$iternext(); k !== undefined; k = iter.tp$iternext()) {
                  var v = attributes.mp$subscript(k);
                  if (v === undefined) {
                    v = null;
                  }
                  var kAsJs = Sk.ffi.remapToJs(k);
                  var vAsJs = Sk.ffi.remapToJs(v);
                  element.setAttribute(kAsJs, vAsJs);
                }
              }
              return wrapNode(element);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CREATE_ELEMENT)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_CREATE_ELEMENT)
            })
          }, METHOD_CREATE_ELEMENT, []));
        }
        case METHOD_GET_ELEMENT_BY_ID: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GET_ELEMENT_BY_ID;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, id) {
              return wrapNode(document.getElementById(stringFromArg(id)));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_ELEMENT_BY_ID)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_ELEMENT_BY_ID)
            })
          }, METHOD_GET_ELEMENT_BY_ID, []));
        }
        case METHOD_GET_ELEMENTS_BY_TAG_NAME: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_GET_ELEMENTS_BY_TAG_NAME;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, tagName) {
              var elements = document.getElementsByTagName(stringFromArg(tagName))
              var xs = [];
              for (var i = elements.length - 1; i >= 0; i--) {
                xs.push(wrapNode(elements[i]));
              }
              return new Sk.builtin.list(xs);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_ELEMENTS_BY_TAG_NAME)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_GET_ELEMENTS_BY_TAG_NAME)
            })
          }, METHOD_GET_ELEMENTS_BY_TAG_NAME, []));
        }
      }
    });
    $loc.__str__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(DOCUMENT_CLASS)
    })
    $loc.__repr__ = new Sk.builtin.func(function(self) {
      return new Sk.builtin.str(DOCUMENT_CLASS)
    })
  }, DOCUMENT_CLASS, []));

  return mod;
}
