/*
 * browser Python module
 *
 * Exposes the window and document variables.
 */
var $builtinmodule = function(name) {

  var mod = {};

  var NODE           = "Node";
  var DOCUMENT_CLASS = "Document";
  var WINDOW_CLASS   = "Window";
  var EVENT_CLASS    = "Event";

  var PROP_KEY_CODE                = "keyCode";
  var METHOD_ADD_EVENT_LISTENER    = "addEventListener";
  var METHOD_REMOVE_EVENT_LISTENER = "removeEventListener";
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
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      var APPEND_CHILD = "appendChild";
      var INSERT_BEFORE = "insertBefore";
      var REMOVE_CHILD = "removeChild";
      var SET_ATTRIBUTE = "setAttribute";
      var node = self.v;
      switch(name) {
        case 'clientHeight': {
          return wrapNumber(node[name]);
        }
        case 'clientWidth': {
          return wrapNumber(node[name]);
        }
        case 'parentNode': {
          return wrapNode(node.parentNode);
        }
        case APPEND_CHILD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = APPEND_CHILD;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, childNode) {
              return wrapNode(node.appendChild(nodeFromArg(childNode)));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(APPEND_CHILD)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(APPEND_CHILD)
            })
          }, APPEND_CHILD, []));
        }
        case INSERT_BEFORE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = INSERT_BEFORE;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, newNode, refNode) {
              return wrapNode(node.insertBefore(nodeFromArg(newNode), nodeFromArg(refNode)));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(INSERT_BEFORE)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(INSERT_BEFORE)
            })
          }, INSERT_BEFORE, []));
        }
        case REMOVE_CHILD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = REMOVE_CHILD;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, childNode) {
              return wrapNode(node.removeChild(nodeFromArg(childNode)));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(REMOVE_CHILD)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(REMOVE_CHILD)
            })
          }, REMOVE_CHILD, []));
        }
        case SET_ATTRIBUTE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = SET_ATTRIBUTE;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, name, value) {
              node.setAttribute(stringFromArg(name), stringFromArg(value));
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(SET_ATTRIBUTE)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(SET_ATTRIBUTE)
            })
          }, SET_ATTRIBUTE, []));
        }
        default: {
          // The framework will raise an AttributeError exception.
          return /* undefined */;
        }
      }
    });
    $loc.__setattr__ = new Sk.builtin.func(function(self, name, value) {
      switch(name) {
        case 'id': {
          self.v.setAttribute(name, stringFromArg(value));
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

  mod["window"] = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = WINDOW_CLASS;
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      var REQUEST_ANIMATION_FRAME = "requestAnimationFrame";
      var CANCEL_ANIMATION_FRAME = "cancelAnimationFrame";
      switch(name) {
        case "document": {
          return mod[name];
        }
        case "innerHeight": {
          return wrapNumber(window[name]);
        }
        case "innerWidth": {
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
        case REQUEST_ANIMATION_FRAME: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = REQUEST_ANIMATION_FRAME;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, callback) {
              var requestID = window.requestAnimationFrame(function(timestamp) {
                // TODO: is it consistent to be wrapping here?
                Sk.misceval.callsim(callback, wrapNumber(timestamp));
              });
              return wrapNumber(requestID);
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(REQUEST_ANIMATION_FRAME)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(REQUEST_ANIMATION_FRAME)
            })
          }, REQUEST_ANIMATION_FRAME, []));
        }
        case CANCEL_ANIMATION_FRAME: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = CANCEL_ANIMATION_FRAME;
            });
            $loc.__call__ = new Sk.builtin.func(function(self, requestID) {
              if (requestID) {
                window.cancelAnimationFrame(numberFromArg(requestID));
              }
            });
            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(CANCEL_ANIMATION_FRAME)
            })
            $loc.__repr__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(CANCEL_ANIMATION_FRAME)
            })
          }, CANCEL_ANIMATION_FRAME, []));
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

  mod["document"] = Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.tp$name = DOCUMENT_CLASS;
    });
    $loc.__getattr__ = new Sk.builtin.func(function(self, name) {
      var METHOD_PREVENT_DEFAULT = "preventDefault";
      var METHOD_CREATE_ELEMENT = "createElement";
      var METHOD_GET_ELEMENT_BY_ID = "getElementById";
      var GET_ELEMENTS_BY_TAG_NAME = "getElementsByTagName";
      switch(name) {
        case "body": {
          return Sk.misceval.callsim(mod[NODE], document.body);
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
