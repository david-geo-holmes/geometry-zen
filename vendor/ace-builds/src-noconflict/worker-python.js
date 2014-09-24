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
    function Mirror(sender) {
        this.sender = sender;
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

ace.define("ace/mode/python/asserts",["require","exports","module"], function(require, exports, module) {
"no use strict";
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
exports.assert = assert;

function fail(message) {
    exports.assert(false, message);
}
exports.fail = fail;
});

ace.define("ace/mode/python/base",["require","exports","module"], function(require, exports, module) {
"no use strict";
function isNumber(val) {
    return typeof val === 'number';
}
exports.isNumber = isNumber;
function isString(val) {
    return typeof val === 'string';
}
exports.isString = isString;
function isDef(val) {
    return val !== undefined;
}
exports.isDef = isDef;
});

ace.define("ace/mode/python/IndentationError",["require","exports","module"], function(require, exports, module) {
"no use strict";
var IndentationError = (function () {
    function IndentationError(message, fileName, begin, end, text) {
    }
    return IndentationError;
})();

    return IndentationError;
});

ace.define("ace/mode/python/TokenError",["require","exports","module","ace/mode/python/asserts","ace/mode/python/base"], function(require, exports, module) {
"no use strict";
var asserts = require('./asserts');
var base = require('./base');

var TokenError = (function () {
    function TokenError(message, fileName, lineNumber, columnNumber) {
        this.name = 'TokenError';
        asserts.assert(base.isString(message), "message must be a string");
        asserts.assert(base.isString(fileName), "fileName must be a string");
        asserts.assert(base.isNumber(lineNumber), "lineNumber must be a number");
        asserts.assert(base.isNumber(columnNumber), "columnNumber must be a number");

        this.message = message;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
    }
    return TokenError;
})();

    return TokenError;
});

ace.define("ace/mode/python/Tokenizer",["require","exports","module","ace/mode/python/asserts","ace/mode/python/base","ace/mode/python/IndentationError","ace/mode/python/TokenError"], function(require, exports, module) {
"no use strict";
var asserts = require('./asserts');
var base = require('./base');
var IndentationError = require('./IndentationError');
var TokenError = require('./TokenError');
function group() {
    var x = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        x[_i] = arguments[_i + 0];
    }
    var args = Array.prototype.slice.call(arguments);
    return '(' + args.join('|') + ')';
}
function any(x) {
    return group.apply(null, arguments) + "*";
}
function maybe(x) {
    return group.apply(null, arguments) + "?";
}
var Whitespace = "[ \\f\\t]*";
var Comment_ = "#[^\\r\\n]*";
var Ident = "[a-zA-Z_]\\w*";

var Binnumber = '0[bB][01]*';
var Hexnumber = '0[xX][\\da-fA-F]*[lL]?';
var Octnumber = '0[oO]?[0-7]*[lL]?';
var Decnumber = '[1-9]\\d*[lL]?';
var Intnumber = group(Binnumber, Hexnumber, Octnumber, Decnumber);

var Exponent = "[eE][-+]?\\d+";
var Pointfloat = group("\\d+\\.\\d*", "\\.\\d+") + maybe(Exponent);
var Expfloat = '\\d+' + Exponent;
var Floatnumber = group(Pointfloat, Expfloat);
var Imagnumber = group("\\d+[jJ]", Floatnumber + "[jJ]");
var Number_ = group(Imagnumber, Floatnumber, Intnumber);
var Single = "^[^'\\\\]*(?:\\\\.[^'\\\\]*)*'";
var Double_ = '^[^"\\\\]*(?:\\\\.[^"\\\\]*)*"';
var Single3 = "[^'\\\\]*(?:(?:\\\\.|'(?!''))[^'\\\\]*)*'''";
var Double3 = '[^"\\\\]*(?:(?:\\\\.|"(?!""))[^"\\\\]*)*"""';
var Triple = group("[ubUB]?[rR]?'''", '[ubUB]?[rR]?"""');
var String_ = group("[uU]?[rR]?'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*'", '[uU]?[rR]?"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*"');
var Operator = group("\\*\\*=?", ">>=?", "<<=?", "<>", "!=", "//=?", "->", "[+\\-*/%&|^=<>]=?", "~");

var Bracket = '[\\][(){}]';
var Special = group('\\r?\\n', '[:;.,`@]');
var Funny = group(Operator, Bracket, Special);

var ContStr = group("[uUbB]?[rR]?'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*" + group("'", '\\\\\\r?\\n'), '[uUbB]?[rR]?"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*' + group('"', '\\\\\\r?\\n'));
var PseudoExtras = group('\\\\\\r?\\n', Comment_, Triple);
var PseudoToken = "^" + group(PseudoExtras, Number_, Funny, ContStr, Ident);

var pseudoprog;
var single3prog;
var double3prog;
var endprogs = {};

var triple_quoted = {
    "'''": true, '"""': true,
    "r'''": true, 'r"""': true, "R'''": true, 'R"""': true,
    "u'''": true, 'u"""': true, "U'''": true, 'U"""': true,
    "b'''": true, 'b"""': true, "B'''": true, 'B"""': true,
    "ur'''": true, 'ur"""': true, "Ur'''": true, 'Ur"""': true,
    "uR'''": true, 'uR"""': true, "UR'''": true, 'UR"""': true,
    "br'''": true, 'br"""': true, "Br'''": true, 'Br"""': true,
    "bR'''": true, 'bR"""': true, "BR'''": true, 'BR"""': true
};

var single_quoted = {
    "'": true, '"': true,
    "r'": true, 'r"': true, "R'": true, 'R"': true,
    "u'": true, 'u"': true, "U'": true, 'U"': true,
    "b'": true, 'b"': true, "B'": true, 'B"': true,
    "ur'": true, 'ur"': true, "Ur'": true, 'Ur"': true,
    "uR'": true, 'uR"': true, "UR'": true, 'UR"': true,
    "br'": true, 'br"': true, "Br'": true, 'Br"': true,
    "bR'": true, 'bR"': true, "BR'": true, 'BR"': true
};
(function () {
    for (var k in triple_quoted) {
    }
    for (var k in single_quoted) {
    }
}());

var tabsize = 8;

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function rstrip(input, what) {
    for (var i = input.length; i > 0; --i) {
        if (what.indexOf(input.charAt(i - 1)) === -1)
            break;
    }
    return input.substring(0, i);
}
var Tokenizer = (function () {
    function Tokenizer(fileName, interactive, callback) {
        this.lnum = 0;
        this.parenlev = 0;
        this.continued = false;
        this.namechars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
        this.numchars = '0123456789';
        this.contstr = '';
        this.needcont = false;
        this.contline = undefined;
        this.indents = [0];
        this.endprog = /.*/;
        this.strstart = [-1, -1];
        asserts.assert(base.isString(fileName), "fileName must be a string");

        this.fileName = fileName;
        this.interactive = interactive;
        this.callback = callback;

        this.doneFunc = function () {
            for (var i = 1; i < this.indents.length; ++i) {
                if (this.callback(Tokenizer.Tokens.T_DEDENT, '', [this.lnum, 0], [this.lnum, 0], ''))
                    return 'done';
            }
            if (this.callback(Tokenizer.Tokens.T_ENDMARKER, '', [this.lnum, 0], [this.lnum, 0], ''))
                return 'done';

            return 'failed';
        };
    }
    Tokenizer.prototype.generateTokens = function (line) {
        var endmatch;
        var pos;
        var column;
        var end;
        var max;
        var pseudoprog = new RegExp(PseudoToken);
        var single3prog = new RegExp(Single3, "g");
        var double3prog = new RegExp(Double3, "g");

        var endprogs = {
            "'": new RegExp(Single, "g"), '"': new RegExp(Double_, "g"),
            "'''": single3prog, '"""': double3prog,
            "r'''": single3prog, 'r"""': double3prog,
            "u'''": single3prog, 'u"""': double3prog,
            "b'''": single3prog, 'b"""': double3prog,
            "ur'''": single3prog, 'ur"""': double3prog,
            "br'''": single3prog, 'br"""': double3prog,
            "R'''": single3prog, 'R"""': double3prog,
            "U'''": single3prog, 'U"""': double3prog,
            "B'''": single3prog, 'B"""': double3prog,
            "uR'''": single3prog, 'uR"""': double3prog,
            "Ur'''": single3prog, 'Ur"""': double3prog,
            "UR'''": single3prog, 'UR"""': double3prog,
            "bR'''": single3prog, 'bR"""': double3prog,
            "Br'''": single3prog, 'Br"""': double3prog,
            "BR'''": single3prog, 'BR"""': double3prog,
            'r': null, 'R': null,
            'u': null, 'U': null,
            'b': null, 'B': null
        };

        if (!line)
            line = '';

        this.lnum += 1;
        pos = 0;
        max = line.length;

        if (this.contstr.length > 0) {
            if (!line) {
                throw new TokenError("EOF in multi-line string", this.fileName, this.strstart[0], this.strstart[1]);
            }
            this.endprog.lastIndex = 0;
            endmatch = this.endprog.test(line);
            if (endmatch) {
                pos = end = this.endprog.lastIndex;
                if (this.callback(Tokenizer.Tokens.T_STRING, this.contstr + line.substring(0, end), this.strstart, [this.lnum, end], this.contline + line)) {
                    return 'done';
                }
                this.contstr = '';
                this.needcont = false;
                this.contline = undefined;
            } else if (this.needcont && line.substring(line.length - 2) !== "\\\n" && line.substring(line.length - 3) !== "\\\r\n") {
                if (this.callback(Tokenizer.Tokens.T_ERRORTOKEN, this.contstr + line, this.strstart, [this.lnum, line.length], this.contline)) {
                    return 'done';
                }
                this.contstr = '';
                this.contline = undefined;
                return false;
            } else {
                this.contstr += line;
                this.contline = this.contline + line;
                return false;
            }
        } else if (this.parenlev === 0 && !this.continued) {
            if (!line)
                return this.doneFunc();
            column = 0;
            while (pos < max) {
                if (line.charAt(pos) === ' ')
                    column += 1;
                else if (line.charAt(pos) === '\t')
                    column = (column / tabsize + 1) * tabsize;
                else if (line.charAt(pos) === '\f')
                    column = 0;
                else
                    break;
                pos = pos + 1;
            }
            if (pos === max)
                return this.doneFunc();

            if ("#\r\n".indexOf(line.charAt(pos)) !== -1) {
                if (line.charAt(pos) === '#') {
                    var comment_token = rstrip(line.substring(pos), '\r\n');
                    var nl_pos = pos + comment_token.length;
                    if (this.callback(Tokenizer.Tokens.T_COMMENT, comment_token, [this.lnum, pos], [this.lnum, pos + comment_token.length], line))
                        return 'done';
                    if (this.callback(Tokenizer.Tokens.T_NL, line.substring(nl_pos), [this.lnum, nl_pos], [this.lnum, line.length], line))
                        return 'done';
                    return false;
                } else {
                    if (this.callback(Tokenizer.Tokens.T_NL, line.substring(pos), [this.lnum, pos], [this.lnum, line.length], line))
                        return 'done';
                    if (!this.interactive)
                        return false;
                }
            }

            if (column > this.indents[this.indents.length - 1]) {
                this.indents.push(column);
                if (this.callback(Tokenizer.Tokens.T_INDENT, line.substring(0, pos), [this.lnum, 0], [this.lnum, pos], line))
                    return 'done';
            }
            while (column < this.indents[this.indents.length - 1]) {
                if (!contains(this.indents, column)) {
                    throw new IndentationError("unindent does not match any outer indentation level", this.fileName, [this.lnum, 0], [this.lnum, pos], line);
                }
                this.indents.splice(this.indents.length - 1, 1);
                if (this.callback(Tokenizer.Tokens.T_DEDENT, '', [this.lnum, pos], [this.lnum, pos], line)) {
                    return 'done';
                }
            }
        } else {
            if (!line) {
                throw new TokenError("EOF in multi-line statement", this.fileName, this.lnum, 0);
            }
            this.continued = false;
        }

        while (pos < max) {
            var capos = line.charAt(pos);
            while (capos === ' ' || capos === '\f' || capos === '\t') {
                pos += 1;
                capos = line.charAt(pos);
            }
            pseudoprog.lastIndex = 0;
            var pseudomatch = pseudoprog.exec(line.substring(pos));
            if (pseudomatch) {
                var start = pos;
                end = start + pseudomatch[1].length;
                var spos = [this.lnum, start];
                var epos = [this.lnum, end];
                pos = end;
                var token = line.substring(start, end);
                var initial = line.charAt(start);
                if (this.numchars.indexOf(initial) !== -1 || (initial === '.' && token !== '.')) {
                    if (this.callback(Tokenizer.Tokens.T_NUMBER, token, spos, epos, line))
                        return 'done';
                } else if (initial === '\r' || initial === '\n') {
                    var newl = Tokenizer.Tokens.T_NEWLINE;
                    if (this.parenlev > 0)
                        newl = Tokenizer.Tokens.T_NL;
                    if (this.callback(newl, token, spos, epos, line))
                        return 'done';
                } else if (initial === '#') {
                    if (this.callback(Tokenizer.Tokens.T_COMMENT, token, spos, epos, line))
                        return 'done';
                } else if (triple_quoted.hasOwnProperty(token)) {
                    this.endprog = endprogs[token];
                    this.endprog.lastIndex = 0;
                    endmatch = this.endprog.test(line.substring(pos));
                    if (endmatch) {
                        pos = this.endprog.lastIndex + pos;
                        token = line.substring(start, pos);
                        if (this.callback(Tokenizer.Tokens.T_STRING, token, spos, [this.lnum, pos], line))
                            return 'done';
                    } else {
                        this.strstart = [this.lnum, start];
                        this.contstr = line.substring(start);
                        this.contline = line;
                        return false;
                    }
                } else if (single_quoted.hasOwnProperty(initial) || single_quoted.hasOwnProperty(token.substring(0, 2)) || single_quoted.hasOwnProperty(token.substring(0, 3))) {
                    if (token[token.length - 1] === '\n') {
                        this.strstart = [this.lnum, start];
                        this.endprog = endprogs[initial] || endprogs[token[1]] || endprogs[token[2]];
                        this.contstr = line.substring(start);
                        this.needcont = true;
                        this.contline = line;
                        return false;
                    } else {
                        if (this.callback(Tokenizer.Tokens.T_STRING, token, spos, epos, line))
                            return 'done';
                    }
                } else if (this.namechars.indexOf(initial) !== -1) {
                    if (this.callback(Tokenizer.Tokens.T_NAME, token, spos, epos, line))
                        return 'done';
                } else if (initial === '\\') {
                    if (this.callback(Tokenizer.Tokens.T_NL, token, spos, [this.lnum, pos], line))
                        return 'done';
                    this.continued = true;
                } else {
                    if ('([{'.indexOf(initial) !== -1)
                        this.parenlev += 1;
                    else if (')]}'.indexOf(initial) !== -1)
                        this.parenlev -= 1;
                    if (this.callback(Tokenizer.Tokens.T_OP, token, spos, epos, line))
                        return 'done';
                }
            } else {
                if (this.callback(Tokenizer.Tokens.T_ERRORTOKEN, line.charAt(pos), [this.lnum, pos], [this.lnum, pos + 1], line)) {
                    return 'done';
                }
                pos += 1;
            }
        }

        return false;
    };
    Tokenizer.Tokens = {
        T_ENDMARKER: 0,
        T_NAME: 1,
        T_NUMBER: 2,
        T_STRING: 3,
        T_NEWLINE: 4,
        T_INDENT: 5,
        T_DEDENT: 6,
        T_LPAR: 7,
        T_RPAR: 8,
        T_LSQB: 9,
        T_RSQB: 10,
        T_COLON: 11,
        T_COMMA: 12,
        T_SEMI: 13,
        T_PLUS: 14,
        T_MINUS: 15,
        T_STAR: 16,
        T_SLASH: 17,
        T_VBAR: 18,
        T_AMPER: 19,
        T_LESS: 20,
        T_GREATER: 21,
        T_EQUAL: 22,
        T_DOT: 23,
        T_PERCENT: 24,
        T_BACKQUOTE: 25,
        T_LBRACE: 26,
        T_RBRACE: 27,
        T_EQEQUAL: 28,
        T_NOTEQUAL: 29,
        T_LESSEQUAL: 30,
        T_GREATEREQUAL: 31,
        T_TILDE: 32,
        T_CIRCUMFLEX: 33,
        T_LEFTSHIFT: 34,
        T_RIGHTSHIFT: 35,
        T_DOUBLESTAR: 36,
        T_PLUSEQUAL: 37,
        T_MINEQUAL: 38,
        T_STAREQUAL: 39,
        T_SLASHEQUAL: 40,
        T_PERCENTEQUAL: 41,
        T_AMPEREQUAL: 42,
        T_VBAREQUAL: 43,
        T_CIRCUMFLEXEQUAL: 44,
        T_LEFTSHIFTEQUAL: 45,
        T_RIGHTSHIFTEQUAL: 46,
        T_DOUBLESTAREQUAL: 47,
        T_DOUBLESLASH: 48,
        T_DOUBLESLASHEQUAL: 49,
        T_AT: 50,
        T_OP: 51,
        T_COMMENT: 52,
        T_NL: 53,
        T_RARROW: 54,
        T_ERRORTOKEN: 55,
        T_N_TOKENS: 56,
        T_NT_OFFSET: 256
    };

    Tokenizer.tokenNames = {
        0: 'T_ENDMARKER', 1: 'T_NAME', 2: 'T_NUMBER', 3: 'T_STRING', 4: 'T_NEWLINE',
        5: 'T_INDENT', 6: 'T_DEDENT', 7: 'T_LPAR', 8: 'T_RPAR', 9: 'T_LSQB',
        10: 'T_RSQB', 11: 'T_COLON', 12: 'T_COMMA', 13: 'T_SEMI', 14: 'T_PLUS',
        15: 'T_MINUS', 16: 'T_STAR', 17: 'T_SLASH', 18: 'T_VBAR', 19: 'T_AMPER',
        20: 'T_LESS', 21: 'T_GREATER', 22: 'T_EQUAL', 23: 'T_DOT', 24: 'T_PERCENT',
        25: 'T_BACKQUOTE', 26: 'T_LBRACE', 27: 'T_RBRACE', 28: 'T_EQEQUAL', 29: 'T_NOTEQUAL',
        30: 'T_LESSEQUAL', 31: 'T_GREATEREQUAL', 32: 'T_TILDE', 33: 'T_CIRCUMFLEX', 34: 'T_LEFTSHIFT',
        35: 'T_RIGHTSHIFT', 36: 'T_DOUBLESTAR', 37: 'T_PLUSEQUAL', 38: 'T_MINEQUAL', 39: 'T_STAREQUAL',
        40: 'T_SLASHEQUAL', 41: 'T_PERCENTEQUAL', 42: 'T_AMPEREQUAL', 43: 'T_VBAREQUAL', 44: 'T_CIRCUMFLEXEQUAL',
        45: 'T_LEFTSHIFTEQUAL', 46: 'T_RIGHTSHIFTEQUAL', 47: 'T_DOUBLESTAREQUAL', 48: 'T_DOUBLESLASH', 49: 'T_DOUBLESLASHEQUAL',
        50: 'T_AT', 51: 'T_OP', 52: 'T_COMMENT', 53: 'T_NL', 54: 'T_RARROW',
        55: 'T_ERRORTOKEN', 56: 'T_N_TOKENS',
        256: 'T_NT_OFFSET'
    };
    return Tokenizer;
})();

    return Tokenizer;
});

ace.define("ace/mode/python/tables",["require","exports","module","ace/mode/python/Tokenizer"], function(require, exports, module) {
"no use strict";
var Tokenizer = require('./Tokenizer');

exports.OpMap = {
    "(": Tokenizer.Tokens.T_LPAR,
    ")": Tokenizer.Tokens.T_RPAR,
    "[": Tokenizer.Tokens.T_LSQB,
    "]": Tokenizer.Tokens.T_RSQB,
    ":": Tokenizer.Tokens.T_COLON,
    ",": Tokenizer.Tokens.T_COMMA,
    ";": Tokenizer.Tokens.T_SEMI,
    "+": Tokenizer.Tokens.T_PLUS,
    "-": Tokenizer.Tokens.T_MINUS,
    "*": Tokenizer.Tokens.T_STAR,
    "/": Tokenizer.Tokens.T_SLASH,
    "|": Tokenizer.Tokens.T_VBAR,
    "&": Tokenizer.Tokens.T_AMPER,
    "<": Tokenizer.Tokens.T_LESS,
    ">": Tokenizer.Tokens.T_GREATER,
    "=": Tokenizer.Tokens.T_EQUAL,
    ".": Tokenizer.Tokens.T_DOT,
    "%": Tokenizer.Tokens.T_PERCENT,
    "`": Tokenizer.Tokens.T_BACKQUOTE,
    "{": Tokenizer.Tokens.T_LBRACE,
    "}": Tokenizer.Tokens.T_RBRACE,
    "@": Tokenizer.Tokens.T_AT,
    "==": Tokenizer.Tokens.T_EQEQUAL,
    "!=": Tokenizer.Tokens.T_NOTEQUAL,
    "<>": Tokenizer.Tokens.T_NOTEQUAL,
    "<=": Tokenizer.Tokens.T_LESSEQUAL,
    ">=": Tokenizer.Tokens.T_GREATEREQUAL,
    "~": Tokenizer.Tokens.T_TILDE,
    "^": Tokenizer.Tokens.T_CIRCUMFLEX,
    "<<": Tokenizer.Tokens.T_LEFTSHIFT,
    ">>": Tokenizer.Tokens.T_RIGHTSHIFT,
    "**": Tokenizer.Tokens.T_DOUBLESTAR,
    "+=": Tokenizer.Tokens.T_PLUSEQUAL,
    "-=": Tokenizer.Tokens.T_MINEQUAL,
    "*=": Tokenizer.Tokens.T_STAREQUAL,
    "/=": Tokenizer.Tokens.T_SLASHEQUAL,
    "%=": Tokenizer.Tokens.T_PERCENTEQUAL,
    "&=": Tokenizer.Tokens.T_AMPEREQUAL,
    "|=": Tokenizer.Tokens.T_VBAREQUAL,
    "^=": Tokenizer.Tokens.T_CIRCUMFLEXEQUAL,
    "<<=": Tokenizer.Tokens.T_LEFTSHIFTEQUAL,
    ">>=": Tokenizer.Tokens.T_RIGHTSHIFTEQUAL,
    "**=": Tokenizer.Tokens.T_DOUBLESTAREQUAL,
    "//": Tokenizer.Tokens.T_DOUBLESLASH,
    "//=": Tokenizer.Tokens.T_DOUBLESLASHEQUAL,
    "->": Tokenizer.Tokens.T_RARROW
};

exports.ParseTables = {
    sym: {
        AndExpr: 257,
        ArithmeticExpr: 258,
        AtomExpr: 259,
        BitwiseAndExpr: 260,
        BitwiseOrExpr: 261,
        BitwiseXorExpr: 262,
        ComparisonExpr: 263,
        ExprList: 264,
        ExprStmt: 265,
        GeometricExpr: 266,
        GlobalStmt: 267,
        IfExpr: 268,
        LambdaExpr: 269,
        NonLocalStmt: 270,
        NotExpr: 271,
        OrExpr: 272,
        PowerExpr: 273,
        ShiftExpr: 274,
        UnaryExpr: 275,
        YieldExpr: 276,
        arglist: 277,
        argument: 278,
        assert_stmt: 279,
        augassign: 280,
        break_stmt: 281,
        classdef: 282,
        comp_op: 283,
        compound_stmt: 284,
        continue_stmt: 285,
        decorated: 286,
        decorator: 287,
        decorators: 288,
        del_stmt: 289,
        dictmaker: 290,
        dotted_as_name: 291,
        dotted_as_names: 292,
        dotted_name: 293,
        encoding_decl: 294,
        eval_input: 295,
        except_clause: 296,
        exec_stmt: 297,
        file_input: 298,
        flow_stmt: 299,
        for_stmt: 300,
        fpdef: 301,
        fplist: 302,
        funcdef: 303,
        gen_for: 304,
        gen_if: 305,
        gen_iter: 306,
        if_stmt: 307,
        import_as_name: 308,
        import_as_names: 309,
        import_from: 310,
        import_name: 311,
        import_stmt: 312,
        list_for: 313,
        list_if: 314,
        list_iter: 315,
        listmaker: 316,
        old_LambdaExpr: 317,
        old_test: 318,
        parameters: 319,
        pass_stmt: 320,
        print_stmt: 321,
        raise_stmt: 322,
        return_stmt: 323,
        simple_stmt: 324,
        single_input: 256,
        sliceop: 325,
        small_stmt: 326,
        stmt: 327,
        subscript: 328,
        subscriptlist: 329,
        suite: 330,
        testlist: 331,
        testlist1: 332,
        testlist_gexp: 333,
        testlist_safe: 334,
        trailer: 335,
        try_stmt: 336,
        varargslist: 337,
        while_stmt: 338,
        with_stmt: 339,
        with_var: 340,
        yield_stmt: 341 },
    number2symbol: {
        256: 'single_input',
        257: 'AndExpr',
        258: 'ArithmeticExpr',
        259: 'AtomExpr',
        260: 'BitwiseAndExpr',
        261: 'BitwiseOrExpr',
        262: 'BitwiseXorExpr',
        263: 'ComparisonExpr',
        264: 'ExprList',
        265: 'ExprStmt',
        266: 'GeometricExpr',
        267: 'GlobalStmt',
        268: 'IfExpr',
        269: 'LambdaExpr',
        270: 'NonLocalStmt',
        271: 'NotExpr',
        272: 'OrExpr',
        273: 'PowerExpr',
        274: 'ShiftExpr',
        275: 'UnaryExpr',
        276: 'YieldExpr',
        277: 'arglist',
        278: 'argument',
        279: 'assert_stmt',
        280: 'augassign',
        281: 'break_stmt',
        282: 'classdef',
        283: 'comp_op',
        284: 'compound_stmt',
        285: 'continue_stmt',
        286: 'decorated',
        287: 'decorator',
        288: 'decorators',
        289: 'del_stmt',
        290: 'dictmaker',
        291: 'dotted_as_name',
        292: 'dotted_as_names',
        293: 'dotted_name',
        294: 'encoding_decl',
        295: 'eval_input',
        296: 'except_clause',
        297: 'exec_stmt',
        298: 'file_input',
        299: 'flow_stmt',
        300: 'for_stmt',
        301: 'fpdef',
        302: 'fplist',
        303: 'funcdef',
        304: 'gen_for',
        305: 'gen_if',
        306: 'gen_iter',
        307: 'if_stmt',
        308: 'import_as_name',
        309: 'import_as_names',
        310: 'import_from',
        311: 'import_name',
        312: 'import_stmt',
        313: 'list_for',
        314: 'list_if',
        315: 'list_iter',
        316: 'listmaker',
        317: 'old_LambdaExpr',
        318: 'old_test',
        319: 'parameters',
        320: 'pass_stmt',
        321: 'print_stmt',
        322: 'raise_stmt',
        323: 'return_stmt',
        324: 'simple_stmt',
        325: 'sliceop',
        326: 'small_stmt',
        327: 'stmt',
        328: 'subscript',
        329: 'subscriptlist',
        330: 'suite',
        331: 'testlist',
        332: 'testlist1',
        333: 'testlist_gexp',
        334: 'testlist_safe',
        335: 'trailer',
        336: 'try_stmt',
        337: 'varargslist',
        338: 'while_stmt',
        339: 'with_stmt',
        340: 'with_var',
        341: 'yield_stmt' },
    dfas: {
        256: [
            [[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]],
            {
                2: 1,
                4: 1,
                5: 1,
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                10: 1,
                11: 1,
                12: 1,
                13: 1,
                14: 1,
                15: 1,
                16: 1,
                17: 1,
                18: 1,
                19: 1,
                20: 1,
                21: 1,
                22: 1,
                23: 1,
                24: 1,
                25: 1,
                26: 1,
                27: 1,
                28: 1,
                29: 1,
                30: 1,
                31: 1,
                32: 1,
                33: 1,
                34: 1,
                35: 1,
                36: 1,
                37: 1 }],
        257: [
            [[[38, 1]], [[39, 0], [0, 1]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        258: [
            [[[40, 1]], [[25, 0], [37, 0], [0, 1]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        259: [
            [
                [[18, 1], [8, 2], [32, 5], [29, 4], [9, 3], [14, 6], [21, 2]],
                [[18, 1], [0, 1]],
                [[0, 2]],
                [[41, 7], [42, 2]],
                [[43, 2], [44, 8], [45, 8]],
                [[46, 9], [47, 2]],
                [[48, 10]],
                [[42, 2]],
                [[43, 2]],
                [[47, 2]],
                [[14, 2]]],
            { 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 29: 1, 32: 1 }],
        260: [
            [[[49, 1]], [[50, 0], [0, 1]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        261: [
            [[[51, 1]], [[52, 0], [0, 1]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        262: [
            [[[53, 1]], [[54, 0], [0, 1]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        263: [
            [[[55, 1]], [[56, 0], [0, 1]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        264: [
            [[[55, 1]], [[57, 2], [0, 1]], [[55, 1], [0, 2]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        265: [
            [
                [[58, 1]],
                [[59, 2], [60, 3], [0, 1]],
                [[58, 4], [45, 4]],
                [[58, 5], [45, 5]],
                [[0, 4]],
                [[60, 3], [0, 5]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        266: [
            [[[61, 1]], [[62, 0], [63, 0], [64, 0], [65, 0], [0, 1]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        267: [[[[27, 1]], [[21, 2]], [[57, 1], [0, 2]]], { 27: 1 }],
        268: [
            [
                [[66, 1], [67, 2]],
                [[0, 1]],
                [[31, 3], [0, 2]],
                [[67, 4]],
                [[68, 5]],
                [[69, 1]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        269: [
            [[[11, 1]], [[70, 2], [71, 3]], [[69, 4]], [[70, 2]], [[0, 4]]],
            { 11: 1 }],
        270: [[[[13, 1]], [[21, 2]], [[57, 1], [0, 2]]], { 13: 1 }],
        271: [
            [[[7, 1], [72, 2]], [[38, 2]], [[0, 2]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        272: [
            [[[73, 1]], [[74, 0], [0, 1]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        273: [
            [[[75, 1]], [[76, 1], [77, 2], [0, 1]], [[49, 3]], [[0, 3]]],
            { 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 29: 1, 32: 1 }],
        274: [
            [[[78, 1]], [[79, 0], [80, 0], [0, 1]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        275: [
            [[[25, 1], [6, 1], [37, 1], [81, 2]], [[49, 2]], [[0, 2]]],
            { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
        276: [[[[26, 1]], [[58, 2], [0, 1]], [[0, 2]]], { 26: 1 }],
        277: [
            [
                [[63, 1], [82, 2], [77, 3]],
                [[69, 4]],
                [[57, 5], [0, 2]],
                [[69, 6]],
                [[57, 7], [0, 4]],
                [[63, 1], [82, 2], [77, 3], [0, 5]],
                [[0, 6]],
                [[82, 4], [77, 3]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1,
                63: 1,
                77: 1 }],
        278: [
            [[[69, 1]], [[83, 2], [60, 3], [0, 1]], [[0, 2]], [[69, 2]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        279: [
            [[[20, 1]], [[69, 2]], [[57, 3], [0, 2]], [[69, 4]], [[0, 4]]],
            { 20: 1 }],
        280: [
            [
                [
                    [84, 1],
                    [85, 1],
                    [86, 1],
                    [87, 1],
                    [88, 1],
                    [89, 1],
                    [90, 1],
                    [91, 1],
                    [92, 1],
                    [93, 1],
                    [94, 1],
                    [95, 1]],
                [[0, 1]]],
            {
                84: 1,
                85: 1,
                86: 1,
                87: 1,
                88: 1,
                89: 1,
                90: 1,
                91: 1,
                92: 1,
                93: 1,
                94: 1,
                95: 1 }],
        281: [[[[33, 1]], [[0, 1]]], { 33: 1 }],
        282: [
            [
                [[10, 1]],
                [[21, 2]],
                [[70, 3], [29, 4]],
                [[96, 5]],
                [[43, 6], [58, 7]],
                [[0, 5]],
                [[70, 3]],
                [[43, 6]]],
            { 10: 1 }],
        283: [
            [
                [
                    [97, 1],
                    [98, 1],
                    [7, 2],
                    [99, 1],
                    [97, 1],
                    [100, 1],
                    [101, 1],
                    [102, 3],
                    [103, 1],
                    [104, 1]],
                [[0, 1]],
                [[100, 1]],
                [[7, 1], [0, 3]]],
            { 7: 1, 97: 1, 98: 1, 99: 1, 100: 1, 101: 1, 102: 1, 103: 1, 104: 1 }],
        284: [
            [
                [
                    [105, 1],
                    [106, 1],
                    [107, 1],
                    [108, 1],
                    [109, 1],
                    [110, 1],
                    [111, 1],
                    [112, 1]],
                [[0, 1]]],
            { 4: 1, 10: 1, 15: 1, 17: 1, 28: 1, 31: 1, 35: 1, 36: 1 }],
        285: [[[[34, 1]], [[0, 1]]], { 34: 1 }],
        286: [[[[113, 1]], [[111, 2], [108, 2]], [[0, 2]]], { 35: 1 }],
        287: [
            [
                [[35, 1]],
                [[114, 2]],
                [[2, 4], [29, 3]],
                [[43, 5], [115, 6]],
                [[0, 4]],
                [[2, 4]],
                [[43, 5]]],
            { 35: 1 }],
        288: [[[[116, 1]], [[116, 1], [0, 1]]], { 35: 1 }],
        289: [[[[22, 1]], [[117, 2]], [[0, 2]]], { 22: 1 }],
        290: [
            [
                [[69, 1]],
                [[70, 2]],
                [[69, 3]],
                [[57, 4], [0, 3]],
                [[69, 1], [0, 4]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        291: [[[[114, 1]], [[118, 2], [0, 1]], [[21, 3]], [[0, 3]]], { 21: 1 }],
        292: [[[[119, 1]], [[57, 0], [0, 1]]], { 21: 1 }],
        293: [[[[21, 1]], [[120, 0], [0, 1]]], { 21: 1 }],
        294: [[[[21, 1]], [[0, 1]]], { 21: 1 }],
        295: [
            [[[58, 1]], [[2, 1], [121, 2]], [[0, 2]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        296: [
            [
                [[122, 1]],
                [[69, 2], [0, 1]],
                [[118, 3], [57, 3], [0, 2]],
                [[69, 4]],
                [[0, 4]]],
            { 122: 1 }],
        297: [
            [
                [[16, 1]],
                [[55, 2]],
                [[100, 3], [0, 2]],
                [[69, 4]],
                [[57, 5], [0, 4]],
                [[69, 6]],
                [[0, 6]]],
            { 16: 1 }],
        298: [
            [[[2, 0], [121, 1], [123, 0]], [[0, 1]]],
            {
                2: 1,
                4: 1,
                5: 1,
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                10: 1,
                11: 1,
                12: 1,
                13: 1,
                14: 1,
                15: 1,
                16: 1,
                17: 1,
                18: 1,
                19: 1,
                20: 1,
                21: 1,
                22: 1,
                23: 1,
                24: 1,
                25: 1,
                26: 1,
                27: 1,
                28: 1,
                29: 1,
                30: 1,
                31: 1,
                32: 1,
                33: 1,
                34: 1,
                35: 1,
                36: 1,
                37: 1,
                121: 1 }],
        299: [
            [[[124, 1], [125, 1], [126, 1], [127, 1], [128, 1]], [[0, 1]]],
            { 5: 1, 19: 1, 26: 1, 33: 1, 34: 1 }],
        300: [
            [
                [[28, 1]],
                [[117, 2]],
                [[100, 3]],
                [[58, 4]],
                [[70, 5]],
                [[96, 6]],
                [[68, 7], [0, 6]],
                [[70, 8]],
                [[96, 9]],
                [[0, 9]]],
            { 28: 1 }],
        301: [[[[29, 1], [21, 2]], [[129, 3]], [[0, 2]], [[43, 2]]], { 21: 1, 29: 1 }],
        302: [[[[130, 1]], [[57, 2], [0, 1]], [[130, 1], [0, 2]]], { 21: 1, 29: 1 }],
        303: [
            [[[4, 1]], [[21, 2]], [[131, 3]], [[70, 4]], [[96, 5]], [[0, 5]]],
            { 4: 1 }],
        304: [
            [
                [[28, 1]],
                [[117, 2]],
                [[100, 3]],
                [[67, 4]],
                [[132, 5], [0, 4]],
                [[0, 5]]],
            { 28: 1 }],
        305: [[[[31, 1]], [[133, 2]], [[132, 3], [0, 2]], [[0, 3]]], { 31: 1 }],
        306: [[[[83, 1], [134, 1]], [[0, 1]]], { 28: 1, 31: 1 }],
        307: [
            [
                [[31, 1]],
                [[69, 2]],
                [[70, 3]],
                [[96, 4]],
                [[68, 5], [135, 1], [0, 4]],
                [[70, 6]],
                [[96, 7]],
                [[0, 7]]],
            { 31: 1 }],
        308: [[[[21, 1]], [[118, 2], [0, 1]], [[21, 3]], [[0, 3]]], { 21: 1 }],
        309: [[[[136, 1]], [[57, 2], [0, 1]], [[136, 1], [0, 2]]], { 21: 1 }],
        310: [
            [
                [[30, 1]],
                [[114, 2], [120, 3]],
                [[24, 4]],
                [[114, 2], [24, 4], [120, 3]],
                [[137, 5], [63, 5], [29, 6]],
                [[0, 5]],
                [[137, 7]],
                [[43, 5]]],
            { 30: 1 }],
        311: [[[[24, 1]], [[138, 2]], [[0, 2]]], { 24: 1 }],
        312: [[[[139, 1], [140, 1]], [[0, 1]]], { 24: 1, 30: 1 }],
        313: [
            [
                [[28, 1]],
                [[117, 2]],
                [[100, 3]],
                [[141, 4]],
                [[142, 5], [0, 4]],
                [[0, 5]]],
            { 28: 1 }],
        314: [[[[31, 1]], [[133, 2]], [[142, 3], [0, 2]], [[0, 3]]], { 31: 1 }],
        315: [[[[143, 1], [144, 1]], [[0, 1]]], { 28: 1, 31: 1 }],
        316: [
            [
                [[69, 1]],
                [[143, 2], [57, 3], [0, 1]],
                [[0, 2]],
                [[69, 4], [0, 3]],
                [[57, 3], [0, 4]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        317: [
            [[[11, 1]], [[70, 2], [71, 3]], [[133, 4]], [[70, 2]], [[0, 4]]],
            { 11: 1 }],
        318: [
            [[[145, 1], [67, 1]], [[0, 1]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        319: [[[[29, 1]], [[43, 2], [71, 3]], [[0, 2]], [[43, 2]]], { 29: 1 }],
        320: [[[[23, 1]], [[0, 1]]], { 23: 1 }],
        321: [
            [
                [[12, 1]],
                [[69, 2], [79, 3], [0, 1]],
                [[57, 4], [0, 2]],
                [[69, 5]],
                [[69, 2], [0, 4]],
                [[57, 6], [0, 5]],
                [[69, 7]],
                [[57, 8], [0, 7]],
                [[69, 7], [0, 8]]],
            { 12: 1 }],
        322: [
            [
                [[5, 1]],
                [[69, 2], [0, 1]],
                [[57, 3], [0, 2]],
                [[69, 4]],
                [[57, 5], [0, 4]],
                [[69, 6]],
                [[0, 6]]],
            { 5: 1 }],
        323: [[[[19, 1]], [[58, 2], [0, 1]], [[0, 2]]], { 19: 1 }],
        324: [
            [[[146, 1]], [[2, 2], [147, 3]], [[0, 2]], [[146, 1], [2, 2]]],
            {
                5: 1,
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                12: 1,
                13: 1,
                14: 1,
                16: 1,
                18: 1,
                19: 1,
                20: 1,
                21: 1,
                22: 1,
                23: 1,
                24: 1,
                25: 1,
                26: 1,
                27: 1,
                29: 1,
                30: 1,
                32: 1,
                33: 1,
                34: 1,
                37: 1 }],
        325: [[[[70, 1]], [[69, 2], [0, 1]], [[0, 2]]], { 70: 1 }],
        326: [
            [
                [
                    [148, 1],
                    [149, 1],
                    [150, 1],
                    [151, 1],
                    [152, 1],
                    [153, 1],
                    [154, 1],
                    [155, 1],
                    [156, 1],
                    [157, 1]],
                [[0, 1]]],
            {
                5: 1,
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                12: 1,
                13: 1,
                14: 1,
                16: 1,
                18: 1,
                19: 1,
                20: 1,
                21: 1,
                22: 1,
                23: 1,
                24: 1,
                25: 1,
                26: 1,
                27: 1,
                29: 1,
                30: 1,
                32: 1,
                33: 1,
                34: 1,
                37: 1 }],
        327: [
            [[[1, 1], [3, 1]], [[0, 1]]],
            {
                4: 1,
                5: 1,
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                10: 1,
                11: 1,
                12: 1,
                13: 1,
                14: 1,
                15: 1,
                16: 1,
                17: 1,
                18: 1,
                19: 1,
                20: 1,
                21: 1,
                22: 1,
                23: 1,
                24: 1,
                25: 1,
                26: 1,
                27: 1,
                28: 1,
                29: 1,
                30: 1,
                31: 1,
                32: 1,
                33: 1,
                34: 1,
                35: 1,
                36: 1,
                37: 1 }],
        328: [
            [
                [[70, 1], [69, 2], [120, 3]],
                [[158, 4], [69, 5], [0, 1]],
                [[70, 1], [0, 2]],
                [[120, 6]],
                [[0, 4]],
                [[158, 4], [0, 5]],
                [[120, 4]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1,
                70: 1,
                120: 1 }],
        329: [
            [[[159, 1]], [[57, 2], [0, 1]], [[159, 1], [0, 2]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1,
                70: 1,
                120: 1 }],
        330: [
            [
                [[1, 1], [2, 2]],
                [[0, 1]],
                [[160, 3]],
                [[123, 4]],
                [[161, 1], [123, 4]]],
            {
                2: 1,
                5: 1,
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                12: 1,
                13: 1,
                14: 1,
                16: 1,
                18: 1,
                19: 1,
                20: 1,
                21: 1,
                22: 1,
                23: 1,
                24: 1,
                25: 1,
                26: 1,
                27: 1,
                29: 1,
                30: 1,
                32: 1,
                33: 1,
                34: 1,
                37: 1 }],
        331: [
            [[[69, 1]], [[57, 2], [0, 1]], [[69, 1], [0, 2]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        332: [
            [[[69, 1]], [[57, 0], [0, 1]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        333: [
            [
                [[69, 1]],
                [[83, 2], [57, 3], [0, 1]],
                [[0, 2]],
                [[69, 4], [0, 3]],
                [[57, 3], [0, 4]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        334: [
            [
                [[133, 1]],
                [[57, 2], [0, 1]],
                [[133, 3]],
                [[57, 4], [0, 3]],
                [[133, 3], [0, 4]]],
            {
                6: 1,
                7: 1,
                8: 1,
                9: 1,
                11: 1,
                14: 1,
                18: 1,
                21: 1,
                25: 1,
                29: 1,
                32: 1,
                37: 1 }],
        335: [
            [
                [[29, 1], [120, 2], [32, 3]],
                [[43, 4], [115, 5]],
                [[21, 4]],
                [[162, 6]],
                [[0, 4]],
                [[43, 4]],
                [[47, 4]]],
            { 29: 1, 32: 1, 120: 1 }],
        336: [
            [
                [[15, 1]],
                [[70, 2]],
                [[96, 3]],
                [[163, 4], [164, 5]],
                [[70, 6]],
                [[70, 7]],
                [[96, 8]],
                [[96, 9]],
                [[163, 4], [68, 10], [164, 5], [0, 8]],
                [[0, 9]],
                [[70, 11]],
                [[96, 12]],
                [[164, 5], [0, 12]]],
            { 15: 1 }],
        337: [
            [
                [[63, 1], [130, 2], [77, 3]],
                [[21, 4]],
                [[60, 5], [57, 6], [0, 2]],
                [[21, 7]],
                [[57, 8], [0, 4]],
                [[69, 9]],
                [[63, 1], [130, 2], [77, 3], [0, 6]],
                [[0, 7]],
                [[77, 3]],
                [[57, 6], [0, 9]]],
            { 21: 1, 29: 1, 63: 1, 77: 1 }],
        338: [
            [
                [[17, 1]],
                [[69, 2]],
                [[70, 3]],
                [[96, 4]],
                [[68, 5], [0, 4]],
                [[70, 6]],
                [[96, 7]],
                [[0, 7]]],
            { 17: 1 }],
        339: [
            [
                [[36, 1]],
                [[69, 2]],
                [[70, 3], [165, 4]],
                [[96, 5]],
                [[70, 3]],
                [[0, 5]]],
            { 36: 1 }],
        340: [[[[118, 1]], [[55, 2]], [[0, 2]]], { 118: 1 }],
        341: [[[[45, 1]], [[0, 1]]], { 26: 1 }] },
    states: [
        [[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]],
        [[[38, 1]], [[39, 0], [0, 1]]],
        [[[40, 1]], [[25, 0], [37, 0], [0, 1]]],
        [
            [[18, 1], [8, 2], [32, 5], [29, 4], [9, 3], [14, 6], [21, 2]],
            [[18, 1], [0, 1]],
            [[0, 2]],
            [[41, 7], [42, 2]],
            [[43, 2], [44, 8], [45, 8]],
            [[46, 9], [47, 2]],
            [[48, 10]],
            [[42, 2]],
            [[43, 2]],
            [[47, 2]],
            [[14, 2]]],
        [[[49, 1]], [[50, 0], [0, 1]]],
        [[[51, 1]], [[52, 0], [0, 1]]],
        [[[53, 1]], [[54, 0], [0, 1]]],
        [[[55, 1]], [[56, 0], [0, 1]]],
        [[[55, 1]], [[57, 2], [0, 1]], [[55, 1], [0, 2]]],
        [
            [[58, 1]],
            [[59, 2], [60, 3], [0, 1]],
            [[58, 4], [45, 4]],
            [[58, 5], [45, 5]],
            [[0, 4]],
            [[60, 3], [0, 5]]],
        [[[61, 1]], [[62, 0], [63, 0], [64, 0], [65, 0], [0, 1]]],
        [[[27, 1]], [[21, 2]], [[57, 1], [0, 2]]],
        [
            [[66, 1], [67, 2]],
            [[0, 1]],
            [[31, 3], [0, 2]],
            [[67, 4]],
            [[68, 5]],
            [[69, 1]]],
        [[[11, 1]], [[70, 2], [71, 3]], [[69, 4]], [[70, 2]], [[0, 4]]],
        [[[13, 1]], [[21, 2]], [[57, 1], [0, 2]]],
        [[[7, 1], [72, 2]], [[38, 2]], [[0, 2]]],
        [[[73, 1]], [[74, 0], [0, 1]]],
        [[[75, 1]], [[76, 1], [77, 2], [0, 1]], [[49, 3]], [[0, 3]]],
        [[[78, 1]], [[79, 0], [80, 0], [0, 1]]],
        [[[25, 1], [6, 1], [37, 1], [81, 2]], [[49, 2]], [[0, 2]]],
        [[[26, 1]], [[58, 2], [0, 1]], [[0, 2]]],
        [
            [[63, 1], [82, 2], [77, 3]],
            [[69, 4]],
            [[57, 5], [0, 2]],
            [[69, 6]],
            [[57, 7], [0, 4]],
            [[63, 1], [82, 2], [77, 3], [0, 5]],
            [[0, 6]],
            [[82, 4], [77, 3]]],
        [[[69, 1]], [[83, 2], [60, 3], [0, 1]], [[0, 2]], [[69, 2]]],
        [[[20, 1]], [[69, 2]], [[57, 3], [0, 2]], [[69, 4]], [[0, 4]]],
        [
            [
                [84, 1],
                [85, 1],
                [86, 1],
                [87, 1],
                [88, 1],
                [89, 1],
                [90, 1],
                [91, 1],
                [92, 1],
                [93, 1],
                [94, 1],
                [95, 1]],
            [[0, 1]]],
        [[[33, 1]], [[0, 1]]],
        [
            [[10, 1]],
            [[21, 2]],
            [[70, 3], [29, 4]],
            [[96, 5]],
            [[43, 6], [58, 7]],
            [[0, 5]],
            [[70, 3]],
            [[43, 6]]],
        [
            [
                [97, 1],
                [98, 1],
                [7, 2],
                [99, 1],
                [97, 1],
                [100, 1],
                [101, 1],
                [102, 3],
                [103, 1],
                [104, 1]],
            [[0, 1]],
            [[100, 1]],
            [[7, 1], [0, 3]]],
        [
            [
                [105, 1],
                [106, 1],
                [107, 1],
                [108, 1],
                [109, 1],
                [110, 1],
                [111, 1],
                [112, 1]],
            [[0, 1]]],
        [[[34, 1]], [[0, 1]]],
        [[[113, 1]], [[111, 2], [108, 2]], [[0, 2]]],
        [
            [[35, 1]],
            [[114, 2]],
            [[2, 4], [29, 3]],
            [[43, 5], [115, 6]],
            [[0, 4]],
            [[2, 4]],
            [[43, 5]]],
        [[[116, 1]], [[116, 1], [0, 1]]],
        [[[22, 1]], [[117, 2]], [[0, 2]]],
        [[[69, 1]], [[70, 2]], [[69, 3]], [[57, 4], [0, 3]], [[69, 1], [0, 4]]],
        [[[114, 1]], [[118, 2], [0, 1]], [[21, 3]], [[0, 3]]],
        [[[119, 1]], [[57, 0], [0, 1]]],
        [[[21, 1]], [[120, 0], [0, 1]]],
        [[[21, 1]], [[0, 1]]],
        [[[58, 1]], [[2, 1], [121, 2]], [[0, 2]]],
        [
            [[122, 1]],
            [[69, 2], [0, 1]],
            [[118, 3], [57, 3], [0, 2]],
            [[69, 4]],
            [[0, 4]]],
        [
            [[16, 1]],
            [[55, 2]],
            [[100, 3], [0, 2]],
            [[69, 4]],
            [[57, 5], [0, 4]],
            [[69, 6]],
            [[0, 6]]],
        [[[2, 0], [121, 1], [123, 0]], [[0, 1]]],
        [[[124, 1], [125, 1], [126, 1], [127, 1], [128, 1]], [[0, 1]]],
        [
            [[28, 1]],
            [[117, 2]],
            [[100, 3]],
            [[58, 4]],
            [[70, 5]],
            [[96, 6]],
            [[68, 7], [0, 6]],
            [[70, 8]],
            [[96, 9]],
            [[0, 9]]],
        [[[29, 1], [21, 2]], [[129, 3]], [[0, 2]], [[43, 2]]],
        [[[130, 1]], [[57, 2], [0, 1]], [[130, 1], [0, 2]]],
        [[[4, 1]], [[21, 2]], [[131, 3]], [[70, 4]], [[96, 5]], [[0, 5]]],
        [[[28, 1]], [[117, 2]], [[100, 3]], [[67, 4]], [[132, 5], [0, 4]], [[0, 5]]],
        [[[31, 1]], [[133, 2]], [[132, 3], [0, 2]], [[0, 3]]],
        [[[83, 1], [134, 1]], [[0, 1]]],
        [
            [[31, 1]],
            [[69, 2]],
            [[70, 3]],
            [[96, 4]],
            [[68, 5], [135, 1], [0, 4]],
            [[70, 6]],
            [[96, 7]],
            [[0, 7]]],
        [[[21, 1]], [[118, 2], [0, 1]], [[21, 3]], [[0, 3]]],
        [[[136, 1]], [[57, 2], [0, 1]], [[136, 1], [0, 2]]],
        [
            [[30, 1]],
            [[114, 2], [120, 3]],
            [[24, 4]],
            [[114, 2], [24, 4], [120, 3]],
            [[137, 5], [63, 5], [29, 6]],
            [[0, 5]],
            [[137, 7]],
            [[43, 5]]],
        [[[24, 1]], [[138, 2]], [[0, 2]]],
        [[[139, 1], [140, 1]], [[0, 1]]],
        [[[28, 1]], [[117, 2]], [[100, 3]], [[141, 4]], [[142, 5], [0, 4]], [[0, 5]]],
        [[[31, 1]], [[133, 2]], [[142, 3], [0, 2]], [[0, 3]]],
        [[[143, 1], [144, 1]], [[0, 1]]],
        [
            [[69, 1]],
            [[143, 2], [57, 3], [0, 1]],
            [[0, 2]],
            [[69, 4], [0, 3]],
            [[57, 3], [0, 4]]],
        [[[11, 1]], [[70, 2], [71, 3]], [[133, 4]], [[70, 2]], [[0, 4]]],
        [[[145, 1], [67, 1]], [[0, 1]]],
        [[[29, 1]], [[43, 2], [71, 3]], [[0, 2]], [[43, 2]]],
        [[[23, 1]], [[0, 1]]],
        [
            [[12, 1]],
            [[69, 2], [79, 3], [0, 1]],
            [[57, 4], [0, 2]],
            [[69, 5]],
            [[69, 2], [0, 4]],
            [[57, 6], [0, 5]],
            [[69, 7]],
            [[57, 8], [0, 7]],
            [[69, 7], [0, 8]]],
        [
            [[5, 1]],
            [[69, 2], [0, 1]],
            [[57, 3], [0, 2]],
            [[69, 4]],
            [[57, 5], [0, 4]],
            [[69, 6]],
            [[0, 6]]],
        [[[19, 1]], [[58, 2], [0, 1]], [[0, 2]]],
        [[[146, 1]], [[2, 2], [147, 3]], [[0, 2]], [[146, 1], [2, 2]]],
        [[[70, 1]], [[69, 2], [0, 1]], [[0, 2]]],
        [
            [
                [148, 1],
                [149, 1],
                [150, 1],
                [151, 1],
                [152, 1],
                [153, 1],
                [154, 1],
                [155, 1],
                [156, 1],
                [157, 1]],
            [[0, 1]]],
        [[[1, 1], [3, 1]], [[0, 1]]],
        [
            [[70, 1], [69, 2], [120, 3]],
            [[158, 4], [69, 5], [0, 1]],
            [[70, 1], [0, 2]],
            [[120, 6]],
            [[0, 4]],
            [[158, 4], [0, 5]],
            [[120, 4]]],
        [[[159, 1]], [[57, 2], [0, 1]], [[159, 1], [0, 2]]],
        [[[1, 1], [2, 2]], [[0, 1]], [[160, 3]], [[123, 4]], [[161, 1], [123, 4]]],
        [[[69, 1]], [[57, 2], [0, 1]], [[69, 1], [0, 2]]],
        [[[69, 1]], [[57, 0], [0, 1]]],
        [
            [[69, 1]],
            [[83, 2], [57, 3], [0, 1]],
            [[0, 2]],
            [[69, 4], [0, 3]],
            [[57, 3], [0, 4]]],
        [
            [[133, 1]],
            [[57, 2], [0, 1]],
            [[133, 3]],
            [[57, 4], [0, 3]],
            [[133, 3], [0, 4]]],
        [
            [[29, 1], [120, 2], [32, 3]],
            [[43, 4], [115, 5]],
            [[21, 4]],
            [[162, 6]],
            [[0, 4]],
            [[43, 4]],
            [[47, 4]]],
        [
            [[15, 1]],
            [[70, 2]],
            [[96, 3]],
            [[163, 4], [164, 5]],
            [[70, 6]],
            [[70, 7]],
            [[96, 8]],
            [[96, 9]],
            [[163, 4], [68, 10], [164, 5], [0, 8]],
            [[0, 9]],
            [[70, 11]],
            [[96, 12]],
            [[164, 5], [0, 12]]],
        [
            [[63, 1], [130, 2], [77, 3]],
            [[21, 4]],
            [[60, 5], [57, 6], [0, 2]],
            [[21, 7]],
            [[57, 8], [0, 4]],
            [[69, 9]],
            [[63, 1], [130, 2], [77, 3], [0, 6]],
            [[0, 7]],
            [[77, 3]],
            [[57, 6], [0, 9]]],
        [
            [[17, 1]],
            [[69, 2]],
            [[70, 3]],
            [[96, 4]],
            [[68, 5], [0, 4]],
            [[70, 6]],
            [[96, 7]],
            [[0, 7]]],
        [[[36, 1]], [[69, 2]], [[70, 3], [165, 4]], [[96, 5]], [[70, 3]], [[0, 5]]],
        [[[118, 1]], [[55, 2]], [[0, 2]]],
        [[[45, 1]], [[0, 1]]]],
    labels: [
        [0, 'EMPTY'],
        [324, null],
        [4, null],
        [284, null],
        [1, 'def'],
        [1, 'raise'],
        [32, null],
        [1, 'not'],
        [2, null],
        [26, null],
        [1, 'class'],
        [1, 'lambda'],
        [1, 'print'],
        [1, 'nonlocal'],
        [25, null],
        [1, 'try'],
        [1, 'exec'],
        [1, 'while'],
        [3, null],
        [1, 'return'],
        [1, 'assert'],
        [1, null],
        [1, 'del'],
        [1, 'pass'],
        [1, 'import'],
        [15, null],
        [1, 'yield'],
        [1, 'global'],
        [1, 'for'],
        [7, null],
        [1, 'from'],
        [1, 'if'],
        [9, null],
        [1, 'break'],
        [1, 'continue'],
        [50, null],
        [1, 'with'],
        [14, null],
        [271, null],
        [1, 'and'],
        [266, null],
        [290, null],
        [27, null],
        [8, null],
        [333, null],
        [276, null],
        [316, null],
        [10, null],
        [332, null],
        [275, null],
        [19, null],
        [262, null],
        [18, null],
        [260, null],
        [33, null],
        [258, null],
        [283, null],
        [12, null],
        [331, null],
        [280, null],
        [22, null],
        [274, null],
        [48, null],
        [16, null],
        [17, null],
        [24, null],
        [269, null],
        [272, null],
        [1, 'else'],
        [268, null],
        [11, null],
        [337, null],
        [263, null],
        [257, null],
        [1, 'or'],
        [259, null],
        [335, null],
        [36, null],
        [261, null],
        [35, null],
        [34, null],
        [273, null],
        [278, null],
        [304, null],
        [46, null],
        [39, null],
        [41, null],
        [47, null],
        [42, null],
        [43, null],
        [37, null],
        [44, null],
        [49, null],
        [45, null],
        [38, null],
        [40, null],
        [330, null],
        [29, null],
        [21, null],
        [28, null],
        [1, 'in'],
        [30, null],
        [1, 'is'],
        [31, null],
        [20, null],
        [336, null],
        [307, null],
        [300, null],
        [282, null],
        [339, null],
        [338, null],
        [303, null],
        [286, null],
        [288, null],
        [293, null],
        [277, null],
        [287, null],
        [264, null],
        [1, 'as'],
        [291, null],
        [23, null],
        [0, null],
        [1, 'except'],
        [327, null],
        [281, null],
        [285, null],
        [322, null],
        [323, null],
        [341, null],
        [302, null],
        [301, null],
        [319, null],
        [306, null],
        [318, null],
        [305, null],
        [1, 'elif'],
        [308, null],
        [309, null],
        [292, null],
        [311, null],
        [310, null],
        [334, null],
        [315, null],
        [313, null],
        [314, null],
        [317, null],
        [326, null],
        [13, null],
        [270, null],
        [267, null],
        [265, null],
        [320, null],
        [321, null],
        [289, null],
        [297, null],
        [299, null],
        [279, null],
        [312, null],
        [325, null],
        [328, null],
        [5, null],
        [6, null],
        [329, null],
        [296, null],
        [1, 'finally'],
        [340, null]],
    keywords: {
        'and': 39,
        'as': 118,
        'assert': 20,
        'break': 33,
        'class': 10,
        'continue': 34,
        'def': 4,
        'del': 22,
        'elif': 135,
        'else': 68,
        'except': 122,
        'exec': 16,
        'finally': 164,
        'for': 28,
        'from': 30,
        'global': 27,
        'if': 31,
        'import': 24,
        'in': 100,
        'is': 102,
        'lambda': 11,
        'nonlocal': 13,
        'not': 7,
        'or': 74,
        'pass': 23,
        'print': 12,
        'raise': 5,
        'return': 19,
        'try': 15,
        'while': 17,
        'with': 36,
        'yield': 26 },
    tokens: {
        0: 121,
        1: 21,
        2: 8,
        3: 18,
        4: 2,
        5: 160,
        6: 161,
        7: 29,
        8: 43,
        9: 32,
        10: 47,
        11: 70,
        12: 57,
        13: 147,
        14: 37,
        15: 25,
        16: 63,
        17: 64,
        18: 52,
        19: 50,
        20: 104,
        21: 98,
        22: 60,
        23: 120,
        24: 65,
        25: 14,
        26: 9,
        27: 42,
        28: 99,
        29: 97,
        30: 101,
        31: 103,
        32: 6,
        33: 54,
        34: 80,
        35: 79,
        36: 77,
        37: 90,
        38: 94,
        39: 85,
        40: 95,
        41: 86,
        42: 88,
        43: 89,
        44: 91,
        45: 93,
        46: 84,
        47: 87,
        48: 62,
        49: 92,
        50: 35 },
    start: 256
};
});

ace.define("ace/mode/python/Parser",["require","exports","module","ace/mode/python/asserts","ace/mode/python/base","ace/mode/python/tables","ace/mode/python/Tokenizer"], function(require, exports, module) {
"no use strict";
var asserts = require('./asserts');
var base = require('./base');
var tables = require('./tables');
var Tokenizer = require('./Tokenizer');

var OpMap = tables.OpMap;
var ParseTables = tables.ParseTables;
function parseError(message, fileName, begin, end) {
    var e = new SyntaxError(message);
    e.name = "ParseError";
    e['fileName'] = fileName;
    if (base.isDef(begin)) {
        e['lineNumber'] = begin[0];
        e['columnNumber'] = begin[1];
    }
    return e;
}
function findInDfa(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i][0] === obj[0] && a[i][1] === obj[1]) {
            return true;
        }
    }
    return false;
}

var Node = (function () {
    function Node(type, value, lineNumber, columnNumber, children) {
        this.used_names = {};
        this.type = type;
        this.value = value;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
        this.children = children;
    }
    return Node;
})();
exports.Node = Node;

var StackEntry = (function () {
    function StackEntry(dfa, state, node) {
        this.dfa = dfa;
        this.state = state;
        this.node = node;
    }
    return StackEntry;
})();

var Parser = (function () {
    function Parser(fileName, grammar) {
        this.fileName = fileName;
        this.grammar = grammar;
    }
    Parser.prototype.setup = function (start) {
        start = start || this.grammar.start;
        var newnode = new Node(start, null, null, null, []);
        this.stack = [new StackEntry(this.grammar.dfas[start], 0, newnode)];
        this.used_names = {};
    };
    Parser.prototype.addtoken = function (type, value, context) {
        var iLabel = this.classify(type, value, context);

        OUTERWHILE:
        while (true) {
            var tp = this.stack[this.stack.length - 1];
            var states = tp.dfa[0];
            var first = tp.dfa[1];
            var arcs = states[tp.state];

            for (var a = 0; a < arcs.length; ++a) {
                var i = arcs[a][0];
                var newstate = arcs[a][1];
                var t = this.grammar.labels[i][0];
                var v = this.grammar.labels[i][1];
                if (iLabel === i) {
                    asserts.assert(t < 256);
                    this.shift(type, value, newstate, context);
                    var state = newstate;
                    while (states[state].length === 1 && states[state][0][0] === 0 && states[state][0][1] === state) {
                        this.pop();
                        if (this.stack.length === 0) {
                            return true;
                        }
                        tp = this.stack[this.stack.length - 1];
                        state = tp.state;
                        states = tp.dfa[0];
                        first = tp.dfa[1];
                    }
                    return false;
                } else if (t >= 256) {
                    var itsdfa = this.grammar.dfas[t];
                    var itsfirst = itsdfa[1];
                    if (itsfirst.hasOwnProperty(iLabel)) {
                        this.push(t, this.grammar.dfas[t], newstate, context);
                        continue OUTERWHILE;
                    }
                }
            }

            if (findInDfa(arcs, [0, tp.state])) {
                this.pop();
                if (this.stack.length === 0) {
                    throw parseError("too much input", this.fileName);
                }
            } else {
                throw parseError("bad input", this.fileName, context[0], context[1]);
            }
        }
    };
    Parser.prototype.classify = function (type, value, context) {
        var iLabel;
        if (type === Tokenizer.Tokens.T_NAME) {
            this.used_names[value] = true;
            iLabel = this.grammar.keywords.hasOwnProperty(value) && this.grammar.keywords[value];
            if (iLabel) {
                return iLabel;
            }
        }
        iLabel = this.grammar.tokens.hasOwnProperty(type) && this.grammar.tokens[type];
        if (!iLabel) {
            throw parseError("bad token", this.fileName, context[0], context[1]);
        }
        return iLabel;
    };
    Parser.prototype.shift = function (type, value, newstate, context) {
        var dfa = this.stack[this.stack.length - 1].dfa;
        var state = this.stack[this.stack.length - 1].state;
        var node = this.stack[this.stack.length - 1].node;
        var newnode = new Node(type, value, context[0][0], context[0][1], []);
        if (newnode) {
            node.children.push(newnode);
        }
        this.stack[this.stack.length - 1] = { dfa: dfa, state: newstate, node: node };
    };
    Parser.prototype.push = function (type, newdfa, newstate, context) {
        var dfa = this.stack[this.stack.length - 1].dfa;
        var node = this.stack[this.stack.length - 1].node;

        this.stack[this.stack.length - 1] = { dfa: dfa, state: newstate, node: node };

        var newnode = new Node(type, null, context[0][0], context[0][1], []);

        this.stack.push({ dfa: newdfa, state: 0, node: newnode });
    };
    Parser.prototype.pop = function () {
        var pop = this.stack.pop();
        var newnode = pop.node;
        if (newnode) {
            if (this.stack.length !== 0) {
                var node = this.stack[this.stack.length - 1].node;
                node.children.push(newnode);
            } else {
                this.rootnode = newnode;
                this.rootnode.used_names = this.used_names;
            }
        }
    };
    return Parser;
})();
function makeParser(fileName, style) {
    if (style === undefined)
        style = "file_input";

    var p = new Parser(fileName, ParseTables);
    if (style === "file_input") {
        p.setup(ParseTables.sym.file_input);
    } else {
        asserts.fail("todo;");
    }
    var curIndex = 0;
    var lineno = 1;
    var column = 0;
    var prefix = "";
    var T_COMMENT = Tokenizer.Tokens.T_COMMENT;
    var T_NL = Tokenizer.Tokens.T_NL;
    var T_OP = Tokenizer.Tokens.T_OP;
    var tokenizer = new Tokenizer(fileName, style === "single_input", function (type, value, start, end, line) {
        var s_lineno = start[0];
        var s_column = start[1];
        if (type === T_COMMENT || type === T_NL) {
            prefix += value;
            lineno = end[0];
            column = end[1];
            if (value[value.length - 1] === "\n") {
                lineno += 1;
                column = 0;
            }
            return undefined;
        }
        if (type === T_OP) {
            type = OpMap[value];
        }
        if (p.addtoken(type, value, [start, end, line])) {
            return true;
        }
    });
    return function (line) {
        var ret = tokenizer.generateTokens(line);
        if (ret) {
            if (ret !== "done") {
                throw parseError("incomplete input", this.fileName);
            }
            return p.rootnode;
        }
        return null;
    };
}
function parse(fileName, input) {
    var parseFunc = makeParser(fileName);
    if (input.substr(input.length - 1, 1) !== "\n")
        input += "\n";
    var lines = input.split("\n");
    var ret;
    for (var i = 0; i < lines.length; ++i) {
        ret = parseFunc(lines[i] + ((i === lines.length - 1) ? "" : "\n"));
    }
    return ret;
}
exports.parse = parse;
function parseTreeDump(node) {
    var ret = "";
    if (node.type >= 256) {
        ret += ParseTables.number2symbol[node.type] + "\n";
        for (var i = 0; i < node.children.length; ++i) {
            ret += exports.parseTreeDump(node.children[i]);
        }
    } else {
        ret += Tokenizer.tokenNames[node.type] + ": " + node.value + "\n";
    }
    return ret;
}
exports.parseTreeDump = parseTreeDump;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/mode/python_worker",["require","exports","module","ace/lib/oop","ace/worker/mirror","ace/mode/python/Parser"], function(require, exports, module) {
"no use strict";
var oop = require('../lib/oop');
var m = require('../worker/mirror');

var Parser = require('../mode/python/Parser');
var INFO = 'info';
var WARNING = 'warning';
var ERROR = 'error';
var PythonWorker = (function (_super) {
    __extends(PythonWorker, _super);
    function PythonWorker(sender) {
        _super.call(this, sender);
        this.callbacks = {};
        this.callbackId = 1;

        this.setTimeout(500);
        this.setOptions();
        this.sender.emit('initAfter');
    }
    PythonWorker.prototype.setOptions = function (options) {
        this.options = options || {};
    };

    PythonWorker.prototype.changeOptions = function (newOptions) {
        oop.mixin(this.options, newOptions);
        this.deferredUpdate.schedule(100);
    };

    PythonWorker.prototype.onUpdate = function () {
        var value = this.doc.getValue();

        var annotations = [];

        try  {
            var node = Parser.parse('<stdin>', value);
        } catch (e) {
            annotations.push({
                row: e.lineNumber - 1,
                column: e.columnNumber,
                text: e.message,
                type: ERROR
            });
        }

        this.sender.emit('syntax', annotations);
    };
    return PythonWorker;
})(m.Mirror);
exports.PythonWorker = PythonWorker;
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
