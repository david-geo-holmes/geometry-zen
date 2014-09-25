"no use strict";
;(function(window) {
if (typeof window.window != "undefined" && window.document) {
    return;
}

window.console = function() {
    var msgs = Array.prototype.slice.call(arguments, 0);
    postMessage({type: "log", data: msgs});
};
window.console.error =
window.console.warn = 
window.console.log =
window.console.trace = window.console;

window.window = window;
window.ace = window;

window.onerror = function(message, file, line, col, err) {
    console.error("Worker " + (err ? err.stack : message));
};

window.normalizeModule = function(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return window.normalizeModule(parentId, chunks[0]) + "!" + window.normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = (base ? base + "/" : "") + moduleName;
        
        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/^\.\//, "").replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }
    
    return moduleName;
};

window.require = function(parentId, id) {
    if (!id) {
        id = parentId;
        parentId = null;
    }
    if (!id.charAt)
        throw new Error("worker.js require() accepts only (parentId, id) as arguments");

    id = window.normalizeModule(parentId, id);

    var module = window.require.modules[id];
    if (module) {
        if (!module.initialized) {
            module.initialized = true;
            module.exports = module.factory().exports;
        }
        return module.exports;
    }
    
    var chunks = id.split("/");
    if (!window.require.tlns)
        return console.log("unable to load " + id);
    chunks[0] = window.require.tlns[chunks[0]] || chunks[0];
    var path = chunks.join("/") + ".js";
    
    window.require.id = id;
    importScripts(path);
    return window.require(parentId, id);
};
window.require.modules = {};
window.require.tlns = {};

window.define = function(id, deps, factory) {
    if (arguments.length == 2) {
        factory = deps;
        if (typeof id != "string") {
            deps = id;
            id = window.require.id;
        }
    } else if (arguments.length == 1) {
        factory = id;
        deps = [];
        id = window.require.id;
    }

    if (!deps.length)
        // If there is no dependencies, we inject 'require', 'exports' and
        // 'module' as dependencies, to provide CommonJS compatibility.
        deps = ['require', 'exports', 'module'];

    if (id.indexOf("text!") === 0) 
        return;
    
    var req = function(childId) {
        return window.require(id, childId);
    };

    window.require.modules[id] = {
        exports: {},
        factory: function() {
            var module = this;
            var returnExports = factory.apply(this, deps.map(function(dep) {
              switch(dep) {
                  // Because 'require', 'exports' and 'module' aren't actual
                  // dependencies, we must handle them seperately.
                  case 'require': return req;
                  case 'exports': return module.exports;
                  case 'module':  return module;
                  // But for all other dependencies, we can just go ahead and
                  // require them.
                  default:        return req(dep);
              }
            }));
            if (returnExports)
                module.exports = returnExports;
            return module;
        }
    };
};
window.define.amd = {};

window.initBaseUrls  = function initBaseUrls(topLevelNamespaces) {
    require.tlns = topLevelNamespaces;
};

window.initSender = function initSender() {

    var EventEmitter = window.require("ace/lib/event_emitter").EventEmitter;
    var oop = window.require("ace/lib/oop");
    
    var Sender = function() {};
    
    (function() {
        
        oop.implement(this, EventEmitter);
                
        this.callback = function(data, callbackId) {
            postMessage({
                type: "call",
                id: callbackId,
                data: data
            });
        };
    
        this.emit = function(name, data) {
            postMessage({
                type: "event",
                name: name,
                data: data
            });
        };
        
    }).call(Sender.prototype);
    
    return new Sender();
};

var main = window.main = null;
var sender = window.sender = null;

window.onmessage = function(e) {
    var msg = e.data;
    if (msg.command) {
        if (main[msg.command])
            main[msg.command].apply(main, msg.args);
        else
            throw new Error("Unknown command:" + msg.command);
    }
    else if (msg.init) {        
        initBaseUrls(msg.tlns);
        require("ace/lib/es5-shim");
        sender = window.sender = initSender();
        var clazz = require(msg.module)[msg.classname];
        main = window.main = new clazz(sender);
    } 
    else if (msg.event && sender) {
        sender._signal(msg.event, msg.data);
    }
};
})(this);

ace.define("ace/lib/oop",["require","exports","module"], function(require, exports, module) {
"no use strict";
function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}
exports.inherits = inherits;
function mixin(obj, base) {
    for (var key in base) {
        obj[key] = base[key];
    }
    return obj;
}
exports.mixin = mixin;
function implement(proto, base) {
    exports.mixin(proto, base);
}
exports.implement = implement;
});

ace.define("ace/lib/event_emitter",["require","exports","module"], function(require, exports, module) {
"no use strict";
var stopPropagation = function () {
    this.propagationStopped = true;
};
var preventDefault = function () {
    this.defaultPrevented = true;
};
var EventEmitterClass = (function () {
    function EventEmitterClass() {
    }
    EventEmitterClass.prototype._dispatchEvent = function (eventName, e) {
        this._eventRegistry || (this._eventRegistry = {});
        this._defaultHandlers || (this._defaultHandlers = {});

        var listeners = this._eventRegistry[eventName] || [];
        var defaultHandler = this._defaultHandlers[eventName];
        if (!listeners.length && !defaultHandler)
            return;

        if (typeof e != "object" || !e)
            e = {};

        if (!e.type)
            e.type = eventName;
        if (!e.stopPropagation)
            e.stopPropagation = stopPropagation;
        if (!e.preventDefault)
            e.preventDefault = preventDefault;

        listeners = listeners.slice();
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](e, this);
            if (e.propagationStopped)
                break;
        }

        if (defaultHandler && !e.defaultPrevented)
            return defaultHandler(e, this);
    };
    EventEmitterClass.prototype._emit = function (eventName, e) {
        return this._dispatchEvent(eventName, e);
    };
    EventEmitterClass.prototype._signal = function (eventName, e) {
        var listeners = (this._eventRegistry || {})[eventName];
        if (!listeners)
            return;
        listeners = listeners.slice();
        for (var i = 0; i < listeners.length; i++)
            listeners[i](e, this);
    };

    EventEmitterClass.prototype.once = function (eventName, callback) {
        var _self = this;
        callback && this.addEventListener(eventName, function newCallback() {
            _self.removeEventListener(eventName, newCallback);
            callback.apply(null, arguments);
        });
    };

    EventEmitterClass.prototype.setDefaultHandler = function (eventName, callback) {
        var handlers = this._defaultHandlers;
        if (!handlers)
            handlers = this._defaultHandlers = { _disabled_: {} };

        if (handlers[eventName]) {
            var old = handlers[eventName];
            var disabled = handlers._disabled_[eventName];
            if (!disabled)
                handlers._disabled_[eventName] = disabled = [];
            disabled.push(old);
            var i = disabled.indexOf(callback);
            if (i != -1)
                disabled.splice(i, 1);
        }
        handlers[eventName] = callback;
    };

    EventEmitterClass.prototype.removeDefaultHandler = function (eventName, callback) {
        var handlers = this._defaultHandlers;
        if (!handlers)
            return;
        var disabled = handlers._disabled_[eventName];

        if (handlers[eventName] == callback) {
            var old = handlers[eventName];
            if (disabled)
                this.setDefaultHandler(eventName, disabled.pop());
        } else if (disabled) {
            var i = disabled.indexOf(callback);
            if (i != -1)
                disabled.splice(i, 1);
        }
    };

    EventEmitterClass.prototype.addEventListener = function (eventName, callback, capturing) {
        this._eventRegistry = this._eventRegistry || {};

        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            listeners = this._eventRegistry[eventName] = [];

        if (listeners.indexOf(callback) == -1)
            listeners[capturing ? "unshift" : "push"](callback);
        return callback;
    };

    EventEmitterClass.prototype.on = function (eventName, callback, capturing) {
        return this.addEventListener(eventName, callback, capturing);
    };

    EventEmitterClass.prototype.removeEventListener = function (eventName, callback) {
        this._eventRegistry = this._eventRegistry || {};

        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        var index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };

    EventEmitterClass.prototype.removeListener = function (eventName, callback) {
        return this.removeEventListener(eventName, callback);
    };

    EventEmitterClass.prototype.off = function (eventName, callback) {
        return this.removeEventListener(eventName, callback);
    };

    EventEmitterClass.prototype.removeAllListeners = function (eventName) {
        if (this._eventRegistry)
            this._eventRegistry[eventName] = [];
    };
    return EventEmitterClass;
})();
exports.EventEmitterClass = EventEmitterClass;
exports.EventEmitter = new EventEmitterClass();
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/range",["require","exports","module"], function(require, exports, module) {
"no use strict";
var comparePoints = function (p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
};
var Range = (function () {
    function Range(startRow, startColumn, endRow, endColumn) {
        this.start = {
            row: startRow,
            column: startColumn
        };

        this.end = {
            row: endRow,
            column: endColumn
        };
    }
    Range.prototype.isEqual = function (range) {
        return this.start.row === range.start.row && this.end.row === range.end.row && this.start.column === range.start.column && this.end.column === range.end.column;
    };
    Range.prototype.toString = function () {
        return ("Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]");
    };
    Range.prototype.contains = function (row, column) {
        return this.compare(row, column) === 0;
    };
    Range.prototype.compareRange = function (range) {
        var cmp, end = range.end, start = range.start;

        cmp = this.compare(end.row, end.column);
        if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
                return 2;
            } else if (cmp === 0) {
                return 1;
            } else {
                return 0;
            }
        } else if (cmp == -1) {
            return -2;
        } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
                return -1;
            } else if (cmp == 1) {
                return 42;
            } else {
                return 0;
            }
        }
    };
    Range.prototype.comparePoint = function (p) {
        return this.compare(p.row, p.column);
    };
    Range.prototype.containsRange = function (range) {
        return this.comparePoint(range.start) === 0 && this.comparePoint(range.end) === 0;
    };
    Range.prototype.intersects = function (range) {
        var cmp = this.compareRange(range);
        return (cmp === -1 || cmp === 0 || cmp === 1);
    };
    Range.prototype.isEnd = function (row, column) {
        return this.end.row == row && this.end.column == column;
    };
    Range.prototype.isStart = function (row, column) {
        return this.start.row == row && this.start.column == column;
    };
    Range.prototype.setStart = function (row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    };
    Range.prototype.setEnd = function (row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    };
    Range.prototype.inside = function (row, column) {
        if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    Range.prototype.insideStart = function (row, column) {
        if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    Range.prototype.insideEnd = function (row, column) {
        if (this.compare(row, column) === 0) {
            if (this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    Range.prototype.compare = function (row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            }
        }

        if (row < this.start.row)
            return -1;

        if (row > this.end.row)
            return 1;

        if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;

        if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;

        return 0;
    };
    Range.prototype.compareStart = function (row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    Range.prototype.compareEnd = function (row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    };
    Range.prototype.compareInside = function (row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    Range.prototype.clipRows = function (firstRow, lastRow) {
        var start;
        var end;
        if (this.end.row > lastRow)
            end = { row: lastRow + 1, column: 0 };
        else if (this.end.row < firstRow)
            end = { row: firstRow, column: 0 };

        if (this.start.row > lastRow)
            start = { row: lastRow + 1, column: 0 };
        else if (this.start.row < firstRow)
            start = { row: firstRow, column: 0 };

        return Range.fromPoints(start || this.start, end || this.end);
    };
    Range.prototype.extend = function (row, column) {
        var cmp = this.compare(row, column);

        if (cmp === 0)
            return this;
        else if (cmp == -1)
            var start = { row: row, column: column };
        else
            var end = { row: row, column: column };

        return Range.fromPoints(start || this.start, end || this.end);
    };

    Range.prototype.isEmpty = function () {
        return (this.start.row === this.end.row && this.start.column === this.end.column);
    };
    Range.prototype.isMultiLine = function () {
        return (this.start.row !== this.end.row);
    };
    Range.prototype.clone = function () {
        return Range.fromPoints(this.start, this.end);
    };
    Range.prototype.collapseRows = function () {
        if (this.end.column === 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
        else
            return new Range(this.start.row, 0, this.end.row, 0);
    };
    Range.prototype.toScreenRange = function (session) {
        var screenPosStart = session.documentToScreenPosition(this.start.row, this.start.column);
        var screenPosEnd = session.documentToScreenPosition(this.end.row, this.end.column);

        return new Range(screenPosStart.row, screenPosStart.column, screenPosEnd.row, screenPosEnd.column);
    };
    Range.prototype.moveBy = function (row, column) {
        this.start.row += row;
        this.start.column += column;
        this.end.row += row;
        this.end.column += column;
    };
    Range.fromPoints = function (start, end) {
        return new Range(start.row, start.column, end.row, end.column);
    };

    Range.comparePoints = function (p1, p2) {
        return p1.row - p2.row || p1.column - p2.column;
    };
    return Range;
})();
exports.Range = Range;

var OrientedRange = (function (_super) {
    __extends(OrientedRange, _super);
    function OrientedRange(startRow, startColumn, endRow, endColumn, cursor, desiredColumn) {
        _super.call(this, startRow, startColumn, endRow, endColumn);
        this.cursor = cursor;
        this.desiredColumn = desiredColumn;
    }
    return OrientedRange;
})(Range);
exports.OrientedRange = OrientedRange;
});

ace.define("ace/lib/asserts",["require","exports","module"], function(require, exports, module) {
"no use strict";
exports.ENABLE_ASSERTS = true;

var AssertionError = (function () {
    function AssertionError(message, args) {
        this.name = 'AssertionError';
        this.message = message;
    }
    return AssertionError;
})();
exports.AssertionError = AssertionError;

function doAssertFailure(defaultMessage, defaultArgs, givenMessage, givenArgs) {
    var message = 'Assertion failed';
    if (givenMessage) {
        message += ': ' + givenMessage;
        var args = givenArgs;
    } else if (defaultMessage) {
        message += ': ' + defaultMessage;
        args = defaultArgs;
    }

    throw new AssertionError('' + message, args || []);
}

function assert(condition, message, args) {
    if (exports.ENABLE_ASSERTS && !condition) {
        doAssertFailure('', null, message, Array.prototype.slice.call(arguments, 2));
    }
    return condition;
}
exports.assert = assert;
;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/anchor",["require","exports","module","ace/lib/event_emitter","ace/lib/asserts"], function(require, exports, module) {
"no use strict";
var eve = require('./lib/event_emitter');
var asserts = require('./lib/asserts');
var Anchor = (function (_super) {
    __extends(Anchor, _super);
    function Anchor(doc, row, column) {
        _super.call(this);
        asserts.assert(typeof row === 'number', "row must be a number");
        asserts.assert(typeof column === 'number', "column must be a number");
        this.$onChange = this.onChange.bind(this);
        this.attach(doc);
        this.setPosition(row, column);
        this.$insertRight = false;
    }
    Anchor.prototype.getPosition = function () {
        return this.$clipPositionToDocument(this.row, this.column);
    };
    Anchor.prototype.getDocument = function () {
        return this.document;
    };
    Anchor.prototype.onChange = function (e) {
        var delta = e.data;
        var range = delta.range;

        if (range.start.row == range.end.row && range.start.row != this.row)
            return;

        if (range.start.row > this.row)
            return;

        if (range.start.row == this.row && range.start.column > this.column)
            return;

        var row = this.row;
        var column = this.column;
        var start = range.start;
        var end = range.end;

        if (delta.action === "insertText") {
            if (start.row === row && start.column <= column) {
                if (start.column === column && this.$insertRight) {
                } else if (start.row === end.row) {
                    column += end.column - start.column;
                } else {
                    column -= start.column;
                    row += end.row - start.row;
                }
            } else if (start.row !== end.row && start.row < row) {
                row += end.row - start.row;
            }
        } else if (delta.action === "insertLines") {
            if (start.row === row && column === 0 && this.$insertRight) {
            } else if (start.row <= row) {
                row += end.row - start.row;
            }
        } else if (delta.action === "removeText") {
            if (start.row === row && start.column < column) {
                if (end.column >= column)
                    column = start.column;
                else
                    column = Math.max(0, column - (end.column - start.column));
            } else if (start.row !== end.row && start.row < row) {
                if (end.row === row)
                    column = Math.max(0, column - end.column) + start.column;
                row -= (end.row - start.row);
            } else if (end.row === row) {
                row -= end.row - start.row;
                column = Math.max(0, column - end.column) + start.column;
            }
        } else if (delta.action == "removeLines") {
            if (start.row <= row) {
                if (end.row <= row)
                    row -= end.row - start.row;
                else {
                    row = start.row;
                    column = 0;
                }
            }
        }

        this.setPosition(row, column, true);
    };
    Anchor.prototype.setPosition = function (row, column, noClip) {
        var pos;
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        } else {
            pos = this.$clipPositionToDocument(row, column);
        }

        if (this.row == pos.row && this.column == pos.column)
            return;

        var old = {
            row: this.row,
            column: this.column
        };

        this.row = pos.row;
        this.column = pos.column;
        this._signal("change", {
            old: old,
            value: pos
        });
    };
    Anchor.prototype.detach = function () {
        this.document.removeEventListener("change", this.$onChange);
    };

    Anchor.prototype.attach = function (doc) {
        this.document = doc || this.document;
        this.document.on("change", this.$onChange);
    };
    Anchor.prototype.$clipPositionToDocument = function (row, column) {
        var pos = { row: 0, column: 0 };

        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        } else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        } else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }

        if (column < 0)
            pos.column = 0;

        return pos;
    };
    return Anchor;
})(eve.EventEmitterClass);
exports.Anchor = Anchor;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/document",["require","exports","module","ace/lib/event_emitter","ace/range","ace/anchor"], function(require, exports, module) {
"no use strict";
var eve = require('./lib/event_emitter');
var rangeModule = require('./range');
var anchorModule = require('./anchor');

var Anchor = anchorModule.Anchor;
var Range = rangeModule.Range;

var $split = (function () {
    function foo(text) {
        return text.replace(/\r\n|\r/g, "\n").split("\n");
    }
    function bar(text) {
        return text.split(/\r\n|\r|\n/);
    }
    if ("aaa".split(/a/).length === 0) {
        return foo;
    } else {
        return bar;
    }
})();

function $clipPosition(doc, position) {
    var length = doc.getLength();
    if (position.row >= length) {
        position.row = Math.max(0, length - 1);
        position.column = doc.getLine(length - 1).length;
    } else if (position.row < 0) {
        position.row = 0;
    }
    return position;
}
var Document = (function (_super) {
    __extends(Document, _super);
    function Document(text) {
        _super.call(this);
        this.$lines = [];
        this.$autoNewLine = "";
        this.$newLineMode = "auto";
        if (text.length === 0) {
            this.$lines = [""];
        } else if (Array.isArray(text)) {
            this._insertLines(0, text);
        } else {
            this.insert({ row: 0, column: 0 }, text);
        }
    }
    Document.prototype.setValue = function (text) {
        var len = this.getLength();
        this.remove(new Range(0, 0, len, this.getLine(len - 1).length));
        this.insert({ row: 0, column: 0 }, text);
    };
    Document.prototype.getValue = function () {
        return this.getAllLines().join(this.getNewLineCharacter());
    };
    Document.prototype.createAnchor = function (row, column) {
        return new Anchor(this, row, column);
    };
    Document.prototype.$detectNewLine = function (text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        this.$autoNewLine = match ? match[1] : "\n";
        this._signal("changeNewLineMode");
    };
    Document.prototype.getNewLineCharacter = function () {
        switch (this.$newLineMode) {
            case "windows":
                return "\r\n";
            case "unix":
                return "\n";
            default:
                return this.$autoNewLine || "\n";
        }
    };
    Document.prototype.setNewLineMode = function (newLineMode) {
        if (this.$newLineMode === newLineMode)
            return;

        this.$newLineMode = newLineMode;
        this._signal("changeNewLineMode");
    };
    Document.prototype.getNewLineMode = function () {
        return this.$newLineMode;
    };
    Document.prototype.isNewLine = function (text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };
    Document.prototype.getLine = function (row) {
        return this.$lines[row] || "";
    };
    Document.prototype.getLines = function (firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };
    Document.prototype.getAllLines = function () {
        return this.getLines(0, this.getLength());
    };
    Document.prototype.getLength = function () {
        return this.$lines.length;
    };
    Document.prototype.getTextRange = function (range) {
        if (range.start.row == range.end.row) {
            return this.getLine(range.start.row).substring(range.start.column, range.end.column);
        }
        var lines = this.getLines(range.start.row, range.end.row);
        lines[0] = (lines[0] || "").substring(range.start.column);
        var l = lines.length - 1;
        if (range.end.row - range.start.row == l) {
            lines[l] = lines[l].substring(0, range.end.column);
        }
        return lines.join(this.getNewLineCharacter());
    };
    Document.prototype.insert = function (position, text) {
        if (!text || text.length === 0)
            return position;

        position = $clipPosition(this, position);
        if (this.getLength() <= 1) {
            this.$detectNewLine(text);
        }

        var lines = $split(text);
        var firstLine = lines.splice(0, 1)[0];
        var lastLine = lines.length == 0 ? null : lines.splice(lines.length - 1, 1)[0];

        position = this.insertInLine(position, firstLine);
        if (lastLine !== null) {
            position = this.insertNewLine(position); // terminate first line
            position = this._insertLines(position.row, lines);
            position = this.insertInLine(position, lastLine || "");
        }
        return position;
    };
    Document.prototype.insertLines = function (row, lines) {
        if (row >= this.getLength())
            return this.insert({ row: row, column: 0 }, "\n" + lines.join("\n"));
        return this._insertLines(Math.max(row, 0), lines);
    };

    Document.prototype._insertLines = function (row, lines) {
        if (lines.length == 0)
            return { row: row, column: 0 };

        while (lines.length > 0xF000) {
            var end = this._insertLines(row, lines.slice(0, 0xF000));
            lines = lines.slice(0xF000);
            row = end.row;
        }

        var args = [row, 0];
        args.push.apply(args, lines);
        this.$lines.splice.apply(this.$lines, args);

        var range = new Range(row, 0, row + lines.length, 0);
        var delta = {
            action: "insertLines",
            range: range,
            lines: lines
        };
        this._signal("change", { data: delta });
        return range.end;
    };
    Document.prototype.insertNewLine = function (position) {
        position = $clipPosition(this, position);
        var line = this.$lines[position.row] || "";

        this.$lines[position.row] = line.substring(0, position.column);
        this.$lines.splice(position.row + 1, 0, line.substring(position.column, line.length));

        var end = {
            row: position.row + 1,
            column: 0
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: this.getNewLineCharacter()
        };
        this._signal("change", { data: delta });

        return end;
    };
    Document.prototype.insertInLine = function (position, text) {
        if (text.length == 0)
            return position;

        var line = this.$lines[position.row] || "";

        this.$lines[position.row] = line.substring(0, position.column) + text + line.substring(position.column);

        var end = {
            row: position.row,
            column: position.column + text.length
        };

        var delta = { action: "insertText", range: Range.fromPoints(position, end), text: text };
        this._signal("change", { data: delta });

        return end;
    };
    Document.prototype.remove = function (range) {
        if (!(range instanceof Range))
            range = Range.fromPoints(range.start, range.end);
        range.start = $clipPosition(this, range.start);
        range.end = $clipPosition(this, range.end);

        if (range.isEmpty())
            return range.start;

        var firstRow = range.start.row;
        var lastRow = range.end.row;

        if (range.isMultiLine()) {
            var firstFullRow = range.start.column == 0 ? firstRow : firstRow + 1;
            var lastFullRow = lastRow - 1;

            if (range.end.column > 0)
                this.removeInLine(lastRow, 0, range.end.column);

            if (lastFullRow >= firstFullRow)
                this._removeLines(firstFullRow, lastFullRow);

            if (firstFullRow != firstRow) {
                this.removeInLine(firstRow, range.start.column, this.getLine(firstRow).length);
                this.removeNewLine(range.start.row);
            }
        } else {
            this.removeInLine(firstRow, range.start.column, range.end.column);
        }
        return range.start;
    };
    Document.prototype.removeInLine = function (row, startColumn, endColumn) {
        if (startColumn == endColumn)
            return;

        var range = new Range(row, startColumn, row, endColumn);
        var line = this.getLine(row);
        var removed = line.substring(startColumn, endColumn);
        var newLine = line.substring(0, startColumn) + line.substring(endColumn, line.length);
        this.$lines.splice(row, 1, newLine);

        var delta = {
            action: "removeText",
            range: range,
            text: removed
        };
        this._signal("change", { data: delta });
        return range.start;
    };
    Document.prototype.removeLines = function (firstRow, lastRow) {
        if (firstRow < 0 || lastRow >= this.getLength())
            return this.remove(new Range(firstRow, 0, lastRow + 1, 0));
        return this._removeLines(firstRow, lastRow);
    };

    Document.prototype._removeLines = function (firstRow, lastRow) {
        var range = new Range(firstRow, 0, lastRow + 1, 0);
        var removed = this.$lines.splice(firstRow, lastRow - firstRow + 1);

        var delta = {
            action: "removeLines",
            range: range,
            nl: this.getNewLineCharacter(),
            lines: removed
        };
        this._signal("change", { data: delta });
        return removed;
    };
    Document.prototype.removeNewLine = function (row) {
        var firstLine = this.getLine(row);
        var secondLine = this.getLine(row + 1);

        var range = new Range(row, firstLine.length, row + 1, 0);
        var line = firstLine + secondLine;

        this.$lines.splice(row, 2, line);

        var delta = {
            action: "removeText",
            range: range,
            text: this.getNewLineCharacter()
        };
        this._signal("change", { data: delta });
    };
    Document.prototype.replace = function (range, text) {
        if (!(range instanceof Range)) {
            range = Range.fromPoints(range.start, range.end);
        }
        if (text.length == 0 && range.isEmpty())
            return range.start;
        if (text == this.getTextRange(range))
            return range.end;

        this.remove(range);
        if (text) {
            var end = this.insert(range.start, text);
        } else {
            end = range.start;
        }

        return end;
    };
    Document.prototype.applyDeltas = function (deltas) {
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.insertLines(range.start.row, delta.lines);
            else if (delta.action == "insertText")
                this.insert(range.start, delta.text);
            else if (delta.action == "removeLines")
                this._removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "removeText")
                this.remove(range);
        }
    };
    Document.prototype.revertDeltas = function (deltas) {
        for (var i = deltas.length - 1; i >= 0; i--) {
            var delta = deltas[i];

            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this._removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "insertText")
                this.remove(range);
            else if (delta.action == "removeLines")
                this._insertLines(range.start.row, delta.lines);
            else if (delta.action == "removeText")
                this.insert(range.start, delta.text);
        }
    };
    Document.prototype.indexToPosition = function (index, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        for (var i = startRow || 0, l = lines.length; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return { row: i, column: index + lines[i].length + newlineLength };
        }
        return { row: l - 1, column: lines[l - 1].length };
    };
    Document.prototype.positionToIndex = function (pos, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        var index = 0;
        var row = Math.min(pos.row, lines.length);
        for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;

        return index + pos.column;
    };
    return Document;
})(eve.EventEmitterClass);
exports.Document = Document;
});

ace.define("ace/lib/lang",["require","exports","module"], function(require, exports, module) {
"no use strict";
function last(a) {
    return a[a.length - 1];
}
exports.last = last;

function stringReverse(s) {
    return s.split("").reverse().join("");
}
exports.stringReverse = stringReverse;

function stringRepeat(s, count) {
    var result = '';
    while (count > 0) {
        if (count & 1) {
            result += s;
        }

        if (count >>= 1) {
            s += s;
        }
    }
    return result;
}
exports.stringRepeat = stringRepeat;

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

function stringTrimLeft(s) {
    return s.replace(trimBeginRegexp, '');
}
exports.stringTrimLeft = stringTrimLeft;
;

function stringTrimRight(s) {
    return s.replace(trimEndRegexp, '');
}
exports.stringTrimRight = stringTrimRight;

function copyObject(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
}
exports.copyObject = copyObject;

function copyArray(array) {
    var copy = [];
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject(array[i]);
        else
            copy[i] = array[i];
    }
    return copy;
}
exports.copyArray = copyArray;

function deepCopy(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    var cons = obj.constructor;
    if (cons === RegExp)
        return obj;

    var copy = cons();
    for (var key in obj) {
        if (typeof obj[key] === "object") {
            copy[key] = exports.deepCopy(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
}
exports.deepCopy = deepCopy;

function arrayToMap(arr) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;
}
exports.arrayToMap = arrayToMap;

function createMap(props) {
    var map = Object.create(null);
    for (var i in props) {
        map[i] = props[i];
    }
    return map;
}
exports.createMap = createMap;
function arrayRemove(array, value) {
    for (var i = 0; i <= array.length; i++) {
        if (value === array[i]) {
            array.splice(i, 1);
        }
    }
}
exports.arrayRemove = arrayRemove;

function escapeRegExp(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}
exports.escapeRegExp = escapeRegExp;

function escapeHTML(str) {
    return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
}
exports.escapeHTML = escapeHTML;
;
function getMatchOffsets(s, searchValue) {
    var matches = [];

    s.replace(searchValue, function (str) {
        matches.push({
            offset: arguments[arguments.length - 2],
            length: str.length
        });
        return "lang.getMatchOffsets";
    });

    return matches;
}
exports.getMatchOffsets = getMatchOffsets;
;
function deferredCall(fcn) {
    var timer = null;
    var callback = function () {
        timer = null;
        fcn();
    };

    var deferred = function (timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function () {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function () {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };

    deferred.isPending = function () {
        return timer;
    };

    return deferred;
}
exports.deferredCall = deferredCall;
;

function delayedCall(fcn, defaultTimeout) {
    var timer = null;

    var callback = function () {
        timer = null;
        fcn();
    };

    var _self = function (timeout) {
        if (timer == null)
            timer = setTimeout(callback, timeout || defaultTimeout);
    };

    _self.delay = function (timeout) {
        timer && clearTimeout(timer);
        timer = setTimeout(callback, timeout || defaultTimeout);
    };
    _self.schedule = _self;

    _self.call = function () {
        this.cancel();
        fcn();
    };

    _self.cancel = function () {
        timer && clearTimeout(timer);
        timer = null;
    };

    _self.isPending = function () {
        return timer;
    };

    return _self;
}
exports.delayedCall = delayedCall;
;
});

ace.define("ace/worker/mirror",["require","exports","module","ace/document","ace/lib/lang"], function(require, exports, module) {
"no use strict";
var dcm = require("../document");
var lang = require("../lib/lang");

var Mirror = (function () {
    function Mirror(sender, timeout) {
        this.sender = sender;
        this.$timeout = timeout;

        var doc = this.doc = new dcm.Document("");

        var deferredUpdate = this.deferredUpdate = lang.delayedCall(this.onUpdate.bind(this));
        var _self = this;

        sender.on('change', function (e) {
            doc.applyDeltas(e.data);

            if (_self.$timeout) {
                return deferredUpdate.schedule(_self.$timeout);
            } else {
                _self.onUpdate();
            }
        });
    }
    Mirror.prototype.setTimeout = function (timeout) {
        this.$timeout = timeout;
    };

    Mirror.prototype.setValue = function (value) {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(this.$timeout);
    };

    Mirror.prototype.getValue = function (callbackId) {
        this.sender.callback(this.doc.getValue(), callbackId);
    };
    Mirror.prototype.onUpdate = function () {
    };

    Mirror.prototype.isPending = function () {
        return this.deferredUpdate.isPending();
    };
    return Mirror;
})();
exports.Mirror = Mirror;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/mode/typescript_worker",["require","exports","module","ace/lib/oop","ace/worker/mirror"], function(require, exports, module) {
"no use strict";
var oop = require('../lib/oop');
var mir = require('../worker/mirror');
var TypeScriptWorker = (function (_super) {
    __extends(TypeScriptWorker, _super);
    function TypeScriptWorker(sender) {
        _super.call(this, sender, 500);

        this.setOptions();

        sender.emit('initAfter');
    }
    TypeScriptWorker.prototype.setOptions = function (options) {
        this.options = options || {};
    };

    TypeScriptWorker.prototype.changeOptions = function (newOptions) {
        oop.mixin(this.options, newOptions);
        this.deferredUpdate.schedule(100);
    };

    TypeScriptWorker.prototype.onUpdate = function () {
        this.sender.emit("compiled");
    };
    return TypeScriptWorker;
})(mir.Mirror);
exports.TypeScriptWorker = TypeScriptWorker;
});

ace.define("ace/lib/es5-shim",["require","exports","module"], function(require, exports, module) {

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        var target = this;
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        var args = slice.call(arguments, 1); // for normal call
        var bound = function () {

            if (this instanceof bound) {

                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        if(target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }
        return bound;
    };
}
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}
if ([1,2].splice(0).length != 2) {
    if(function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = new Array(l+2);
            a[0] = a[1] = 0;
            return a;
        }
        var array = [], lengthBefore;
        
        array.splice.apply(array, makeArray(20));
        array.splice.apply(array, makeArray(26));

        lengthBefore = array.length; //46
        array.splice(5, 0, "XXX"); // add one element

        lengthBefore + 1 == array.length

        if (lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
    }()) {//IE 6/7
        var array_splice = Array.prototype.splice;
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(slice.call(arguments, 2)))
            }
        };
    } else {//IE8
        Array.prototype.splice = function(pos, removeCount){
            var length = this.length;
            if (pos > 0) {
                if (pos > length)
                    pos = length;
            } else if (pos == void 0) {
                pos = 0;
            } else if (pos < 0) {
                pos = Math.max(length + pos, 0);
            }

            if (!(pos+removeCount < length))
                removeCount = length - pos;

            var removed = this.slice(pos, pos+removeCount);
            var insert = slice.call(arguments, 2);
            var add = insert.length;            
            if (pos === length) {
                if (add) {
                    this.push.apply(this, insert);
                }
            } else {
                var remove = Math.min(removeCount, length - pos);
                var tailOldPos = pos + remove;
                var tailNewPos = tailOldPos + add - remove;
                var tailCount = length - tailOldPos;
                var lengthAfterRemove = length - remove;

                if (tailNewPos < tailOldPos) { // case A
                    for (var i = 0; i < tailCount; ++i) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } else if (tailNewPos > tailOldPos) { // case B
                    for (i = tailCount; i--; ) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } // else, add == remove (nothing to do)

                if (add && pos === lengthAfterRemove) {
                    this.length = lengthAfterRemove; // truncate array
                    this.push.apply(this, insert);
                } else {
                    this.length = lengthAfterRemove + add; // reserves space
                    for (i = 0; i < add; ++i) {
                        this[pos+i] = insert[i];
                    }
                }
            }
            return removed;
        };
    }
}
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}
if (!Object.getPrototypeOf) {
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;
        descriptor =  { enumerable: true, configurable: true };
        if (supportsAccessors) {
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;
                return descriptor;
            }
        }
        descriptor.value = object[property];
        return descriptor;
    };
}
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}
if (!Object.create) {
    var createEmpty;
    if (Object.prototype.__proto__ === null) {
        createEmpty = function () {
            return { "__proto__": null };
        };
    } else {
        createEmpty = function () {
            var empty = {};
            for (var i in empty)
                empty[i] = null;
            empty.constructor =
            empty.hasOwnProperty =
            empty.propertyIsEnumerable =
            empty.isPrototypeOf =
            empty.toLocaleString =
            empty.toString =
            empty.valueOf =
            empty.__proto__ = null;
            return empty;
        }
    }

    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
    }
}
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
            }
        }
        if (owns(descriptor, "value")) {

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                delete object[property];
                object[property] = descriptor.value;
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}
if (!Object.seal) {
    Object.seal = function seal(object) {
        return object;
    };
}
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        return object;
    };
}
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        return object;
    };
}
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}
if (!Object.keys) {
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});