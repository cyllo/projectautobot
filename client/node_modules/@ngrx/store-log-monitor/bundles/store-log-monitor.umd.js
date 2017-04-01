(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/operator/filter'), require('rxjs/operator/map'), require('@ngrx/core/operator/select'), require('@ngrx/store-devtools'), require('rxjs/observable/merge'), require('@ngrx/store'), require('@ngrx/core/compose')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/operator/filter', 'rxjs/operator/map', '@ngrx/core/operator/select', '@ngrx/store-devtools', 'rxjs/observable/merge', '@ngrx/store', '@ngrx/core/compose'], factory) :
    (factory((global.ngrx = global.ngrx || {}, global.ngrx.storeLogMonitor = global.ngrx.storeLogMonitor || {}),global.ng.core,global.ng.common,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.ngrx.core,global.ngrx.storeDevtools,global.Rx.Observable,global.ngrx.store,global.ngrx.core));
}(this, (function (exports,_angular_core,_angular_common,rxjs_operator_filter,rxjs_operator_map,_ngrx_core_operator_select,_ngrx_storeDevtools,rxjs_observable_merge,_ngrx_store,_ngrx_core_compose) { 'use strict';

// Most of these are according to this table: http://www.ssicom.org/js/x171166.htm
// However where nodejs readline diverges, they are adjusted to conform to it
var KEYCODES = {
    nomod: {
        escape: '\u001b',
        space: ' ' // actually '\u0020'
    },
    ctrl: {
        ' ': '\u0000',
        'a': '\u0001',
        'b': '\u0002',
        'c': '\u0003',
        'd': '\u0004',
        'e': '\u0005',
        'f': '\u0006',
        'g': '\u0007',
        'h': '\u0008',
        'i': '\u0009',
        'j': '\u000a',
        'k': '\u000b',
        'm': '\u000c',
        'n': '\u000d',
        'l': '\u000e',
        'o': '\u000f',
        'p': '\u0010',
        'q': '\u0011',
        'r': '\u0012',
        's': '\u0013',
        't': '\u0014',
        'u': '\u0015',
        'v': '\u0016',
        'w': '\u0017',
        'x': '\u0018',
        'y': '\u0019',
        'z': '\u001a',
        '[': '\u001b',
        '\\': '\u001c',
        ']': '\u001d',
        '^': '\u001e',
        '_': '\u001f',
        'space': '\u0000'
    }
};

var CommanderComponent = (function () {
    function CommanderComponent() {
        var _this = this;
        this.keydown$ = new _angular_core.EventEmitter();
        this._ignoreTags = ['INPUT', 'SELECT', 'TEXTAREA'];
        this.keydown$ = new _angular_core.EventEmitter();
        var filtered$ = rxjs_operator_filter.filter.call(this.keydown$, function (e) {
            if (_this._ignoreTags.indexOf(e.target.tagName) !== -1) {
                return false;
            }
            if (e.target.isContentEditable) {
                return false;
            }
            var command = _this.parseCommand(_this.shortcut);
            if (!command) {
                return false;
            }
            var charCode = e.keyCode || e.which;
            var char = String.fromCharCode(charCode);
            return command.name.toUpperCase() === char.toUpperCase() &&
                command.alt === e.altKey &&
                command.ctrl === e.ctrlKey &&
                command.meta === e.metaKey &&
                command.shift === e.shiftKey;
        });
        this.command = rxjs_operator_map.map.call(filtered$, function (e) {
            e.preventDefault();
            return { command: _this.shortcut };
        });
    }
    CommanderComponent.prototype.parseCommand = function (s) {
        var keyString = s.trim().toLowerCase();
        if (!/^(ctrl-|shift-|alt-|meta-){0,4}\w+$/.test(keyString)) {
            throw new Error('The string to parse needs to be of the format "c", "ctrl-c", "shift-ctrl-c".');
        }
        var parts = keyString.split('-');
        var key = {
            ctrl: false,
            meta: false,
            shift: false,
            alt: false
        };
        var c;
        key.name = parts.pop();
        while ((c = parts.pop())) {
            key[c] = true;
        }
        if (key.ctrl) {
            key.sequence = KEYCODES.ctrl[key.name] || key.name;
        }
        else {
            key.sequence = KEYCODES.nomod[key.name] || key.name;
        }
        if (key.shift && key.sequence && key.sequence.length === 1) {
            key.sequence = key.sequence.toUpperCase();
        }
        return key;
    };
    CommanderComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ngrx-commander',
                    template: '',
                    styles: [':host{ display: none }'],
                    host: {
                        '(document:keydown)': 'keydown$.emit($event)'
                    }
                },] },
    ];
    /** @nocollapse */
    CommanderComponent.ctorParameters = [];
    CommanderComponent.propDecorators = {
        'shortcut': [{ type: _angular_core.Input },],
        'command': [{ type: _angular_core.Output },],
    };
    return CommanderComponent;
}());

var DockComponent = (function () {
    function DockComponent() {
        this.position = 'right';
        this.size = 0.3;
        this.visible = true;
    }
    Object.defineProperty(DockComponent.prototype, "absoluteSize", {
        get: function () {
            return 100 * this.size + "%";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "restSize", {
        get: function () {
            return (100 - (100 * this.size)) + "%";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "leftPosition", {
        get: function () {
            return this.calculatePosition('left', 'right');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "rightPosition", {
        get: function () {
            return this.calculatePosition('right', 'left');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "topPosition", {
        get: function () {
            return this.calculatePosition('top', 'bottom');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "bottomPosition", {
        get: function () {
            return this.calculatePosition('bottom', 'top');
        },
        enumerable: true,
        configurable: true
    });
    DockComponent.prototype.calculatePosition = function (primary, secondary) {
        if (this.visible) {
            switch (this.position) {
                case secondary:
                    return this.restSize;
                default:
                    return '0%';
            }
        }
        else {
            switch (this.position) {
                case primary:
                    return "-" + this.absoluteSize;
                case secondary:
                    return '100%';
                default:
                    return '0%';
            }
        }
    };
    DockComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ngrx-dock',
                    template: "\n    <div class=\"dock\">\n      <div class=\"dock-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n  ",
                    styles: ["\n    :host {\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      transition: all 0.3s;\n      z-index: 9999;\n    }\n\n    .dock {\n      position: absolute;\n      z-index: 1;\n      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);\n      background-color: white;\n      left: 0;\n      top: 0;\n      width: 100%;\n      height: 100%;\n    }\n\n    .dock-content {\n      width: 100%;\n      height: 100%;\n      overflow: auto;\n    }\n  "]
                },] },
    ];
    /** @nocollapse */
    DockComponent.ctorParameters = [];
    DockComponent.propDecorators = {
        'position': [{ type: _angular_core.Input },],
        'size': [{ type: _angular_core.Input },],
        'visible': [{ type: _angular_core.Input },],
        'leftPosition': [{ type: _angular_core.HostBinding, args: ['style.left',] },],
        'rightPosition': [{ type: _angular_core.HostBinding, args: ['style.right',] },],
        'topPosition': [{ type: _angular_core.HostBinding, args: ['style.top',] },],
        'bottomPosition': [{ type: _angular_core.HostBinding, args: ['style.bottom',] },],
    };
    return DockComponent;
}());

var DockActions = (function () {
    function DockActions() {
    }
    DockActions.prototype.toggleVisibility = function () {
        return { type: DockActions.TOGGLE_VISIBILITY };
    };
    DockActions.prototype.changePosition = function () {
        return { type: DockActions.CHANGE_POSITION };
    };
    DockActions.prototype.changeSize = function (size) {
        return { type: DockActions.CHANGE_SIZE, payload: size };
    };
    DockActions.prototype.changeMonitor = function () {
        return { type: DockActions.CHANGE_MONITOR };
    };
    DockActions.TOGGLE_VISIBILITY = '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
    DockActions.CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
    DockActions.CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
    DockActions.CHANGE_MONITOR = '@@redux-devtools-log-monitor/CHANGE_MONITOR';
    DockActions.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    DockActions.ctorParameters = [];
    return DockActions;
}());

var DockMonitorComponent = (function () {
    function DockMonitorComponent(tools, actions) {
        this.state$ = _ngrx_core_operator_select.select.call(tools.liftedState, function (s) { return s.monitorState; });
        this.visible$ = _ngrx_core_operator_select.select.call(this.state$, function (s) { return s.visible; });
        this.position$ = _ngrx_core_operator_select.select.call(this.state$, function (s) { return s.position; });
        this.size$ = _ngrx_core_operator_select.select.call(this.state$, function (s) { return s.size; });
        this.toggle$ = new _angular_core.EventEmitter();
        this.changePosition$ = new _angular_core.EventEmitter();
        this.actionsSubscription = rxjs_observable_merge.merge(rxjs_operator_map.map.call(this.toggle$, function () { return actions.toggleVisibility(); }), rxjs_operator_map.map.call(this.changePosition$, function () { return actions.changePosition(); })).subscribe(tools);
    }
    DockMonitorComponent.prototype.ngOnDestroy = function () {
        this.actionsSubscription.unsubscribe();
    };
    DockMonitorComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'dock-monitor',
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    template: "\n    <ngrx-commander [shortcut]=\"toggleCommand\" (command)=\"toggle$.emit($event)\"></ngrx-commander>\n    <ngrx-commander [shortcut]=\"positionCommand\" (command)=\"changePosition$.emit($event)\"></ngrx-commander>\n\n    <ngrx-dock [visible]=\"visible$ | async\" [position]=\"position$ | async\" [size]=\"size$ | async\">\n      <ng-content></ng-content>\n    </ngrx-dock>\n  "
                },] },
    ];
    /** @nocollapse */
    DockMonitorComponent.ctorParameters = [
        { type: _ngrx_storeDevtools.StoreDevtools, },
        { type: DockActions, },
    ];
    DockMonitorComponent.propDecorators = {
        'toggleCommand': [{ type: _angular_core.Input },],
        'positionCommand': [{ type: _angular_core.Input },],
    };
    return DockMonitorComponent;
}());

var POSITIONS = ['left', 'top', 'right', 'bottom'];
function useDockMonitor(_options) {
    if (_options === void 0) { _options = {}; }
    var options = Object.assign({
        position: 'right',
        visible: true,
        size: 0.3
    }, _options);
    function position(state, action) {
        if (state === void 0) { state = options.position; }
        return (action.type === DockActions.CHANGE_POSITION) ?
            POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length] :
            state;
    }
    function size(state, action) {
        if (state === void 0) { state = options.size; }
        return (action.type === DockActions.CHANGE_SIZE) ?
            action.size :
            state;
    }
    function visible(state, action) {
        if (state === void 0) { state = options.visible; }
        return (action.type === DockActions.TOGGLE_VISIBILITY) ?
            !state :
            state;
    }
    return _ngrx_store.combineReducers({
        position: position,
        visible: visible,
        size: size
    });
}

var DockMonitorModule = (function () {
    function DockMonitorModule() {
    }
    DockMonitorModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule
                    ],
                    declarations: [
                        CommanderComponent,
                        DockComponent,
                        DockMonitorComponent
                    ],
                    providers: [
                        DockActions
                    ],
                    exports: [
                        DockMonitorComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    DockMonitorModule.ctorParameters = [];
    return DockMonitorModule;
}());

var KNOWN = {
    Array: 'array',
    Object: 'object',
    Null: 'null',
    Undefined: 'undefined',
    Boolean: 'boolean',
    Number: 'number',
    String: 'string',
    Symbol: 'symbol',
    Function: 'function',
    Iterable: 'iterable'
};
function getTypeOf(object) {
    var literalType = typeof object;
    if (literalType === 'object') {
        if (Array.isArray(object)) {
            return KNOWN.Array;
        }
        if (object === null) {
            return KNOWN.Null;
        }
        if (typeof object[Symbol.iterator] === 'function') {
            return KNOWN.Iterable;
        }
    }
    return literalType;
}
var arrayLength = function (value) { return value.length; };
var lengthLabel = function (single, plural) { return function (length) { return (length + " " + (length === 1 ? single : plural)); }; };
var typeIndicator = function (typeIndicator) { return function (input) { return (typeIndicator + " " + input); }; };
var typeIdentity = function (type) { return function () { return type; }; };
var withQuotes = function (val) { return ("\"" + val + "\""); };
var toString = function (val) { return val.toString(); };
var iterableToArray = function (value) { return Array.from(value); };
var labelFactoriesForTypes = (_a = {},
    _a[KNOWN.Array] = _ngrx_core_compose.compose(typeIndicator('[]'), lengthLabel('item', 'items'), arrayLength),
    _a[KNOWN.Object] = _ngrx_core_compose.compose(typeIndicator('{}'), lengthLabel('key', 'keys'), arrayLength, Object.getOwnPropertyNames),
    _a[KNOWN.Null] = typeIdentity(KNOWN.Null),
    _a[KNOWN.Undefined] = typeIdentity(KNOWN.Undefined),
    _a[KNOWN.Boolean] = function (val) { return val ? 'true' : 'false'; },
    _a[KNOWN.Number] = toString,
    _a[KNOWN.String] = withQuotes,
    _a[KNOWN.Symbol] = _ngrx_core_compose.compose(withQuotes, toString),
    _a[KNOWN.Function] = typeIdentity(KNOWN.Function),
    _a[KNOWN.Iterable] = _ngrx_core_compose.compose(typeIndicator('()'), lengthLabel('entry', 'entries'), arrayLength, iterableToArray),
    _a
);
var getLabelFor = function (object) { return labelFactoriesForTypes[getTypeOf(object)](object); };
function getChildrenFor(object) {
    var literalType = getTypeOf(object);
    if (literalType === KNOWN.Object) {
        return Object.getOwnPropertyNames(object).map(function (name) {
            return { key: name, value: object[name] };
        });
    }
    else if (literalType === KNOWN.Array) {
        return object.map(function (value, index) {
            return { key: index, value: value };
        });
    }
    else if (literalType === KNOWN.Iterable) {
        return Array.from(object).map(function (value, index) {
            return { key: index, value: value };
        });
    }
    throw new TypeError("Tried to get children for non-enumerable type \"" + literalType + "\"");
}
var _a;

var JsonNodeComponent = (function () {
    function JsonNodeComponent() {
        this.expanded = false;
    }
    Object.defineProperty(JsonNodeComponent.prototype, "value", {
        set: function (value) {
            this.label = getLabelFor(value);
            this.type = getTypeOf(value);
            if (this.type === KNOWN.Array || this.type === KNOWN.Object || this.type === KNOWN.Iterable) {
                this.children = getChildrenFor(value);
            }
            else {
                this.children = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    JsonNodeComponent.prototype.toggle = function () {
        if (this.children) {
            this.expanded = !this.expanded;
        }
    };
    JsonNodeComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ngrx-json-node',
                    styles: ["\n    :host {\n      display: block;\n      padding: 2px 2px 2px 20px;\n      position: relative;\n      color: #70AFCD;\n      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;\n    }\n    .expanded-indicator {\n      position: absolute;\n      top: 7px;\n      left: 5px;\n      font-size: 10px;\n      transition: transform 200ms;\n    }\n\n    .expanded .expanded-indicator {\n      transform: rotate(90deg);\n    }\n\n    .node-key::after {\n      content: ': ';\n      display: inline;\n    }\n\n    .expanded .node-label {\n      color: #BABBBD !important;\n    }\n\n    .node-label {\n      color: #9AC05C;\n    }\n\n    .node-label.array, .node-label.null, .node-label.iterable {\n      color: #D182C0;\n    }\n\n    .node-label.number, .node-label.undefined, .node-label.boolean {\n      color: #F86936;\n    }\n  "],
                    template: "\n    <div (click)=\"toggle()\" [class.expanded]=\"expanded\">\n      <span class=\"expanded-indicator\" *ngIf=\"children\">\u25B6</span>\n      <span class=\"node-key\">{{ key }}</span>\n      <span class=\"node-label\" [ngClass]=\"type\">{{ label }}</span>\n    </div>\n    <div class=\"child-nodes\" *ngIf=\"children && expanded\">\n      <ngrx-json-node *ngFor=\"let child of children\" [value]=\"child.value\" [key]=\"child.key\"></ngrx-json-node>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    JsonNodeComponent.ctorParameters = [];
    JsonNodeComponent.propDecorators = {
        'key': [{ type: _angular_core.Input },],
        'expanded': [{ type: _angular_core.Input },],
        'value': [{ type: _angular_core.Input },],
    };
    return JsonNodeComponent;
}());

var JsonTreeComponent = (function () {
    function JsonTreeComponent() {
        this.children = [];
        this.expanded = true;
    }
    Object.defineProperty(JsonTreeComponent.prototype, "value", {
        set: function (value) {
            this.children = getChildrenFor(value);
        },
        enumerable: true,
        configurable: true
    });
    JsonTreeComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ngrx-json-tree',
                    template: "\n    <ngrx-json-node *ngFor=\"let child of children\" [expanded]=\"expanded\" [value]=\"child.value\" [key]=\"child.key\"></ngrx-json-node>\n  "
                },] },
    ];
    /** @nocollapse */
    JsonTreeComponent.ctorParameters = [];
    JsonTreeComponent.propDecorators = {
        'expanded': [{ type: _angular_core.Input },],
        'value': [{ type: _angular_core.Input },],
    };
    return JsonTreeComponent;
}());

var JsonTreeModule = (function () {
    function JsonTreeModule() {
    }
    JsonTreeModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule
                    ],
                    declarations: [
                        JsonNodeComponent,
                        JsonTreeComponent
                    ],
                    exports: [
                        JsonTreeComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    JsonTreeModule.ctorParameters = [];
    return JsonTreeModule;
}());

var LogMonitorComponent = (function () {
    function LogMonitorComponent(devtools) {
        this.devtools = devtools;
        this.expandEntries = true;
        this.canRevert$ = _ngrx_core_operator_select.select.call(devtools.liftedState, function (s) { return !(s.computedStates.length > 1); });
        this.canSweep$ = _ngrx_core_operator_select.select.call(devtools.liftedState, function (s) { return !(s.skippedActionIds.length > 0); });
        this.canCommit$ = _ngrx_core_operator_select.select.call(devtools.liftedState, function (s) { return !(s.computedStates.length > 1); });
        this.items$ = rxjs_operator_map.map.call(devtools.liftedState, function (_a) {
            var actionsById = _a.actionsById, skippedActionIds = _a.skippedActionIds, stagedActionIds = _a.stagedActionIds, computedStates = _a.computedStates;
            var actions = [];
            for (var i = 0; i < stagedActionIds.length; i++) {
                var actionId = stagedActionIds[i];
                var action = actionsById[actionId].action;
                var _b = computedStates[i], state = _b.state, error = _b.error;
                var previousState = void 0;
                if (i > 0) {
                    previousState = computedStates[i - 1].state;
                }
                actions.push({
                    key: actionId,
                    collapsed: skippedActionIds.indexOf(actionId) > -1,
                    action: action,
                    actionId: actionId,
                    state: state,
                    previousState: previousState,
                    error: error
                });
            }
            return actions;
        });
    }
    LogMonitorComponent.prototype.handleToggle = function (id) {
        this.devtools.toggleAction(id);
    };
    LogMonitorComponent.prototype.handleReset = function () {
        this.devtools.reset();
    };
    LogMonitorComponent.prototype.handleRollback = function () {
        this.devtools.rollback();
    };
    LogMonitorComponent.prototype.handleSweep = function () {
        this.devtools.sweep();
    };
    LogMonitorComponent.prototype.handleCommit = function () {
        this.devtools.commit();
    };
    LogMonitorComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'log-monitor',
                    styles: ["\n    :host {\n      display: block;\n      background-color: #2A2F3A;\n      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;\n      position: relative;\n      overflow-y: hidden;\n      width: 100%;\n      height: 100%;\n      min-width: 300px;\n      direction: ltr;\n    }\n\n    .button-bar {\n      text-align: center;\n      border-bottom-width: 1px;\n      border-bottom-style: solid;\n      border-color: transparent;\n      z-index: 1;\n      display: flex;\n      flex-direction: row;\n      padding: 0 4px;\n    }\n\n    .elements {\n      position: absolute;\n      left: 0;\n      right: 0;\n      top: 38px;\n      bottom: 0;\n      overflow-x: hidden;\n      overflow-y: auto;\n    }\n  "],
                    template: "\n    <div class=\"button-bar\">\n      <log-monitor-button (action)=\"handleReset()\">\n        Reset\n      </log-monitor-button>\n\n      <log-monitor-button (action)=\"handleRollback()\">\n        Revert\n      </log-monitor-button>\n\n      <log-monitor-button (action)=\"handleSweep()\" [disabled]=\"canSweep$ | async\">\n        Sweep\n      </log-monitor-button>\n\n      <log-monitor-button (action)=\"handleCommit()\" [disabled]=\"canCommit$ | async\">\n        Commit\n      </log-monitor-button>\n    </div>\n    <div class=\"elements\">\n      <log-monitor-entry\n        *ngFor=\"let item of (items$ | async); let i = index\"\n        [item]=\"item\"\n        [disabled]=\"i === 0\"\n        [expandEntries]=\"expandEntries\"\n        (toggle)=\"handleToggle($event.id)\">\n      </log-monitor-entry>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    LogMonitorComponent.ctorParameters = [
        { type: _ngrx_storeDevtools.StoreDevtools, },
    ];
    LogMonitorComponent.propDecorators = {
        'expandEntries': [{ type: _angular_core.Input },],
    };
    return LogMonitorComponent;
}());

var LogMonitorButtonComponent = (function () {
    function LogMonitorButtonComponent() {
        this.action = new _angular_core.EventEmitter();
    }
    LogMonitorButtonComponent.prototype.handleAction = function ($event) {
        if (!this.disabled) {
            this.action.next({});
        }
        $event.stopPropagation();
        return false;
    };
    LogMonitorButtonComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'log-monitor-button',
                    template: "\n    <ng-content></ng-content>\n  ",
                    styles: ["\n    :host{\n      flex-grow: 1;\n      display: inline-block;\n      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;\n      cursor: pointer;\n      font-weight: bold;\n      border-radius: 3px;\n      padding: 4px 8px;\n      margin: 5px 3px 5px 3px;\n      font-size: 0.8em;\n      color: white;\n      text-decoration: none;\n      background-color: #4F5A65;\n    }\n\n    :host.disabled{\n      opacity: 0.2;\n      cursor: text;\n      background-color: transparent;\n    }\n  "]
                },] },
    ];
    /** @nocollapse */
    LogMonitorButtonComponent.ctorParameters = [];
    LogMonitorButtonComponent.propDecorators = {
        'disabled': [{ type: _angular_core.HostBinding, args: ['class.disabled',] }, { type: _angular_core.Input },],
        'action': [{ type: _angular_core.Output },],
        'handleAction': [{ type: _angular_core.HostListener, args: ['click', ['$event'],] },],
    };
    return LogMonitorButtonComponent;
}());

var LogMonitorEntryComponent = (function () {
    function LogMonitorEntryComponent() {
        this.expandEntries = false;
        this.disabled = false;
        this.toggle = new _angular_core.EventEmitter();
    }
    Object.defineProperty(LogMonitorEntryComponent.prototype, "item", {
        get: function () {
            return this._item;
        },
        set: function (value) {
            this._item = value;
            this.stateActionPair = {
                state: value.state,
                action: value.action
            };
        },
        enumerable: true,
        configurable: true
    });
    LogMonitorEntryComponent.prototype.handleToggle = function () {
        if (!this.disabled) {
            this.toggle.next({ id: this.item.actionId });
        }
    };
    LogMonitorEntryComponent.prototype.logPayload = function () {
        console.log(this.item.action);
    };
    LogMonitorEntryComponent.prototype.logState = function () {
        console.log(this.item.state);
    };
    LogMonitorEntryComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'log-monitor-entry',
                    template: "\n    <div class=\"title-bar\" [ngClass]=\"{ collapsed: item.collapsed }\" (click)=\"handleToggle()\">\n      {{ item.action.type }}\n    </div>\n    <div class=\"action-bar\" *ngIf=\"!item.collapsed\">\n      <ngrx-json-tree [value]=\"stateActionPair\" [expanded]=\"expandEntries\"></ngrx-json-tree>\n    </div>\n  ",
                    styles: ["\n    :host{\n      color: #FFFFFF;\n      background-color: #4F5A65;\n      cursor: pointer;\n    }\n    .title-bar{\n      padding: 8px 0 7px 16px;\n      background-color: rgba(0,0,0,0.1);\n    }\n    .action-bar{\n      padding: 20px;\n    }\n    .collapsed{\n      text-decoration: line-through;\n      font-style: italic;\n      opacity: 0.5;\n    }\n  "]
                },] },
    ];
    /** @nocollapse */
    LogMonitorEntryComponent.ctorParameters = [];
    LogMonitorEntryComponent.propDecorators = {
        'expandEntries': [{ type: _angular_core.Input },],
        'disabled': [{ type: _angular_core.Input },],
        'item': [{ type: _angular_core.Input },],
        'toggle': [{ type: _angular_core.Output },],
    };
    return LogMonitorEntryComponent;
}());

var LogMonitorModule = (function () {
    function LogMonitorModule() {
    }
    LogMonitorModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule,
                        JsonTreeModule
                    ],
                    declarations: [
                        LogMonitorComponent,
                        LogMonitorButtonComponent,
                        LogMonitorEntryComponent
                    ],
                    exports: [
                        LogMonitorComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    LogMonitorModule.ctorParameters = [];
    return LogMonitorModule;
}());

var StoreLogMonitorComponent = (function () {
    function StoreLogMonitorComponent() {
        this.toggleCommand = 'ctrl-h';
        this.positionCommand = 'ctrl-m';
        this.expandEntries = false;
    }
    StoreLogMonitorComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ngrx-store-log-monitor',
                    template: "\n    <dock-monitor [toggleCommand]=\"toggleCommand\" [positionCommand]=\"positionCommand\">\n      <log-monitor [expandEntries]=\"expandEntries\"></log-monitor>\n    </dock-monitor>\n  "
                },] },
    ];
    /** @nocollapse */
    StoreLogMonitorComponent.ctorParameters = [];
    StoreLogMonitorComponent.propDecorators = {
        'toggleCommand': [{ type: _angular_core.Input },],
        'positionCommand': [{ type: _angular_core.Input },],
        'expandEntries': [{ type: _angular_core.Input },],
    };
    return StoreLogMonitorComponent;
}());

var StoreLogMonitorModule = (function () {
    function StoreLogMonitorModule() {
    }
    StoreLogMonitorModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule,
                        DockMonitorModule,
                        LogMonitorModule
                    ],
                    declarations: [
                        StoreLogMonitorComponent
                    ],
                    exports: [
                        StoreLogMonitorComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    StoreLogMonitorModule.ctorParameters = [];
    return StoreLogMonitorModule;
}());

exports.StoreLogMonitorModule = StoreLogMonitorModule;
exports.useLogMonitor = useDockMonitor;

Object.defineProperty(exports, '__esModule', { value: true });

})));