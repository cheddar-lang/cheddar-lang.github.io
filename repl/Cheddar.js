(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _scope = require('../interpreter/core/env/scope');

var _scope2 = _interopRequireDefault(_scope);

var _nil = require('../interpreter/core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _exec = require('../interpreter/exec');

var _exec2 = _interopRequireDefault(_exec);

var _tok = require('../tokenizer/tok');

var _tok2 = _interopRequireDefault(_tok);

var _caret = require('../helpers/caret');

var _caret2 = _interopRequireDefault(_caret);

var _stdlib = require('../stdlib/stdlib');

var _stdlib2 = _interopRequireDefault(_stdlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var USI = 0;

var CONSTANT = { Writeable: false };
var GLOBAL_SCOPE = new _scope2.default(null);
GLOBAL_SCOPE.Scope = _stdlib2.default;
var windw = Function('return this')();
windw.Chedz = function input(STDIN) {

	if (STDIN === 'exit') return;
	if (STDIN === 'help') {/* Helpful text */}

	var Tokenizer = new _tok2.default(STDIN, 0);
	var Result = Tokenizer.exec();

	if (!(Result instanceof _tok2.default)) {
		// Draw error pointer
		console.log((0, _caret2.default)(STDIN, Tokenizer.Index, true));
	}

	var Executor = new _exec2.default(Result, GLOBAL_SCOPE);
	var Output = Executor.exec();

	if (Output) {

		if (typeof Output === "string") {
			throw new Error(Output, "Error");
		} else if (Output instanceof _nil2.default) {
			// do nothing?
		} else if (!Output) {
			console.log(Output);
		} else if (Output.constructor.Name === "String") {
			console.log('"' + Output.value + '"', '', 'magenta');
		} else if (Output && Output.constructor.Cast && Output.constructor.Cast.has('String')) {
			console.log('' + Output.constructor.Cast.get('String')(Output).value, '', 'magenta');
		} else if (Output instanceof _scope2.default) {
			console.log('< Instance of "' + Output.constructor.Name + '" >', '', 'orange');
		} else if (Output.prototype instanceof _scope2.default) {
			console.log('< Class "' + Output.Name + '" >', '', 'orange');
		} else if ((typeof Output === 'undefined' ? 'undefined' : _typeof(Output)) === "symbol") {
			console.log(Output.toString(), '', 'red');
		} else {
			console.log('< Unprintable object of class "' + Output.constructor.name.magenta + '" with literal value ' + Output.magenta + ' >', '', 'orange');
		}
	}
};

},{"../helpers/caret":2,"../interpreter/core/consts/nil":9,"../interpreter/core/env/scope":13,"../interpreter/exec":31,"../stdlib/stdlib":75,"../tokenizer/tok":105,"colors":121,"readline":108}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = caret;

var _loc = require('./loc');

var _loc2 = _interopRequireDefault(_loc);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HIGHLIGHT = function HIGHLIGHT(str, highlight) {
    return highlight ? str.yellow : str;
};

var FORMAT_LINE = function FORMAT_LINE(lines, highlight, start) {
    return lines.map(function (ln, i) {
        return HIGHLIGHT(" ".repeat((lines.length + start + 1).toString().length - (i + start + 1).toString().length) + (i + start + 1) + ' |', highlight) + ' ' + ln;
    });
};

function caret(Code, Index, highlight) {
    var _HelperLoc = (0, _loc2.default)(Code, Index);

    var _HelperLoc2 = _slicedToArray(_HelperLoc, 2);

    var line = _HelperLoc2[0];
    var col = _HelperLoc2[1];

    var lines = Code.split(/\r?\n/);

    var start = Math.max(0, line - 1);
    var end = Math.min(lines.length, line + 1);

    lines = FORMAT_LINE(lines.slice(start, end), highlight, start);
    lines.splice(start + 1, 0, HIGHLIGHT(" ".repeat((lines.length + 1).toString().length + 1) + "|", highlight) + " ".repeat(col + 1) + HIGHLIGHT("^", highlight));

    return lines.join("\n");
}
module.exports = exports['default'];

},{"./loc":4,"colors":121}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = HelperInit;
// Given a class, construct it given arguments
function HelperInit(Class) {
    var A = new Class(null, null),
        B = void 0;

    for (var _len = arguments.length, Args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        Args[_key - 1] = arguments[_key];
    }

    if ((B = A.init.apply(A, Args)) === true) {
        return A;
    } else {
        return B;
    }
}
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = HelperLocateIndex;
// Locates an Column:Row given an index

function HelperLocateIndex(Code, Index) {
    var num = 1; // Line #
    var last = 0; // Last newline
    var i = 0;
    for (; i <= Index; i++) {
        if (Code[i] === "\n") {
            num++;last = i;
        } else if (i === Index) return [num, i - last, i];
    }return [num, i - last, i];
}
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _String = require('../primitives/String');

var _String2 = _interopRequireDefault(_String);

var _Number = require('../primitives/Number');

var _Number2 = _interopRequireDefault(_Number);

var _Array = require('../primitives/Array');

var _Array2 = _interopRequireDefault(_Array);

var _Bool = require('../primitives/Bool');

var _Bool2 = _interopRequireDefault(_Bool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([[_String2.default, 'String'], [_Number2.default, 'Number'], [_Array2.default, 'Array'], [_Bool2.default, 'Bool']]);
module.exports = exports['default'];

},{"../primitives/Array":18,"../primitives/Bool":19,"../primitives/Number":20,"../primitives/String":21}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EVALUATED_LINKS = exports.PRIMITIVE_LINKS = undefined;

var _String = require('../primitives/String');

var _String2 = _interopRequireDefault(_String);

var _Number = require('../primitives/Number');

var _Number2 = _interopRequireDefault(_Number);

var _Array = require('../primitives/Array');

var _Array2 = _interopRequireDefault(_Array);

var _Bool = require('../primitives/Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _nil = require('../consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _func = require('../env/func');

var _func2 = _interopRequireDefault(_func);

var _fop = require('../evaluated/fop');

var _fop2 = _interopRequireDefault(_fop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PRIMITIVE_LINKS = exports.PRIMITIVE_LINKS = new Map([["CheddarBooleanToken", _Bool2.default], ["CheddarNilToken", _nil2.default], ["CheddarStringToken", _String2.default], ["CheddarNumberToken", _Number2.default], ["CheddarArrayToken", _Array2.default], ["CheddarFunctionToken", _func2.default]]);

var EVALUATED_LINKS = exports.EVALUATED_LINKS = new Map([["CheddarFunctionizedOperatorToken", _fop2.default]]);

},{"../consts/nil":9,"../env/func":12,"../evaluated/fop":17,"../primitives/Array":18,"../primitives/Bool":19,"../primitives/Number":20,"../primitives/String":21}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Runtime Errors
exports.default = {
    KEY_NOT_FOUND: Symbol('KEY_NOT_FOUND'),
    KEY_IS_RESERVED: Symbol('KEY_IS_RESERVED'),

    NO_OP_BEHAVIOR: Symbol('NO_OP_BEHAVIOR'),
    NOT_A_REFERENCE: Symbol('NOT_A_REFERENCE'),
    CANNOT_READ_PROP: Symbol('CANNOT_READ_PROP'),

    CAST_FAILED: Symbol('CAST_FAILED'),
    NOT_A_CLASS: Symbol('NOT_A_CLASS'),

    UNLINKED_CLASS: Symbol('UNLINKED_CLASS'),
    MALFORMED_TOKEN: Symbol('MALFORMED_TOKEN'),

    ABSTRACT_USED: Symbol('ABSTRACT_USED')
};
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require("./err");

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([[_err2.default.KEY_NOT_FOUND, "Attempted to access undefined variable `$0`"], [_err2.default.KEY_IS_RESERVED, "Attempted to access reserved keyword $0"], [_err2.default.NO_OP_BEHAVIOR, "`$0` has no behavior for types `$2` and `$1`"], [_err2.default.NOT_A_REFERENCE, "Left side of assignment is not a reference"], [_err2.default.CANNOT_READ_PROP, "Cannot read property `$0` of nil (`$1`)"], [_err2.default.UNLINKED_CLASS, "InternalError: Token `$0` has no link."], [_err2.default.MALFORMED_TOKEN, "InternalError: Recieved a malformed token at callstack ref. $0"], [_err2.default.ABSTRACT_USED, "InternalError: Attempted to construct an abstract interface"]]);
module.exports = exports['default'];

},{"./err":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _init = require('../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NIL = function (_CheddarClass) {
    _inherits(NIL, _CheddarClass);

    function NIL() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, NIL);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(NIL)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.init = function () {
            return true;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return NIL;
}(_class2.default);

NIL.Name = "nil";
NIL.Cast = new Map([].concat(_toConsumableArray(_class2.default.Operator), [['String', function () {
    return (0, _init2.default)(require('../primitives/String'), "nil");
}, 'Bool', function () {
    return (0, _init2.default)(require('../primitives/Bool'), false);
}]]));
exports.default = NIL;
module.exports = exports['default'];

},{"../../../helpers/init":3,"../env/class":10,"../primitives/Bool":19,"../primitives/String":21}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scope = require('./scope');

var _scope2 = _interopRequireDefault(_scope);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _defaults = require('./defaults');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // == CheddarClass ==
// The Cheddar Class is a critical component in
//  Cheddar execution. All literals either are
//  constructed upon an internal or external
//  classes.
// The class layer provides a custom set of
//  all functions to provide a distinct level
//  of abstraction throughout the interpreter

// == Info ==
// The classes implementation is designed to
//  provide a significant level of abstraction
//  as stated before
// Various parts to interface with operators
//  and scopes are added through seperate
//  classes.

// == Proccess ==
// A classes construction is illustration in the
//  following diagram:
//
//               Class
//    ____________|______________
//    |           |             |
//  args        main()       instance
//           _____|________
//           |    |       |
//        scope main()  return
//
// Within the constructor. The class stores an
//  internal scope as itself is an extention of
//  CheddarScope. Built-ins are merged through
//  main() whether implicit or explicit.

var CheddarClass = function (_CheddarScope) {
    _inherits(CheddarClass, _CheddarScope);

    // TODO: Write some superflicious and redundant
    //  explanation elaborating on the abstract
    //  nature of this particulator subject of matter
    //  being discussed.


    // Define operators. Each item in the
    //  hash-map, defines behavior for the
    //  specific token in an OperatorToken
    // Operators:HashMap<Token, Behavior(LHS, RHS)>
    // Unary operators will RHS explicitly be
    //  an unabstrated, native, `null` value
    //  which will require an interface in order
    //  for a Cheddar unary operator interface

    function CheddarClass() {
        var Scope = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var Reference = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, CheddarClass);

        // CheddarClass serves as an interface
        //  for higher-level classes.

        // Provide scope construction interface

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarClass).call(this));

        _this.scope = Scope;
        _this.Reference = Reference;
        return _this;
    }

    // Initialize class
    // This method is to be overloaded
    //  and provide an simple interface
    //  in which details can be passed to
    //  the interpreter while data of the
    //  class itself can remain sandboxed


    _createClass(CheddarClass, [{
        key: 'init',
        value: function init() {

            // This abstract interface should never
            //  be constructed.
            return CheddarError.ABSTRACT_USED;
        }
    }]);

    return CheddarClass;
}(_scope2.default);

CheddarClass.Name = "Class";
CheddarClass.Operator = _defaults.DEFAULT_OP;
CheddarClass.Cast = _defaults.DEFAULT_CAST;
exports.default = CheddarClass;
module.exports = exports['default'];

},{"../consts/err":7,"./defaults":11,"./scope":13}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_CAST = exports.DEFAULT_OP = exports.IS_CLASS = undefined;

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

var _init = require('../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Request dependencies for
//  preset casing for operator
//  handling
var IS_CLASS = exports.IS_CLASS = Symbol("IS_CLASS");
var DEFAULT_OP = exports.DEFAULT_OP = new Map([

// print: Definition
['print', function (_, LHS) {
    if (!LHS || !LHS.constructor.Cast) return _err2.default.NO_OP_BEHAVIOR;

    // Attempt to call `repr`, else, cast to string
    var VAL = LHS.constructor.Name === 'String' ? LHS : LHS.constructor.Cast.has('String') ? LHS.constructor.Cast.get('String')(LHS) : LHS.constructor.Operator.has('repr') ? LHS.constructor.Operator.get('repr')(null, LHS) : LHS;

    // Stream
    if (VAL.constructor.Name === 'String') console.log(VAL.value);else return _err2.default.NO_OP_BEHAVIOR;

    return LHS;
}], ['::', function (LHS, RHS) {
    var CheddarClass = require('./class');
    var CAST_ALIAS = require('../config/alias');

    if (!(LHS.prototype instanceof CheddarClass)) {
        // ERROR INTEGRATE
        return 'Cast target must be class';
    }

    if (RHS.constructor === LHS) return RHS;

    var res = void 0;
    if (res = RHS.constructor.Cast.get(LHS.Name) || RHS.constructor.Cast.get(LHS) || RHS.constructor.Cast.get(CAST_ALIAS.get(LHS))) {
        return res(RHS);
    } else {
        return 'Cannot cast to given target `' + (LHS.Name || "object") + '`';
    }
}], ['==', function (LHS, RHS) {
    return (0, _init2.default)(require("../primitives/Bool"), RHS && LHS instanceof RHS.constructor && LHS.value === RHS.value);
}], ['!=', function (LHS, RHS) {
    return (0, _init2.default)(require("../primitives/Bool"), RHS && LHS instanceof RHS.constructor && LHS.value !== RHS.value);
}],

// Defaults
['!', function (LHS, RHS) {
    if (LHS === null && RHS && RHS.constructor.Cast && RHS.constructor.Cast.has('Bool')) return (0, _init2.default)(require("../primitives/Bool"), !RHS.constructor.Cast.get('Bool')(RHS).value);else return _err2.default.NO_OP_BEHAVIOR;
}]]);

var DEFAULT_CAST = exports.DEFAULT_CAST = new Map([['Bool', function (self) {
    self;
}]]);

},{"../../../helpers/init":3,"../config/alias":5,"../consts/err":7,"../primitives/Bool":19,"./class":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _var = require('./var');

var _var2 = _interopRequireDefault(_var);

var _scope = require('./scope');

var _scope2 = _interopRequireDefault(_scope);

var _class = require('./class');

var _class2 = _interopRequireDefault(_class);

var _nil = require('../primitives/nil');

var _nil2 = _interopRequireDefault(_nil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// I have the details, planing, structure,
// and design of functions all on my
// whiteboard. I'll copy it here later

var CheddarFunction = function (_CheddarClass) {
    _inherits(CheddarFunction, _CheddarClass);

    function CheddarFunction(args, body) {
        var preset = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, CheddarFunction);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarFunction).call(this));

        _this.args = args;
        _this.body = body;
        _this.preset = preset;

        // TODO: Redo optimizations lost due to git
        _this.cache = {};
        return _this;
    }

    // Initalizes from primitive arguments


    _createClass(CheddarFunction, [{
        key: 'init',
        value: function init(args, body) {
            if (!body) {
                body = args;
                args = [];
            } else {
                args = args._Tokens.map(function (argument) {
                    // Argument is a arg object
                    var props = {};
                    var name = void 0;

                    // Store the argument tokens
                    var args = argument._Tokens;
                    var nameargs = args[0]._Tokens;

                    props.Optional = args[1] === '?';
                    props.Default = args[2] || args[1] && args[1].constructor.name === "CheddarExpressionToken" && args[1];

                    props.Type = nameargs.length > 1 && nameargs[0];

                    name = (nameargs[1] || nameargs[0])._Tokens[0];

                    return [name, props];
                });
            }

            // Move the scope argument to correct prop
            this.preset = this.args;
            this.inherited = this.args;
            this.Reference = this.body;

            this.args = args;
            this.body = body;

            return true;
        }
    }, {
        key: 'exec',
        value: function exec(input, self) {
            var scope = this.generateScope(input, self);

            if (!(scope instanceof _scope2.default)) return scope;

            var tmp = void 0;
            if (typeof this.body === 'function') {
                return this.body(scope, function (name) {
                    return (tmp = scope.accessor(name)) && tmp.Value;
                });
            } else {
                var executor = require(this.body.constructor.name === "StatementExpression" ? '../eval/eval' : '../../exec');

                var res = new executor(this.body.constructor.name === "StatementExpression" ? this.body : this.body._Tokens[0], scope).exec();

                return res;
            }
        }
    }, {
        key: 'generateScope',
        value: function generateScope(input, self) {
            var args = new _scope2.default(this.inherited || null);

            var CheddarArray = require('../primitives/Array');
            var tmp = void 0;

            if (self) args.setter("self", new _var2.default(self, {
                Writeable: false
            }));

            for (var i = 0; i < this.args.length; i++) {
                tmp = this.args[i][1];
                if (tmp.Splat === true) {
                    var splat = new CheddarArray();
                    splat.init.apply(splat, _toConsumableArray(input.slice(i)));

                    args.setter(this.args[i][0], new _var2.default(splat));

                    break;
                } else if (input[i]) {
                    args.setter(this.args[i][0], new _var2.default(input[i]));
                } else {
                    if (tmp.Optional === true) {
                        args.setter(this.args[i][0], new _var2.default(new _nil2.default()));
                    } else if (tmp.Default) {
                        args.setter(this.args[i][0], new _var2.default(tmp.Default));
                    } else {
                        return 'Missing argument for ' + this.args[i][0];
                    }
                }
            }

            return args;
        }
    }]);

    return CheddarFunction;
}(_class2.default);

CheddarFunction.Name = "Function";
exports.default = CheddarFunction;
module.exports = exports['default'];

},{"../primitives/Array":18,"../primitives/nil":26,"./class":10,"./scope":13,"./var":14}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Basic idea of the Execution Enviorments:
//
//  ExecutionEnviorment
//    |    ^
//    |- Sandboxed Enviorment
//    |    |- Crossdepedent scoping
//    |    |    ^
//    |    v    | - Inheritence Chain
//    |- Scope  v
//    |   |- Inheritence
//    |- Preset data

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _ops = require('../../../tokenizer/consts/ops');

var _var = require('./var');

var _var2 = _interopRequireDefault(_var);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarScope = function () {
    function CheddarScope() {
        var inherit = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        _classCallCheck(this, CheddarScope);

        // Global scope
        // Make sure to move preset items
        // Avoid duplicating scopes
        //  by providing a loopup within
        //  a seperate hash which is linked
        //  by overriding a properties get
        this.inheritanceChain = inherit;
    }

    // STATIC


    _createClass(CheddarScope, [{
        key: 'has',


        // DYNAMIC
        value: function has(token) {
            return _ops.RESERVED_KEYWORDS.has(token) ? false : this.Scope.has(token) || this.inheritanceChain && this.inheritanceChain.has(token);
        }
    }, {
        key: 'manage',
        value: function manage(token, value) {
            if (this.inheritanceChain && this.inheritanceChain.has(token)) {
                // It's in the inheritance chain
                // just use the parent's function
                return this.inheritanceChain.manage(token, value);
            } else {
                if (_ops.RESERVED_KEYWORDS.has(token)) {
                    return CheddarError.KEY_IS_RESERVED;
                } else {
                    this.setter(token, value);
                    return true;
                }
            }
        }

        // Property accessors

    }, {
        key: 'accessor',
        value: function accessor(token) {
            if (!this.has(token)) return null;

            var value = this.Scope.get(token) || (this.inheritanceChain ? this.inheritanceChain.accessor(token) : null);

            if (value && value.Value) {
                value.Value.Reference = token;
                value.Value.scope = this;
            }

            return value;
        }
    }, {
        key: 'setter',
        value: function setter(path, _setter) {
            this.Scope.set(path, _setter);
        }
    }], [{
        key: 'has',
        value: function has(token) {
            return !_ops.RESERVED_KEYWORDS.has(token) & this.Scope.has(token);
        }
    }, {
        key: 'manage',
        value: function manage(token, value) {
            if (_ops.RESERVED_KEYWORDS.has(token)) {
                return CheddarError.KEY_IS_RESERVED;
            } else {
                return this.setter(token, value), token;
            }
        }
    }, {
        key: 'setter',
        value: function setter(token, value) {
            this.Scope.set(token, value);
        }
    }, {
        key: 'accessor',
        value: function accessor(token) {
            var value = this.Scope.get(token);
            if (value && value.Value) {
                value.Value.Reference = token;
                value.Value.scope = this;
            }
            return value;
        }
    }]);

    return CheddarScope;
}();

CheddarScope.Name = "Namespace";
CheddarScope.Scope = new Map();
exports.default = CheddarScope;


CheddarScope.prototype.Scope = new Map();
module.exports = exports['default'];

},{"../../../tokenizer/consts/ops":79,"../consts/err":7,"./var":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Cheddar variable class
// simply provides a struct
//  for properties and to
//  store variable data
//
// typedef struct {
//     Any : Value
//     Bool: Writeable
// } CheddarVariable

var CheddarVariable = function () {
    function CheddarVariable(Value) {
        var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var _ref$Writeable = _ref.Writeable;
        var Writeable = _ref$Writeable === undefined ? true : _ref$Writeable;
        var _ref$StrictType = _ref.StrictType;
        var StrictType = _ref$StrictType === undefined ? null : _ref$StrictType;
        var _ref$getter = _ref.getter;
        var getter = _ref$getter === undefined ? null : _ref$getter;
        var _ref$setter = _ref.setter;
        var setter = _ref$setter === undefined ? null : _ref$setter;

        _classCallCheck(this, CheddarVariable);

        this.Value = Value;

        this.Writeable = Writeable;
        this.StrictType = StrictType;

        this.getter = getter;
        this.setter = setter;
    }

    _createClass(CheddarVariable, [{
        key: "Mutate",
        value: function Mutate(nval) {
            if (this.Writeable) this.Value = nval;
        }
    }]);

    return CheddarVariable;
}();

exports.default = CheddarVariable;
module.exports = exports['default'];

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scope = require('../env/scope');

var _scope2 = _interopRequireDefault(_scope);

var _shunting_yard = require('../../../tokenizer/tok/shunting_yard');

var _shunting_yard2 = _interopRequireDefault(_shunting_yard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarCallStack = function () {
    function CheddarCallStack(exec_instruct) {
        var scope = arguments.length <= 1 || arguments[1] === undefined ? new _scope2.default() : arguments[1];

        _classCallCheck(this, CheddarCallStack);

        this.InStack = new _shunting_yard2.default().exec(exec_instruct._Tokens[0])._Tokens;

        this.CallStack = [];
        this.Scope = scope;

        this._csi = 0; // Call-stack Index
    }

    _createClass(CheddarCallStack, [{
        key: 'put',
        value: function put(n) {
            return this.CallStack.unshift(n);
        }
    }, {
        key: 'shift',
        value: function shift() {
            return this.CallStack.shift();
        }
    }, {
        key: 'next',
        value: function next() {
            return this.InStack[this._csi++];
        }
    }, {
        key: 'close',
        value: function close() {
            return this.CallStack[this.CallStack.length - 1];
        }
    }, {
        key: 'stack',
        get: function get() {
            return this.CallStack;
        }
    }]);

    return CheddarCallStack;
}();

exports.default = CheddarCallStack;
module.exports = exports['default'];

},{"../../../tokenizer/tok/shunting_yard":107,"../env/scope":13}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _link = require('../config/link');

var _ops = require('../../../tokenizer/consts/ops');

var _property = require('../../../tokenizer/parsers/property');

var _property2 = _interopRequireDefault(_property);

var _literal = require('../../../tokenizer/literals/literal');

var _literal2 = _interopRequireDefault(_literal);

var _paren_expr = require('../../../tokenizer/parsers/paren_expr');

var _paren_expr2 = _interopRequireDefault(_paren_expr);

var _op = require('../../../tokenizer/literals/op');

var _op2 = _interopRequireDefault(_op);

var _array = require('../../../tokenizer/parsers/array');

var _array2 = _interopRequireDefault(_array);

var _var = require('../../../tokenizer/literals/var');

var _var2 = _interopRequireDefault(_var);

var _scope = require('../env/scope');

var _scope2 = _interopRequireDefault(_scope);

var _func = require('../env/func');

var _func2 = _interopRequireDefault(_func);

var _var3 = require('../env/var');

var _var4 = _interopRequireDefault(_var3);

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _nil = require('../consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _callstack = require('./callstack');

var _callstack2 = _interopRequireDefault(_callstack);

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

var _err_msg = require('../consts/err_msg');

var _err_msg2 = _interopRequireDefault(_err_msg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // == Evaluates Expressions ==
// Perhaps add config item to specify optimizations
// This first version will be a preliminary test
//  and won't have very many features
// Class operators and tokens  will be abstracted so
//  changed to `class` won't be deterimental to the
//  existing code.
// This will also allow classes to be forged for testing

// == Info ==
// config:link contains class linktage to
//  primitives, which functions as a basic
//  abstraction layer between the expression
//  parser and the tokenizer.
//   The CheddarClass itself provides   a
//   more thougrough abstraction between
//   the tokenizer and the rest of the code
//   itself

// Primitive <-> Class Links


// Reference tokens


// Call stack wrapper


// Standard Error class


function to_value(variable, parent) {
    // Check if getter
    if (variable.Value) {
        return variable.Value;
    } else if (variable.getter) {
        return variable.getter.exec([], parent);
    } else {
        // ERROR INTEGRATE
        return 'Attempted to accesses variable without value';
    }
}

function set_value(value, child) {
    // The CheddarVariable() wrapping the value
    var variable = value.scope.accessor(value.Reference);

    // If the result is being set to a variable
    if (child instanceof _var4.default) {
        child = child.Value; // extract it's literal value
    }

    // If there's a setter
    if (variable.setter !== null) {
        // Run the setter.
        // Pass the target value (child) as an arg
        // Run in context of value (`self`)
        child = variable.setter.exec([child], value);
    }

    // Set the correct reference on the scope
    child.scope = value.scope;
    child.Reference = value.Reference;

    // Get the scope the LHS is in.
    var rep = value.scope.manage(
    // Change the var name
    value.Reference,
    // to the resulting value
    new _var4.default(child, {
        Writeable: true,
        StrictType: variable.StrictType
    }));

    if (rep !== true) {
        // ERROR INTEGRATE
        return '`' + value.Reference + '` is a reserved keyword';
    }

    return true;
}

var CheddarEval = function (_CheddarCallStack) {
    _inherits(CheddarEval, _CheddarCallStack);

    function CheddarEval() {
        _classCallCheck(this, CheddarEval);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarEval).apply(this, arguments));
    }

    _createClass(CheddarEval, [{
        key: 'step',

        // To iterativaley evaluate the expression
        //  individual repeated steps would be taken
        //  which would also allow the debugger to
        //  function on the same foundation
        value: function step() {
            var Operation = this.next();

            var OPERATOR = void 0,
                TOKEN = void 0,
                DATA = void 0,
                NAME = void 0,
                TARGET = void 0,
                REFERENCE = null;

            // Handle Operator
            if (Operation instanceof _op2.default) {

                var SETSELF = false; // If the operator is a self-asignning operator

                TOKEN = this.shift(); // Get the value to operate upon

                // SPECIAL BEHAVIOR FOR REsASSIGNMENT
                if (Operation.tok(0) === "=") {
                    DATA = this.shift();

                    if (!(DATA.scope instanceof _scope2.default) || DATA.Reference === null || Operation.tok(1) === _ops.TYPE.UNARY) {
                        return _err_msg2.default.get(_err2.default.NOT_A_REFERENCE);
                    }

                    if (DATA.scope.accessor(DATA.Reference).Writeable === false) {
                        // ERROR INTEGRATE
                        return 'Cannot override constant ' + DATA.Reference;
                    }

                    // Call `set_value` function
                    DATA = set_value(DATA, TOKEN);

                    // If it errored
                    if (DATA !== true) {
                        return DATA;
                    }

                    OPERATOR = TOKEN;
                } else if (Operation.Tokens[1] === _ops.TYPE.UNARY) {
                    NAME = TOKEN.constructor.Operator || TOKEN.Operator;
                    // It is an Unary operator use TOKEN as RHS, null as LHS
                    if (NAME.has(Operation.Tokens[0])) {
                        OPERATOR = NAME.get(Operation.Tokens[0])(null, TOKEN);
                    } else {
                        OPERATOR = _err2.default.NO_OP_BEHAVIOR;
                    }
                } else {
                    // Binary operator. DATA is LHS, TOKEN is RHS
                    DATA = this.shift(); // Get the other arg

                    NAME = DATA.constructor.Operator || DATA.Operator;

                    TARGET = Operation.Tokens[0]; // The operator

                    // Set LHS to LHS * RHS

                    // if it ends with `=`, given `a *= b` do `a = a * b`
                    // given if the above is true, set the `SETSELF` to true
                    if (TARGET.endsWith('=') && !_ops.EXCLUDE_META_ASSIGNMENT.has(TARGET)) {
                        SETSELF = true;
                        TARGET = TARGET.slice(0, -1);
                    }

                    if (NAME.has(TARGET)) {
                        OPERATOR = NAME.get(TARGET)(DATA, TOKEN);
                    } else {
                        OPERATOR = _err2.default.NO_OP_BEHAVIOR;
                    }
                }

                if (OPERATOR === _err2.default.NO_OP_BEHAVIOR) {
                    return _err_msg2.default.get(OPERATOR).replace(/\$0/g, Operation.Tokens[0]).replace(/\$1/g, TOKEN ? TOKEN.constructor.Name || (TOKEN.prototype instanceof _class2.default ? "Class" : "nil") : "nil").replace(/\$2/g, DATA ? DATA.constructor.Name || (DATA.prototype instanceof _class2.default ? "Class" : "nil") : "nil");
                } else if (typeof OPERATOR === 'string') {
                    return OPERATOR;
                } else {
                    // Perform re-assignment
                    if (SETSELF) {
                        // DATA, TOKEN
                        if (!(DATA.scope instanceof _scope2.default) || DATA.Reference === null || Operation.tok(1) === _ops.TYPE.UNARY) {
                            return _err_msg2.default.get(_err2.default.NOT_A_REFERENCE);
                        }

                        if (DATA.scope.accessor(DATA.Reference).Writeable === false) {
                            // ERROR INTEGRATE
                            return 'Cannot override constant ' + DATA.Reference;
                        }

                        // Call `set_value` function
                        DATA = set_value(DATA, OPERATOR);

                        // If it errored
                        if (DATA !== true) {
                            return DATA;
                        }
                    }

                    this.put(OPERATOR);
                }
            } else if (Operation instanceof _property2.default || Operation instanceof _literal2.default) {
                // If it's a property
                //  this includes functions

                // Is a primitive
                // this includes `"foo".bar`
                if (Operation._Tokens[0] instanceof _literal2.default || Operation instanceof _literal2.default) {

                    if (Operation instanceof _literal2.default) {
                        TOKEN = Operation;
                    } else {
                        // Get the token's value
                        TOKEN = Operation._Tokens[0]._Tokens[0];
                    }

                    // Get the class associated with the token
                    if (OPERATOR = _link.PRIMITIVE_LINKS.get(TOKEN.constructor.name)) {
                        var _OPERATOR;

                        // Set the name to be used in errors
                        NAME = OPERATOR.Name || "object";

                        OPERATOR = new OPERATOR(this.Scope);

                        if ((TOKEN = (_OPERATOR = OPERATOR).init.apply(_OPERATOR, _toConsumableArray(TOKEN.Tokens))) !== true) {
                            return TOKEN;
                        }

                        // Exit if it's a raw literal
                        if (Operation instanceof _literal2.default) {
                            this.put(OPERATOR);
                            return true;
                        }
                    } else if (OPERATOR = _link.EVALUATED_LINKS.get(TOKEN.constructor.name)) {
                        OPERATOR = OPERATOR.apply(undefined, _toConsumableArray(TOKEN.Tokens));
                    } else {
                        return _err2.default.UNLINKED_CLASS;
                    }
                } else if (Operation._Tokens[0] instanceof _paren_expr2.default) {
                    // Evaluate
                    OPERATOR = new CheddarEval(Operation._Tokens[0], this.Scope);

                    OPERATOR = OPERATOR.exec();

                    if (typeof OPERATOR === "string") {
                        return OPERATOR;
                    }

                    NAME = OPERATOR.constructor.Name || OPERATOR.Name || "object";
                } else if (Operation._Tokens[0] instanceof _var2.default) {
                    // Lookup variable -> initial variable name
                    OPERATOR = this.Scope.accessor(Operation._Tokens[0]._Tokens[0]);

                    // Set the name to be used in errors, extracted from token
                    NAME = Operation._Tokens[0]._Tokens[0];
                    if (!OPERATOR || OPERATOR === _err2.default.KEY_NOT_FOUND) {
                        return _err_msg2.default.get(_err2.default.KEY_NOT_FOUND).replace('$0', NAME);
                    }

                    OPERATOR = to_value(OPERATOR);
                    if (typeof OPERATOR === "string") return OPERATOR;
                } else {
                    return _err2.default.MALFORMED_TOKEN;
                }

                // Advance variable tree
                for (var i = 1; i < Operation._Tokens.length; i++) {
                    // if it is a function call, call the function
                    // we know this if the marker is a (
                    if (Operation._Tokens[i] === "(") {
                        ++i; // Go to the actual function token

                        if (!(OPERATOR instanceof _func2.default)) {
                            // ERROR INTEGRATE
                            return '`' + NAME + '` is not a function';
                        }

                        DATA = [];

                        // Get the array of args from the token
                        TOKEN = Operation._Tokens[i]._Tokens;
                        var evalres = void 0; // Evaluation result
                        for (var _i = 0; _i < TOKEN.length; _i++) {
                            evalres = new CheddarEval({ _Tokens: [TOKEN[_i]] }, this.Scope);
                            evalres = evalres.exec();
                            if (typeof evalres === "string") {
                                return evalres;
                            } else {
                                DATA.push(evalres);
                            }
                        }

                        OPERATOR = OPERATOR.exec(DATA, REFERENCE);
                    }
                    // if it is a class call, initalize it
                    // we know this if the marker is a {
                    else if (Operation._Tokens[i] === "{") {
                            // Go to the token...
                            ++i;

                            // Make sure it's a class
                            if (!(OPERATOR.prototype instanceof _class2.default)) {
                                // ERROR INTEGRATE
                                return NAME + ' is not a class';
                            }

                            // Create the JS version of it
                            var bg = new OPERATOR(this.Scope // Pass current scope
                            );

                            // Evaluate each argument
                            DATA = []; // Stores the results

                            // Get the array of args from the token
                            TOKEN = Operation._Tokens[i]._Tokens;
                            var _evalres = void 0; // Evaluation result
                            for (var _i2 = 0; _i2 < TOKEN.length; _i2++) {
                                _evalres = new CheddarEval({ _Tokens: [TOKEN[_i2]] }, this.Scope);
                                _evalres = _evalres.exec();
                                if (typeof _evalres === "string") {
                                    return _evalres;
                                } else {
                                    DATA.push(_evalres);
                                }
                            }

                            // Construct the item
                            OPERATOR = bg.init.apply(bg, _toConsumableArray(DATA));

                            // If it's sucessful, set it to the calss
                            if (OPERATOR === true) OPERATOR = bg;
                        } else {
                            if (Operation._Tokens[i] === "[]") {
                                // it is [ ... ]
                                ++i; // Go to expression

                                // Execute the expression
                                var res = new CheddarEval({ _Tokens: [Operation._Tokens[i]] }, this.Scope).exec();

                                // If response is a string, it's errored
                                if (typeof res === "string") {
                                    return res;
                                }

                                // The response should be:
                                //  A) number
                                //  B) string

                                if (res.constructor.Name === "String" || res.constructor.Name === "Number" && Number.isInteger(res.value)) {
                                    TARGET = res.value + "";
                                } else {
                                    return 'Evaluated accessors must evaluate to a string or integer';
                                }
                            } else {
                                TARGET = Operation._Tokens[i]._Tokens[0];
                            }

                            // Else it is a property

                            // Attempt to access the accessor
                            // then use the accessor to get the token
                            if (!OPERATOR.accessor || !(DATA = OPERATOR.accessor(TARGET))) {
                                // ERROR INTEGRATE
                                return NAME + ' has no property ' + TARGET;
                            }

                            NAME = TARGET;

                            // Set the previous item to the REFERENCE
                            REFERENCE = OPERATOR;

                            OPERATOR = to_value(DATA, REFERENCE);

                            if (typeof OPERATOR === "string") return OPERATOR;
                        }
                }

                this.put(OPERATOR);
            } else if (Operation.constructor.name === "CheddarExpressionTernary") {
                var condition = Operation._Tokens[0];
                var if_true = Operation._Tokens[1];
                var if_false = Operation._Tokens[2];

                condition = new CheddarEval({ _Tokens: condition }, this.Scope).exec();

                if (typeof condition === 'string') return condition;

                var condition_result = new (_link.PRIMITIVE_LINKS.get("CheddarBooleanToken"))(this.Scope);

                var to_run = condition_result.init(condition) && condition_result.value === true ? if_true : if_false;

                to_run = new CheddarEval({ _Tokens: [to_run] }, this.Scope).exec();

                if (typeof to_run === 'string') return to_run;

                this.put(to_run);
            } else {
                return "An unhandled token was encountered";
            }

            return true;
        }

        // Evaluate entire call stack
        //  this stepts until the call
        //  stack or `InStack` is empty

    }, {
        key: 'exec',
        value: function exec() {
            var step = void 0;
            while (!!this.InStack[this._csi]) {
                if ((step = this.step()) !== true) return step;
            }return this.close();
        }
    }]);

    return CheddarEval;
}(_callstack2.default);

exports.default = CheddarEval;
module.exports = exports['default'];

},{"../../../tokenizer/consts/ops":79,"../../../tokenizer/literals/literal":83,"../../../tokenizer/literals/op":86,"../../../tokenizer/literals/var":89,"../../../tokenizer/parsers/array":92,"../../../tokenizer/parsers/paren_expr":96,"../../../tokenizer/parsers/property":97,"../config/link":6,"../consts/err":7,"../consts/err_msg":8,"../consts/nil":9,"../env/class":10,"../env/func":12,"../env/scope":13,"../env/var":14,"./callstack":15}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (operator) {
    return new _func2.default([["a", {}], ["b", {}]], function (scope, input) {
        var LHS = input("a");
        var RHS = input("b");

        var resp = void 0; // output / response
        var opfunc = (LHS.constructor.Operator || LHS.Operator).get(operator);

        if (opfunc) {
            resp = opfunc(LHS, RHS);
        } else {
            resp = _err2.default.NO_OP_BEHAVIOR;
        }

        if (resp === _err2.default.NO_OP_BEHAVIOR) {
            return _err_msg2.default.get(resp).replace(/\$0/g, operator).replace(/\$1/g, LHS ? LHS.constructor.Name || (LHS.prototype instanceof _class2.default ? "Class" : "nil") : "nil").replace(/\$2/g, RHS ? RHS.constructor.Name || (RHS.prototype instanceof _class2.default ? "Class" : "nil") : "nil");
        } else {
            return resp;
        }
    });
};

var _func = require('../env/func');

var _func2 = _interopRequireDefault(_func);

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _err_msg = require('../consts/err_msg');

var _err_msg2 = _interopRequireDefault(_err_msg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

},{"../consts/err":7,"../consts/err_msg":8,"../env/class":10,"../env/func":12}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _var = require('../env/var');

var _var2 = _interopRequireDefault(_var);

var _nil = require('../consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _err = require('../consts/err');

var _array = require('./op/array');

var _array2 = _interopRequireDefault(_array);

var _array3 = require('./cast/array');

var _array4 = _interopRequireDefault(_array3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarArray = function (_CheddarClass) {
    _inherits(CheddarArray, _CheddarClass);

    function CheddarArray() {
        _classCallCheck(this, CheddarArray);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarArray).apply(this, arguments));
    }

    _createClass(CheddarArray, [{
        key: 'init',
        value: function init() {
            var CheddarEval = require('../eval/eval');
            this.value = [];

            for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
                items[_key] = arguments[_key];
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i] instanceof _class2.default) {
                    // Is a class
                    this.value.push(items[i]);
                } else if (items[i].constructor.name === "CheddarExpressionToken") {
                    // Is an expression
                    var res = new CheddarEval({ _Tokens: [items[i]] }, this.scope).exec();
                    if (typeof res === "string") {
                        return res;
                    } else if (!res) {
                        if (i && i !== items.length - 1) {
                            this.value.push(new _nil2.default());
                        }
                    } else {
                        this.value.push(res);
                    }
                } else {
                    return _err.MALFORMED_TOKEN;
                }
            }

            return true;
        }

        // TODO: replace with Cheddar generator
        // send a `yield` signal probably

    }, {
        key: 'iterator',
        value: function iterator() {}
    }, {
        key: 'reverse',
        value: function reverse() {
            this.value.reverse();
            return this;
        }
    }, {
        key: 'accessor',


        // Accessor to redirect [n]
        value: function accessor(target) {
            return this.Scope.get(target) || (Number.isInteger(+target) ? new _var2.default(this.value[target] || new _nil2.default()) : null);
        }

        // String is the lowest level class
        //  meaning operators can have directly
        //  defined behavior

    }, {
        key: 'Scope',
        get: function get() {
            return require('../../../stdlib/primitive/Array/lib');
        }
    }]);

    return CheddarArray;
}(_class2.default);

CheddarArray.Name = "Array";
CheddarArray.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_array2.default)));
CheddarArray.Cast = _array4.default;
exports.default = CheddarArray;


CheddarArray.Scope = require('../../../stdlib/primitive/Array/static');
module.exports = exports['default'];

},{"../../../stdlib/primitive/Array/lib":50,"../../../stdlib/primitive/Array/static":63,"../consts/err":7,"../consts/nil":9,"../env/class":10,"../env/var":14,"../eval/eval":16,"./cast/array":22,"./op/array":27}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _bool = require('./op/bool');

var _bool2 = _interopRequireDefault(_bool);

var _bool3 = require('./cast/bool');

var _bool4 = _interopRequireDefault(_bool3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarBool = function (_CheddarClass) {
    _inherits(CheddarBool, _CheddarClass);

    function CheddarBool() {
        _classCallCheck(this, CheddarBool);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarBool).apply(this, arguments));
    }

    _createClass(CheddarBool, [{
        key: 'init',
        value: function init(bool) {

            // Determine false or true
            if (bool) {
                switch (_typeof(bool.value)) {
                    case "string":
                        this.value = bool.value !== "";
                        break;
                    case "number":
                        this.value = bool.value !== 0;
                        break;
                    case "boolean":
                        this.value = bool.value;
                        break;
                    default:
                        if (bool.value instanceof Array) {
                            this.value = bool.value.length > 0;
                        } else {
                            this.value = true;
                        }
                }
            } else {
                this.value = false;
            }

            return true;
        }

        // String is the lowest level class
        //  meaning operators can have directly
        //  defined behavior

    }]);

    return CheddarBool;
}(_class2.default);

CheddarBool.Name = "Boolean";
CheddarBool.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_bool2.default)));
CheddarBool.Cast = _bool4.default;
exports.default = CheddarBool;
module.exports = exports['default'];

},{"../env/class":10,"./cast/bool":23,"./op/bool":28}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _number = require('./op/number');

var _number2 = _interopRequireDefault(_number);

var _number3 = require('./cast/number');

var _number4 = _interopRequireDefault(_number3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarNumber = function (_CheddarClass) {
    _inherits(CheddarNumber, _CheddarClass);

    function CheddarNumber() {
        _classCallCheck(this, CheddarNumber);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarNumber).apply(this, arguments));
    }

    _createClass(CheddarNumber, [{
        key: 'init',
        value: function init(base, bitshift, value) {
            // TODO: Optimize
            if (bitshift) value += "0".repeat(bitshift);

            if (typeof value === "string") {
                var _value$split = value.split(".");

                var _value$split2 = _slicedToArray(_value$split, 2);

                var INT = _value$split2[0];
                var DEC = _value$split2[1];


                if (base !== 10) this.value = DEC ? parseInt(INT, base) + parseInt(DEC, base) / Math.pow(base, DEC.length) : parseInt(value, base);else this.value = +value;
            } else {
                this.value = value;
            }
            return true;
        }

        // String is the lowest level class
        //  meaning operators can have directly
        //  defined behavior

    }]);

    return CheddarNumber;
}(_class2.default);

CheddarNumber.Name = "Number";
CheddarNumber.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_number2.default)));
CheddarNumber.Cast = _number4.default;
exports.default = CheddarNumber;
module.exports = exports['default'];

},{"../env/class":10,"./cast/number":24,"./op/number":29}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _var = require('../env/var');

var _var2 = _interopRequireDefault(_var);

var _nil = require('../consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _string = require('./op/string');

var _string2 = _interopRequireDefault(_string);

var _string3 = require('./cast/string');

var _string4 = _interopRequireDefault(_string3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function InitalizeSubstring(source) {
    if (!source) return new _nil2.default();
    var str = new CheddarString(null, null);
    str.init(source);
    return str;
}

var CheddarString = function (_CheddarClass) {
    _inherits(CheddarString, _CheddarClass);

    function CheddarString() {
        _classCallCheck(this, CheddarString);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarString).apply(this, arguments));
    }

    _createClass(CheddarString, [{
        key: 'init',
        value: function init(string) {
            this.value = string.toString();
            return true;
        }

        // String is the lowest level class
        //  meaning operators can have directly
        //  defined behavior

    }, {
        key: 'accessor',
        value: function accessor(target) {
            return this.Scope.get(target) || (Number.isInteger(+target) ? new _var2.default(InitalizeSubstring(this.value[target])) : null);
        }
    }]);

    return CheddarString;
}(_class2.default);

CheddarString.Name = "String";
CheddarString.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_string2.default)));
CheddarString.Cast = _string4.default;
exports.default = CheddarString;


CheddarString.Scope = require('../../../stdlib/primitive/String/static');
CheddarString.prototype.Scope = require('../../../stdlib/primitive/String/lib');
module.exports = exports['default'];

},{"../../../stdlib/primitive/String/lib":64,"../../../stdlib/primitive/String/static":74,"../consts/nil":9,"../env/class":10,"../env/var":14,"./cast/string":25,"./op/string":30}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['String', function (self) {
    // Get Dependencies
    var CheddarString = require('../String');

    var Stringified = "",
        Cast = void 0;
    for (var i = 0; i < self.value.length; i++) {
        Cast = self.value[i] && self.value[i].constructor.Cast ? self.value[i].constructor.Cast.has('String') || self.value[i].constructor.Operator.has('repr') : false;

        if (Cast) Stringified += (i ? ", " : "") + (self.value[i].constructor.Cast.has('String') ? self.value[i].constructor.Cast.get('String')(self.value[i]) : self.value[i].constructor.Operator.get('repr')(null, self.value[i])).value;else Stringified += (i ? ", " : "") + ('<' + (self.value[i].constructor.Name || self.value[i].Name) + '>');
    }
    return (0, _init2.default)(CheddarString, "[" + Stringified + "]");
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../String":21}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require('../../consts/err');

var _Number = require('../Number');

var _Number2 = _interopRequireDefault(_Number);

var _String = require('../String');

var _String2 = _interopRequireDefault(_String);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['String', function (RHS) {
    return RHS.value === true ? (0, _init2.default)(_String2.default, "true") : RHS.value !== false ? _err.CAST_FAILED : (0, _init2.default)(_String2.default, "false");
}], ['Number', function (RHS) {
    return (0, _init2.default)(_Number2.default, 10, 0, +RHS.value);
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../consts/err":7,"../Number":20,"../String":21}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _String = require('../String');

var _String2 = _interopRequireDefault(_String);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['String', function (LHS) {
    return (0, _init2.default)(_String2.default, LHS.value);
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../String":21}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require('../../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _Number = require('../Number');

var _Number2 = _interopRequireDefault(_Number);

var _lex = require('../../../../tokenizer/tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _number = require('../../../../tokenizer/literals/number');

var _number2 = _interopRequireDefault(_number);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // Standard error


// Dependencies


// Tokenizers


exports.default = new Map([['Number', function (LHS) {
    var Attempt = new _number2.default(LHS, 0).exec();
    if (Attempt instanceof _lex2.default) return _init2.default.apply(undefined, [_Number2.default].concat(_toConsumableArray(Attempt._Tokens)));else return CheddarError.CAST_FAILED;
}]]);

/*
class A {
    cast from String (args) {

    }
}


CLASS ::= class <identifier> <idlist> {
              <ITEM> (\n<ITEM> | })
ITEM  ::= init <codeblock> |
          (cast (from|to)|(get|set))? <indentifier> <arglist> <codeblock> |
          (assignby (copy|reference))|
*/

module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../../../tokenizer/literals/number":85,"../../../../tokenizer/tok/lex":106,"../../consts/err":7,"../Number":20}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require("../env/class");

var _class2 = _interopRequireDefault(_class);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nil = function (_CheddarClass) {
    _inherits(nil, _CheddarClass);

    function nil() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, nil);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(nil)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.accessor = null, _this.setter = null, _this.Scope = null, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(nil, [{
        key: "init",
        value: function init() {}
    }]);

    return nil;
}(_class2.default);

nil.Name = "nil";
nil.accessor = null;
nil.setter = null;
nil.Scope = null;
exports.default = nil;
module.exports = exports['default'];

},{"../env/class":10}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require('../../consts/err');

var _err2 = _interopRequireDefault(_err);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['!', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    if (LHS === null) return (0, _init2.default)(CheddarBool, RHS.value.length === 0);else return _err2.default.NO_OP_BEHAVIOR;
}], ['has', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    var self = LHS.value;
    var op = void 0,
        res = (0, _init2.default)(CheddarBool, false);

    for (var i = 0; i < self.length; i++) {
        if (self[i] && self[i].constructor.Operator && (op = self[i].constructor.Operator.get('=='))) {
            res = op(self[i], RHS);
            if (!(res instanceof CheddarBool)) {
                return '`has` cannot compare item @' + i;
            } else if (res.value === true) {
                break;
            }
        } else {
            return '`has` cannot compare item @' + i;
        }
    }

    return res;
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../consts/err":7,"../Bool":19}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['!', function (LHS, RHS) {
    if (LHS === null) return (0, _init2.default)(RHS.constructor, !RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require('../../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _String = require('../String');

var _String2 = _interopRequireDefault(_String);

var _Bool = require('../Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// from Cyoce the almighty platypus, modified quite heavily.
// http://chat.stackexchange.com/transcript/message/27392766#27392766
var range = function range(a, b) {
    var CheddarNumber = require('../Number');
    var out = [];
    var i = 0;
    if (b < a) {
        while (a >= b) {
            out[i++] = (0, _init2.default)(CheddarNumber, 10, 0, a--);
        }
    } else {
        while (a <= b) {
            out[i++] = (0, _init2.default)(CheddarNumber, 10, 0, a++);
        }
    }
    return out;
};

exports.default = new Map([
// Basic arithmetic operator
//  definitions

// Addition / (if enabled) implicit
//  casting with concatenation
['+', function (LHS, RHS) {

    //NOTE: IMPLICIT
    //if (RHS.Cast.has(CheddarString))
    //    RHS = RHS.Cast.get(CheddarString)();

    if (LHS === null) return (0, _init2.default)(RHS.constructor, 10, 0, RHS.value);else if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value + RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}],

// Subtraction, purely explicit
//  with numbers.
['-', function (LHS, RHS) {

    //NOTE: IMPLICIT
    //if (RHS.Cast.has(CheddarString))
    //    RHS = RHS.Cast.get(CheddarString)();

    if (LHS === null) return (0, _init2.default)(RHS.constructor, 10, 0, -RHS.value);else if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value - RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}],

// Multiplication either, arithemtic
//  multiplication or repetition
['*', function (LHS, RHS) {

    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value * RHS.value);else if (RHS.constructor.Name === "String") return (0, _init2.default)(RHS.constructor, RHS.value.repeat(LHS.value));else return CheddarError.NO_OP_BEHAVIOR;
}],

// Division, solely arithemtic
['/', function (LHS, RHS) {

    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value / RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['^', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, Math.pow(LHS.value, RHS.value));else return CheddarError.NO_OP_BEHAVIOR;
}], ['%', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value % RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}],

// == Boolean Operators ==
['!', function (LHS, RHS) {
    if (LHS === null) return (0, _init2.default)(_Bool2.default, RHS.value === 0);else return CheddarError.NO_OP_BEHAVIOR;
}], ['<', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(_Bool2.default, LHS.value < RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['>', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(_Bool2.default, LHS.value > RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['<=', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(_Bool2.default, LHS.value <= RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['>=', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(_Bool2.default, LHS.value >= RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}],

// == Bitwise Operators ==
['&', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value & RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['|', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value | RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['xor', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value ^ RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['<<', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value << RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['>>', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value >> RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}],

// Special Operators
['|>', function (LHS, RHS) {
    var CheddarArray = require("../Array");
    if (LHS && RHS instanceof LHS.constructor) return _init2.default.apply(undefined, [CheddarArray].concat(_toConsumableArray(range(LHS.value, RHS.value))));else if (LHS === null) return _init2.default.apply(undefined, [CheddarArray].concat(_toConsumableArray(range(0, RHS.value - 1))));else return CheddarError.NO_OP_BEHAVIOR;
}],

// == Word Operators ==
['sign', function (LHS, RHS) {
    if (LHS === null) return (0, _init2.default)(RHS.constructor, 10, 0, Math.sign(RHS.value));else if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, Math.sign(LHS.value - RHS.value));else return CheddarError.NO_OP_BEHAVIOR;
}], ['sqrt', function (LHS, RHS) {
    if (LHS === null) return (0, _init2.default)(RHS.constructor, 10, 0, Math.sqrt(RHS.value));
    return CheddarError.NO_OP_BEHAVIOR;
}], ['cbrt', function (LHS, RHS) {
    if (LHS === null) return (0, _init2.default)(RHS.constructor, 10, 0, Math.cbrt(RHS.value));
    return CheddarError.NO_OP_BEHAVIOR;
}], ['root', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, Math.pow(LHS.value, 1 / RHS.value));
    return CheddarError.NO_OP_BEHAVIOR;
}], ['log', function (LHS, RHS) {
    if (LHS === null) return (0, _init2.default)(RHS.constructor, 10, 0, Math.log(RHS.value));else if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, Math.log(LHS.value) / Math.log(RHS.value));

    return CheddarError.NO_OP_BEHAVIOR;
}],

// == Trig Functions ==
['sin', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.sin(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['cos', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.cos(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['tan', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.tan(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['asin', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.asin(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['acos', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.acos(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['atan', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.atan(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}],

// == Rounding Functions ==
['ceil', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.ceil(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['floor', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.floor(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['round', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.round(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}], ['abs', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.abs(RHS.value)) : CheddarError.NO_OP_BEHAVIOR;
}],

// == Misc Operators ==
['len', function (LHS, RHS) {
    return LHS === null ? (0, _init2.default)(RHS.constructor, 10, 0, Math.abs(Math.floor(RHS.value))) : CheddarError.NO_OP_BEHAVIOR;
}],

// == Assignment Operators

// == Testing Operators ==
['@"', function (LHS, RHS) {
    if (LHS === null) // monadic
        return (0, _init2.default)(_String2.default, String.fromCharCode(RHS.value));else if (RHS instanceof LHS.constructor) return (0, _init2.default)(_String2.default, range(LHS.value, RHS.value).map(function (e) {
        return String.fromCharCode(e);
    }).join(""));
}]]);

/*
TODO:
'+=', '-=', '*=', '/=', '^=', '%=', '&=', '|=', '<<', '>>', '<<=', '>>=',

'and', 'or', 'xor',
*/

module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../consts/err":7,"../Array":18,"../Bool":19,"../Number":20,"../String":21}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require('../../consts/err');

var _err2 = _interopRequireDefault(_err);

var _Number = require('../Number');

var _Number2 = _interopRequireDefault(_Number);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// == STRING ==
exports.default = new Map([
// Replace " with \"
//  and replace \
//  with \\s
['repr', function (_, LHS) {
    return (0, _init2.default)(LHS.constructor, '"' + LHS.value.replace(/"|\\/g, "\\$&") + '"');
}],

// String concatenation
//  using +, attempt to
//  implicitly cast
['+', function (LHS, RHS) {

    //NOTE: IMPLICIT
    //if (RHS.Cast.has(CheddarString))
    //    RHS = RHS.Cast.get(CheddarString)();

    if (LHS && RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, LHS.value + RHS.value);else return _err2.default.NO_OP_BEHAVIOR;
}],

// Logical NOT
//  if the string is
//  empty
['!', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    if (LHS === null) return (0, _init2.default)(CheddarBool, RHS.value.length === 0);else return _err2.default.NO_OP_BEHAVIOR;
}],

// Comparisons
//  compares the char
//  codes of the strings
['<', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(CheddarBool, LHS.value < RHS.value);else return _err2.default.NO_OP_BEHAVIOR;
}], ['>', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(CheddarBool, LHS.value > RHS.value);else return _err2.default.NO_OP_BEHAVIOR;
}],

// has operator
//  checks if substring
//  is empty
['has', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(CheddarBool, LHS.value.includes(RHS.value));else return _err2.default.NO_OP_BEHAVIOR;
}],

// String repetition
//  when either Operator<*>.Behavior
//  is (String, Number)
//  or (Number, String)
//  repeat <String> <Number> times
['*', function (LHS, RHS) {

    if (RHS.constructor.Name === "Number") return (0, _init2.default)(LHS.constructor, LHS.value.repeat(RHS.value));else return _err2.default.NO_OP_BEHAVIOR;
}], ['@"', function (LHS, RHS) {
    var CheddarArray = require("../Array");
    if (LHS === null) return _init2.default.apply(undefined, [CheddarArray].concat(_toConsumableArray([].concat(_toConsumableArray(RHS.value)).map(function (x) {
        return (0, _init2.default)(_Number2.default, 10, 0, x.charCodeAt());
    }))));else return _err2.default.NO_OP_BEHAVIOR;
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../consts/err":7,"../Array":18,"../Bool":19,"../Number":20}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _links = require('./links');

var _links2 = _interopRequireDefault(_links);

var _nil = require('./core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarExec = function () {
    function CheddarExec(exec_stack, scope) {
        _classCallCheck(this, CheddarExec);

        this.Code = exec_stack._Tokens;
        this._csi = 0;
        this.Scope = scope;

        this.errored = false;
        this.lrep = new _nil2.default();
    }

    _createClass(CheddarExec, [{
        key: 'step',
        value: function step() {
            var item = this.Code[this._csi++];
            var sproc = _links2.default[item.constructor.name];

            var proc = new sproc(item, this.Scope);
            var resp = proc.exec();

            if (typeof resp === "string") {
                this.errored = true;
                this.lrep = resp;
            } else if (typeof resp === "undefined") {
                this.lrep = new _nil2.default();
            } else {
                this.lrep = resp;
            }
        }
    }, {
        key: 'exec',
        value: function exec() {
            while (this.Code[this._csi] && !this.errored) {
                this.step();
            }return this.lrep;
        }
    }]);

    return CheddarExec;
}();

exports.default = CheddarExec;
module.exports = exports['default'];

},{"./core/consts/nil":9,"./links":32}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _eval = require('./core/eval/eval');

var _eval2 = _interopRequireDefault(_eval);

var _assign = require('./states/assign');

var _assign2 = _interopRequireDefault(_assign);

var _for = require('./states/for');

var _for2 = _interopRequireDefault(_for);

var _if = require('./states/if');

var _if2 = _interopRequireDefault(_if);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    StatementAssign: _assign2.default,
    StatementIf: _if2.default,
    StatementFor: _for2.default,
    StatementExpression: _eval2.default
};
module.exports = exports['default'];

},{"./core/eval/eval":16,"./states/assign":33,"./states/for":34,"./states/if":35}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _var = require('../core/env/var');

var _var2 = _interopRequireDefault(_var);

var _class = require('../core/env/class');

var _class2 = _interopRequireDefault(_class);

var _eval = require('../core/eval/eval');

var _eval2 = _interopRequireDefault(_eval);

var _nil = require('../core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarAssign = function () {
    function CheddarAssign(tokl, scope) {
        _classCallCheck(this, CheddarAssign);

        this.assignt = tokl.tok(0); // assignment type
        this.assignl = tokl.tok(1); // name & type?
        this.toks = tokl;

        this.scope = scope;
    }

    _createClass(CheddarAssign, [{
        key: 'exec',
        value: function exec() {
            if (this.scope.has(this.assignl.tok(0))) {
                // ERROR INTEGRATE
                return this.assignl.tok(0) + ' has already been defined';
            }

            var res = void 0;

            if (this.toks.tok(2)) {
                var val = new _eval2.default(this.toks.tok(2), this.scope);
                if (!((val = val.exec()) instanceof _class2.default || val.prototype instanceof _class2.default)) return val;

                val.scope = this.scope;
                val.Reference = this.assignl.tok(0);

                res = this.scope.manage(this.assignl.tok(0), new _var2.default(val, {
                    Writeable: this.assignt !== "const",
                    StrictType: this.assignl.tok(1) || null
                }));
            } else {
                res = this.scope.manage(this.assignl.tok(0), new _var2.default(new _nil2.default(), {
                    Writeable: this.assignt !== "const",
                    StrictType: this.assignl.tok(1) || null
                }));
            }

            if (res !== true) {
                return '`' + this.assignl.tok(0) + '` is a reserved keyword';
            }
        }
    }]);

    return CheddarAssign;
}();

exports.default = CheddarAssign;
module.exports = exports['default'];

},{"../core/consts/nil":9,"../core/env/class":10,"../core/env/var":14,"../core/eval/eval":16}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nil = require('../core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _exec = require('../exec');

var _exec2 = _interopRequireDefault(_exec);

var _eval = require('../core/eval/eval');

var _eval2 = _interopRequireDefault(_eval);

var _Bool = require('../core/primitives/Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _scope = require('../core/env/scope');

var _scope2 = _interopRequireDefault(_scope);

var _assign = require('./assign');

var _assign2 = _interopRequireDefault(_assign);

var _err = require('../core/consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _err_msg = require('../core/consts/err_msg');

var _err_msg2 = _interopRequireDefault(_err_msg);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarFor = function () {
    function CheddarFor(toks, scope) {
        _classCallCheck(this, CheddarFor);

        this.toks = toks;
        this.scope = scope;
    }

    _createClass(CheddarFor, [{
        key: 'exec',
        value: function exec() {
            // Create `for`'s scope, inherits from parent
            var SCOPE = new _scope2.default(this.scope);

            // Determine whether for..in or for (a; b; c)
            // 4 tokens === for..in
            if (this.toks._Tokens.length === 4) {
                var vars = void 0,
                    // Variable array for destructuring
                target = void 0,
                    // Item to loop over
                codeblock = void 0; // Codeblock to execute

                // First token is the variable(s) name(s)
                vars = this.toks._Tokens[1];

                // Handle destructuring
                if (vars.constructor.name === "CheddarArrayToken") {
                    // Extract the variable name from inside the tokens
                    vars = vars._Tokens.map(function (variable) {
                        return variable._Tokens[0];
                    });
                } else {
                    // It's just a normal variable
                    // wrap it as an array
                    vars = [vars._Tokens[0]];
                }

                // Evaluate the expression
                target = new _eval2.default(this.toks._Tokens[2], // The target token
                SCOPE // The generated scope
                ).exec();

                // Propogate errors
                if (typeof target === 'string') return target;

                // Iterate over the result
                if (target.value) {
                    var CheddarString = require('../core/primitives/String');
                    var init = require('../../helpers/init');
                    var cvar = require('../core/env/var');
                    // TODO: Actually make generators
                    // Currently just extract value and iterate over that
                    for (var i = 0; i < target.value.length; i++) {
                        // Check if destructuring properly
                        if (i === 0 && vars.length > 1) {
                            return 'Unused variables in for destructuring: `' + vars.slice(1).join(", ") + '`';
                        }

                        // If it has the variable and it's not writable
                        if (SCOPE.has(vars[0]) && SCOPE.accessor(vars[0]).Writeable === false) {
                            return 'Cannot overwrite constant `' + vars[0] + '`';
                        }

                        if (typeof target.value === 'string') {
                            // It is an array
                            SCOPE.manage( // The setter
                            vars[0], // set it to the first variable
                            // Convert the item to a CheddarString, wrap in a
                            // CheddarVariable
                            new cvar(init(CheddarString, target.value[i])));
                        } else {
                            // It's an array
                            SCOPE.manage( // the setter
                            vars[0], // the variable name, the first one
                            // Wrap the array item in a CheddarVariable
                            new cvar(target.value[i]));
                        }

                        // Execute the codeblock
                        codeblock = new _exec2.default(
                        // The codeblock is at the 3rd token
                        // Actual tokens are wrapped
                        // Can be accessed through ._Tokens[0]
                        this.toks._Tokens[3]._Tokens[0], SCOPE // Pass the generated scope
                        ).exec();

                        // If it errored, it returned a string, error.
                        if (typeof codeblock === "string") return codeblock;
                    }

                    // Return the result of codeblock
                    // The implicit output will become
                    // the last iteration response
                    return codeblock;
                } else {
                    return 'Cannot iterate over ' + (target.constructor.Name || target.Name || "object");
                }
            } else {

                var pool0 = void 0,
                    poola = void 0,
                    poolb = void 0,
                    poolc = void 0,
                    // Token caching
                res = void 0,
                    bool = void 0,
                    // Storage
                ralloc = void 0,
                    // Pending result
                trs = void 0; // Temp

                // Execute the initial setup
                pool0 = this.toks._Tokens[1];

                if (pool0.constructor.name === "StatementAssign") {
                    trs = new _assign2.default(pool0, SCOPE).exec();
                } else {
                    trs = new _eval2.default(pool0, SCOPE).exec();
                }

                if (typeof trs === 'string') return trs;

                // Cache tokens to avoid new lookup
                poola = this.toks._Tokens[2];
                poolb = this.toks._Tokens[3];
                poolc = this.toks._Tokens[4];

                while (true) {
                    res = new _eval2.default(poola, SCOPE);
                    res = res.exec();

                    if (typeof res === 'string') return res;

                    bool = new _Bool2.default(SCOPE);

                    if (bool.init(res) && bool.value === true) {
                        ralloc = new _exec2.default(poolc._Tokens[0], SCOPE);

                        ralloc = ralloc.exec();

                        if (typeof ralloc === "string") break;

                        trs = new _eval2.default(poolb, SCOPE);
                        trs.exec();

                        if (typeof trs === 'string') return trs;
                    } else {
                        break;
                    }
                }

                return ralloc;
            }
        }
    }]);

    return CheddarFor;
}();

exports.default = CheddarFor;
module.exports = exports['default'];

},{"../../helpers/init":3,"../core/consts/err":7,"../core/consts/err_msg":8,"../core/consts/nil":9,"../core/env/scope":13,"../core/env/var":14,"../core/eval/eval":16,"../core/primitives/Bool":19,"../core/primitives/String":21,"../exec":31,"./assign":33}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nil = require('../core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _exec = require('../exec');

var _exec2 = _interopRequireDefault(_exec);

var _eval = require('../core/eval/eval');

var _eval2 = _interopRequireDefault(_eval);

var _Bool = require('../core/primitives/Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _scope = require('../core/env/scope');

var _scope2 = _interopRequireDefault(_scope);

var _err = require('../core/consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _err_msg = require('../core/consts/err_msg');

var _err_msg2 = _interopRequireDefault(_err_msg);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarIf = function () {
    function CheddarIf(toks, scope) {
        _classCallCheck(this, CheddarIf);

        this.toks = toks;
        this.Scope = scope;
    }

    _createClass(CheddarIf, [{
        key: 'exec',
        value: function exec() {
            var expr = void 0,
                // Conditional Expression
            val = void 0,
                // Result Holder
            evalf = void 0; // Evaluation frame

            var tok = void 0;
            var cs = 0;

            while ((tok = this.toks._Tokens[cs++]) !== undefined) {
                switch (tok) {
                    case "": // If-statement
                    case "elif":
                        // Else-if statement
                        expr = this.toks._Tokens[cs++];
                        expr = new _eval2.default(expr, this.Scope).exec();

                        if (typeof expr === 'string') return expr;

                        // Check if expression is true
                        val = new _Bool2.default(this.Scope);
                        // Ensure: a. Succesful cast; b. evals to true
                        if (val.init(expr) && val.value === true) {
                            evalf = new _exec2.default(this.toks._Tokens[cs++]._Tokens[0], // Code Block
                            new _scope2.default(this.Scope) // New scope inheriting
                            );

                            return evalf.exec();
                        } else {
                            cs++;
                            break;
                        }
                    case "else":
                        // Else statement
                        evalf = new _exec2.default(this.toks._Tokens[cs++]._Tokens[0], new _scope2.default(this.Scope));

                        return evalf.exec();
                    default:
                        return _err_msg2.default.get(CheddarError.MALFORMED_TOKEN).replace(/\$0/, this.toks._Tokens.length);
                }
            }
        }
    }]);

    return CheddarIf;
}();

exports.default = CheddarIf;
module.exports = exports['default'];

},{"../core/consts/err":7,"../core/consts/err_msg":8,"../core/consts/nil":9,"../core/env/scope":13,"../core/eval/eval":16,"../core/primitives/Bool":19,"../exec":31}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _String = require('../interpreter/core/primitives/String');

var _String2 = _interopRequireDefault(_String);

var _Number = require('../interpreter/core/primitives/Number');

var _Number2 = _interopRequireDefault(_Number);

var _Array = require('../interpreter/core/primitives/Array');

var _Array2 = _interopRequireDefault(_Array);

var _Bool = require('../interpreter/core/primitives/Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _nil = require('../interpreter/core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _func = require('../interpreter/core/env/func');

var _func2 = _interopRequireDefault(_func);

var _err = require('../interpreter/core/consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _var2 = require('../interpreter/core/env/var');

var _var3 = _interopRequireDefault(_var2);

var _scope = require('../interpreter/core/env/scope');

var _scope2 = _interopRequireDefault(_scope);

var _class = require('../interpreter/core/env/class');

var _class2 = _interopRequireDefault(_class);

var _init = require('../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_class2.default.merge = {
    accessor: function accessor(override) {
        return function (target) {
            this.Scope.get(target) || override(target) || null;
        };
    }
};

var API = {
    string: _String2.default,
    number: _Number2.default,
    array: _Array2.default,
    bool: _Bool2.default,
    func: _func2.default,
    nil: _nil2.default,

    error: CheddarError,

    // Make a literal
    init: _init2.default,

    // Make a variable AND literal
    make: function make() {
        return new _var3.default(_init2.default.apply(undefined, arguments), { Writeable: false });
    },

    // Make a variable
    var: function _var(val) {
        return new _var3.default(val, { Writeable: false });
    },

    // Make a variable from an implementation
    from: function from(val) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return new _var3.default(val.apply(undefined, [API].concat(args)), { Writeable: false });
    },

    // Make a property (getters & setters)
    prop: function prop() {
        var getter = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var setter = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        return new _var3.default(null, {
            Writeable: false,
            getter: getter,
            setter: setter
        });
    },

    // Make a namespace given a map
    namespace: function namespace(val) {
        var Scope = new _scope2.default(null);
        Scope.Scope = new Map(val);
        return Scope;
    },

    variable: _var3.default,
    class: _class2.default,
    scope: _scope2.default
};

exports.default = API;
module.exports = exports['default'];

},{"../helpers/init":3,"../interpreter/core/consts/err":7,"../interpreter/core/consts/nil":9,"../interpreter/core/env/class":10,"../interpreter/core/env/func":12,"../interpreter/core/env/scope":13,"../interpreter/core/env/var":14,"../interpreter/core/primitives/Array":18,"../interpreter/core/primitives/Bool":19,"../interpreter/core/primitives/Number":20,"../interpreter/core/primitives/String":21}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return cheddar.namespace([['get', cheddar.from(require('./HTTP/get'))]]);
};

module.exports = exports['default'];

},{"./HTTP/get":38}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = factor;
function factor(cheddar) {
    return new cheddar.func([["URL", {
        Type: cheddar.string
    }]], function (scope, input) {
        var URL = input("URL");
    });
}
module.exports = exports['default'];

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return cheddar.namespace([["prompt", cheddar.var(require("./IO/prompt")(cheddar))], ["printf", cheddar.var(require("./IO/printf")(cheddar))], ["sprintf", cheddar.var(require("./IO/sprintf")(cheddar))]]);
};

module.exports = exports['default'];

},{"./IO/printf":41,"./IO/prompt":42,"./IO/sprintf":43}],40:[function(require,module,exports){
(function (process,Buffer){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Salehen Shovon Rahman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 **/

'use strict';

var fs = require('fs');
var term = [13, 10]; //carriage return

/**
 * create -- sync function for reading user input from stdin
 * @param   {Object} config {
 *   sigint: {Boolean} exit on ^C
 *   autocomplete: {StringArray} function({String})
 *   history: {String} a history control object (see `prompt-sync-history`)
 * }
 * @returns {Function} prompt function
 */

function create(config) {

    config = config || {};
    var sigint = config.sigint;
    var autocomplete = config.autocomplete = config.autocomplete || function () {
        return [];
    };
    var history = config.history;
    prompt.history = history || {
        save: function save() {}
    };
    prompt.hide = function (ask) {
        return prompt(ask, {
            echo: ''
        });
    };

    return prompt;

    /**
     * prompt -- sync function for reading user input from stdin
     *  @param {String} ask opening question/statement to prompt for
     *  @param {String} value initial value for the prompt
     *  @param   {Object} opts {
     *   echo: set to a character to be echoed, default is '*'. Use '' for no echo
     *   value: {String} initial value for the prompt
     *   ask: {String} opening question/statement to prompt for, does not override ask param
     *   autocomplete: {StringArray} function({String})
     * }
     *
     * @returns {string} Returns the string input or (if sigint === false)
     *                   null if user terminates with a ^C
     */

    function prompt(ask, value, opts) {
        var insert = 0,
            savedinsert = 0,
            res,
            i,
            savedstr;
        opts = opts || {};

        if (Object(ask) === ask) {
            opts = ask;
            ask = opts.ask;
        } else if (Object(value) === value) {
            opts = value;
            value = opts.value;
        }
        ask = ask || '';
        var echo = opts.echo;
        var masked = 'echo' in opts;
        autocomplete = opts.autocomplete || autocomplete;

        var fd = process.platform === 'win32' ? process.stdin.fd : fs.openSync('/dev/tty', 'rs');

        var wasRaw = process.stdin.isRaw;
        if (!wasRaw && process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        var buf = new Buffer(3);
        var str = '',
            char,
            read;

        savedstr = '';

        if (ask) {
            process.stdout.write(ask);
        }

        var cycle = 0;
        var prevComplete;

        while (true) {
            read = fs.readSync(fd, buf, 0, 3);
            if (read == 3) {
                // received a control sequence
                switch (buf.toString()) {
                    case '\u001b[A':
                        //up arrow
                        if (masked) break;
                        if (!history) break;
                        if (history.atStart()) break;

                        if (history.atEnd()) {
                            savedstr = str;
                            savedinsert = insert;
                        }
                        str = history.prev();
                        insert = str.length;
                        process.stdout.write('\u001b[2K\u001b[0G' + ask + str);
                        break;
                    case '\u001b[B':
                        //down arrow
                        if (masked) break;
                        if (!history) break;
                        if (history.pastEnd()) break;

                        if (history.atPenultimate()) {
                            str = savedstr;
                            insert = savedinsert;
                            history.next();
                        } else {
                            str = history.next();
                            insert = str.length;
                        }
                        process.stdout.write('\u001b[2K\u001b[0G' + ask + str + '\u001b[' + (insert + ask.length + 1) + 'G');
                        break;
                    case '\u001b[D':
                        //left arrow
                        if (masked) break;
                        var before = insert;
                        insert = --insert < 0 ? 0 : insert;
                        if (before - insert) process.stdout.write('\u001b[1D');
                        break;
                    case '\u001b[C':
                        //right arrow
                        if (masked) break;
                        insert = ++insert > str.length ? str.length : insert;
                        process.stdout.write('\u001b[' + (insert + ask.length + 1) + 'G');
                        break;
                }
                if (term.indexOf(buf[read - 1]) > -1) {
                    fs.closeSync(fd);
                    if (!history) break;
                    if (!masked && str.length) history.push(str);
                    history.reset();
                    break;
                }
                continue; // any other 3 character sequence is ignored
            }

            // if it is not a control character seq, assume only one character is read
            char = buf[read - 1];

            // catch a ^C and return null
            if (char == 3) {
                process.stdout.write('^C\n');
                fs.closeSync(fd);

                if (sigint) process.exit(130);

                if (process.stdin.isTTY) {
                    process.stdin.setRawMode(wasRaw);
                }

                return null;
            }

            // catch the terminating character
            if (term.indexOf(char) > -1) {
                fs.closeSync(fd);
                if (!history) break;
                if (!masked && str.length) history.push(str);
                history.reset();
                break;
            }

            // catch a TAB and implement autocomplete
            if (char == 9) {
                // TAB
                res = autocomplete(str);

                if (str == res[0]) {
                    res = autocomplete('');
                } else {
                    prevComplete = res.length;
                }

                if (res.length == 0) {
                    process.stdout.write('\t');
                    continue;
                }

                var item = res[cycle++] || res[(cycle = 0, cycle++)];

                if (item) {
                    process.stdout.write('\r\u001b[K' + ask + item);
                    str = item;
                    insert = item.length;
                }
            }

            if (char == 127 || process.platform == 'win32' && char == 8) {
                //backspace
                if (!insert) continue;
                str = str.slice(0, insert - 1) + str.slice(insert);
                insert--;
                process.stdout.write('\u001b[2D');
            } else {
                if (char < 32 || char > 126) continue;
                str = str.slice(0, insert) + String.fromCharCode(char) + str.slice(insert);
                insert++;
            };

            if (masked) {
                process.stdout.write('\u001b[2K\u001b[0G' + ask + Array(str.length + 1).join(echo));
            } else {
                process.stdout.write('\u001b[s');
                if (insert == str.length) {
                    process.stdout.write('\u001b[2K\u001b[0G' + ask + str);
                } else {
                    if (ask) {
                        process.stdout.write('\u001b[2K\u001b[0G' + ask + str);
                    } else {
                        process.stdout.write('\u001b[2K\u001b[0G' + str + '\u001b[' + (str.length - insert) + 'D');
                    }
                }
                process.stdout.write('\u001b[u');
                process.stdout.write('\u001b[1C');
            }
        }

        if (process.stdin.isTTY) {
            process.stdout.write('\n');
        }

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(wasRaw);
        }

        return str || value || '';
    }
};

module.exports = create;

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":114,"buffer":109,"fs":108}],41:[function(require,module,exports){
(function (process){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return new cheddar.func([["format", {
        Type: cheddar.string
    }], ["args", {
        Splat: true
    }]], function (scope, input) {
        var result = (0, _sprintf2.default)(cheddar).exec([input("format")].concat(_toConsumableArray(input("args").value)), input("self"));

        // Stream
        process.stdout.write(result.value);

        return result;
    });
};

var _sprintf = require("./sprintf");

var _sprintf2 = _interopRequireDefault(_sprintf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = exports['default'];

}).call(this,require('_process'))
},{"./sprintf":43,"_process":114}],42:[function(require,module,exports){
(function (process){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return new cheddar.func([["prompt", {
        Type: cheddar.string
    }], ["required", {
        Type: cheddar.string,
        Optional: true
    }]], function (scope, input) {
        var val = input("prompt").value;
        var retry = input("required");

        process.stdin.pause();
        var res = read(val);
        process.stdin.pause();

        if (retry instanceof cheddar.string) {
            // Keep trying to get input
            while (!res) {
                res = read(retry);
            }
        }

        return cheddar.init(cheddar.string, res);
    });
};

var read = require('./lib/prompt')({ sigint: true });

module.exports = exports['default'];

}).call(this,require('_process'))
},{"./lib/prompt":40,"_process":114}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {

    var FORMAT_REGEX = /%(-?\+?#?0?)(\d+|\*)?(\.\d+|\.\*)?([dixXrs])/gi;

    // Format of method:
    // [type, cast]
    // cast:
    //  V - object
    //  C - object's cast methods
    // **must** return JS string
    var FORMAT = {
        NUMBER: 'dixXbBoO',
        BASE: 'xXbBoO',
        SPECIFIER: {
            r: [cheddar.array, function (V, C) {
                return C.get("String")(V).value;
            }],
            d: [cheddar.number, function (V, C) {
                return C.get("String")(V).value;
            }],
            i: [cheddar.number, function (V, C) {
                return C.get("String")(V).value;
            }],
            x: [cheddar.number, function (V, C) {
                return V.value.toString(16);
            }],
            X: [cheddar.number, function (V, C) {
                return V.value.toString(16).toUpperCase();
            }],
            b: [cheddar.number, function (V, C) {
                return V.value.toString(2);
            }],
            B: [cheddar.number, function (V, C) {
                return V.value.toString(2);
            }],
            o: [cheddar.number, function (V, C) {
                return V.value.toString(8);
            }],
            O: [cheddar.number, function (V, C) {
                return V.value.toString(8);
            }],
            s: [cheddar.string, function (V, C) {
                return V.value;
            }],
            c: [cheddar.string, function (V, C) {
                return V.value[0];
            }]
        }
    };

    return new cheddar.func([["format", {
        Type: cheddar.string
    }], ["args", {
        Splat: true
    }]], function (scope, input) {
        var formats = input("format").value;
        var arglist = input("args").value;
        var idx = 0;
        var tmp = void 0;

        var REPLACE_WILDCARD = function REPLACE_WILDCARD(VAL) {
            return VAL === "*" ? // If it's a wildcard get it
            (tmp = arglist[idx++]) instanceof cheddar.number ? tmp.value : false : +VAL;
        }; // Otherwise covert to int

        // Simply replace
        var result = formats.replace(FORMAT_REGEX, function (MATCH, FLAG) {
            var WIDTH = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            var PRECISION = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
            var SPECIFIER = arguments[4];

            // Replaces wildcards with arglist value

            WIDTH = REPLACE_WILDCARD(WIDTH);
            PRECISION = REPLACE_WILDCARD(PRECISION);

            if (WIDTH === false || PRECISION === false) {
                idx++;
                return MATCH;
            }

            // If the arg type is correctly matching the specifier's
            if ((tmp = arglist[idx++]) instanceof FORMAT.SPECIFIER[SPECIFIER][0]) {
                // Convert to a string using given cast
                var res = FORMAT.SPECIFIER[SPECIFIER][1](tmp, tmp.constructor.Cast);

                if (FORMAT.NUMBER.indexOf(SPECIFIER) > -1) {
                    res = res.replace(/\..+/, function (DECIMAL) {
                        return DECIMAL + "0".repeat(Math.max(0, PRECISION - DECIMAL.length + 1));
                    });
                }

                if (FORMAT.NUMBER.indexOf(SPECIFIER) > -1) {
                    var neg = void 0;

                    // Check if negative, remove sign
                    if (res[0] === '-') {
                        res = res.slice(1);
                        neg = true;
                    }

                    // Implements `#` flag and is base
                    if (FORMAT.BASE.indexOf(SPECIFIER) > -1 && FLAG.indexOf('#') > -1) {
                        res = '0' + SPECIFIER + res;
                    }

                    // Re-add negative sign if needed
                    if (neg) {
                        res = '-' + res;
                    }

                    // Add + sign if needed and `+` flag
                    if (FLAG.indexOf('+') > -1) {
                        if (!neg) {
                            res = '+' + res;
                        }
                    }
                }

                if (WIDTH > res.length) {
                    // Length to pad
                    var padlen = WIDTH - res.length;

                    // Default character to pad with is space
                    var padchr = " ";

                    if (FLAG.indexOf("0") > -1) {
                        padchr = "0";
                    }

                    if (FLAG.indexOf('-') > -1) {
                        res += padchr.repeat(padlen);
                    } else {
                        res = padchr.repeat(padlen) + res;
                    }
                }

                return res;
            } else {
                return MATCH;
            }
        });

        return cheddar.init(cheddar.string, result);
    });
};

module.exports = exports['default']; /**
                                      * Cheddar, IO.sprintf(<format>, [args ...])
                                      *
                                      * Format specification:
                                      * %[flag][width][.precision]specifier]
                                      *
                                      * flag:
                                      *  -      left justification
                                      *  +      requires sign to show
                                      *  #      preceedes value with 0x 0o or 0b
                                      *  0      prepends width with 0s rather than spaces
                                      * width:
                                      *  0-9+   specifies width
                                      *  *      specifies width from argument
                                      * precision:
                                      *  0-9+   specifies width
                                      *  *      specifies width from argument
                                      * specifier:
                                      *  d      decimal
                                      *  i      integer
                                      *  x      hexadecimal
                                      *  X      heXadecimal (uppercase X)
                                      *  x      binary
                                      *  X      Binary (uppercase B)
                                      *  o      octal
                                      *  O      Octal (uppercase O)
                                      *  r      array
                                      *  s      string
                                      *  c      char, first char of string
                                      **/

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return cheddar.namespace([["E", cheddar.make(cheddar.number, 10, 0, 2.718281828459045)], ["PI", cheddar.make(cheddar.number, 10, 0, 3.141592653589793)], ["PHI", cheddar.make(cheddar.number, 10, 0, 1.618033988749894)], ["MILL", cheddar.make(cheddar.number, 10, 0, 1.306377883863080)], ["GAMMA", cheddar.make(cheddar.number, 10, 0, 0.577215664901532)], ["AVOGADRO", cheddar.make(cheddar.number, 10, 0, 6.02214086)], ["fib", cheddar.from(require("./Math/fib"))], ["factor", cheddar.from(require("./Math/factor"))], ["prime", cheddar.from(require("./Math/prime"))], ["rand", cheddar.from(require("./Math/rand"))]]);
};

module.exports = exports['default'];

},{"./Math/factor":45,"./Math/fib":46,"./Math/prime":48,"./Math/rand":49}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = factor;

var _factor2 = require("./helpers/factor");

var _factor3 = _interopRequireDefault(_factor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function factor(cheddar) {
    return new cheddar.func([["n", {
        Type: cheddar.number
    }]], function (scope, input) {
        var out = cheddar.init(cheddar.array);

        var n = input("n").value;

        if (n === 0) {
            out.value.push(cheddar.init(cheddar.number, 10, 0, 0));
            return out;
        }

        for (var i = 1; i <= n; i++) {
            if (n % i == 0) {
                out.value.push(cheddar.init(cheddar.number, 10, 0, i));
            }
        }

        return out;
    });
}
module.exports = exports['default'];

},{"./helpers/factor":47}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fib;
function fib(cheddar) {
    var memoized = new Map([[0, 0], [1, 1]]); // memoize values for faster access

    var fib = function fib(n) {
        return memoized.has(n) ? memoized.get(n) : n < 0 ? memoized.set(n, -fib(-n)).get(n) : memoized.set(n, fib(n - 1) + fib(n - 2)).get(n);
    };

    return new cheddar.func([["n", {
        Type: cheddar.number,
        Default: cheddar.init(cheddar.number, 10, 0, 1)
    }]], function (scope, input) {
        var n = input("n").value;
        return cheddar.init(cheddar.number, 10, 0, fib(n));
    });
}
module.exports = exports['default'];

},{}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = factor;
function factor(n) {
    var i = 2;
    var res = [];
    while (i <= n) {
        while (n % i === 0) {
            res.push(i);
            n /= i;
        }
        i++;
    }
    return res;
}
module.exports = exports['default'];

},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return new cheddar.func([["n", {
        Type: cheddar.number
    }]], function (scope, input) {
        var n = input("n").value;
        return cheddar.init(cheddar.bool, (0, _factor3.default)(n).length === 1);
    });
};

var _factor2 = require("./helpers/factor");

var _factor3 = _interopRequireDefault(_factor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

},{"./helpers/factor":47}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return new cheddar.func([["lower", {
        Type: cheddar.number,
        Optional: true
    }], ["upper", {
        Type: cheddar.number,
        Optional: true
    }]], function (scope, input) {
        var lower = input("lower").value;
        var upper = input("upper").value;

        if (lower !== undefined) {
            if (upper === undefined) {
                return cheddar.init(cheddar.number, 10, 0, Math.floor(Math.random() * lower));
            } else {
                return cheddar.init(cheddar.number, 10, 0, Math.floor(Math.random() * (upper - lower) + lower));
            }
        } else {
            return cheddar.init(cheddar.number, 10, 0, Math.random());
        }
    });
};

module.exports = exports['default'];

},{}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _api = require('../../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([require('./lib/len')(_api2.default), require('./lib/turn')(_api2.default), require('./lib/fuse')(_api2.default), require('./lib/vfuse')(_api2.default), require('./lib/join')(_api2.default), require('./lib/each')(_api2.default), require('./lib/map')(_api2.default), require('./lib/cycle')(_api2.default), require('./lib/shift')(_api2.default), require('./lib/unshift')(_api2.default), require('./lib/pop')(_api2.default), require('./lib/push')(_api2.default)]);
module.exports = exports['default'];

},{"../../api":36,"./lib/cycle":51,"./lib/each":52,"./lib/fuse":53,"./lib/join":54,"./lib/len":55,"./lib/map":56,"./lib/pop":57,"./lib/push":58,"./lib/shift":59,"./lib/turn":60,"./lib/unshift":61,"./lib/vfuse":62}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["cycle", api.var(new api.func([["rotations", {
        Type: api.number,
        Default: api.init(api.number, 10, 0, 1)
    }], ["counterclockwise", {
        Type: api.bool,
        Default: api.init(api.bool, false)
    }]], function (scope, input) {
        var self = input("self").value;

        if (self.length < 2) {
            return new api.nil();
        }

        var rotations = input("rotations").value;
        var counterclockwise = input("counterclockwise").value;

        if (rotations < 0) {
            rotations = -rotations;
            counterclockwise = !counterclockwise;
        }

        if (counterclockwise) {
            while (rotations--) {
                self.push(self.shift());
            }
        } else {
            while (rotations--) {
                self.unshift(self.pop());
            }
        }

        return new api.nil();
    }))];
};

module.exports = exports['default'];

},{}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["each", api.var(new api.func([["callback", {
        Type: api.func
    }]], function (scope, input) {
        var callback = input("callback");
        var _self = input("self");
        var self = _self.value;
        var res = void 0;

        for (var i = 0; i < self.length; i++) {
            res = callback.exec([self[i], api.init(api.number, 10, 0, i), _self]);

            if (typeof res === 'string') {
                return res;
            }
        }

        return new api.nil();
    }))];
};

module.exports = exports['default'];

},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["fuse", api.prop(new api.func([], function (scope, input) {
        var self = input("self").value;

        var stringified = "",
            cast = void 0,
            text = void 0;

        for (var i = 0; i < self.length; i++) {
            cast = self[i] instanceof api.string || self[i].constructor.Cast.get('String');

            if (cast) {
                if (cast === true) {
                    text = self[i].value;
                } else {
                    text = cast(self[i]).value;
                }
                stringified += "" + text;
            } else {
                return "Cannot stringify `" + (self[i].constructor.Name || self[i].Name) + "` in join";
            }
        }

        return api.init(api.string, stringified);
    }))];
};

module.exports = exports['default'];

},{}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["join", api.var(new api.func([["seperator", {
        Type: api.string,
        Default: api.init(api.string, "")
    }]], function (scope, input) {
        var self = input("self").value;
        var seperator = input("seperator").value;

        var stringified = "",
            cast = void 0,
            text = void 0;

        for (var i = 0; i < self.length; i++) {
            cast = self[i] instanceof api.string || self[i].constructor.Cast.get('String');

            if (cast) {
                if (cast === true) {
                    text = self[i].value;
                } else {
                    text = cast(self[i]).value;
                }
                stringified += (i ? seperator : "") + text;
            } else {
                return "Cannot stringify `" + (self[i].constructor.Name || self[i].Name) + "` in join";
            }
        }

        return api.init(api.string, stringified);
    }))];
};

module.exports = exports['default'];

},{}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["len", api.prop(new api.func([], function (_, input) {
        var size = input("self").value.length;
        return api.init(api.number, 10, 0, size);
    }))];
};

module.exports = exports['default'];

},{}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["map", api.var(new api.func([["callback", {
        Type: api.func
    }]], function (scope, input) {
        var callback = input("callback");
        var _self = input("self");
        var self = _self.value;
        var res = void 0;
        var out = api.init(api.array);

        for (var i = 0; i < self.length; i++) {
            res = callback.exec([self[i], api.init(api.number, 10, 0, i), _self]);

            if (typeof res === 'string') {
                return res;
            } else {
                out.value.push(res || new api.nil());
            }
        }

        return out;
    }))];
};

module.exports = exports['default'];

},{}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["pop", api.var(new api.func([], function (scope, input) {
        return input("self").value.pop() || new api.nil();
    }))];
};

module.exports = exports['default'];

},{}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["push", api.var(new api.func([["item", {}]], function (scope, input) {
        var array = input("self").value;
        array.push(input("item"));
        return api.init(api.number, 10, 0, array.length);
    }))];
};

module.exports = exports['default'];

},{}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["shift", api.var(new api.func([], function (scope, input) {
        return input("self").value.shift() || new api.nil();
    }))];
};

module.exports = exports['default'];

},{}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["turn", api.var(new api.func([["rotations", {
        Type: api.number,
        Default: api.init(api.number, 10, 0, 1)
    }]], function (scope, input) {
        var self = input("self").value;
        var rotations = input("rotations").value % 4;

        if (rotations < 0) {
            rotations = 4 + rotations;
        }

        while (rotations--) {
            // Transpose self
            if (self[0] && self[0].value && self[0].value.length === undefined) {
                return "Second dimension must be iterable";
            }

            var w = self.length,
                h = self[0].value.length;

            var t = [],
                y;

            // Loop through every item in the outer array (height)
            for (var i = 0; i < h; i++) {
                // Insert a new row (array)

                // If it's an array
                if (self[i] instanceof api.array) {
                    y = 0;
                    t.push(api.init(api.array));
                } else {
                    y = 1;
                    t.push(api.init(api.string, ""));
                }
                // Loop through every item per item in outer array (width)
                for (var j = 0; j < w; j++) {
                    // Save transposed data.
                    if (y === 1) {
                        t[i].value = self[j].value[i] + t[i].value;
                    } else {
                        t[i].value.unshift(self[j].value[i]);
                    }
                }
            }

            self = t;
        }

        return api.init.apply(api, [api.array].concat(t));
    }))];
};

module.exports = exports['default'];

},{}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["push", api.var(new api.func([["item", {}]], function (scope, input) {
        var array = input("self").value;
        array.unshift(input("item"));
        return api.init(api.number, 10, 0, array.length);
    }))];
};

module.exports = exports['default'];

},{}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["vfuse", api.prop(new api.func([], function (scope, input) {
        var self = input("self").value;

        var stringified = "",
            cast = void 0,
            text = void 0;

        for (var i = 0; i < self.length; i++) {
            cast = self[i] instanceof api.string || self[i].constructor.Cast.get('String');

            if (cast) {
                if (cast === true) {
                    text = self[i].value;
                } else {
                    text = cast(self[i]).value;
                }
                stringified += "\n" + text;
            } else {
                return "Cannot stringify `" + (self[i].constructor.Name || self[i].Name) + "` in join";
            }
        }

        return api.init(api.string, stringified);
    }))];
};

module.exports = exports['default'];

},{}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('../../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map();
module.exports = exports['default'];

},{"../../api":36}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _api = require('../../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([require('./lib/slice')(_api2.default), require('./lib/count')(_api2.default), require('./lib/upper')(_api2.default), require('./lib/lower')(_api2.default), require('./lib/split')(_api2.default), require('./lib/ord')(_api2.default), require('./lib/len')(_api2.default), require('./lib/rev')(_api2.default), require('./lib/chars')(_api2.default)]);
module.exports = exports['default'];

},{"../../api":36,"./lib/chars":65,"./lib/count":66,"./lib/len":67,"./lib/lower":68,"./lib/ord":69,"./lib/rev":70,"./lib/slice":71,"./lib/split":72,"./lib/upper":73}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["chars", api.prop(new api.func([], function (_, input) {
        return api.init.apply(api, [api.array].concat(_toConsumableArray((input("self").value.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[\S\s]/g) || []).map(function (chr) {
            return api.init(api.string, chr);
        }))));
    }))];
};

module.exports = exports['default'];

},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {
    return ["count", cheddar.var(new cheddar.func([["needle", {
        Type: cheddar.string
    }]], function (scope, input) {
        var string = input("self").value;
        var strlen = string.length;
        var needle = input("needle").value;

        // If it's less than two, no need to do a lookup
        // just check if the strings are equal
        if (strlen < 2 || needle.length >= strlen) {
            return cheddar.init(cheddar.number, 10, 0, string === needle | 0);
        }

        var count = 0;
        // Slower more blunt method
        // don't have too much time to spend on this
        for (var i = 0; i < strlen; i++) {
            if (string.indexOf(needle, i) === i) {
                count++;
            }
        }

        return cheddar.init(cheddar.number, 10, 0, count);

        /*
        let nlen = needle.length;
        let start = needle[0];
         let count  = 0;
        let shift  = 1;
        let i = 0;
        let j;
        let k;
         while (string[i]) {
            if (string[i] === start) {
                j = i;
                k = 0;
                while(k < nlen && string[j] === needle[k]) {
                 }
            }
        }*/
    }))];
};

module.exports = exports['default'];

},{}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["len", api.prop(new api.func([], function (_, input) {
        var size = (input("self").value.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[\S\s]/g) || []).length;
        return api.init(api.number, 10, 0, size);
    }))];
};

module.exports = exports['default'];

},{}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["lower", api.prop(new api.func([], function (_, input) {
        return api.init(api.string, input("self").value.toLowerCase());
    }))];
};

module.exports = exports['default'];

},{}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["ord", api.var(new api.func([["index", {
        Type: api.number,
        Default: api.init(api.number, 10, 0, 0)
    }]], function (scope, input) {
        var self = input("self").value.match(
        // Matches a surrogate pair or a single character
        /([\uD800-\uDBFF][\uDC00-\uDFFF])|[\S\s]/g) || [];
        var index = input("index").value;
        var target = self[index];
        var code = void 0;

        if (!target) {
            return new api.nil();
        }

        if (target[1]) {
            code = 0x10000;
            code += (target.charCodeAt(0) & 0x03FF) << 10;
            code += target.charCodeAt(1) & 0x03FF;
        } else {
            code = target.charCodeAt(0);
        }

        return api.init(api.number, 10, 0, code);
    }))];
};

module.exports = exports['default'];

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["rev", api.prop(new api.func([], function (_, input) {
        return api.init(api.string, (input("self").value.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[\S\s]/g) || []).reverse().join(""));
    }))];
};

module.exports = exports['default'];

},{}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["slice", api.var(new api.func([["A", {
        Type: api.number
    }], ["B", {
        Type: api.number,
        Optional: true
    }]], function (scope, input) {
        var item = input("self").value;
        return api.init(api.string, item.slice(input("A").value, input("B") && input("B").value));
    }))];
};

module.exports = exports['default'];

},{}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["split", api.var(new api.func([["seperator", {
        Type: api.string
    }]], function (scope, input) {
        return api.init.apply(api, [api.array].concat(_toConsumableArray(input("self").value.split(input("seperator").value).map(function (l) {
            return api.init(api.string, l);
        }))));
    }))];
};

module.exports = exports['default'];

},{}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["upper", api.prop(new api.func([], function (_, input) {
        return api.init(api.string, input("self").value.toUpperCase());
    }))];
};

module.exports = exports['default'];

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _String = require('../../../interpreter/core/primitives/String');

var _String2 = _interopRequireDefault(_String);

var _init = require('../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([["letters", { Value: (0, _init2.default)(_String2.default, "abcdefghijklmnopqrstuvwxyz") }], ["digits", { Value: (0, _init2.default)(_String2.default, "0123456789") }], ["alphanumeric", { Value: (0, _init2.default)(_String2.default, "abcdefghijklmnopqrstuvwxyz0123456789") }]]);
module.exports = exports['default'];

},{"../../../helpers/init":3,"../../../interpreter/core/primitives/String":21}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STDLIB = new Map();
STDLIB.Item = function (Name, LIB) {
  return STDLIB.set(Name, _api2.default.var(LIB(_api2.default)));
};

/** Global Libraries **/
STDLIB.Item("Math", require('./ns/Math'));
//STDLIB.Item("Encoding", require('./ns/Encoding'));
//STDLIB.Item("Buffer", require('./ns/Buffer'));
STDLIB.Item("IO", require('./ns/IO'));
STDLIB.Item("HTTP", require('./ns/HTTP'));

/** Primitives **/
STDLIB.set("String", _api2.default.var(_api2.default.string));
STDLIB.set("Number", _api2.default.var(_api2.default.number));
STDLIB.set("Array", _api2.default.var(_api2.default.array));
STDLIB.set("Boolean", _api2.default.var(_api2.default.bool));

exports.default = STDLIB;
module.exports = exports['default'];

},{"./api":36,"./ns/HTTP":37,"./ns/IO":39,"./ns/Math":44}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * DEFAULT CONSTANTS
 * List:
  * DIGITS  0-9
  * ALPHA   a-z
  * UALPHA  A-Z
  * MALPHA  A-Za-z
  * NUMERALS 0-9A-F
  * WHTIESPACE \s
  *
  * OP  infix operators
  * UOP unary operators 
  * SYMBOL_FILTER valid characters in operators
  *
  * STRING_DELIMITERS
  * STRING_ESCAPE
  * NUMBER_GROUPING number grouping delimiters
  * NUMBER_DECIMALS decimal point to use 
  *
  * BASE_IDENTIFIERS
  *
  * RESERVED reserved token names
**/
var DIGITS = exports.DIGITS = '0123456789';
var ALPHA = exports.ALPHA = 'abcdefghijklmnopqrstuvwxyz';
var UALPHA = exports.UALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var MALPHA = exports.MALPHA = ALPHA + UALPHA;

var NUMERALS = exports.NUMERALS = '0123456789ABCDEF';

var WHITESPACE = exports.WHITESPACE = '\r\n\f '; // Add \t here to allow tabs

var TOKEN_START = exports.TOKEN_START = MALPHA + '$_';
var TOKEN_END = exports.TOKEN_END = TOKEN_START + DIGITS;

/*== Operator Constants ==*/

/*== Parse Data ==*/
var STRING_DELIMITERS = exports.STRING_DELIMITERS = ['\'', '"'];
var STRING_ESCAPE = exports.STRING_ESCAPE = '\\';

var SYMBOL_FILTER = exports.SYMBOL_FILTER = '!%&*+-:<=>@\^|~';

var NUMBER_GROUPING = exports.NUMBER_GROUPING = ['_'];
var NUMBER_DECIMALS = exports.NUMBER_DECIMALS = ['.'];

var EXPR_OPEN = exports.EXPR_OPEN = '(';
var EXPR_CLOSE = exports.EXPR_CLOSE = ')';

/*== Array Data ==*/
var ARRAY_OPEN = exports.ARRAY_OPEN = '[';
var ARRAY_CLOSE = exports.ARRAY_CLOSE = ']';
var ARRAY_SEPARATOR = exports.ARRAY_SEPARATOR = ',';

/*== Number Data ==*/
var BASE_IDENTIFIERS = exports.BASE_IDENTIFIERS = ['b', 'o', 'x'];
var BASE_RESPECTIVE_NUMBERS = exports.BASE_RESPECTIVE_NUMBERS = [2, 8, 16];

/*== Conflict Data ==*/
var RESERVED = exports.RESERVED = ['sqrt', 'cos', 'sin', 'sign'];

},{}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * DEFAULT ERROR CODES
 * Codes:
  0. Success
  1. Unexpected token
  2. Unexpected
**/

var EXIT_NOTFOUND = exports.EXIT_NOTFOUND = Symbol('er_EXIT_NOTFOUND');
var UNEXPECTED_TOKEN = exports.UNEXPECTED_TOKEN = Symbol('er_UNEXPECTED_TOKEN');
var UNMATCHED_DELIMITER = exports.UNMATCHED_DELIMITER = Symbol('er_UNMATCHED_DELIMITER');
var EXPECTED_BLOCK = exports.EXPECTED_BLOCK = Symbol('er_EXPECTED_BLOCK');

},{}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require("./err");

var _SyntaxError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = new Map([[_SyntaxError.EXIT_NOTFOUND, "Abnormal syntax at $LOC"], [_SyntaxError.UNEXPECTED_TOKEN, "Unexpected token at $LOC"], [_SyntaxError.UNMATCHED_DELIMITER, "Expected a matching delimiter for `$1` at $LOC"], [_SyntaxError.EXPECTED_BLOCK, "Expected a code block at $LOC"]]);
module.exports = exports['default'];

},{"./err":77}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * DEFAULT Operators
 * OP - Operators
 * UOP - Unary operators
**/

var RESERVED_KEYWORDS = exports.RESERVED_KEYWORDS = new Set(['sqrt', 'cbrt', 'root', 'sin', 'cos', 'tan', 'acos', 'asin', 'atan', 'log', 'has', 'floor', 'ceil', 'round', 'len', 'reverse', 'abs', 'repr', 'sign', 'print', 'and', 'or', 'xor',
// States
'var', 'const', 'if', 'for', 'while', 'func', 'class',
// Literals
'true', 'false', 'nil']);

var EXCLUDE_META_ASSIGNMENT = exports.EXCLUDE_META_ASSIGNMENT = new Set(['==', '!=', '<=', '>=']);

var OP = exports.OP = ['^', '*', '/', '%', '+', '-', '<=', '>=', '<', '>', '==', '&', '|', '!=', '=', '+=', '-=', '*=', '/=', '^=', '%=', '&=', '|=', '<<', '>>', '<<=', '>>=', '|>', '::', '@"', 'has', 'and', 'or', 'xor', 'log', 'sign', 'root'];

// Unary operators
var UOP = exports.UOP = ['-', '+', '!', '|>', 'sqrt', 'cbrt', 'sin', 'cos', 'tan', 'acos', 'asin', 'atan', 'floor', 'ceil', 'round', 'len', 'reverse', 'abs', 'repr', 'print', 'log', 'sign', 'new', '@"'];

// TODO: how will the user modify this? no idea
//TODO: fix precedence
var UNARY_PRECEDENCE = exports.UNARY_PRECEDENCE = new Map([['new', 21000], ['!', 20000], ['-', 20000], ['+', 20000], ['@"', 17000], ['sqrt', 15000], ['cbrt', 15000], ['cos', 15000], ['sin', 15000], ['tan', 15000], ['acos', 15000], ['asin', 15000], ['atan', 15000], ['log', 15000], ['floor', 15000], ['ceil', 15000], ['abs', 15000], ['len', 15000], ['repr', 15000], ['reverse', 15000], ['round', 15000], ['sign', 15000], ['print', 0]]);

var PRECEDENCE = exports.PRECEDENCE = new Map([['::', 15000], ['log', 14000], ['root', 14000], ['*', 13000], ['/', 13000], ['%', 13000], ['+', 12000], ['-', 12000], ['@"', 12000], ['<<', 11000], ['>>', 11000], ['<', 10000], ['>', 10000], ['<=', 10000], ['>=', 10000], ['sign', 10000], ['has', 90000], ['==', 9000], ['!=', 9000], ['&', 8000], ['xor', 7000], ['|', 6000], ['and', 5000], ['or', 4000], ['+=', 1000], ['-=', 1000], ['*=', 1000], ['/=', 1000], ['%=', 1000], ['&=', 1000], ['|=', 1000], ['^=', 1000], ['<<=', 1000], ['>>=', 1000]]);

var RA_PRECEDENCE = exports.RA_PRECEDENCE = new Map([['^', 14000], ['=', 1000]]);

var TYPE = exports.TYPE = {
    UNARY: Symbol('Unary Operator'),
    LTR: Symbol('LTR Operator'),
    RTL: Symbol('RTL Operator')
};

},{}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var PropertyType = exports.PropertyType = {
    Property: Symbol('Property'),
    Method: Symbol('Method')
};

var ClassType = exports.ClassType = {
    Boolean: Symbol('Boolean'),
    Number: Symbol('Number'),
    String: Symbol('String'),
    Array: Symbol('Array')
};

},{}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _types = require('../consts/types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarBooleanToken = function (_CheddarPrimitive) {
    _inherits(CheddarBooleanToken, _CheddarPrimitive);

    function CheddarBooleanToken() {
        _classCallCheck(this, CheddarBooleanToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarBooleanToken).apply(this, arguments));
    }

    _createClass(CheddarBooleanToken, [{
        key: 'exec',
        value: function exec() {
            if (this.curchar === 't' && this.Code[this.Index + 1] === 'r' && this.Code[this.Index + 2] === 'u' && this.Code[this.Index + 3] === 'e') {
                this.Index += 4;
                this.Tokens = true;
                return this.close();
            }

            if (this.curchar === 'f' && this.Code[this.Index + 1] === 'a' && this.Code[this.Index + 2] === 'l' && this.Code[this.Index + 3] === 's' && this.Code[this.Index + 4] === 'e') {
                this.Index += 5;
                this.Tokens = false;
                return this.close();
            }

            return this.close(CheddarError.EXIT_NOTFOUND);
        }
    }, {
        key: 'Type',
        get: function get() {
            return _types.ClassType.Boolean;
        }
    }]);

    return CheddarBooleanToken;
}(_primitive2.default);

exports.default = CheddarBooleanToken;
module.exports = exports['default'];

},{"../consts/err":77,"../consts/types":80,"./primitive":87}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ops = require('../consts/ops');

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Functionized operators


var CheddarFunctionizedOperatorToken = function (_CheddarPrimitive) {
    _inherits(CheddarFunctionizedOperatorToken, _CheddarPrimitive);

    function CheddarFunctionizedOperatorToken() {
        _classCallCheck(this, CheddarFunctionizedOperatorToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarFunctionizedOperatorToken).apply(this, arguments));
    }

    _createClass(CheddarFunctionizedOperatorToken, [{
        key: 'exec',
        value: function exec() {
            return this.grammar(true, ['(', _ops.OP, ')']);
        }
    }]);

    return CheddarFunctionizedOperatorToken;
}(_primitive2.default);

exports.default = CheddarFunctionizedOperatorToken;
module.exports = exports['default'];

},{"../consts/ops":79,"./primitive":87}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _chars = require('../consts/chars');

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarLiteral = function (_CheddarLexer) {
    _inherits(CheddarLiteral, _CheddarLexer);

    function CheddarLiteral() {
        _classCallCheck(this, CheddarLiteral);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarLiteral).apply(this, arguments));
    }

    _createClass(CheddarLiteral, [{
        key: 'exec',
        value: function exec() {

            this.open();

            var chr = this.getChar();

            if (_chars.TOKEN_START.indexOf(chr) > -1) {
                this.addToken(chr);

                while (chr = this.getChar()) {
                    if (_chars.TOKEN_START.indexOf(chr) > -1) {
                        this.addToken(chr);
                    } else {
                        --this.Index;
                        break;
                    }
                }return this.close();
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND);
            }
        }
    }]);

    return CheddarLiteral;
}(_lex2.default);

exports.default = CheddarLiteral;
module.exports = exports['default'];

},{"../consts/chars":76,"../consts/err":77,"../tok/lex":106}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _types = require('../consts/types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarNilToken = function (_CheddarPrimitive) {
    _inherits(CheddarNilToken, _CheddarPrimitive);

    function CheddarNilToken() {
        _classCallCheck(this, CheddarNilToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarNilToken).apply(this, arguments));
    }

    _createClass(CheddarNilToken, [{
        key: 'exec',
        value: function exec() {
            if (this.curchar === 'n' && this.Code[this.Index + 1] === 'i' && this.Code[this.Index + 2] === 'l') {
                this.Index += 3;
                return this.close();
            }

            return this.close(CheddarError.EXIT_NOTFOUND);
        }
    }, {
        key: 'Type',
        get: function get() {
            return _types.ClassType.Boolean;
        }
    }]);

    return CheddarNilToken;
}(_primitive2.default);

exports.default = CheddarNilToken;
module.exports = exports['default'];

},{"../consts/err":77,"../consts/types":80,"./primitive":87}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _chars = require('../consts/chars');

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _types = require('../consts/types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarNumberToken = function (_CheddarPrimitive) {
    _inherits(CheddarNumberToken, _CheddarPrimitive);

    function CheddarNumberToken() {
        _classCallCheck(this, CheddarNumberToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarNumberToken).apply(this, arguments));
    }

    _createClass(CheddarNumberToken, [{
        key: 'exec',
        value: function exec() {

            this.open(false);

            var chr = this.getChar(); // Get first char

            // Ensure it starts with a digit or decimal
            if (_chars.DIGITS.indexOf(chr) > -1 || _chars.NUMBER_DECIMALS.indexOf(chr) > -1) {

                // Is a number
                // Parses in two parts:
                // 1. determining the base
                // 2. parsing the integer
                // 3. parsing the decimal
                // Errors are handled each step
                // Fatal errors only occur with
                //  number seperators

                // Base Determination

                var second_char = this.Code[this.Index]; // Gets the next character
                var base = void 0;

                if (second_char) second_char = second_char.toLowerCase();

                if (_chars.BASE_IDENTIFIERS.indexOf(second_char) > -1) {
                    // if it's a different base
                    base = _chars.BASE_RESPECTIVE_NUMBERS[_chars.BASE_IDENTIFIERS.indexOf(second_char)];
                    ++this.Index;
                } else {
                    base = 10;
                    --this.Index; // take it back now y'all
                }

                this.newToken(base);
                var digit_set = _chars.NUMERALS.slice(0, base);

                // add bitshift as token
                if (base !== 10) this.newToken(chr);else this.newToken(0);

                // Integer Parsing
                this.newToken();

                var decimal_parsed = false;

                // Loop through literal
                while (chr = this.getChar()) {
                    // Within base range?
                    if (digit_set.indexOf(chr.toUpperCase()) > -1) this.addToken(chr);
                    // If is a decimal and no decimals have occured yet
                    else if (_chars.NUMBER_DECIMALS.indexOf(chr) > -1 && decimal_parsed === false) decimal_parsed = true, this.addToken(chr);
                        // Is a digit seperator e.g. _
                        else if (_chars.NUMBER_GROUPING.indexOf(chr) > -1) {
                                    // Not the first or last integer digit
                                    if (this.last && this.Code[this.Index] && (digit_set.indexOf(this.Code[this.Index].toUpperCase()) > -1 || _chars.NUMBER_GROUPING.indexOf(this.Code[this.Index]) > -1)) continue;else return this.error(CheddarError.UNEXPECTED_TOKEN);
                            } else break;
                }--this.Index;

                // If no digits were found in the literal
                if (this.last === ".") {
                    --this.Index;
                    return this.error(CheddarError.UNEXPECTED_TOKEN); // throw compile error
                }

                return this.close(); // Close the parser
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND); // Safe exit
            }
        }
    }, {
        key: 'Type',
        get: function get() {
            return _types.ClassType.Number;
        }
    }]);

    return CheddarNumberToken;
}(_primitive2.default);

exports.default = CheddarNumberToken;
module.exports = exports['default'];

},{"../consts/chars":76,"../consts/err":77,"../consts/types":80,"./primitive":87}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _ops = require('../consts/ops');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarOperatorToken = function (_CheddarLexer) {
    _inherits(CheddarOperatorToken, _CheddarLexer);

    function CheddarOperatorToken() {
        _classCallCheck(this, CheddarOperatorToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarOperatorToken).apply(this, arguments));
    }

    _createClass(CheddarOperatorToken, [{
        key: 'exec',
        value: function exec(UNARY) {
            var ops = UNARY ? _ops.UOP : _ops.OP;
            // this.Code is the code
            // this.Index is the index
            this.open(false);

            var op = void 0;
            for (var i = 0; i < ops.length; i++) {
                if (this.Code.indexOf(ops[i], this.Index) === this.Index) {
                    if ((!op || op.length < ops[i].length) && !(/[a-z][a-z0-9]*/i.test(ops[i]) && /[a-z0-9]/i.test(this.Code[this.Index + ops[i].length]))) op = ops[i];
                }
            }

            if (op) {
                this.Tokens = op;
                this.Index += op.length;
                return this.close();
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND);
            }
        }
    }]);

    return CheddarOperatorToken;
}(_lex2.default);

exports.default = CheddarOperatorToken;
module.exports = exports['default'];

},{"../consts/err":77,"../consts/ops":79,"../tok/lex":106}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _literal = require('./literal');

var _literal2 = _interopRequireDefault(_literal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarPrimitive = function (_CheddarLiteral) {
  _inherits(CheddarPrimitive, _CheddarLiteral);

  function CheddarPrimitive() {
    _classCallCheck(this, CheddarPrimitive);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarPrimitive).apply(this, arguments));
  }

  return CheddarPrimitive;
}(_literal2.default);

exports.default = CheddarPrimitive;
module.exports = exports['default'];

},{"./literal":83}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _chars = require('../consts/chars');

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _types = require('../consts/types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarStringToken = function (_CheddarPrimitive) {
    _inherits(CheddarStringToken, _CheddarPrimitive);

    function CheddarStringToken() {
        _classCallCheck(this, CheddarStringToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarStringToken).apply(this, arguments));
    }

    _createClass(CheddarStringToken, [{
        key: 'exec',
        value: function exec() {

            this.open();

            var chr = this.getChar();
            if (_chars.STRING_DELIMITERS.indexOf(chr) > -1) {
                var loc = this.Index - 1;
                // in a string

                var qt = chr; // store quote

                while (chr = this.getChar()) {
                    if (chr === qt) {
                        break;
                    } else if (this.isLast) {
                        this.Index = loc;
                        return this.error(CheddarError.UNMATCHED_DELIMITER);
                    } else if (chr === _chars.STRING_ESCAPE) {
                        this.addToken(this.getChar());
                    } else {
                        this.addToken(chr);
                    }
                }

                return this.close();
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND);
            }
        }
    }, {
        key: 'Type',
        get: function get() {
            return _types.ClassType.String;
        }
    }]);

    return CheddarStringToken;
}(_primitive2.default);

exports.default = CheddarStringToken;
module.exports = exports['default'];

},{"../consts/chars":76,"../consts/err":77,"../consts/types":80,"./primitive":87}],89:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _chars = require('../consts/chars');

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Very similar to literal.es6 but with numbers


var CheddarVariableToken = function (_CheddarLexer) {
    _inherits(CheddarVariableToken, _CheddarLexer);

    function CheddarVariableToken() {
        _classCallCheck(this, CheddarVariableToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarVariableToken).apply(this, arguments));
    }

    _createClass(CheddarVariableToken, [{
        key: 'exec',
        value: function exec() {

            this.open();

            var chr = this.getChar();

            if (_chars.TOKEN_START.indexOf(chr) > -1) {
                this.addToken(chr);

                while (chr = this.getChar()) {
                    if (_chars.TOKEN_END.indexOf(chr) > -1) {
                        this.addToken(chr);
                    } else {
                        --this.Index;
                        break;
                    }
                }return this.close();
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND);
            }
        }
    }]);

    return CheddarVariableToken;
}(_lex2.default);

exports.default = CheddarVariableToken;
module.exports = exports['default'];

},{"../consts/chars":76,"../consts/err":77,"../tok/lex":106}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _literal = require('../literals/literal');

var _literal2 = _interopRequireDefault(_literal);

var _boolean = require('../literals/boolean');

var _boolean2 = _interopRequireDefault(_boolean);

var _nil = require('../literals/nil');

var _nil2 = _interopRequireDefault(_nil);

var _string = require('../literals/string');

var _string2 = _interopRequireDefault(_string);

var _number = require('../literals/number');

var _number2 = _interopRequireDefault(_number);

var _array = require('./array');

var _array2 = _interopRequireDefault(_array);

var _fop = require('../literals/fop');

var _fop2 = _interopRequireDefault(_fop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarAnyLiteral = function (_CheddarLexer) {
    _inherits(CheddarAnyLiteral, _CheddarLexer);

    function CheddarAnyLiteral() {
        _classCallCheck(this, CheddarAnyLiteral);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarAnyLiteral).apply(this, arguments));
    }

    _createClass(CheddarAnyLiteral, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            var attempt = this.attempt(_fop2.default, _string2.default, _number2.default, _boolean2.default, _nil2.default, _array2.default);

            if (attempt instanceof _literal2.default) {
                this.Index = attempt.Index;
                this.Tokens = attempt;
                return this.close();
            } else {
                return this.error(attempt);
            }
        }
    }]);

    return CheddarAnyLiteral;
}(_literal2.default);

exports.default = CheddarAnyLiteral;
module.exports = exports['default'];

},{"../literals/boolean":81,"../literals/fop":82,"../literals/literal":83,"../literals/nil":84,"../literals/number":85,"../literals/string":88,"./array":92}],91:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _var = require('../literals/var');

var _var2 = _interopRequireDefault(_var);

var _typed_var = require('./typed_var');

var _typed_var2 = _interopRequireDefault(_typed_var);

var _expr = require('./expr');

var _expr2 = _interopRequireDefault(_expr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarArgumentToken = function (_CheddarLexer) {
    _inherits(CheddarArgumentToken, _CheddarLexer);

    function CheddarArgumentToken() {
        _classCallCheck(this, CheddarArgumentToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarArgumentToken).apply(this, arguments));
    }

    _createClass(CheddarArgumentToken, [{
        key: 'exec',
        value: function exec() {
            //why not just argument - array handles the rest - var
            // ah, okay
            this.open(false);

            var V = _var2.default;
            var E = _expr2.default;
            var T = _typed_var2.default;

            // this can become:
            /*
            [V, [['=', E]]]
            */
            return this.grammar(true, [T, ['?'], [['=', E]]]);
        }
    }]);

    return CheddarArgumentToken;
}(_lex2.default);

exports.default = CheddarArgumentToken;
module.exports = exports['default'];

},{"../literals/var":89,"../tok/lex":106,"./expr":94,"./typed_var":98}],92:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _chars = require('../consts/chars');

var _expr = require('./expr');

var _expr2 = _interopRequireDefault(_expr);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _primitive = require('../literals/primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _types = require('../consts/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarArrayToken = function (_CheddarPrimitive) {
    _inherits(CheddarArrayToken, _CheddarPrimitive);

    function CheddarArrayToken() {
        _classCallCheck(this, CheddarArrayToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarArrayToken).apply(this, arguments));
    }

    _createClass(CheddarArrayToken, [{
        key: 'exec',
        value: function exec() {
            var OPEN = arguments.length <= 0 || arguments[0] === undefined ? _chars.ARRAY_OPEN : arguments[0];
            var CLOSE = arguments.length <= 1 || arguments[1] === undefined ? _chars.ARRAY_CLOSE : arguments[1];
            var PARSER = arguments.length <= 2 || arguments[2] === undefined ? _expr2.default : arguments[2];
            var LOOSE = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

            var c = this.getChar();
            if (c !== OPEN) return this.error(CheddarError.EXIT_NOTFOUND);
            while (true) {

                this.jumpWhite();

                if (Array.isArray(PARSER)) {
                    var parser = this.grammar.apply(this, [true].concat(_toConsumableArray(PARSER)));
                    if (!(parser instanceof _lex2.default)) return this.error(parser);
                } else {
                    var value = this.initParser(PARSER),
                        parsed = value.exec();

                    this.Index = value.Index;
                    if (parsed instanceof _lex2.default) this.Tokens = parsed;else return this.error(parsed);
                }

                this.jumpWhite();

                switch (this.getChar()) {
                    case CLOSE:
                        return this.close();
                    case _chars.ARRAY_SEPARATOR:
                        break;
                    default:
                        if (LOOSE === false) {
                            return this.error(CheddarError.UNEXPECTED_TOKEN);
                        } else {
                            return this.close(CheddarError.EXIT_NOTFOUND);
                        }
                }
            }
        }
    }, {
        key: 'Type',
        get: function get() {
            return _types.ClassType.Array;
        }
    }]);

    return CheddarArrayToken;
}(_primitive2.default);

exports.default = CheddarArrayToken;
module.exports = exports['default'];

},{"../consts/chars":76,"../consts/err":77,"../consts/types":80,"../literals/primitive":87,"../tok/lex":106,"./expr":94}],93:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CheddarCustomLexer;

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CheddarCustomLexer(orig) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var parser = new _lex2.default();
    parser.exec = function () {
        var _ref;

        return (_ref = new orig(this.Code, this.Index)).exec.apply(_ref, args);
    };
    return parser;
}
module.exports = exports['default'];

},{"../tok/lex":106}],94:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _op = require('../literals/op');

var _op2 = _interopRequireDefault(_op);

var _property = require('./property');

var _property2 = _interopRequireDefault(_property);

var _function = require('./function');

var _function2 = _interopRequireDefault(_function);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _ops = require('../consts/ops');

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _custom = require('./custom');

var _custom2 = _interopRequireDefault(_custom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Cheddar Expression Parser


// Special Exceptions

/*
For Reference, the orginal grammar is:

E -> O E
     E O E?
     ( E )
     B
     P
     L

Made right-recursive:

E -> O E α
     ( E ) α
       α  <-- This is where any custom grammars go
     B α
     P α
     L α

α -> O E α
     O α
     ε

Combined into one expression:

E -> (OE|(E)|P|L|B)[OE|O]

where groups are only nested to a depth of one

=== Forget the above ===
The following grammar should work

ternary -> α β ? E : E
expr -> α β
start -> ( E )     // parenthesis
     L         // number
     B         // boolean
     P         // identifier
     prefix E  // prefix
end -> infix E   // infix
       postfix   // postfix
       ε



even worse:

E -> α β
     ε
α -> ( E )
     L
     B
     P
     O E
β -> O E?
     ε

*/

var UNARY = (0, _custom2.default)(_op2.default, true, true);

// Class Prototypes

var CheddarExpressionToken = function (_CheddarLexer) {
    _inherits(CheddarExpressionToken, _CheddarLexer);

    function CheddarExpressionToken() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarExpressionToken);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarExpressionToken)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.isExpression = true, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return CheddarExpressionToken;
}(_lex2.default);

var CheddarExpressionTokenAlpha = function (_CheddarLexer2) {
    _inherits(CheddarExpressionTokenAlpha, _CheddarLexer2);

    function CheddarExpressionTokenAlpha() {
        var _Object$getPrototypeO2;

        var _temp2, _this2, _ret2;

        _classCallCheck(this, CheddarExpressionTokenAlpha);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(CheddarExpressionTokenAlpha)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.isExpression = true, _temp2), _possibleConstructorReturn(_this2, _ret2);
    }

    return CheddarExpressionTokenAlpha;
}(_lex2.default);

var CheddarExpressionTokenBeta = function (_CheddarLexer3) {
    _inherits(CheddarExpressionTokenBeta, _CheddarLexer3);

    function CheddarExpressionTokenBeta() {
        var _Object$getPrototypeO3;

        var _temp3, _this3, _ret3;

        _classCallCheck(this, CheddarExpressionTokenBeta);

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return _ret3 = (_temp3 = (_this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO3 = Object.getPrototypeOf(CheddarExpressionTokenBeta)).call.apply(_Object$getPrototypeO3, [this].concat(args))), _this3), _this3.isExpression = true, _temp3), _possibleConstructorReturn(_this3, _ret3);
    }

    return CheddarExpressionTokenBeta;
}(_lex2.default);

var E = (0, _custom2.default)(CheddarExpressionToken, false);

// Ternary
// Solely for reference

var CheddarExpressionTernary = function (_CheddarLexer4) {
    _inherits(CheddarExpressionTernary, _CheddarLexer4);

    function CheddarExpressionTernary() {
        _classCallCheck(this, CheddarExpressionTernary);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarExpressionTernary).apply(this, arguments));
    }

    return CheddarExpressionTernary;
}(_lex2.default);

// ALPHA


CheddarExpressionTokenAlpha.prototype.exec = function () {
    this.open(false);

    this.jumpWhite();

    return this.grammar(true, [_function2.default],
    // ['(', E, ')'],
    [UNARY, E], // Prefix
    [_property2.default]);
};

// BETA
CheddarExpressionTokenBeta.prototype.exec = function () {
    this.open(false);

    this.jumpWhite();

    return this.grammar(true, [_op2.default, E], //infix
    // [O], // postfix
    [] // ε
    );
};

// MASTER
CheddarExpressionToken.prototype.exec = function () {
    var DISALLOW_EMPTY = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var ALLOW_TERNARY = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    this.open(false);

    this.jumpWhite();

    var expression = void 0;
    if (DISALLOW_EMPTY) {
        expression = this.grammar(true, [CheddarExpressionTokenAlpha, CheddarExpressionTokenBeta]);
    } else {
        expression = this.grammar(true, [CheddarExpressionTokenAlpha, CheddarExpressionTokenBeta], [/** epsilon */]);
    }

    /** == Ternary Handling == **/
    if (ALLOW_TERNARY) {
        // Lookahead for ternary `?`
        if (!this.lookAhead("?")) {
            // If it doesn't exist, just exit
            return expression;
        }
        // Increase index past the `?`
        this.Index++;

        // Now we know it's a ternary
        // parse the tail, `E : E`

        // Parse the first expression
        var TAIL_TRUE = this.initParser(CheddarExpressionToken);
        var IFT = TAIL_TRUE.exec();

        // Set the index of the expression
        this.Index = IFT.Index || TAIL_TRUE.Index;

        // Error if applicable
        if (!(IFT instanceof _lex2.default)) return this.error(IFT);

        // IF True
        if (!this.lookAhead(":")) {
            // Expected a `:`
            return this.error(CheddarError.UNEXPECTED_TOKEN);
        }
        // Increase past the `:`
        this.Index++;

        // Parse the second expression
        var TAIL_FALSE = this.initParser(CheddarExpressionToken);
        var IFF = TAIL_FALSE.exec();

        this.Index = IFF.Index || TAIL_FALSE.Index;
        if (!(IFF instanceof _lex2.default)) return this.error(IFF);

        var Ternary = new CheddarExpressionTernary();
        console.log(require('util').inspect(this._Tokens, { depth: Infinity }));
        Ternary.Index = this.Index;
        Ternary._Tokens = [this._Tokens.slice(0), // Token from this.grammar
        IFT, IFF];

        this._Tokens = [Ternary];

        return this.close();
    } else {
        return expression;
    }
};

exports.default = CheddarExpressionToken;
module.exports = exports['default'];

},{"../consts/err":77,"../consts/ops":79,"../literals/op":86,"../tok/lex":106,"./custom":93,"./function":95,"./property":97,"util":116}],95:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expr = require('../states/expr');

var _expr2 = _interopRequireDefault(_expr);

var _block = require('../patterns/block');

var _block2 = _interopRequireDefault(_block);

var _array = require('./array');

var _array2 = _interopRequireDefault(_array);

var _argument = require('./argument');

var _argument2 = _interopRequireDefault(_argument);

var _custom = require('./custom');

var _custom2 = _interopRequireDefault(_custom);

var _primitive = require('../literals/primitive');

var _primitive2 = _interopRequireDefault(_primitive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarFunctionToken = function (_CheddarPrimitive) {
    _inherits(CheddarFunctionToken, _CheddarPrimitive);

    function CheddarFunctionToken() {
        _classCallCheck(this, CheddarFunctionToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarFunctionToken).apply(this, arguments));
    }

    _createClass(CheddarFunctionToken, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            this.jumpWhite();

            var E = _expr2.default;
            var A = (0, _custom2.default)(_array2.default, '(', ')', _argument2.default, true);

            /**
             This basically runs the following:
              "->" ARG_LIST? (CODE BLOCK | EXPRESSION)
              */

            var grammar = this.grammar(true, [[A], "->", [_block2.default, _expr2.default]]);

            return grammar;
        }
    }]);

    return CheddarFunctionToken;
}(_primitive2.default);

exports.default = CheddarFunctionToken;
module.exports = exports['default'];

},{"../literals/primitive":87,"../patterns/block":100,"../states/expr":102,"./argument":91,"./array":92,"./custom":93}],96:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expr = require('./expr');

var _expr2 = _interopRequireDefault(_expr);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import * as CheddarError from '../consts/err';


var CheddarParenthesizedExpression = function (_CheddarLexer) {
    _inherits(CheddarParenthesizedExpression, _CheddarLexer);

    function CheddarParenthesizedExpression() {
        _classCallCheck(this, CheddarParenthesizedExpression);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarParenthesizedExpression).apply(this, arguments));
    }

    _createClass(CheddarParenthesizedExpression, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            var resp = this.grammar(true, ['(', _expr2.default, ')']);

            if (resp instanceof _lex2.default) {
                resp._Tokens[0].Index = resp.Index;
                return this.close();
            } else {
                return this.error(resp);
            }

            /*
            // @Downgoat you change it if it works
            if (this.getChar() !== '(')
                this.error(CheddarError.EXIT_NOTFOUND);
             this.jumpWhite();
             let attempt = this.initParser(CheddarExpressionToken).exec();
            if (!(attempt instanceof CheddarLexer))
                this.error(CheddarError.UNEXPECTED_TOKEN);
             this.Tokens = attempt.Tokens;
            this.Index = attempt.Index;
             this.jumpWhite();
             if (this.getChar() !== ')')
                this.error(CheddarError.UNMATCHED_DELIMITER);
             return this.close(attempt);*/
        }
    }]);

    return CheddarParenthesizedExpression;
}(_lex2.default);

exports.default = CheddarParenthesizedExpression;
module.exports = exports['default'];

},{"../tok/lex":106,"./expr":94}],97:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paren_expr = require('./paren_expr');

var _paren_expr2 = _interopRequireDefault(_paren_expr);

var _var = require('../literals/var');

var _var2 = _interopRequireDefault(_var);

var _types = require('../consts/types');

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _array = require('./array');

var _array2 = _interopRequireDefault(_array);

var _any = require('./any');

var _any2 = _interopRequireDefault(_any);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _primitive = require('../literals/primitive');

var _primitive2 = _interopRequireDefault(_primitive);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ARGLISTS = new Map([['(', ')'], ['{', '}']]);

var MATCHBODY = new Set("([");

var CheddarPropertyToken = function (_CheddarLexer) {
    _inherits(CheddarPropertyToken, _CheddarLexer);

    function CheddarPropertyToken() {
        _classCallCheck(this, CheddarPropertyToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarPropertyToken).apply(this, arguments));
    }

    _createClass(CheddarPropertyToken, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            this.Type = _types.PropertyType.Property;

            var Initial = false;
            var NOVAR = false;

            // Plans for property parsing:
            //  1. Match <variable> ("." | end)
            //  2. Match <variable (<expr>,*<expr>)?

            while (true) {
                this.jumpWhite();

                var attempt = void 0;
                if (Initial === false) attempt = this.attempt(_any2.default, _var2.default, _paren_expr2.default);else attempt = this.initParser(_var2.default).exec();

                if (NOVAR === true && attempt === CheddarError.EXIT_NOTFOUND) {
                    // Do nothing?
                } else if (!(attempt instanceof _lex2.default) || attempt.Errored === true) {
                    return this.error(attempt);
                } else {
                    this.Index = attempt.Index;
                    this.Tokens = attempt;
                }

                Initial = true;
                NOVAR = false;

                if (this.curchar === '[') {
                    ++this.Index;

                    var CheddarExpressionToken = require('./expr');
                    var expr = this.initParser(CheddarExpressionToken);
                    var res = expr.exec();

                    this.Index = res.Index;

                    if (!(res instanceof _lex2.default)) return this.error(res);

                    this.jumpWhite();

                    if (this.curchar !== ']') {
                        return this.error(CheddarError.UNEXPECTED_TOKEN);
                    }

                    ++this.Index;

                    this.Tokens = "[]"; // `[]` signals expression
                    this.Tokens = expr;
                }

                var argd = void 0; // Argument list delimiter
                var id = this.Index; // delta-index
                this.jumpWhite();
                if (ARGLISTS.has(argd = this.curchar)) {
                    this.Tokens = argd; // Specify what arg type this is

                    this.Type = _types.PropertyType.Method;

                    var _expr = this.initParser(_array2.default);
                    var _res = _expr.exec(argd, ARGLISTS.get(argd));

                    this.Index = _expr.Index;

                    if (!(_res instanceof _lex2.default)) return this.error(_res);

                    this.Tokens = _expr;
                } else {
                    this.Index = id;
                }

                var marker = this.Index;
                this.jumpWhite();
                if (this.curchar === '.') {
                    ++this.Index;
                    continue;
                } else if (MATCHBODY.has(this.curchar)) {
                    NOVAR = true;
                    continue;
                }

                this.Index = marker;

                if (this._Tokens.length === 1 && this._Tokens[0] instanceof _primitive2.default) return this.close(this._Tokens[0]);else return this.close();
            }
        }
    }]);

    return CheddarPropertyToken;
}(_lex2.default);

exports.default = CheddarPropertyToken;
module.exports = exports['default'];

},{"../consts/err":77,"../consts/types":80,"../literals/primitive":87,"../literals/var":89,"../tok/lex":106,"./any":90,"./array":92,"./expr":94,"./paren_expr":96}],98:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _literal = require('../literals/literal');

var _literal2 = _interopRequireDefault(_literal);

var _var = require('../literals/var');

var _var2 = _interopRequireDefault(_var);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var L = _literal2.default;
var V = _var2.default;

var CheddarTypedVariableToken = function (_CheddarLexer) {
    _inherits(CheddarTypedVariableToken, _CheddarLexer);

    function CheddarTypedVariableToken() {
        _classCallCheck(this, CheddarTypedVariableToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarTypedVariableToken).apply(this, arguments));
    }

    _createClass(CheddarTypedVariableToken, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            // TODO: capture type name (L)
            return this.grammar(true, [[[L, ':']], V]);
        }
    }]);

    return CheddarTypedVariableToken;
}(_lex2.default);

exports.default = CheddarTypedVariableToken;
module.exports = exports['default'];

},{"../literals/literal":83,"../literals/var":89,"../tok/lex":106}],99:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarExplicitEnd = function (_CheddarLexer) {
  _inherits(CheddarExplicitEnd, _CheddarLexer);

  function CheddarExplicitEnd() {
    _classCallCheck(this, CheddarExplicitEnd);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarExplicitEnd).apply(this, arguments));
  }

  return CheddarExplicitEnd;
}(_lex2.default);

exports.default = CheddarExplicitEnd;
module.exports = exports['default'];

},{"../tok/lex":106}],100:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _tok = require('../tok');

var _tok2 = _interopRequireDefault(_tok);

var _custom = require('../parsers/custom');

var _custom2 = _interopRequireDefault(_custom);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarCodeblock = function (_CheddarLexer) {
    _inherits(CheddarCodeblock, _CheddarLexer);

    function CheddarCodeblock() {
        _classCallCheck(this, CheddarCodeblock);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarCodeblock).apply(this, arguments));
    }

    _createClass(CheddarCodeblock, [{
        key: 'exec',
        value: function exec() {
            if (!this.lookAhead("{")) return CheddarError.EXIT_NOTFOUND;

            this.jumpLiteral("{");

            var RUN = this.initParser((0, _custom2.default)(_tok2.default, '}'));
            var RES = RUN.exec();

            this.Index = RES.Index || RUN.Index;
            if (RUN.Errored || !(RES instanceof _lex2.default)) return this.error(RES);

            this.Index = RES.Index;
            this.Tokens = RES;

            this.jumpWhite();
            if (this.jumpLiteral("}") === false) {
                return this.error(CheddarError.UNEXPECTED_TOKEN);
            }

            return this.close();
        }
    }]);

    return CheddarCodeblock;
}(_lex2.default);

exports.default = CheddarCodeblock;
module.exports = exports['default'];

},{"../consts/err":77,"../parsers/custom":93,"../tok":105,"../tok/lex":106}],101:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _expr = require('../parsers/expr');

var _expr2 = _interopRequireDefault(_expr);

var _var = require('../literals/var');

var _var2 = _interopRequireDefault(_var);

var _typed_var = require('../parsers/typed_var');

var _typed_var2 = _interopRequireDefault(_typed_var);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatementAssign = function (_CheddarLexer) {
    _inherits(StatementAssign, _CheddarLexer);

    function StatementAssign() {
        _classCallCheck(this, StatementAssign);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StatementAssign).apply(this, arguments));
    }

    _createClass(StatementAssign, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            var DEFS = ['var', 'const'];
            return this.grammar(true, [DEFS, this.jumpWhite, _var2.default, CheddarError.UNEXPECTED_TOKEN, [['=', _expr2.default]]], [DEFS, this.jumpWhite, _typed_var2.default, CheddarError.UNEXPECTED_TOKEN, [['=', _expr2.default]]]);
        }
    }]);

    return StatementAssign;
}(_lex2.default);

exports.default = StatementAssign;
module.exports = exports['default'];

},{"../consts/err":77,"../literals/var":89,"../parsers/expr":94,"../parsers/typed_var":98,"../tok/lex":106}],102:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _expr = require('../parsers/expr');

var _expr2 = _interopRequireDefault(_expr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatementExpression = function (_CheddarLexer) {
    _inherits(StatementExpression, _CheddarLexer);

    function StatementExpression() {
        _classCallCheck(this, StatementExpression);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StatementExpression).apply(this, arguments));
    }

    _createClass(StatementExpression, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            return this.grammar(true, [_expr2.default]);
        }
    }]);

    return StatementExpression;
}(_lex2.default);

exports.default = StatementExpression;
module.exports = exports['default'];

},{"../parsers/expr":94,"../tok/lex":106}],103:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assign = require('./assign');

var _assign2 = _interopRequireDefault(_assign);

var _expr = require('./expr');

var _expr2 = _interopRequireDefault(_expr);

var _block = require('../patterns/block');

var _block2 = _interopRequireDefault(_block);

var _EXPLICIT = require('../patterns/EXPLICIT');

var _EXPLICIT2 = _interopRequireDefault(_EXPLICIT);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _var = require('../literals/var');

var _var2 = _interopRequireDefault(_var);

var _custom = require('../parsers/custom');

var _custom2 = _interopRequireDefault(_custom);

var _array = require('../parsers/array');

var _array2 = _interopRequireDefault(_array);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DECONSTRUCT = (0, _custom2.default)(_array2.default, '[', ']', _var2.default, true);

var StatementFor = function (_CheddarLexer) {
    _inherits(StatementFor, _CheddarLexer);

    function StatementFor() {
        _classCallCheck(this, StatementFor);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StatementFor).apply(this, arguments));
    }

    _createClass(StatementFor, [{
        key: 'exec',
        value: function exec() {
            this.open();

            if (!this.lookAhead("for")) return CheddarError.EXIT_NOTFOUND;

            this.jumpLiteral("for");

            var FOR = this.grammar(true, ['(', [DECONSTRUCT, _var2.default], 'in', _expr2.default, ')', _block2.default], ['(', [_assign2.default, _expr2.default], ';', _expr2.default, ';', _expr2.default, ')', _block2.default]);

            return FOR;
        }
    }]);

    return StatementFor;
}(_EXPLICIT2.default);

exports.default = StatementFor;
module.exports = exports['default'];

},{"../consts/err":77,"../literals/var":89,"../parsers/array":92,"../parsers/custom":93,"../patterns/EXPLICIT":99,"../patterns/block":100,"./assign":101,"./expr":102}],104:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expr = require('./expr');

var _expr2 = _interopRequireDefault(_expr);

var _block = require('../patterns/block');

var _block2 = _interopRequireDefault(_block);

var _custom = require('../parsers/custom');

var _custom2 = _interopRequireDefault(_custom);

var _EXPLICIT = require('../patterns/EXPLICIT');

var _EXPLICIT2 = _interopRequireDefault(_EXPLICIT);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatementIf = function (_CheddarLexer) {
    _inherits(StatementIf, _CheddarLexer);

    function StatementIf() {
        _classCallCheck(this, StatementIf);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StatementIf).apply(this, arguments));
    }

    _createClass(StatementIf, [{
        key: 'exec',
        value: function exec() {
            this.open();

            if (!this.lookAhead("if")) return CheddarError.EXIT_NOTFOUND;

            this.jumpLiteral("if");

            var EXPRESSION = (0, _custom2.default)(_expr2.default, true);

            // Match the `expr { block }` format
            var FORMAT = ['(', EXPRESSION, ')', _block2.default, CheddarError.EXPECTED_BLOCK];

            // Match initial `if`
            var IF = this.grammar(true, FORMAT);
            if (IF === CheddarError.EXIT_NOTFOUND) return IF;else if (!(IF instanceof _EXPLICIT2.default)) return this.error(IF);

            while (this.lookAhead("else")) {
                this.jumpLiteral("else");

                if (this.lookAhead("if")) {
                    // else-if Statement

                    this.jumpLiteral("if");
                    this.newToken("elif");
                    this.jumpWhite();

                    var OUT = this.grammar(true, FORMAT);

                    if (!OUT instanceof _EXPLICIT2.default) return this.error(OUT);
                } else {
                    // else Statement

                    this.newToken("else");
                    this.jumpWhite();

                    var RUN = this.initParser(_block2.default);
                    var RES = RUN.exec();

                    this.Index = RES.Index || RUN.Index;

                    if (RUN.Errored || !RES instanceof _EXPLICIT2.default) return this.error(RES);

                    this.Tokens = RES;
                }

                this.jumpWhite();
            }

            return this.close();
        }
    }]);

    return StatementIf;
}(_EXPLICIT2.default);

exports.default = StatementIf;
module.exports = exports['default'];

},{"../consts/err":77,"../parsers/custom":93,"../patterns/EXPLICIT":99,"../patterns/block":100,"./expr":102}],105:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('./tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _EXPLICIT = require('./patterns/EXPLICIT');

var _EXPLICIT2 = _interopRequireDefault(_EXPLICIT);

var _err = require('./consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _err_msg = require('./consts/err_msg');

var _err_msg2 = _interopRequireDefault(_err_msg);

var _loc = require('../helpers/loc');

var _loc2 = _interopRequireDefault(_loc);

var _assign = require('./states/assign');

var _assign2 = _interopRequireDefault(_assign);

var _if = require('./states/if');

var _if2 = _interopRequireDefault(_if);

var _for = require('./states/for');

var _for2 = _interopRequireDefault(_for);

var _expr = require('./states/expr');

var _expr2 = _interopRequireDefault(_expr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Global tokenizer
//  tokenizes expressions and all that great stuff

var CLOSES = '\n;';

var VALID_END = function VALID_END(chr) {
    return CLOSES.indexOf(chr) > -1 || !chr;
};

var FORMAT_ERROR = function FORMAT_ERROR(TOK, LEXER) {
    return TOK.replace(/\$LOC/, (0, _loc2.default)(LEXER.Code, LEXER.Index).slice(0, 2).join(":")).replace(/\$1/, LEXER.Code[LEXER.Index]);
};

var SINGLELINE_WHITESPACE = /[\t\f ]/;
var NEWLINE = /[\r\n]/;

var CheddarTokenize = function (_CheddarLexer) {
    _inherits(CheddarTokenize, _CheddarLexer);

    function CheddarTokenize() {
        _classCallCheck(this, CheddarTokenize);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarTokenize).apply(this, arguments));
    }

    _createClass(CheddarTokenize, [{
        key: 'exec',
        value: function exec() {
            var ENDS = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];


            var MATCH = this.attempt(_assign2.default, _if2.default, _for2.default, _expr2.default);

            if (MATCH instanceof _lex2.default && MATCH.Errored !== true) {

                this.Tokens = MATCH;
                this.Index = MATCH.Index;

                // Whether or not it backtracked for a newline
                var backtracked = false;

                while (SINGLELINE_WHITESPACE.test(this.Code[this.Index])) {
                    backtracked = true;
                    this.Index--;
                } /* then { */
                if (backtracked) {
                    if (NEWLINE.test(this.Code[this.Index - 1])) {
                        this.Index--;
                    }
                }

                while (this.Code[this.Index] && SINGLELINE_WHITESPACE.test(this.Code[this.Index]) || this._jumpComment()) {
                    this.Index++;
                }

                if (ENDS.indexOf(this.Code[this.Index]) > -1) {
                    return this.close();
                }

                if (!(MATCH instanceof _EXPLICIT2.default) && !VALID_END(this.Code[this.Index])) {
                    return this.error(FORMAT_ERROR(_err_msg2.default.get(CheddarError.UNEXPECTED_TOKEN), this));
                }

                this.Index++;

                this.jumpWhite();

                if (this.Code[this.Index]) {
                    var M2 = new CheddarTokenize(this.Code, this.Index);
                    var response = M2.exec.apply(M2, arguments);

                    if (response instanceof _lex2.default) {
                        var _Tokens;

                        (_Tokens = this._Tokens).push.apply(_Tokens, _toConsumableArray(M2._Tokens));
                        this.Index = M2.Index;
                    } else {
                        if (response !== CheddarError.EXIT_NOTFOUND) return this.error(response);
                    }
                }

                return this.close();
            } else {
                if (MATCH instanceof _lex2.default) {
                    return this.error(FORMAT_ERROR(_err_msg2.default.get(CheddarError.UNEXPECTED_TOKEN), this));
                } else {
                    return this.error(FORMAT_ERROR((typeof MATCH === 'undefined' ? 'undefined' : _typeof(MATCH)) === 'symbol' ? _err_msg2.default.get(MATCH) : MATCH.toString(), this));
                }
            }
        }
    }]);

    return CheddarTokenize;
}(_lex2.default);

exports.default = CheddarTokenize;
module.exports = exports['default'];

},{"../helpers/loc":4,"./consts/err":77,"./consts/err_msg":78,"./patterns/EXPLICIT":99,"./states/assign":101,"./states/expr":102,"./states/for":103,"./states/if":104,"./tok/lex":106}],106:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarLexer = function () {
    function CheddarLexer(Code, Index) {
        _classCallCheck(this, CheddarLexer);

        this.isExpression = false;

        this.Code = Code;
        this.Index = Index;

        this._Tokens = [];
    }

    _createClass(CheddarLexer, [{
        key: 'getChar',
        value: function getChar() {
            return this.Code[this.Index++];
        }
    }, {
        key: 'newToken',
        value: function newToken() {
            var fill = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            this._Tokens[this._Tokens.push(fill) - 1];return this;
        }
    }, {
        key: 'addToken',
        value: function addToken() {
            var char = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            this._Tokens[this._Tokens.length - 1] += char;return this;
        }
    }, {
        key: 'shift',
        value: function shift() {
            return this._Tokens.shift();
        }
    }, {
        key: 'open',
        value: function open(forceNot) {
            if (forceNot !== false) this.newToken();
        }
    }, {
        key: 'close',
        value: function close(arg) {
            return arg || this;
        }
    }, {
        key: 'error',
        value: function error(id) {
            this.Errored = true;
            return id;
        }
    }, {
        key: 'attempt',
        value: function attempt() {
            var attempt = void 0;

            for (var _len = arguments.length, parsers = Array(_len), _key = 0; _key < _len; _key++) {
                parsers[_key] = arguments[_key];
            }

            for (var i = 0; i < parsers.length; i++) {
                if (parsers[i] instanceof CheddarLexer) {
                    parsers[i].Code = this.Code;
                    parsers[i].Index = this.Index;
                    attempt = parsers[i].exec();
                } else {
                    parsers[i] = this.initParser(parsers[i]);
                    attempt = parsers[i].exec();
                }

                if (attempt instanceof CheddarLexer && attempt.Errored !== true) {
                    this.Index = attempt.Index;
                    return attempt;
                } else if (attempt !== CheddarError.EXIT_NOTFOUND) {
                    this.Index = parsers[i].Index;

                    if (attempt instanceof CheddarLexer) {
                        return this.error(CheddarError.UNEXPECTED_TOKEN);
                    } else {
                        return this.error(attempt);
                    }
                }
            }

            return this.error(CheddarError.EXIT_NOTFOUND);
        }
    }, {
        key: 'initParser',
        value: function initParser(parseClass) {
            var i = arguments.length <= 1 || arguments[1] === undefined ? this.Index : arguments[1];

            if (parseClass instanceof CheddarLexer) {
                parseClass.Code = this.Code;
                parseClass.Index = i;
                return parseClass;
            } else {
                return new parseClass(this.Code, i);
            }
        }
    }, {
        key: 'tok',
        value: function tok() {
            var n = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            return this._Tokens[n];
        }
    }, {
        key: 'grammar',
        value: function grammar(whitespace) {
            //TODO: remove unused stuff (if any)
            // defs<Array<CheddarLexer or String>>
            var index = void 0,
                parser = void 0,
                result = void 0,
                tokens = void 0,
                i = void 0,
                j = void 0,
                WDIFF = void 0;

            for (var _len2 = arguments.length, defs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                defs[_key2 - 1] = arguments[_key2];
            }

            main: for (i = 0; i < defs.length; i++) {

                index = this.Index;
                tokens = [];

                sub: for (j = 0; j < defs[i].length; j++) {
                    if (whitespace) {
                        var oldIndex = this.Index;
                        var deltaIndex = index;
                        this.Index = index;
                        this.jumpWhite();
                        index = this.Index;
                        WDIFF = this.Index - deltaIndex > 0;
                        this.Index = oldIndex;
                    }

                    if (_typeof(defs[i][j]) === 'symbol') {
                        continue sub;
                    } else if (defs[i][j] instanceof CheddarLexer) {
                        parser = defs[i][j];
                        parser.Code = this.Code;
                        parser.Index = index;
                        result = parser.exec();

                        if (result === CheddarError.EXIT_NOTFOUND) {
                            continue main;
                        } else if (!(result instanceof CheddarLexer)) {
                            this.Index = parser.Index;
                            return this.error(result);
                        }

                        index = result.Index;

                        tokens.push(result);
                    } else if (defs[i][j].prototype instanceof CheddarLexer) {
                        parser = new defs[i][j](this.Code, index);
                        result = parser.exec();

                        if (!(result instanceof CheddarLexer) && _typeof(defs[i][j + 1]) === 'symbol') {
                            this.Index = Math.max(parser.Index, index);
                            return this.error(defs[i][j + 1]);
                        }

                        if (result === CheddarError.EXIT_NOTFOUND) {
                            continue main;
                        } else if (!(result instanceof CheddarLexer)) {
                            this.Index = parser.Index;
                            return this.error(result);
                        }

                        index = parser.Index;

                        // Filters out meaningless data
                        if (!((result.constructor.name.endsWith('Alpha') || result.constructor.name.endsWith('Beta')) && result._Tokens.length === 0)) tokens.push(result);
                    } else if (defs[i][j] === this.jumpWhite) {
                        var _oldIndex = this.Index;
                        this.Index = index;
                        if (whitespace ? !WDIFF : !/\s/.test(this.curchar)) return this.error(CheddarError.EXIT_NOTFOUND);
                        this.jumpWhite();
                        index = this.Index;
                        this.Index = _oldIndex;
                    } else if (defs[i][j] === this.jumpSpace) {
                        var _oldIndex2 = this.Index;
                        this.Index = index;
                        this.jumpWhite();
                        index = this.Index;
                        this.Index = _oldIndex2;
                    } else if (Array.isArray(defs[i][j])) {
                        if (defs[i][j].length === 1) {
                            if (Array.isArray(defs[i][j][0])) {
                                var _defs$i;

                                // TODO: not recommended; creates 2^optionals new rules
                                //slice(0) clones array
                                var def = defs[i].slice(0);
                                def.splice(j, 1);
                                defs.splice(i + 1, 0, def);
                                (_defs$i = defs[i]).splice.apply(_defs$i, [j, 1].concat(_toConsumableArray(defs[i][j][0])));
                                i--;
                                continue main;
                            }

                            // Optional
                            if (typeof defs[i][j][0] === 'string') {
                                // If it matches
                                if (this.Code.indexOf(defs[i][j][0], index) === index) {
                                    index += defs[i][j][0].length;
                                    tokens.push(defs[i][j][0]);
                                }
                            } else {
                                parser = this.initParser(defs[i][j][0], index);
                                result = parser.exec();

                                if (result !== CheddarError.EXIT_NOTFOUND) {
                                    if (!(result instanceof CheddarLexer)) {
                                        return this.error(result);
                                    } else {
                                        index = result.Index;

                                        // Filter
                                        if (!((result.constructor.name.endsWith('Alpha') || result.constructor.name.endsWith('Beta')) && result._Tokens.length === 0)) tokens.push(result);
                                    }
                                }
                            }
                        } else {
                            // OR
                            var match = void 0;
                            var _oldIndex3 = this.Index;
                            for (var k = 0; k < defs[i][j].length; k++) {
                                this.Index = index;
                                if (defs[i][j][k].prototype instanceof CheddarLexer || defs[i][j][k] instanceof CheddarLexer) {
                                    result = this.initParser(defs[i][j][k]).exec();
                                    if (result instanceof CheddarLexer) {
                                        match = result;
                                        index = result.Index;
                                        break;
                                    }
                                    if (result !== CheddarError.EXIT_NOTFOUND) return this.error(result);
                                } else {
                                    result = this.jumpLiteral(defs[i][j][k]);
                                    if (result) {
                                        match = defs[i][j][k];
                                        index = this.Index;
                                        break;
                                    }
                                }
                            }
                            this.Index = _oldIndex3;
                            if (match) {
                                if (!((result.constructor.name.endsWith('Alpha') || result.constructor.name.endsWith('Beta')) && result._Tokens.length === 0)) {
                                    tokens.push(match);
                                    continue sub;
                                }
                            } else {
                                // this.Index = result.Index;
                                return this.error(CheddarError.EXIT_NOTFOUND);
                            }
                        }
                    } else {
                        // It must be a string
                        var _oldIndex4 = this.Index;
                        this.Index = index;
                        result = this.jumpLiteral(defs[i][j]);
                        if (result) index = this.Index;
                        this.Index = _oldIndex4;
                        if (!result) continue main;
                    }
                }

                this.Tokens = tokens;
                this.Index = index;

                return this.close();
            }

            return this.error(CheddarError.EXIT_NOTFOUND);
        }

        /*
        Whitespace Grammar:
        W -> w
             w C1 w
             w C2 w
             ... etc
         Right-recursive:
        W -> w α
             α
        α -> C1 W
             C2 W
         where C1...CN are terminal comment grammars
        */

    }, {
        key: 'jumpWhite',
        value: function jumpWhite() {
            var STARTINDEX = this.Index;
            while (/\s/.test(this.Code[this.Index])) {
                this.Index++;
                this._jumpComment();
            }

            return this;
        }
    }, {
        key: '_jumpComment',
        value: function _jumpComment() {
            if (this.Code[this.Index] === '/') {
                switch (this.Code[this.Index + 1]) {
                    case '*':
                        // match till EOF or '*/'
                        this.Index += 2;
                        this._jumpBlockComment();
                        break;
                    case '/':
                        // match till EOF or newline
                        this.Index += 2; // jump ahead to the start of the comment
                        while (this.curchar && this.curchar !== '\n') {
                            this.Index++;
                        }break;
                    default:
                        return false;
                }

                return true;
            } else {
                return false;
            }

            // you must of borked something bad if this is executing
        }
    }, {
        key: '_jumpBlockComment',
        value: function _jumpBlockComment() {
            var nextStart = void 0,
                nextEnd = void 0,
                depth = 1,
                newIndex = this.Index + 2;
            while (depth) {
                nextStart = this.Code.indexOf('/*', newIndex);
                nextEnd = this.Code.indexOf('*/', newIndex);
                if (nextStart < nextEnd) {
                    depth++;
                    newIndex = nextStart + 2;
                } else {
                    depth--;
                    newIndex = nextEnd + 2;
                }
                if (nextEnd === -1) return this.error(CheddarError.UNEXPECTED_TOKEN);
            }
            this.Index = newIndex;
            return this;
        }
    }, {
        key: 'jumpLiteral',
        value: function jumpLiteral(l) {
            //TODO: make more efficient
            //downgoat D: this returned first index
            //took me 6 hours to figure out the problem :(
            //D: D: D:
            if (this.Code.indexOf(l, this.Index) === this.Index) this.Index += l.length;else return false;
            return this;
        }
    }, {
        key: 'jumpSpace',
        value: function jumpSpace() {
            return this.jumpWhite();
        }
    }, {
        key: 'lookAhead',
        value: function lookAhead(seq) {
            this.jumpWhite();
            return this.Code.indexOf(seq, this.Index) === this.Index;
        }
    }, {
        key: 'curchar',
        get: function get() {
            return this.Code[this.Index];
        }
    }, {
        key: 'last',
        get: function get() {
            return this._Tokens[this._Tokens.length - 1];
        }
    }, {
        key: 'Tokens',
        get: function get() {
            return this._Tokens;
        },
        set: function set(v) {
            var _Tokens;

            if (Array.isArray(v)) (_Tokens = this._Tokens).push.apply(_Tokens, _toConsumableArray(v));else this._Tokens.push(v);
        }
    }, {
        key: 'isLast',
        get: function get() {
            return this.Index === this.Code.length;
        }
    }, {
        key: 'isPrimitive',
        get: function get() {
            return false;
        }
    }]);

    return CheddarLexer;
}();

exports.default = CheddarLexer;
module.exports = exports['default'];

},{"../consts/err":77}],107:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _op = require('../literals/op');

var _op2 = _interopRequireDefault(_op);

var _ops = require('../consts/ops');

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _lex = require('./lex');

var _lex2 = _interopRequireDefault(_lex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarShuntingYard = function (_CheddarLexer) {
    _inherits(CheddarShuntingYard, _CheddarLexer);

    function CheddarShuntingYard() {
        _classCallCheck(this, CheddarShuntingYard);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarShuntingYard).apply(this, arguments));
    }

    _createClass(CheddarShuntingYard, [{
        key: 'exec',
        value: function exec(expression) {
            var _Tokens;

            if (expression && expression.Code) this.Code = expression.Code;
            if (expression && expression.Index) this.Index = expression.Index;

            // Flatten the expression
            var current = expression;
            var tokens = [];
            if (!current || !current.isExpression || current._Tokens.length > 2) return this.close(expression);

            while (current && current._Tokens.length === 2 && (current.tok(1).isExpression || // prevents import recursion
            current.tok(1) instanceof CheddarShuntingYard)) {
                if (current.tok().isExpression) //TODO: code, index
                    tokens.push(new CheddarShuntingYard().exec(current.tok()));else tokens.push(current.tok());
                if (current.tok(1) instanceof CheddarShuntingYard) {
                    tokens.push(current.tok(1));
                    current = null;
                    break;
                } else current = current.tok(1);
                //TODO: make sure this covers all cases; otherwise, see when this doesn't work
            }

            if (current && current._Tokens.length > 1) {
                this.Index = current.Index;
                return this.error(CheddarError.UNEXPECTED_TOKEN);
            }

            if (current && current._Tokens.length === 1) {
                if (current.tok().isExpression) tokens.push(new CheddarShuntingYard().exec(current.tok()));else tokens.push(current.tok());
            }

            // Reorder tokens
            var operators = [],
                precedences = [],
                unary = true;
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i],
                    previousPrecedence = 0;
                if (token instanceof CheddarShuntingYard) {
                    for (var _i = 0; _i < token._Tokens.length; _i++) {
                        this.Tokens = token.tok(_i);
                    }unary = false;
                } else if (token instanceof _op2.default) {
                    // It's an operator
                    if (_ops.RA_PRECEDENCE.has(token.tok(0))) token.Tokens = _ops.TYPE.RTL;else if (unary) token.Tokens = _ops.TYPE.UNARY;else token.Tokens = _ops.TYPE.LTR;

                    var precedence = void 0;
                    switch (token.tok(1)) {
                        case _ops.TYPE.RTL:
                            precedence = _ops.RA_PRECEDENCE.get(token.tok());
                            break;
                        case _ops.TYPE.UNARY:
                            precedence = _ops.UNARY_PRECEDENCE.get(token.tok());
                            break;
                        case _ops.TYPE.LTR:
                            precedence = _ops.PRECEDENCE.get(token.tok());
                            break;
                    }

                    var minus = token.tok(1) == _ops.TYPE.RTL ? 0 : 1;
                    previousPrecedence = precedences[precedences.length - 1];
                    while (precedence - minus < previousPrecedence) {
                        this.Tokens = operators.pop();
                        precedences.pop();
                        previousPrecedence = precedences[precedences.length - 1];
                    }

                    operators.push(token);
                    precedences.push(precedence);
                    previousPrecedence = precedence;
                    unary = true;
                } else {
                    this.Tokens = token;
                    unary = false;
                }
            }

            (_Tokens = this.Tokens).push.apply(_Tokens, _toConsumableArray(operators.reverse()));

            return this.close();
        }
    }]);

    return CheddarShuntingYard;
}(_lex2.default);

exports.default = CheddarShuntingYard;
module.exports = exports['default'];

},{"../consts/err":77,"../consts/ops":79,"../literals/op":86,"./lex":106}],108:[function(require,module,exports){

},{}],109:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = byteOffset; i < arrLength; ++i) {
    if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }

  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":110,"ieee754":111,"isarray":112}],110:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],111:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],112:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],113:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],114:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],115:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],116:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":115,"_process":114,"inherits":113}],117:[function(require,module,exports){
/*

The MIT License (MIT)

Original Library 
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var ansiStyles = colors.styles = require('./styles');
var defineProps = Object.defineProperties;

colors.supportsColor = require('./system/supports-colors');

if (typeof colors.enabled === "undefined") {
  colors.enabled = colors.supportsColor;
}

colors.stripColors = colors.strip = function(str){
  return ("" + str).replace(/\x1B\[\d+m/g, '');
};


var stylize = colors.stylize = function stylize (str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  return ansiStyles[style].open + str + ansiStyles[style].close;
}

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe,  '\\$&');
}

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function () {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function (key) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = arguments;
  var argsLen = args.length;
  var str = argsLen !== 0 && String(arguments[0]);
  if (argsLen > 1) {
    for (var a = 1; a < argsLen; a++) {
      str += ' ' + args[a];
    }
  }

  if (!colors.enabled || !str) {
    return str;
  }

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
  }

  return str;
}

function applyTheme (theme) {
  for (var style in theme) {
    (function(style){
      colors[style] = function(str){
        if (typeof theme[style] === 'object'){
          var out = str;
          for (var i in theme[style]){
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style)
  }
}

colors.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      colors.themes[theme] = require(theme);
      applyTheme(colors.themes[theme]);
      return colors.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

var sequencer = function sequencer (map, str) {
  var exploded = str.split(""), i = 0;
  exploded = exploded.map(map);
  return exploded.join("");
};

// custom formatter methods
colors.trap = require('./custom/trap');
colors.zalgo = require('./custom/zalgo');

// maps
colors.maps = {};
colors.maps.america = require('./maps/america');
colors.maps.zebra = require('./maps/zebra');
colors.maps.rainbow = require('./maps/rainbow');
colors.maps.random = require('./maps/random')

for (var map in colors.maps) {
  (function(map){
    colors[map] = function (str) {
      return sequencer(colors.maps[map], str);
    }
  })(map)
}

defineProps(colors, init());
},{"./custom/trap":118,"./custom/zalgo":119,"./maps/america":122,"./maps/rainbow":123,"./maps/random":124,"./maps/zebra":125,"./styles":126,"./system/supports-colors":127}],118:[function(require,module,exports){
module['exports'] = function runTheTrap (text, options) {
  var result = "";
  text = text || "Run the trap, drop the bass";
  text = text.split('');
  var trap = {
    a: ["\u0040", "\u0104", "\u023a", "\u0245", "\u0394", "\u039b", "\u0414"],
    b: ["\u00df", "\u0181", "\u0243", "\u026e", "\u03b2", "\u0e3f"],
    c: ["\u00a9", "\u023b", "\u03fe"],
    d: ["\u00d0", "\u018a", "\u0500" , "\u0501" ,"\u0502", "\u0503"],
    e: ["\u00cb", "\u0115", "\u018e", "\u0258", "\u03a3", "\u03be", "\u04bc", "\u0a6c"],
    f: ["\u04fa"],
    g: ["\u0262"],
    h: ["\u0126", "\u0195", "\u04a2", "\u04ba", "\u04c7", "\u050a"],
    i: ["\u0f0f"],
    j: ["\u0134"],
    k: ["\u0138", "\u04a0", "\u04c3", "\u051e"],
    l: ["\u0139"],
    m: ["\u028d", "\u04cd", "\u04ce", "\u0520", "\u0521", "\u0d69"],
    n: ["\u00d1", "\u014b", "\u019d", "\u0376", "\u03a0", "\u048a"],
    o: ["\u00d8", "\u00f5", "\u00f8", "\u01fe", "\u0298", "\u047a", "\u05dd", "\u06dd", "\u0e4f"],
    p: ["\u01f7", "\u048e"],
    q: ["\u09cd"],
    r: ["\u00ae", "\u01a6", "\u0210", "\u024c", "\u0280", "\u042f"],
    s: ["\u00a7", "\u03de", "\u03df", "\u03e8"],
    t: ["\u0141", "\u0166", "\u0373"],
    u: ["\u01b1", "\u054d"],
    v: ["\u05d8"],
    w: ["\u0428", "\u0460", "\u047c", "\u0d70"],
    x: ["\u04b2", "\u04fe", "\u04fc", "\u04fd"],
    y: ["\u00a5", "\u04b0", "\u04cb"],
    z: ["\u01b5", "\u0240"]
  }
  text.forEach(function(c){
    c = c.toLowerCase();
    var chars = trap[c] || [" "];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== "undefined") {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;

}

},{}],119:[function(require,module,exports){
// please no
module['exports'] = function zalgo(text, options) {
  text = text || "   he is here   ";
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }
  

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] =   typeof options["up"]   !== 'undefined' ? options["up"]   : true;
    options["mid"] =  typeof options["mid"]  !== 'undefined' ? options["mid"]  : true;
    options["down"] = typeof options["down"] !== 'undefined' ? options["down"] : true;
    options["size"] = typeof options["size"] !== 'undefined' ? options["size"] : "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.mid = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.mid = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
}

},{}],120:[function(require,module,exports){
var colors = require('./colors');

module['exports'] = function () {

  //
  // Extends prototype of native string object to allow for "foo".red syntax
  //
  var addProperty = function (color, func) {
    String.prototype.__defineGetter__(color, func);
  };

  var sequencer = function sequencer (map, str) {
      return function () {
        var exploded = this.split(""), i = 0;
        exploded = exploded.map(map);
        return exploded.join("");
      }
  };

  addProperty('strip', function () {
    return colors.strip(this);
  });

  addProperty('stripColors', function () {
    return colors.strip(this);
  });

  addProperty("trap", function(){
    return colors.trap(this);
  });

  addProperty("zalgo", function(){
    return colors.zalgo(this);
  });

  addProperty("zebra", function(){
    return colors.zebra(this);
  });

  addProperty("rainbow", function(){
    return colors.rainbow(this);
  });

  addProperty("random", function(){
    return colors.random(this);
  });

  addProperty("america", function(){
    return colors.america(this);
  });

  //
  // Iterate through all default styles and colors
  //
  var x = Object.keys(colors.styles);
  x.forEach(function (style) {
    addProperty(style, function () {
      return colors.stylize(this, style);
    });
  });

  function applyTheme(theme) {
    //
    // Remark: This is a list of methods that exist
    // on String that you should not overwrite.
    //
    var stringPrototypeBlacklist = [
      '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'charAt', 'constructor',
      'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'charCodeAt',
      'indexOf', 'lastIndexof', 'length', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substring',
      'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight'
    ];

    Object.keys(theme).forEach(function (prop) {
      if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
        console.log('warn: '.red + ('String.prototype' + prop).magenta + ' is probably something you don\'t want to override. Ignoring style name');
      }
      else {
        if (typeof(theme[prop]) === 'string') {
          colors[prop] = colors[theme[prop]];
          addProperty(prop, function () {
            return colors[theme[prop]](this);
          });
        }
        else {
          addProperty(prop, function () {
            var ret = this;
            for (var t = 0; t < theme[prop].length; t++) {
              ret = colors[theme[prop][t]](ret);
            }
            return ret;
          });
        }
      }
    });
  }

  colors.setTheme = function (theme) {
    if (typeof theme === 'string') {
      try {
        colors.themes[theme] = require(theme);
        applyTheme(colors.themes[theme]);
        return colors.themes[theme];
      } catch (err) {
        console.log(err);
        return err;
      }
    } else {
      applyTheme(theme);
    }
  };

};
},{"./colors":117}],121:[function(require,module,exports){
var colors = require('./colors');
module['exports'] = colors;

// Remark: By default, colors will add style properties to String.prototype
//
// If you don't wish to extend String.prototype you can do this instead and native String will not be touched
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
require('./extendStringPrototype')();
},{"./colors":117,"./extendStringPrototype":120}],122:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = (function() {
  return function (letter, i, exploded) {
    if(letter === " ") return letter;
    switch(i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter)
      case 2: return colors.blue(letter)
    }
  }
})();
},{"../colors":117}],123:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
})();


},{"../colors":117}],124:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = (function () {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  return function(letter, i, exploded) {
    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
  };
})();
},{"../colors":117}],125:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = function (letter, i, exploded) {
  return i % 2 === 0 ? letter : colors.inverse(letter);
};
},{"../colors":117}],126:[function(require,module,exports){
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49]

};

Object.keys(codes).forEach(function (key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});
},{}],127:[function(require,module,exports){
(function (process){
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var argv = process.argv;

module.exports = (function () {
  if (argv.indexOf('--no-color') !== -1 ||
    argv.indexOf('--color=false') !== -1) {
    return false;
  }

  if (argv.indexOf('--color') !== -1 ||
    argv.indexOf('--color=true') !== -1 ||
    argv.indexOf('--color=always') !== -1) {
    return true;
  }

  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }

  if (process.platform === 'win32') {
    return true;
  }

  if ('COLORTERM' in process.env) {
    return true;
  }

  if (process.env.TERM === 'dumb') {
    return false;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }

  return false;
})();
}).call(this,require('_process'))
},{"_process":114}]},{},[1]);
