/*
 * browser Python module
 *
 * Exposes the window and document variables.
 */
var $builtinmodule = function(name) {

  var mod = {};

  var NODE              = "Node";
  var CONTEXT_CLASS     = "Context";
  var DOCUMENT_CLASS    = "Document";
  var EVENT_CLASS       = "Event";
  var WINDOW_CLASS      = "Window";
  
  var PROP_ANIMATION_TIME            = "animationTime";
  var PROP_BODY                      = "body";
  var PROP_DEVICE_PIXEL_RATIO        = "devicePixelRatio";
  var PROP_DOCUMENT                  = "document";
  var PROP_FILL_STYLE                = "fillStyle";
  var PROP_FIRST_CHILD               = "firstChild";
  var PROP_HEIGHT                    = "height";
  var PROP_KEY_CODE                  = "keyCode";
  var PROP_LAST_CHILD                = "lastChild";
  var PROP_LEFT                      = "left";
  var PROP_NEXT_SIBLING              = "nextSibling";
  var PROP_PARENT_NODE               = "parentNode";
  var PROP_POSITION                  = "position";
  var PROP_PREVIOUS_SIBLING          = "previousSibling";
  var PROP_STROKE_STYLE              = "strokeStyle";
  var PROP_STYLE                     = "style";
  var PROP_TOP                       = "top";
  var PROP_WEBKIT_HIDDEN             = "webkitHidden";
  var PROP_WIDTH                     = "width";
  var PROP_WINDOW                    = "window";
  var METHOD_ADD_EVENT_LISTENER      = "addEventListener";
  var METHOD_APPEND_CHILD            = "appendChild";
  var METHOD_ARC                     = "arc";
  var METHOD_BEGIN_PATH              = "beginPath";
  var METHOD_CANCEL_ANIMATION_FRAME  = "cancelAnimationFrame";
  var METHOD_CLEAR_RECT              = "clearRect";
  var METHOD_CLOSE_PATH              = "closePath";
  var METHOD_FILL                    = "fill";
  var METHOD_FILL_RECT               = "fillRect";
  var METHOD_FILL_TEXT               = "fillText";
  var METHOD_GET_CONTEXT             = "getContext";
  var METHOD_INSERT_BEFORE           = "insertBefore";
  var METHOD_LINE_TO                 = "lineTo";
  var METHOD_MOVE_TO                 = "moveTo";
  var METHOD_RECT                    = "rect";
  var METHOD_REMOVE_CHILD            = "removeChild";
  var METHOD_REMOVE_EVENT_LISTENER   = "removeEventListener";
  var METHOD_REQUEST_ANIMATION_FRAME = "requestAnimationFrame";
  var METHOD_SET_ATTRIBUTE           = "setAttribute";
  var METHOD_SET_TIMEOUT             = "setTimeout";
  var METHOD_SET_TRANSFORM           = "setTransform";
  var METHOD_STROKE                  = "stroke";
  var METHOD_STROKE_RECT             = "strokeRect";
  var METHOD_STROKE_TEXT             = "strokeText";
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
            $loc.__call__ = new Sk.builtin.func(function(self, contextIdPy) {
              var contextId = Sk.ffi.remapToJs(contextIdPy);
              var context = node.getContext(contextId);
              return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                $loc.__init__ = new Sk.builtin.func(function(self) {
                  self.tp$name = CONTEXT_CLASS;
                  self.v = context;
                });
                $loc.__getattr__ = new Sk.builtin.func(function(contextPy, name) {
                  switch(name) {
                    case PROP_FILL_STYLE: {
                      return new Sk.builtin.str(context[PROP_FILL_STYLE]);
                    }
                    case PROP_STROKE_STYLE: {
                      return new Sk.builtin.str(context[PROP_STROKE_STYLE]);
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
                        $loc.__call__ = new Sk.builtin.func(function(self, text, x, y, maxWidth) {
                          text = Sk.ffi.remapToJs(text);
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          maxWidth = Sk.ffi.remapToJs(maxWidth);
                          context[METHOD_FILL_TEXT](text, x, y, maxWidth);
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
                    case METHOD_SET_TRANSFORM: {
                      return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                        $loc.__init__ = new Sk.builtin.func(function(self) {
                          self.tp$name = METHOD_SET_TRANSFORM;
                        });
                        $loc.__call__ = new Sk.builtin.func(function(self, m11, m12, m21, m22, dx, dy) {
                          m11 = Sk.ffi.remapToJs(m11);
                          m12 = Sk.ffi.remapToJs(m12);
                          m21 = Sk.ffi.remapToJs(m21);
                          m22 = Sk.ffi.remapToJs(m22);
                          dx = Sk.ffi.remapToJs(dx);
                          dy = Sk.ffi.remapToJs(dy);
                          context[METHOD_SET_TRANSFORM](m11, m12, m21, m22, dx, dy);
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
                        $loc.__call__ = new Sk.builtin.func(function(self, text, x, y, maxWidth) {
                          text = Sk.ffi.remapToJs(text);
                          x = Sk.ffi.remapToJs(x);
                          y = Sk.ffi.remapToJs(y);
                          maxWidth = Sk.ffi.remapToJs(maxWidth);
                          context[METHOD_STROKE_TEXT](text, x, y, maxWidth);
                        });
                        $loc.__str__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE_TEXT);
                        });
                        $loc.__repr__ = new Sk.builtin.func(function(self) {
                          return new Sk.builtin.str(METHOD_STROKE_TEXT);
                        });
                      }, METHOD_STROKE_TEXT, []));
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
                    case PROP_STROKE_STYLE: {
                      context[PROP_STROKE_STYLE] = value;
                    }
                    break;
                    default: {
                      throw new Sk.builtin.AssertionError(name + " is not a writeable attribute of " + CONTEXT_CLASS);
                    }
                  }
                })
                $loc.__str__ = new Sk.builtin.func(function(self) {
                  return new Sk.builtin.str(CONTEXT_CLASS);
                });
                $loc.__repr__ = new Sk.builtin.func(function(self) {
                  return new Sk.builtin.str(CONTEXT_CLASS);
                });
              }, CONTEXT_CLASS, []));
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
          self.v.setAttribute(name, stringFromArg(value));
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
          return wrapNumber(window[name]);
        }
        case METHOD_ADD_EVENT_LISTENER: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = METHOD_ADD_EVENT_LISTENER;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, type, listener, useCapture) {
              // TODO: Removal of event listener functions.
              window[METHOD_ADD_EVENT_LISTENER](stringFromArg(type), function() {
                Sk.misceval.callsim(listener);
              }, useCapture);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD_EVENT_LISTENER)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(METHOD_ADD_EVENT_LISTENER)
            })
          }, METHOD_ADD_EVENT_LISTENER, []));
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
      var METHOD_PREVENT_DEFAULT = "preventDefault";
      var METHOD_CREATE_ELEMENT = "createElement";
      var METHOD_GET_ELEMENT_BY_ID = "getElementById";
      var GET_ELEMENTS_BY_TAG_NAME = "getElementsByTagName";
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
                var eventPy = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
                  $loc.__init__ = new Sk.builtin.func(function(self) {
                    self.tp$name = EVENT_CLASS;
                  });
                  $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
                    switch(name) {
                      case PROP_KEY_CODE: {
                        return Sk.builtin.assk$(event[PROP_KEY_CODE], Sk.builtin.nmber.float$);
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
                    }
                  });
                  $loc.__str__ = new Sk.builtin.func(function(self) {
                    return new Sk.builtin.str(EVENT_CLASS)
                  })
                  $loc.__repr__ = new Sk.builtin.func(function(self) {
                    return new Sk.builtin.str(EVENT_CLASS)
                  })
                }, EVENT_CLASS, []));
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
              // TODO: Removal of event listener functions.
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
        case GET_ELEMENTS_BY_TAG_NAME: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = GET_ELEMENTS_BY_TAG_NAME;
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
              return new Sk.builtin.str(GET_ELEMENTS_BY_TAG_NAME)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(GET_ELEMENTS_BY_TAG_NAME)
            })
          }, GET_ELEMENTS_BY_TAG_NAME, []));
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
