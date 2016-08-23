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
		} else if (Output && Output.Cast && Output.Cast.has('String')) {
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

},{"../helpers/caret":2,"../interpreter/core/consts/nil":10,"../interpreter/core/env/scope":14,"../interpreter/exec":42,"../stdlib/stdlib":102,"../tokenizer/tok":139,"colors":149,"readline":143}],2:[function(require,module,exports){
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

},{"./loc":4,"colors":149}],3:[function(require,module,exports){
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
module.exports = exports["default"];

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
module.exports = exports["default"];

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

},{"../primitives/Array":21,"../primitives/Bool":22,"../primitives/Number":24,"../primitives/String":26}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EVALUATED_LINKS = exports.PRIMITIVE_LINKS = undefined;

var _Dictionary = require('../primitives/Dictionary');

var _Dictionary2 = _interopRequireDefault(_Dictionary);

var _Symbol = require('../primitives/Symbol');

var _Symbol2 = _interopRequireDefault(_Symbol);

var _String = require('../primitives/String');

var _String2 = _interopRequireDefault(_String);

var _Number = require('../primitives/Number');

var _Number2 = _interopRequireDefault(_Number);

var _Array = require('../primitives/Array');

var _Array2 = _interopRequireDefault(_Array);

var _Regex = require('../primitives/Regex');

var _Regex2 = _interopRequireDefault(_Regex);

var _Bool = require('../primitives/Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _nil = require('../consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _func = require('../env/func');

var _func2 = _interopRequireDefault(_func);

var _fop = require('../evaluated/fop');

var _fop2 = _interopRequireDefault(_fop);

var _fprop = require('../evaluated/fprop');

var _fprop2 = _interopRequireDefault(_fprop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PRIMITIVE_LINKS = exports.PRIMITIVE_LINKS = new Map([["CheddarNilToken", _nil2.default], ["CheddarFunctionToken", _func2.default], ["CheddarBooleanToken", _Bool2.default], ["CheddarRegexToken", _Regex2.default], ["CheddarArrayToken", _Array2.default], ["CheddarSymbolToken", _Symbol2.default], ["CheddarStringToken", _String2.default], ["CheddarNumberToken", _Number2.default], ["CheddarDictToken", _Dictionary2.default]]);

var EVALUATED_LINKS = exports.EVALUATED_LINKS = new Map([["CheddarFunctionizedOperatorToken", _fop2.default], ["CheddarFunctionizedPropertyToken", _fprop2.default]]);

},{"../consts/nil":10,"../env/func":13,"../evaluated/fop":19,"../evaluated/fprop":20,"../primitives/Array":21,"../primitives/Bool":22,"../primitives/Dictionary":23,"../primitives/Number":24,"../primitives/Regex":25,"../primitives/String":26,"../primitives/Symbol":27}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KEY_INTERNAL = exports.KEY_INTERNAL = new Set("String", "Number");

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require("./err");

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([[_err2.default.KEY_NOT_FOUND, "Attempted to access undefined variable `$0`"], [_err2.default.KEY_IS_RESERVED, "Attempted to access reserved keyword $0"], [_err2.default.NO_OP_BEHAVIOR, "`$0` has no behavior for types `$2` and `$1`"], [_err2.default.NOT_A_REFERENCE, "Left side of assignment is not a reference"], [_err2.default.CANNOT_READ_PROP, "Cannot read property `$0` of nil (`$1`)"], [_err2.default.UNLINKED_CLASS, "InternalError: Token `$0` has no link."], [_err2.default.MALFORMED_TOKEN, "InternalError: Recieved a malformed token at callstack ref. $0"], [_err2.default.ABSTRACT_USED, "InternalError: Attempted to construct an abstract interface"]]);
module.exports = exports["default"];

},{"./err":8}],10:[function(require,module,exports){
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
        }, _this.Cast = new Map([].concat(_toConsumableArray(_class2.default.Operator), [['String', function () {
            return (0, _init2.default)(require('../primitives/String'), "nil");
        }, 'Bool', function () {
            return (0, _init2.default)(require('../primitives/Bool'), false);
        }]])), _temp), _possibleConstructorReturn(_this, _ret);
    }

    return NIL;
}(_class2.default);

NIL.Name = "nil";
exports.default = NIL;
module.exports = exports['default'];

},{"../../../helpers/init":3,"../env/class":11,"../primitives/Bool":22,"../primitives/String":26}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scope = require('./scope');

var _scope2 = _interopRequireDefault(_scope);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

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

    // Define operators. Each item in the
    //  hash-map, defines behavior for the
    //  specific token in an OperatorToken
    // Operators:HashMap<Token, Behavior(LHS, RHS)>
    // Unary operators will RHS explicitly be
    //  an unabstrated, native, `null` value
    //  which will require an interface in order
    //  for a Cheddar unary operator interface
    //
    //     Operator = DEFAULT_OP;
    //     Cast = DEFAULT_CAST;
    //
    // See CheddarScope for details

    // TODO: Write some superflicious and redundant
    //  explanation elaborating on the abstract
    //  nature of this particulator subject of matter
    //  being discussed.
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
exports.default = CheddarClass;
module.exports = exports['default'];

},{"../consts/err":8,"./scope":14}],12:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_RHS_OP = exports.DEFAULT_CAST = exports.DEFAULT_OP = undefined;

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

var _init = require('../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Request dependencies for
//  preset casing for operator
//  handling
var DEFAULT_OP = exports.DEFAULT_OP = new Map([

// print: Definition
['print', function (_, LHS) {
    if (!LHS || !LHS.Cast) return _err2.default.NO_OP_BEHAVIOR;

    // Attempt to call `repr`, else, cast to string
    var VAL = LHS.constructor.Name === 'String' ? LHS : LHS.Cast.has('String') ? LHS.Cast.get('String')(LHS) : LHS.Operator.has('repr') ? LHS.Operator.get('repr')(null, LHS) : LHS;

    // Stream
    if (VAL.constructor.Name === 'String') global.CHEDDAR_OPTS.PRINT(VAL.value + "\n");else return _err2.default.NO_OP_BEHAVIOR;

    return LHS;
}],

// + is no-op by default
['+', function (_, self) {
    if (_) return _err2.default.NO_OP_BEHAVIOR;

    // Destroy the references
    delete self.scope;
    delete self.Reference;
    return self;
}], ['is', function (LHS, RHS) {
    var c = require('./class');
    if (LHS === null) {
        var f = require('./func');
        var comp = RHS.Operator.get('==');
        if (!comp) {
            return '`' + (RHS.constructor.Name || RHS.Name || "object") + '` has no behavior for `==`';
        }
        var fn = new f([["item", {}]], function (scope, input) {
            return comp(RHS, input("item"));
        });

        fn.WHICH_CLASS = RHS instanceof c ? RHS.constructor : null;
        fn.SELF = RHS;
        return fn;
    } else {
        if (!(RHS.prototype instanceof c)) {
            return _err2.default.NO_OP_BEHAVIOR;
        }
        var b = require('../primitives/Bool');
        return (0, _init2.default)(b, LHS instanceof RHS);
    }
}], ['actually', function (LHS, RHS) {
    var CheddarBool = require('../primitives/Bool');
    return (0, _init2.default)(CheddarBool, LHS && RHS.SELF ? LHS === RHS.SELF : _err2.default.NO_OP_BEHAVIOR);
}], ['what', function (LHS, RHS) {
    return RHS.WHICH_CLASS || _err2.default.NO_OP_BEHAVIOR;
}], ['::', function (LHS, RHS) {
    var CheddarClass = require('./class');
    var CAST_ALIAS = require('../config/alias');

    if (!(LHS.prototype instanceof CheddarClass)) {
        // ERROR INTEGRATE
        return 'Cast target must be class';
    }

    if (RHS.constructor === LHS) return RHS;

    var res = void 0;
    if (res = RHS.Cast.get(LHS.Name) || RHS.Cast.get(LHS) || RHS.Cast.get(CAST_ALIAS.get(LHS))) {
        return res(RHS);
    } else {
        return 'Cannot cast to given target `' + (LHS.Name || "object") + '`';
    }
}], ['as', function (LHS, RHS) {
    var cast = RHS.Operator.get("::");
    return cast(RHS, LHS);
}], ['==', function (LHS, RHS) {
    return (0, _init2.default)(require("../primitives/Bool"), RHS && (LHS === RHS || LHS instanceof RHS.constructor && LHS.value && LHS.value === RHS.value));
}], ['!=', function (LHS, RHS) {
    var eq = LHS.Operator.get('==');
    if (!eq) return _err2.default.NO_OP_BEHAVIOR;
    return (0, _init2.default)(require("../primitives/Bool"), !eq(LHS, RHS).value);
}],

// Defaults
['!', function (LHS, RHS) {
    if (LHS === null && RHS && RHS.Cast && RHS.Cast.has('Bool')) return (0, _init2.default)(require("../primitives/Bool"), !RHS.Cast.get('Bool')(RHS).value);else return _err2.default.NO_OP_BEHAVIOR;
}],

// TODO: short-circuiting
['&&', function (LHS, RHS) {
    var bool = require("../primitives/Bool");
    if (LHS && RHS) return (0, _init2.default)(bool, (0, _init2.default)(bool, LHS).value && (0, _init2.default)(bool, RHS).value);else return _err2.default.NO_OP_BEHAVIOR;
}],

// TODO: short-circuiting
['||', function (LHS, RHS) {
    var bool = require("../primitives/Bool");
    if (LHS && RHS) return (0, _init2.default)(bool, (0, _init2.default)(bool, LHS).value || (0, _init2.default)(bool, RHS).value);else return _err2.default.NO_OP_BEHAVIOR;
}]]);

var DEFAULT_CAST = exports.DEFAULT_CAST = new Map([['Bool', function (self) {
    var bool = require("../primitives/Bool");
    return (0, _init2.default)(bool, self);
}]]);

var DEFAULT_RHS_OP = exports.DEFAULT_RHS_OP = new Map();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../../helpers/init":3,"../config/alias":5,"../consts/err":8,"../primitives/Bool":22,"./class":11,"./func":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _var = require('./var');

var _var2 = _interopRequireDefault(_var);

var _scope = require('./scope');

var _scope2 = _interopRequireDefault(_scope);

var _class = require('./class');

var _class2 = _interopRequireDefault(_class);

var _signal = require('../../signal');

var _signal2 = _interopRequireDefault(_signal);

var _nil = require('../consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarFunction = function (_CheddarClass) {
    _inherits(CheddarFunction, _CheddarClass);

    function CheddarFunction(args, body) {
        _classCallCheck(this, CheddarFunction);

        // List of arguments the
        //  function is expecting
        // Tokens handled by init
        // #generateScope handles
        //  the enforcement
        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarFunction).call(this, null));

        _initialiseProps.call(_this);

        _this.args = args;

        // Function body, either a
        //  native function or a
        //  exec/eval pattern body
        _this.body = body;

        // Does the function have a self-alias?
        _this.selfRef = null;
        return _this;
    }

    // Initalizes from primitive arguments


    _createClass(CheddarFunction, [{
        key: 'init',
        value: function init(args, selfRef, body) {
            if (!body) {
                body = selfRef;
                selfRef = null;
            } else {
                selfRef = selfRef._Tokens[0];
            }

            // Move the scope argument to correct prop
            this.inherited = this.args;
            this.Reference = this.body;

            if (args === "") {
                args = [];
            } else {

                if (args.constructor.name !== "CheddarArrayToken") {
                    args = { _Tokens: [args] };
                }

                var argument = void 0,
                    res = Array(args._Tokens.length);
                for (var i = 0; i < args._Tokens.length; i++) {
                    argument = args._Tokens[i];

                    // Argument is a arg object
                    var props = {};
                    var name = void 0;

                    // Store the argument tokens
                    var arg = argument._Tokens;
                    var nameargs = arg[0]._Tokens;

                    props.Optional = arg[1] === '?';
                    props.Default = arg[2] || arg[1] && arg[1].constructor.name === "StatementExpression" && arg[1];

                    props.Type = nameargs.length > 1 && nameargs[1];

                    if (props.Type) {
                        var type = this.inherited.accessor(props.Type._Tokens[0]);
                        if (!type) {
                            return props.Type._Tokens[0] + ' is not defined';
                        }

                        type = type.Value;

                        if (!(type.prototype instanceof _class2.default)) {
                            return props.Type._Tokens[0] + ' is not a class';
                        }

                        props.Type = type;
                    }

                    name = nameargs[0]._Tokens[0];

                    res[i] = [name, props];
                }

                args = res;
            }

            this.args = args;
            this.body = body;
            this.selfRef = selfRef;

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
                }, input);
            } else {
                var executor = require(this.body.constructor.name === "StatementExpression" ? '../eval/eval' : '../../exec');

                var res = new executor(this.body.constructor.name === "StatementExpression" ? this.body : this.body._Tokens[0], scope).exec();

                if (res instanceof _signal2.default) {
                    if (res.is(_signal2.default.RETURN)) {
                        res = res.data;
                    }
                }

                return res;
            }
        }
    }, {
        key: 'generateScope',
        value: function generateScope(input, self) {
            var _this2 = this;

            var args = new _scope2.default(this.inherited || null);

            var CheddarArray = require('../primitives/Array');
            var tmp = void 0;

            if (self) {
                args.setter("self", new _var2.default(self, {
                    Writeable: false
                }));
            }

            if (this.selfRef) {
                args.setter(this.selfRef, new _var2.default(this, {}));
            }

            var _loop = function _loop(i) {
                tmp = _this2.args[i][1];

                // Pass if undefined
                if (!tmp) return 'continue';

                if (tmp.Splat === true) {
                    var splat = new CheddarArray();
                    splat.init.apply(splat, _toConsumableArray(input.slice(i)));

                    args.setter(_this2.args[i][0], new _var2.default(splat));

                    return 'break';
                } else if (input[i]) {
                    if (tmp.Type) {
                        if (Array.isArray(tmp.Type)) {
                            if (!tmp.Type.some(function (t) {
                                return input[i] instanceof t;
                            })) {
                                return {
                                    v: (_this2.Reference || "function") + ' expected arg @' + i + ' to be any of: ' + tmp.Type.map(function (t) {
                                        return tmp.Type.Name || tmp.Type.constructor.Name || "object";
                                    }).join(", ") + ', recieved ' + (input[i].Name || input[i].constructor.Name || "object")
                                };
                            }
                        } else if (!(input[i] instanceof tmp.Type)) {
                            return {
                                v: (_this2.Reference || "function") + ' expected arg @' + i + ' to be ' + (tmp.Type.Name || tmp.Type.constructor.Name || "object") + ', recieved ' + (input[i].Name || input[i].constructor.Name || "object")
                            };
                        }
                    }
                    args.setter(_this2.args[i][0], new _var2.default(input[i]));
                } else {
                    if (tmp.Optional === true) {
                        args.setter(_this2.args[i][0], new _var2.default(new _nil2.default()));
                    } else if (tmp.Default) {
                        // If it's an expression
                        if (tmp.Default.constructor.name === "StatementExpression") {
                            var res = new (require('../eval/eval'))(tmp.Default, args).exec();

                            if (typeof res === 'string') {
                                return {
                                    v: res
                                };
                            }

                            tmp.Default = res;
                        }

                        args.setter(_this2.args[i][0], new _var2.default(tmp.Default));
                    } else {
                        return {
                            v: 'Missing argument for ' + _this2.args[i][0]
                        };
                    }
                }
            };

            _loop2: for (var i = 0; i < this.args.length; i++) {
                var _ret = _loop(i);

                switch (_ret) {
                    case 'continue':
                        continue;

                    case 'break':
                        break _loop2;

                    default:
                        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                }
            }

            return args;
        }
    }]);

    return CheddarFunction;
}(_class2.default);

CheddarFunction.Name = "Function";

var _initialiseProps = function _initialiseProps() {
    this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), [['&', function (self, value) {
        // Copy args to new function
        var new_args = self.args.slice(1);
        return new self.constructor(new_args, function (a, b, args) {
            return self.exec([].concat(_toConsumableArray(args), [value]), null);
        });
    }], ['+', function (LHS, RHS) {
        if (RHS instanceof LHS.constructor) {
            return new LHS.constructor([], function (a, b, rargs) {
                return LHS.exec([RHS.exec(rargs, null)], null);
            });
        } else {
            return _err2.default.NO_OP_BEHAVIOR;
        }
    }]]));
    this.RHS_Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), [['&', function (self, value) {
        // Copy args to new function
        var new_args = self.args.slice(1);
        return new self.constructor(new_args, function (a, b, args) {
            return self.exec([value].concat(_toConsumableArray(args)), null);
        });
    }]]));
};

exports.default = CheddarFunction;
module.exports = exports['default'];

},{"../../signal":44,"../consts/err":8,"../consts/nil":10,"../eval/eval":17,"../primitives/Array":21,"./class":11,"./scope":14,"./var":15}],14:[function(require,module,exports){
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

var _defaults = require('./defaults');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function enforceset(token, value, iv) {
    var self = void 0;

    if (this.has(token)) {
        self = this.accessor(token);

        if (self.Writeable === false) {
            return 'Cannot override constant ' + token;
        }

        if (self.StrictType && !(value instanceof self.StrictType)) {
            return 'Attempted to set `' + token + '` to a `' + (value.Name || value.constructor.Name || "object") + '`, expected `' + (self.StrictType.Name || self.StrictType.constructor.Name || "object") + '`';
        }
    }

    return this.manage(token, iv ? value : new _var2.default(value, {
        Writeable: true,
        StrictType: self ? self.StrictType : null
    }));
}

var CheddarScope = function () {
    function CheddarScope() {
        var inherit = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        _classCallCheck(this, CheddarScope);

        this.Cast = _defaults.DEFAULT_CAST;
        this.Operator = _defaults.DEFAULT_OP;
        this.RHS_Operator = _defaults.DEFAULT_RHS_OP;
        this.enforceset = enforceset;

        // Global scope
        // Make sure to move preset items
        // Avoid duplicating scopes
        //  by providing a loopup within
        //  a seperate hash which is linked
        //  by overriding a properties get
        this.inheritanceChain = inherit;

        if (!this.Scope) {
            this.Scope = new Map();
        }
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

        // Enforces typing

    }, {
        key: 'accessor',


        // Property accessors
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
            //console.log(this.Scope);
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
CheddarScope.Operator = _defaults.DEFAULT_OP;
CheddarScope.RHS_Operator = _defaults.DEFAULT_RHS_OP;
CheddarScope.enforceset = enforceset;
exports.default = CheddarScope;
module.exports = exports['default'];

},{"../../../tokenizer/consts/ops":106,"../consts/err":8,"./defaults":12,"./var":15}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var CheddarVariable = function CheddarVariable(Value) {
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
};

exports.default = CheddarVariable;
module.exports = exports["default"];

},{}],16:[function(require,module,exports){
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
            var ret = this.CallStack[this.CallStack.length - 1];
            if (ret) {
                delete ret.Reference;
                delete ret.scope;
            }
            return ret;
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

},{"../../../tokenizer/tok/shunting_yard":141,"../env/scope":14}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _link = require('../config/link');

var _ops = require('../../../tokenizer/consts/ops');

var _property = require('../../../tokenizer/parsers/property');

var _property2 = _interopRequireDefault(_property);

var _literal = require('../../../tokenizer/literals/literal');

var _literal2 = _interopRequireDefault(_literal);

var _op = require('../../../tokenizer/literals/op');

var _op2 = _interopRequireDefault(_op);

var _expr = require('../../../tokenizer/parsers/expr');

var _expr2 = _interopRequireDefault(_expr);

var _scope = require('../env/scope');

var _scope2 = _interopRequireDefault(_scope);

var _var = require('../env/var');

var _var2 = _interopRequireDefault(_var);

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

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


function set_value(value, child) {
    // The CheddarVariable() wrapping the value
    var variable = value.scope.accessor(value.Reference);

    // If the result is being set to a variable
    if (child instanceof _var2.default) {
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
    var rep = value.scope.enforceset(
    // Change the var name
    value.Reference,
    // to the resulting value
    child);

    return rep;
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

            // Helper functions
            function run_op(LHS, RHS) {
                if (NAME.has(TARGET)) {
                    OPERATOR = NAME.get(TARGET)(LHS, RHS);
                } else {
                    OPERATOR = _err2.default.NO_OP_BEHAVIOR;
                }
            }

            // Expression source

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

                    // Call `set_value` function
                    DATA = set_value(DATA, TOKEN);

                    // If it errored
                    if (DATA !== true) {
                        return DATA;
                    }

                    OPERATOR = TOKEN;
                } else if (Operation.Tokens[1] === _ops.TYPE.UNARY) {
                    NAME = TOKEN.Operator;
                    // It is an Unary operator use TOKEN as RHS, null as LHS
                    if (NAME.has(Operation.Tokens[0])) {
                        OPERATOR = NAME.get(Operation.Tokens[0])(null, TOKEN);
                    } else {
                        OPERATOR = _err2.default.NO_OP_BEHAVIOR;
                    }
                } else {
                    // Binary operator. DATA is LHS, TOKEN is RHS
                    DATA = this.shift(); // Get the other arg

                    NAME = DATA.Operator; // Get the list of operators DATA has

                    TARGET = Operation.Tokens[0]; // The operator

                    // Set LHS to LHS * RHS

                    // if it ends with `=`, given `a *= b` do `a = a * b`
                    // given if the above is true, set the `SETSELF` to true
                    if (TARGET.endsWith('=') && !_ops.EXCLUDE_META_ASSIGNMENT.has(TARGET)) {
                        SETSELF = true;
                        TARGET = TARGET.slice(0, -1);
                    }

                    run_op(DATA, TOKEN); // Run the operator

                    if (OPERATOR === _err2.default.NO_OP_BEHAVIOR) {
                        NAME = TOKEN.RHS_Operator;
                        run_op(TOKEN, DATA); // Run the operator again
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
                var res = (0, _prop2.default)(Operation, this.Scope, this.constructor);
                if (typeof res === 'string' || typeof res === 'boolean' || (typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'symbol') return res;

                this.put(res);
            } else if (Operation.constructor.name === "CheddarExpressionTernary") {
                var condition = new _expr2.default();
                condition._Tokens = Operation._Tokens[0];
                var if_true = Operation._Tokens[1];
                var if_false = Operation._Tokens[2];

                condition = new CheddarEval({ _Tokens: [condition] }, this.Scope).exec();

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

},{"../../../tokenizer/consts/ops":106,"../../../tokenizer/literals/literal":112,"../../../tokenizer/literals/op":115,"../../../tokenizer/parsers/expr":126,"../../../tokenizer/parsers/property":129,"../config/link":6,"../consts/err":8,"../consts/err_msg":9,"../consts/nil":10,"../env/class":11,"../env/scope":14,"../env/var":15,"./callstack":16,"./prop":18}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = eval_prop;

var _paren_expr = require('../../../tokenizer/parsers/paren_expr');

var _paren_expr2 = _interopRequireDefault(_paren_expr);

var _var = require('../../../tokenizer/literals/var');

var _var2 = _interopRequireDefault(_var);

var _literal = require('../../../tokenizer/literals/literal');

var _literal2 = _interopRequireDefault(_literal);

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _link = require('../config/link');

var _func = require('../env/func');

var _func2 = _interopRequireDefault(_func);

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

var _err_msg = require('../consts/err_msg');

var _err_msg2 = _interopRequireDefault(_err_msg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function to_value(variable, parent, name) {
    // Check if getter
    if (variable.Value) {
        return variable.Value;
    } else if (variable.getter) {
        var res = variable.getter.exec([], parent);
        res.Reference = name;
        res.scope = parent;
        return res;
    } else {
        // ERROR INTEGRATE
        return 'Attempted to accesses variable without value';
    }
}

// Evaluates a property
function eval_prop(prop, scope, evaluate) {
    // If it's a property
    var Operation = prop;

    var CheddarEval = evaluate;

    var OPERATOR = void 0;
    var NAME = void 0;
    var DATA = void 0;
    var TOKEN = void 0;
    var REFERENCE = void 0;
    var TARGET = void 0;

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

            OPERATOR = new OPERATOR(scope);

            if ((TOKEN = (_OPERATOR = OPERATOR).init.apply(_OPERATOR, _toConsumableArray(TOKEN.Tokens))) !== true) {
                return TOKEN;
            }

            // Exit if it's a raw literal
            if (Operation instanceof _literal2.default) {
                return OPERATOR;
            }
        } else if (OPERATOR = _link.EVALUATED_LINKS.get(TOKEN.constructor.name)) {
            OPERATOR = OPERATOR.apply(undefined, _toConsumableArray(TOKEN.Tokens));
        } else {
            return _err2.default.UNLINKED_CLASS;
        }
    } else if (Operation._Tokens[0] instanceof _paren_expr2.default) {
        // Evaluate
        OPERATOR = new CheddarEval(Operation._Tokens[0], scope);

        OPERATOR = OPERATOR.exec();

        if (typeof OPERATOR === "string") {
            return OPERATOR;
        }

        NAME = OPERATOR.constructor.Name || OPERATOR.Name || "object";
    } else if (Operation._Tokens[0] instanceof _var2.default) {
        // Lookup variable -> initial variable name
        OPERATOR = scope.accessor(Operation._Tokens[0]._Tokens[0]);

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
                evalres = new CheddarEval({
                    _Tokens: [TOKEN[_i]]
                }, scope);
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
                var bg = new OPERATOR(scope // Pass current scope
                );

                // Evaluate each argument
                DATA = []; // Stores the results

                // Get the array of args from the token
                TOKEN = Operation._Tokens[i]._Tokens;
                var _evalres = void 0; // Evaluation result
                for (var _i2 = 0; _i2 < TOKEN.length; _i2++) {
                    _evalres = new CheddarEval({
                        _Tokens: [TOKEN[_i2]]
                    }, scope);
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
                    var res = new CheddarEval({
                        _Tokens: [Operation._Tokens[i]]
                    }, scope).exec();

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

                // Set the previous item to the REFERENCE
                REFERENCE = OPERATOR;

                OPERATOR = to_value(DATA, REFERENCE, TARGET);

                // Set the pending name to the target
                NAME = TARGET;

                if (typeof OPERATOR === "string") return OPERATOR;
            }
    }

    return OPERATOR;
}
module.exports = exports['default'];

},{"../../../tokenizer/literals/literal":112,"../../../tokenizer/literals/var":120,"../../../tokenizer/parsers/paren_expr":128,"../config/link":6,"../consts/err":8,"../consts/err_msg":9,"../env/class":11,"../env/func":13}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (operator, force_unary) {
    return new _func2.default([["a", {}], ["b", {
        Optional: true
    }]], function (scope, input) {
        var LHS = input("a");
        var RHS = input("b");

        var resp = void 0; // output / response
        var opfunc = LHS.Operator.get(operator);

        if (opfunc) {
            if (force_unary || RHS instanceof _nil2.default || UNARY_ONLY.indexOf(operator) > -1) resp = opfunc(null, LHS);else resp = opfunc(LHS, RHS);
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

var _nil = require('../consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _func = require('../env/func');

var _func2 = _interopRequireDefault(_func);

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _err_msg = require('../consts/err_msg');

var _err_msg2 = _interopRequireDefault(_err_msg);

var _ops = require('../../../tokenizer/consts/ops');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UNARY_ONLY = _ops.UOP.filter(function (i) {
    return _ops.OP.indexOf(i) === -1;
});

module.exports = exports['default'];

},{"../../../tokenizer/consts/ops":106,"../consts/err":8,"../consts/err_msg":9,"../consts/nil":10,"../env/class":11,"../env/func":13}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (prop) {
    // Inject `$0` variable to the beginning of the property
    prop._Tokens.unshift($0);

    return new _func2.default([["$0", {}]], function (scope, input) {
        return (0, _prop2.default)(prop, scope, _eval2.default);
    });
};

var _func = require('../env/func');

var _func2 = _interopRequireDefault(_func);

var _var = require('../../../tokenizer/literals/var');

var _var2 = _interopRequireDefault(_var);

var _prop = require('../eval/prop');

var _prop2 = _interopRequireDefault(_prop);

var _eval = require('../eval/eval');

var _eval2 = _interopRequireDefault(_eval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $0 = new _var2.default();
$0._Tokens = ['$0'];

module.exports = exports['default'];

},{"../../../tokenizer/literals/var":120,"../env/func":13,"../eval/eval":17,"../eval/prop":18}],21:[function(require,module,exports){
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
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarArray);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarArray)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_array2.default))), _this.Cast = _array4.default, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CheddarArray, [{
        key: 'init',
        value: function init() {
            var CheddarEval = require('../eval/eval');
            this.value = [];

            for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                items[_key2] = arguments[_key2];
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
exports.default = CheddarArray;


CheddarArray.Scope = require('../../../stdlib/primitive/Array/static');
module.exports = exports['default'];

},{"../../../stdlib/primitive/Array/lib":53,"../../../stdlib/primitive/Array/static":81,"../consts/err":8,"../consts/nil":10,"../env/class":11,"../env/var":15,"../eval/eval":17,"./cast/array":28,"./op/array":35}],22:[function(require,module,exports){
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
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarBool);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarBool)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_bool2.default))), _this.Cast = _bool4.default, _temp), _possibleConstructorReturn(_this, _ret);
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
exports.default = CheddarBool;
module.exports = exports['default'];

},{"../env/class":11,"./cast/bool":29,"./op/bool":36}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _eval = require('../eval/eval');

var _eval2 = _interopRequireDefault(_eval);

var _dict = require('../consts/dict');

var _dict2 = require('./op/dict');

var _dict3 = _interopRequireDefault(_dict2);

var _dict4 = require('./cast/dict');

var _dict5 = _interopRequireDefault(_dict4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function evaluate(item, scope) {
    return new _eval2.default({ _Tokens: [item] }, scope).exec();
}

var CheddarDictionary = function (_CheddarClass) {
    _inherits(CheddarDictionary, _CheddarClass);

    function CheddarDictionary() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarDictionary);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarDictionary)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_dict3.default))), _this.Cast = _dict5.default, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CheddarDictionary, [{
        key: 'init',
        value: function init(dict) {
            this.value = new Map();

            // Dictionary entries [ktok, vtok]
            var entries = dict._Tokens;
            var entry = void 0;

            // Evaluate & move to `this.value`
            for (var i = 0; i < entries.length; i++) {
                entry = entries[i]._Tokens;
                var tok_key = evaluate(entry[0], this.scope);

                if (typeof tok_key === "string") {
                    return tok_key;
                }

                var tok_value = evaluate(entry[1], this.scope);

                if (typeof tok_key === "string") {
                    return tok_key;
                }

                if (_dict.KEY_INTERNAL.has(tok_key.constructor.Name)) {
                    this.value.set(tok_key.value, tok_value);
                } else {
                    this.value.set(tok_key, tok_value);
                }
            }

            return true;
        }
    }]);

    return CheddarDictionary;
}(_class2.default);

//CheddarDictionary.Scope = require('../../../stdlib/primitive/Dictionary/static');
//CheddarDictionary.prototype.Scope = require('../../../stdlib/primitive/Dictionary/lib');


CheddarDictionary.Name = "Dictionary";
exports.default = CheddarDictionary;
module.exports = exports['default'];

},{"../consts/dict":7,"../env/class":11,"../eval/eval":17,"./cast/dict":30,"./op/dict":37}],24:[function(require,module,exports){
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
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarNumber);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarNumber)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_number2.default))), _this.Cast = _number4.default, _temp), _possibleConstructorReturn(_this, _ret);
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
    }, {
        key: 'Scope',
        get: function get() {
            return require('../../../stdlib/primitive/Number/lib');
        }
    }]);

    return CheddarNumber;
}(_class2.default);

CheddarNumber.Name = "Number";
exports.default = CheddarNumber;
module.exports = exports['default'];

},{"../../../stdlib/primitive/Number/lib":82,"../env/class":11,"./cast/number":31,"./op/number":38}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _xregexp = require('xregexp');

var _xregexp2 = _interopRequireDefault(_xregexp);

var _regex = require('./op/regex');

var _regex2 = _interopRequireDefault(_regex);

var _regex3 = require('./cast/regex');

var _regex4 = _interopRequireDefault(_regex3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarRegex = function (_CheddarClass) {
    _inherits(CheddarRegex, _CheddarClass);

    function CheddarRegex() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarRegex);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarRegex)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_regex2.default))), _this.Cast = _regex4.default, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CheddarRegex, [{
        key: 'init',
        value: function init(source, flags) {
            if (source instanceof _xregexp2.default || source instanceof RegExp) {
                this.value = source;
                this.flags = source.xregexp.flags;
            } else {
                if (flags.indexOf("c") > -1) {
                    source = _xregexp2.default.escape(source);
                    flags = flags.replace(/c/g, "");
                }

                if (!source) return "Regex source not provided";else if (source.constructor.Name === 'String') source = source.value;

                if (!flags) flags = "";else if (flags.constructor.Name === 'String') flags = flags.value;

                if (typeof source !== 'string' || typeof flags !== 'string') return "Regex source and flags must be string. Flags are optional";

                try {
                    this.value = (0, _xregexp2.default)(source, flags);
                } catch (e) {
                    return e.message || "error during regex instantiation";
                }

                this.flags = this.value.xregexp.flags;
            }
            return true;
        }
    }]);

    return CheddarRegex;
}(_class2.default);

CheddarRegex.Name = "Regex";
exports.default = CheddarRegex;
module.exports = exports['default'];

},{"../env/class":11,"./cast/regex":32,"./op/regex":39,"xregexp":163}],26:[function(require,module,exports){
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
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarString);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarString)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_string2.default))), _this.Cast = _string4.default, _temp), _possibleConstructorReturn(_this, _ret);
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
exports.default = CheddarString;


CheddarString.Scope = require('../../../stdlib/primitive/String/static');
CheddarString.prototype.Scope = require('../../../stdlib/primitive/String/lib');
module.exports = exports['default'];

},{"../../../stdlib/primitive/String/lib":84,"../../../stdlib/primitive/String/static":101,"../consts/nil":10,"../env/class":11,"../env/var":15,"./cast/string":33,"./op/string":40}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class = require('../env/class');

var _class2 = _interopRequireDefault(_class);

var _symbol = require('./op/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _symbol3 = require('./cast/symbol');

var _symbol4 = _interopRequireDefault(_symbol3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarSymbol = function (_CheddarClass) {
    _inherits(CheddarSymbol, _CheddarClass);

    function CheddarSymbol() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, CheddarSymbol);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheddarSymbol)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.Operator = new Map([].concat(_toConsumableArray(_class2.default.Operator), _toConsumableArray(_symbol2.default))), _this.Cast = _symbol4.default, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CheddarSymbol, [{
        key: 'init',
        value: function init(name) {
            if (!name) return "Symbol name not provided";else if (name.constructor.Name === 'String') name = name.value;

            if (typeof name !== 'string') return "Symbol name must be string";

            this.value = name;
            return true;
        }
    }]);

    return CheddarSymbol;
}(_class2.default);

CheddarSymbol.Name = "Symbol";
exports.default = CheddarSymbol;
module.exports = exports['default'];

},{"../env/class":11,"./cast/symbol":34,"./op/symbol":41}],28:[function(require,module,exports){
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
        Cast = self.value[i] && self.value[i].Cast ? self.value[i].Cast.has('String') || self.value[i].Operator.has('repr') : false;

        if (Cast) Stringified += (i ? ", " : "") + (self.value[i].Cast.has('String') ? self.value[i].Cast.get('String')(self.value[i]) : self.value[i].Operator.get('repr')(null, self.value[i])).value;else Stringified += (i ? ", " : "") + ('<' + (self.value[i].constructor.Name || self.value[i].Name) + '>');
    }
    return (0, _init2.default)(CheddarString, "[" + Stringified + "]");
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../String":26}],29:[function(require,module,exports){
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

},{"../../../../helpers/init":3,"../../consts/err":8,"../Number":24,"../String":26}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _String = require('../String');

var _String2 = _interopRequireDefault(_String);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../String":26}],31:[function(require,module,exports){
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

},{"../../../../helpers/init":3,"../String":26}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require('../../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Standard error
exports.default = new Map([['String', function (self) {
    var CheddarString = require('../String');

    return (0, _init2.default)(CheddarString, self.source);
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../consts/err":8,"../String":26}],33:[function(require,module,exports){
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
    var Attempt = new _number2.default(LHS.value, 0).exec();

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

},{"../../../../helpers/init":3,"../../../../tokenizer/literals/number":114,"../../../../tokenizer/tok/lex":140,"../../consts/err":8,"../Number":24}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['String', function (self) {
    var CheddarString = require('../String');
    return (0, _init2.default)(CheddarString, '@' + self.value);
}]]); // Standard error

module.exports = exports['default'];

},{"../../../../helpers/init":3,"../String":26}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require('../../consts/err');

var _err2 = _interopRequireDefault(_err);

var _String = require('../String');

var _String2 = _interopRequireDefault(_String);

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = new Map([['!', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    if (LHS === null) return (0, _init2.default)(CheddarBool, RHS.value.length === 0);else return _err2.default.NO_OP_BEHAVIOR;
}], ['+', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) {
        return _init2.default.apply(undefined, [LHS.constructor].concat(_toConsumableArray(LHS.value.concat(RHS.value))));
    } else {
        return _err2.default.NO_OP_BEHAVIOR;
    }
}], ['*', function (LHS, RHS) {
    var CheddarNumber = require("../Number");
    if (RHS instanceof CheddarNumber) {
        var ar = LHS.value;
        var res = [];
        var t = RHS.value;
        for (var i = 0; i < t; i++) {
            res.push.apply(res, _toConsumableArray(ar));
        }
        return _init2.default.apply(undefined, [LHS.constructor].concat(res));
    } else {
        return _err2.default.NO_OP_BEHAVIOR;
    }
}], ['has', function (LHS, RHS) {
    var CheddarBool = require('../Bool');
    var self = LHS.value;
    var op = void 0,
        res = (0, _init2.default)(CheddarBool, false);

    for (var i = 0; i < self.length; i++) {
        if (self[i] && self[i].Operator && (op = self[i].Operator.get('=='))) {
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
}], ['@"', function (LHS, RHS) {
    var CheddarArray = require("../Array");
    if (LHS === null) return (0, _init2.default)(_String2.default, RHS.value.map(function (x) {
        return String.fromCharCode(x.value);
    }).join(""));else return _err2.default.NO_OP_BEHAVIOR;
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../consts/err":8,"../Array":21,"../Bool":22,"../Number":24,"../String":26}],36:[function(require,module,exports){
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

},{"../../../../helpers/init":3}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['+', function (LHS, RHS) {
    RHS.value.forEach(function (k, v) {
        LHS.value.set(k, v);
    });

    return LHS;
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3}],38:[function(require,module,exports){
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

    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value * RHS.value);else if (RHS.constructor.Name === "String") {
        if (LHS.value < 0) return (0, _init2.default)(RHS.constructor, RHS.value.repeat(LHS.value));else return (0, _init2.default)(RHS.constructor, RHS.value.repeat(LHS.value));
    } else return CheddarError.NO_OP_BEHAVIOR;
}],

// Division, solely arithemtic
['/', function (LHS, RHS) {

    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value / RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['**', function (LHS, RHS) {
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
}], ['^', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value ^ RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['<<', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value << RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}], ['>>', function (LHS, RHS) {
    if (RHS instanceof LHS.constructor) return (0, _init2.default)(LHS.constructor, 10, 0, LHS.value >> RHS.value);else return CheddarError.NO_OP_BEHAVIOR;
}],

// Special Operators
['|>', function (LHS, RHS) {
    var CheddarArray = require("../Array");
    if (LHS && RHS instanceof LHS.constructor) return _init2.default.apply(undefined, [CheddarArray].concat(_toConsumableArray(range(LHS.value, RHS.value))));else if (LHS === null) {
        if (RHS.value === 0) return (0, _init2.default)(CheddarArray);else return _init2.default.apply(undefined, [CheddarArray].concat(_toConsumableArray(range(0, RHS.value - Math.sign(RHS.value)))));
    } else return CheddarError.NO_OP_BEHAVIOR;
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
    if (LHS === null) {
        return (0, _init2.default)(_String2.default, String.fromCharCode(RHS.value));
    } else if (RHS instanceof LHS.constructor) {
        return (0, _init2.default)(_String2.default, range(LHS.value, RHS.value).map(function (l) {
            return String.fromCharCode(l.value);
        }).join(""));
    }
}]]);

/*
TODO:
'+=', '-=', '*=', '/=', '^=', '%=', '&=', '|=', '<<', '>>', '<<=', '>>=',

'and', 'or', 'xor',
*/

module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../consts/err":8,"../Array":21,"../Bool":22,"../Number":24,"../String":26}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('../../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

var _xregexp = require('xregexp');

var _xregexp2 = _interopRequireDefault(_xregexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([['repr', function (LHS, RHS) {
    var CheddarString = require('../String');
    return (0, _init2.default)(CheddarString, '/' + RHS.value.xregexp.source + '/' + RHS.value.xregexp.flags);
}], ['|', function (LHS, RHS) {
    if (LHS && RHS instanceof LHS.constructor) {
        return (0, _init2.default)(LHS.constructor, _xregexp2.default.union([LHS.value, RHS.value]));
    }
}], ['+', function (LHS, RHS) {
    if (LHS && RHS instanceof LHS.constructor) {
        return (0, _init2.default)(LHS.constructor, (0, _xregexp2.default)(LHS.value.xregexp.source + RHS.value.xregexp.source));
    }
}], ['-', function (LHS, RHS) {
    if (LHS && RHS instanceof LHS.constructor) {
        return (0, _init2.default)(LHS.constructor, (0, _xregexp2.default)('(?!' + RHS.value.xregexp.source + ')(?:' + LHS.value.xregexp.source + ')'));
    }
}], ['*', function (LHS, RHS) {
    if (RHS.constructor.Name === "Number") {
        return (0, _init2.default)(LHS.constructor, (0, _xregexp2.default)('(?:' + LHS.value.xregexp.source + '){' + RHS.value + '}'));
    }
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../String":26,"xregexp":163}],40:[function(require,module,exports){
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

var _sprintf = require('../../../../stdlib/ns/IO/sprintf');

var _sprintf2 = _interopRequireDefault(_sprintf);

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
}], ['%', function (LHS, RHS) {
    var API = require('../../../../stdlib/api');
    return (0, _sprintf2.default)(API).exec([LHS, RHS], null);
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

    if (RHS.constructor.Name === "Number") {
        if (RHS.value < 0) return (0, _init2.default)(LHS.constructor, "");else return (0, _init2.default)(LHS.constructor, LHS.value.repeat(RHS.value));
    } else return _err2.default.NO_OP_BEHAVIOR;
}], ['@"', function (LHS, RHS) {
    var CheddarArray = require("../Array");
    if (LHS === null) return _init2.default.apply(undefined, [CheddarArray].concat(_toConsumableArray([].concat(_toConsumableArray(RHS.value)).map(function (x) {
        return (0, _init2.default)(_Number2.default, 10, 0, x.charCodeAt());
    }))));else return _err2.default.NO_OP_BEHAVIOR;
}]]);
module.exports = exports['default'];

},{"../../../../helpers/init":3,"../../../../stdlib/api":51,"../../../../stdlib/ns/IO/sprintf":52,"../../consts/err":8,"../Array":21,"../Bool":22,"../Number":24}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = new Map();
module.exports = exports["default"];

},{}],42:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _links = require('./links');

var _links2 = _interopRequireDefault(_links);

var _nil = require('./core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

var _signal = require('./signal');

var _signal2 = _interopRequireDefault(_signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarExec = function () {
    function CheddarExec(exec_stack, scope) {
        _classCallCheck(this, CheddarExec);

        this.Code = exec_stack._Tokens;
        this._csi = 0;
        this.Scope = scope;

        this.continue = true;
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
                this.continue = false;
                this.lrep = resp;
            } else if (typeof resp === "undefined") {
                this.lrep = new _nil2.default();
            } else if (resp instanceof _signal2.default) {
                resp.res = this.lrep;
                this.lrep = resp;
                this.continue = false;
            } else {
                this.lrep = resp;
            }
        }
    }, {
        key: 'exec',
        value: function exec(OPTS) {
            if (OPTS) {
                global.CHEDDAR_OPTS = OPTS;
            }

            while (this.Code[this._csi] && this.continue) {
                this.step();
            }return this.lrep;
        }
    }]);

    return CheddarExec;
}();

exports.default = CheddarExec;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./core/consts/nil":10,"./links":43,"./signal":44}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _eval = require('./core/eval/eval');

var _eval2 = _interopRequireDefault(_eval);

var _return = require('./states/return');

var _return2 = _interopRequireDefault(_return);

var _assign = require('./states/assign');

var _assign2 = _interopRequireDefault(_assign);

var _break = require('./states/break');

var _break2 = _interopRequireDefault(_break);

var _func = require('./states/func');

var _func2 = _interopRequireDefault(_func);

var _for = require('./states/for');

var _for2 = _interopRequireDefault(_for);

var _if = require('./states/if');

var _if2 = _interopRequireDefault(_if);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    StatementAssign: _assign2.default,
    StatementIf: _if2.default,
    StatementFor: _for2.default,
    StatementFunc: _func2.default,
    StatementBreak: _break2.default,
    StatementReturn: _return2.default,
    StatementExpression: _eval2.default
};
module.exports = exports['default'];

},{"./core/eval/eval":17,"./states/assign":45,"./states/break":46,"./states/for":47,"./states/func":48,"./states/if":49,"./states/return":50}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nil = require('./core/consts/nil');

var _nil2 = _interopRequireDefault(_nil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Signal = function () {
    function Signal(name) {
        var data = arguments.length <= 1 || arguments[1] === undefined ? new _nil2.default() : arguments[1];

        _classCallCheck(this, Signal);

        this.name = name;
        this.data = data;
    }

    _createClass(Signal, [{
        key: 'is',
        value: function is(sym) {
            return this.name === sym;
        }

        // SIGNALS

    }]);

    return Signal;
}();

Signal.BREAK = Symbol('SIGBREAK');
Signal.RETURN = Symbol('RETURN');
exports.default = Signal;
module.exports = exports['default'];

},{"./core/consts/nil":10}],45:[function(require,module,exports){
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
            var varname = this.assignl.tok(0)._Tokens[0];
            if (this.scope.has(varname)) {
                // ERROR INTEGRATE
                return varname + ' has already been defined';
            }

            // Strict typing
            var stricttype = this.assignl.tok(1) ? this.assignl.tok(1)._Tokens[0] : null;

            if (stricttype && this.scope.has(stricttype) && !((stricttype = this.scope.accessor(stricttype).Value).prototype instanceof _class2.default)) {
                return stricttype + ' is not a class';
            }

            var res = void 0;

            if (this.toks.tok(2)) {
                var val = new _eval2.default(this.toks.tok(2), this.scope);
                if (!((val = val.exec()) instanceof _class2.default || val.prototype instanceof _class2.default)) return val;

                if (stricttype && !(val instanceof stricttype)) {
                    return 'Attempted to set `' + varname + '` to a `' + (val.Name || val.constructor.Name || "object") + '`, expected `' + (stricttype.Name || stricttype.constructor.Name || "object") + '`';
                }

                val.scope = this.scope;
                val.Reference = varname;

                res = this.scope.manage(varname, new _var2.default(val, {
                    Writeable: this.assignt !== "const",
                    StrictType: stricttype
                }));
            } else {
                res = this.scope.manage(varname, new _var2.default(new _nil2.default(), {
                    Writeable: this.assignt !== "const",
                    StrictType: stricttype
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

},{"../core/consts/nil":10,"../core/env/class":11,"../core/env/var":15,"../core/eval/eval":17}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _signal = require('../signal');

var _signal2 = _interopRequireDefault(_signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarAssign = function () {
    function CheddarAssign(toks, scope) {
        _classCallCheck(this, CheddarAssign);

        this.toks = toks;
        this.scope = scope;
    }

    _createClass(CheddarAssign, [{
        key: 'exec',
        value: function exec() {
            return new _signal2.default(_signal2.default.BREAK, { propagation: 1 });
        }
    }]);

    return CheddarAssign;
}();

exports.default = CheddarAssign;
module.exports = exports['default'];

},{"../signal":44}],47:[function(require,module,exports){
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

var _signal = require('../signal');

var _signal2 = _interopRequireDefault(_signal);

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

                        if (ralloc instanceof _signal2.default) {
                            if (ralloc.is(_signal2.default.BREAK)) {
                                ralloc = ralloc.data;
                                break;
                            }
                        }

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

},{"../../helpers/init":3,"../core/consts/nil":10,"../core/env/scope":14,"../core/env/var":15,"../core/eval/eval":17,"../core/primitives/Bool":22,"../core/primitives/String":26,"../exec":42,"../signal":44,"./assign":45}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _func = require('../core/env/func');

var _func2 = _interopRequireDefault(_func);

var _var = require('../core/env/var');

var _var2 = _interopRequireDefault(_var);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarFunc = function () {
    function CheddarFunc(toks, scope) {
        _classCallCheck(this, CheddarFunc);

        this.toks = toks._Tokens;
        this.scope = scope;
    }

    _createClass(CheddarFunc, [{
        key: 'exec',
        value: function exec() {
            var res = new _func2.default(this.scope);

            res.init(this.toks[1], this.toks[2]);

            var out = this.scope.enforceset(this.toks[0]._Tokens[0], new _var2.default(res, {
                Writeable: false
            }), true);

            if (typeof out === 'string') {
                return out;
            }
        }
    }]);

    return CheddarFunc;
}();

exports.default = CheddarFunc;
module.exports = exports['default'];

},{"../core/env/func":13,"../core/env/var":15}],49:[function(require,module,exports){
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

},{"../core/consts/err":8,"../core/consts/err_msg":9,"../core/consts/nil":10,"../core/env/scope":14,"../core/eval/eval":17,"../core/primitives/Bool":22,"../exec":42}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eval = require('../core/eval/eval');

var _eval2 = _interopRequireDefault(_eval);

var _signal = require('../signal');

var _signal2 = _interopRequireDefault(_signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheddarBreak = function () {
    function CheddarBreak(toks, scope) {
        _classCallCheck(this, CheddarBreak);

        this.toks = toks._Tokens;
        this.scope = scope;
    }

    _createClass(CheddarBreak, [{
        key: 'exec',
        value: function exec() {
            var res = new _eval2.default(this.toks[1], this.scope).exec();

            if (typeof res === 'string') {
                return res;
            }

            return new _signal2.default(_signal2.default.RETURN, res);
        }
    }]);

    return CheddarBreak;
}();

exports.default = CheddarBreak;
module.exports = exports['default'];

},{"../core/eval/eval":17,"../signal":44}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _String = require('../interpreter/core/primitives/String');

var _String2 = _interopRequireDefault(_String);

var _Symbol = require('../interpreter/core/primitives/Symbol');

var _Symbol2 = _interopRequireDefault(_Symbol);

var _Number = require('../interpreter/core/primitives/Number');

var _Number2 = _interopRequireDefault(_Number);

var _Regex = require('../interpreter/core/primitives/Regex');

var _Regex2 = _interopRequireDefault(_Regex);

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
    symbol: _Symbol2.default,
    number: _Number2.default,
    regex: _Regex2.default,
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

    nstoclass: function nstoclass(input) {
        var ns = new _class2.default(null);
        ns.Name = "Namespace";
        ns.Scope = input.Scope;
        return ns;
    },

    variable: _var3.default,
    class: _class2.default,
    scope: _scope2.default
};

exports.default = API;
module.exports = exports['default'];

},{"../helpers/init":3,"../interpreter/core/consts/err":8,"../interpreter/core/consts/nil":10,"../interpreter/core/env/class":11,"../interpreter/core/env/func":13,"../interpreter/core/env/scope":14,"../interpreter/core/env/var":15,"../interpreter/core/primitives/Array":21,"../interpreter/core/primitives/Bool":22,"../interpreter/core/primitives/Number":24,"../interpreter/core/primitives/Regex":25,"../interpreter/core/primitives/String":26,"../interpreter/core/primitives/Symbol":27}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cheddar) {

    var FORMAT_REGEX = /%(-?\+?#?0?)(\d+|\*)?(\.\d+|\.\*)?([dixXbBoOrsc])/gi;

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
                var res = FORMAT.SPECIFIER[SPECIFIER][1](tmp, tmp.Cast);

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

},{}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _api = require('../../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([require('./lib/rand')(_api2.default), require('./lib/max')(_api2.default), require('./lib/min')(_api2.default), require('./lib/len')(_api2.default), require('./lib/turn')(_api2.default), require('./lib/fuse')(_api2.default), require('./lib/vfuse')(_api2.default), require('./lib/join')(_api2.default), require('./lib/each')(_api2.default), require('./lib/map')(_api2.default), require('./lib/cycle')(_api2.default), require('./lib/shift')(_api2.default), require('./lib/all')(_api2.default), require('./lib/any')(_api2.default), require('./lib/filter')(_api2.default), require('./lib/sorted')(_api2.default), require('./lib/chunk')(_api2.default), require('./lib/rev')(_api2.default), require('./lib/unshift')(_api2.default), require('./lib/head')(_api2.default), require('./lib/tail')(_api2.default), require('./lib/index')(_api2.default), require('./lib/slice')(_api2.default), require('./lib/sum')(_api2.default), require('./lib/pop')(_api2.default), require('./lib/reduce')(_api2.default), require('./lib/push')(_api2.default)]);
module.exports = exports['default'];

},{"../../api":51,"./lib/all":54,"./lib/any":55,"./lib/chunk":56,"./lib/cycle":57,"./lib/each":58,"./lib/filter":59,"./lib/fuse":60,"./lib/head":61,"./lib/index":62,"./lib/join":63,"./lib/len":64,"./lib/map":65,"./lib/max":66,"./lib/min":67,"./lib/pop":68,"./lib/push":69,"./lib/rand":70,"./lib/reduce":71,"./lib/rev":72,"./lib/shift":73,"./lib/slice":74,"./lib/sorted":75,"./lib/sum":76,"./lib/tail":77,"./lib/turn":78,"./lib/unshift":79,"./lib/vfuse":80}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["all", api.var(new api.func([["callback", {
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

            if (!(res instanceof api.bool)) {
                res = api.init(api.bool, res);
            }

            if (res.value !== true) {
                return api.init(api.bool, false);
            }
        }

        return api.init(api.bool, true);
    }))];
};

module.exports = exports["default"];

},{}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["any", api.var(new api.func([["callback", {
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

            if (!(res instanceof api.bool)) {
                res = api.init(api.bool, res);
            }

            if (res.value === true) {
                return api.init(api.bool, true);
            }
        }

        return api.init(api.bool, false);
    }))];
};

module.exports = exports["default"];

},{}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// source: http://stackoverflow.com/a/14349616/1620622, modified
function chunkArray(ar, len, cheddar) {
    var _size = Math.ceil(ar.length / len),
        _ret = new Array(_size),
        _offset;

    for (var _i = 0; _i < _size; _i++) {
        _offset = _i * len;
        _ret[_i] = cheddar.init.apply(cheddar, [cheddar.array].concat(_toConsumableArray(ar.slice(_offset, _offset + len))));
    }

    return _ret;
}

exports.default = function (cheddar) {
    return ["chunk", cheddar.var(new cheddar.func([["size", {
        Type: cheddar.number
    }]], function (scope, input) {
        var size = input("size").value;
        var self = input("self").value;

        // TODO: ensure > 0

        return cheddar.init.apply(cheddar, [cheddar.array].concat(_toConsumableArray(chunkArray(self, size, cheddar))));
    }))];
};

module.exports = exports["default"];

},{}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["cycle", api.var(new api.func([["rotations", {
        Type: api.number,
        Default: api.init(api.number, 10, 0, 1)
    }]], function (scope, input) {
        var _self = input("self"),
            self = _self.value;

        if (self.length < 2) {
            return new api.nil();
        }

        var rotations = input("rotations").value;
        var counterclockwise = false;

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

        return _self;
    }))];
};

module.exports = exports["default"];

},{}],58:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["filter", api.var(new api.func([["callback", {
        Type: api.func
    }]], function (scope, input) {
        var callback = input("callback");
        var _self = input("self");
        var self = _self.value;
        var res = void 0;
        var out = [];

        for (var i = 0; i < self.length; i++) {
            res = callback.exec([self[i], api.init(api.number, 10, 0, i), _self]);

            if (typeof res === 'string') {
                return res;
            }

            if (!(res instanceof api.bool)) {
                res = api.init(api.bool, res);
            }

            if (res.value === true) {
                out.push(self[i]);
            }
        }

        return api.init.apply(api, [api.array].concat(out));
    }))];
};

module.exports = exports["default"];

},{}],60:[function(require,module,exports){
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
            cast = self[i] instanceof api.string || self[i].Cast.get('String');

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

module.exports = exports["default"];

},{}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["head", api.var(new api.func([["A", {
        Type: api.number
    }]], function (scope, input) {
        var item = input("self").value;
        return api.init.apply(api, [api.array].concat(_toConsumableArray(item.slice(0, input("A").value))));
    }))];
};

module.exports = exports["default"];

},{}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["index", api.var(new api.func([["item", {}]], function (scope, input) {
        var res = -1;
        var self = input("self").value;
        var item = input("item");

        var eq = void 0;

        for (var i = 0; i < self.length; i++) {
            if (self[i].Operator && (eq = self[i].Operator.get("==")) && eq(self[i], item).value === true) {
                res = i;
                break;
            }
        }

        return api.init(api.number, 10, 0, res);
    }))];
};

module.exports = exports["default"];

},{}],63:[function(require,module,exports){
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
            cast = self[i] instanceof api.string || self[i].Cast.get('String');

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

module.exports = exports["default"];

},{}],64:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],65:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["max", api.prop(new api.func([], function (_, input) {
        var self = input("self").value;
        if (self.length === 0) return "Cannot find max of empty array";
        var pending = self[0].value;
        for (var i = 0; i < self.length; i++) {
            if (!(self[i] instanceof api.number)) return "Item @" + i + " was " + (self[i].Name || self[i].constructor.Name || "object") + ", expected Number";
            if (self[i].value > pending) pending = self[i].value;
        }
        return api.init(api.number, 10, 0, pending);
    }))];
};

module.exports = exports["default"];

},{}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["min", api.prop(new api.func([], function (_, input) {
        var self = input("self").value;
        if (self.length === 0) return "Cannot find min of empty array";
        var pending = self[0].value;
        for (var i = 0; i < self.length; i++) {
            if (!(self[i] instanceof api.number)) return "Item @" + i + " was " + (self[i].Name || self[i].constructor.Name || "object") + ", expected Number";
            if (self[i].value < pending) pending = self[i].value;
        }
        return api.init(api.number, 10, 0, pending);
    }))];
};

module.exports = exports["default"];

},{}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["pop", api.var(new api.func([], function (scope, input) {
        return input("self").value.pop() || new api.nil();
    }))];
};

module.exports = exports["default"];

},{}],69:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["rand", api.prop(new api.func([], function (_, input) {
        var self = input("self").value;
        return self[Math.floor(Math.random() * self.length)];
    }))];
};

module.exports = exports["default"];

},{}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["reduce", api.var(new api.func([["callback", {
        Type: api.func
    }]], function (scope, input) {
        var self = input("self");
        var callback = input("callback");

        return self.value.reduce(function (item1, item2, index, array) {
            return input("callback").exec([item1, item2, api.init(api.number, 10, 0, index), self], null);
        });
    }))];
};

module.exports = exports["default"];

},{}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["rev", api.prop(new api.func([], function (_, input) {
        return api.init.apply(api, [api.array].concat(_toConsumableArray(input("self").value.slice().reverse())));
    }))];
};

module.exports = exports["default"];

},{}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["shift", api.var(new api.func([], function (scope, input) {
        return input("self").value.shift() || new api.nil();
    }))];
};

module.exports = exports["default"];

},{}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["slice", api.var(new api.func([["A", {
        Type: api.number
    }], ["B", {
        Type: api.number,
        Optional: true
    }]], function (scope, input) {
        var item = input("self").value;
        return api.init.apply(api, [api.array].concat(_toConsumableArray(item.slice(input("A").value, input("B") && input("B").value))));
    }))];
};

module.exports = exports["default"];

},{}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["sorted", api.prop(new api.func([], function (_, input) {
        var res = void 0;
        var op = void 0;
        try {
            res = input("self").value.sort(function (a, b) {
                op = a.Operator && a.Operator.get(">");
                if (!op) {
                    throw (a.Name || a.constructor.Name) + " is not comparable";
                }

                op = op(a, b);
                if (op.constructor.Name !== "Boolean") {
                    throw "Unable to compare `" + (a.Name || a.constructor.Name) + "` and `" + (a.Name || a.constructor.Name) + "`";
                }

                if (op.value === true) {
                    return 1;
                } else {
                    op = a.Operator && a.Operator.get("<");
                    if (!op) {
                        throw (a.Name || a.constructor.Name) + " is not comparable";
                    }

                    op = op(a, b);
                    if (op.constructor.Name !== "Boolean") {
                        throw "Unable to compare `" + (a.Name || a.constructor.Name) + "` and `" + (a.Name || a.constructor.Name) + "`";
                    }

                    if (op.value === true) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            });
        } catch (e) {
            return e.message;
        }

        return api.init.apply(api, [api.array].concat(_toConsumableArray(res)));
    }))];
};

module.exports = exports["default"];

},{}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["sum", api.prop(new api.func([], function (_, input) {
        var s = 0;
        var self = input("self").value;
        for (var i = 0; i < self.length; i++) {
            if (!(self[i] instanceof api.number)) return "Item @" + i + " was " + (self[i].Name || self[i].constructor.Name || "object") + ", expected Number";
            s += self[i].value;
        }
        return api.init(api.number, 10, 0, s);
    }))];
};

module.exports = exports["default"];

},{}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["tail", api.var(new api.func([["A", {
        Type: api.number
    }]], function (scope, input) {
        var item = input("self").value;
        return api.init.apply(api, [api.array].concat(_toConsumableArray(item.slice(-Math.abs(input("A").value)))));
    }))];
};

module.exports = exports["default"];

},{}],78:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],79:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],80:[function(require,module,exports){
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
            cast = self[i] instanceof api.string || self[i].Cast.get('String');

            if (cast) {
                if (cast === true) {
                    text = self[i].value;
                } else {
                    text = cast(self[i]).value;
                }
                stringified += (i === 0 ? "" : "\n") + text;
            } else {
                return "Cannot stringify `" + (self[i].constructor.Name || self[i].Name) + "` in join";
            }
        }

        return api.init(api.string, stringified);
    }))];
};

module.exports = exports["default"];

},{}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('../../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map();
module.exports = exports['default'];

},{"../../api":51}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _api = require('../../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([require('./lib/tobase')(_api2.default)]);
module.exports = exports['default'];

},{"../../api":51,"./lib/tobase":83}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bases = require("bases");

var _bases2 = _interopRequireDefault(_bases);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

exports.default = function (api) {
    return ["tobase", api.var(new api.func([["base", {}]], function (scope, input, rargs) {
        var self = input("self").value;
        var base = input("base");
        var alphabet = ALPHABET;
        var t = void 0; // temporary variable

        if (base instanceof api.string) {
            alphabet = base.value;

            if (rargs[1]) {
                if (rargs[1] instanceof api.number) {
                    if (rargs[1].value > alphabet.length) {
                        return "Alphabet was too short for given base";
                    } else {
                        t = rargs[1].value;
                    }
                } else {
                    return "Given string as first argument, second was expected to be number when provided";
                }
            }

            alphabet = alphabet.slice(0, t);
        } else if (base instanceof api.number) {
            if (rargs[1]) {
                if (rargs[1] instanceof api.string) {
                    if (base.value > rargs[1].value.length) {
                        return "Alphabet is too short for given base";
                    } else {
                        alphabet = rargs[1].value;
                    }
                } else {
                    return "Given number as first argument, second was expected to be alphabet when provided.";
                }
            }

            if (base.value > alphabet.length) {
                return "Provide alphabet when converting to base larger than 62";
            }

            if (base.value <= 0) {
                return "Base must be greater than zero";
            }

            alphabet = alphabet.slice(0, base.value);
        } else {
            return "base must be number or string";
        }

        return api.init(api.string, _bases2.default.toAlphabet(self, alphabet));
    }))];
};

module.exports = exports["default"];

},{"bases":142}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _api = require('../../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Map([require('./lib/slice')(_api2.default), require('./lib/bytes')(_api2.default), require('./lib/lines')(_api2.default), require('./lib/count')(_api2.default), require('./lib/upper')(_api2.default), require('./lib/lower')(_api2.default), require('./lib/split')(_api2.default), require('./lib/ord')(_api2.default), require('./lib/len')(_api2.default), require('./lib/rev')(_api2.default), require('./lib/chars')(_api2.default), require('./lib/head')(_api2.default), require('./lib/tail')(_api2.default), require('./lib/sub')(_api2.default), require('./lib/index')(_api2.default), require('./lib/chunk')(_api2.default)]);
module.exports = exports['default'];

},{"../../api":51,"./lib/bytes":85,"./lib/chars":86,"./lib/chunk":87,"./lib/count":88,"./lib/head":89,"./lib/index":90,"./lib/len":91,"./lib/lines":92,"./lib/lower":93,"./lib/ord":94,"./lib/rev":95,"./lib/slice":96,"./lib/split":97,"./lib/sub":98,"./lib/tail":99,"./lib/upper":100}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["bytes", api.prop(new api.func([], function (_, input) {
        return api.init.apply(api, [api.array].concat(_toConsumableArray(input("self").value.split("").map(function (chr) {
            return api.init(api.number, 10, 0, chr.charCodeAt());
        }))));
    }))];
};

module.exports = exports["default"];

},{}],86:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// source: http://stackoverflow.com/a/14349616/1620622, modified
function chunkString(str, len, cheddar) {
    var _size = Math.ceil(str.length / len),
        _ret = new Array(_size),
        _offset;

    for (var _i = 0; _i < _size; _i++) {
        _offset = _i * len;
        _ret[_i] = cheddar.init(cheddar.string, str.substring(_offset, _offset + len));
    }

    return _ret;
}

exports.default = function (cheddar) {
    return ["chunk", cheddar.var(new cheddar.func([["size", {
        Type: cheddar.number
    }]], function (scope, input) {
        var size = input("size").value;
        var self = input("self").value;

        // TODO: ensure > 0

        return cheddar.init.apply(cheddar, [cheddar.array].concat(_toConsumableArray(chunkString(self, size, cheddar))));
    }))];
};

module.exports = exports["default"];

},{}],88:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["head", api.var(new api.func([["A", {
        Type: api.number
    }]], function (scope, input) {
        var item = input("self").value;
        return api.init(api.string, item.substring(0, input("A").value));
    }))];
};

module.exports = exports["default"];

},{}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["index", api.var(new api.func([["substring", {
        Type: api.string
    }]], function (scope, input) {
        return api.init(api.number, 10, 0, input("self").value.indexOf(input("substring").value));
    }))];
};

module.exports = exports["default"];

},{}],91:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (api) {
    return ["lines", api.prop(new api.func([], function (_, input) {
        return api.init.apply(api, [api.array].concat(_toConsumableArray(input("self").value.split(/\r?\n|\r/).map(function (chr) {
            return api.init(api.string, chr);
        }))));
    }))];
};

module.exports = exports["default"];

},{}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["lower", api.prop(new api.func([], function (_, input) {
        return api.init(api.string, input("self").value.toLowerCase());
    }))];
};

module.exports = exports["default"];

},{}],94:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["rev", api.prop(new api.func([], function (_, input) {
        return api.init(api.string, (input("self").value.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[\S\s]/g) || []).reverse().join(""));
    }))];
};

module.exports = exports["default"];

},{}],96:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],97:[function(require,module,exports){
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

module.exports = exports["default"];

},{}],98:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _xregexp = require('xregexp');

var _xregexp2 = _interopRequireDefault(_xregexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (cheddar) {
    return ["sub", cheddar.var(new cheddar.func([['regex', {
        // Type: cheddar.(string|regex)
    }], ['replacement', {
        // Type: cheddar.(string|function)
    }]], function (scope, input) {
        var string = input('self').value;
        var regex = input('regex');
        var replacement = input('replacement');

        if (regex instanceof cheddar.string || regex instanceof cheddar.regex) {
            regex = regex.value;
        } else {
            return 'Pattern was of type ' + (regex.Name || regex.constructor.Name) + ', expected string or regex';
        }

        // Make sure replacement is string or funcion
        if (replacement instanceof cheddar.func) {
            (function () {
                // Given replacement
                var _replacement = replacement;

                // If it's a function create a wrapper
                replacement = function replacement() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    // Check if args[0] is an object
                    if (_typeof(args[0]) === 'object') {}
                    // TODO: Handle this


                    // Cast to cheddar strings
                    var cargs = args.map(function (i) {
                        return cheddar.init(cheddar.string, i);
                    });

                    var res = _replacement.exec(cargs, null);
                    if (!(res instanceof cheddar.string)) {
                        throw res.Name || res.constructor.Name; // Generall error
                    } else {
                        return res.value;
                    }
                };
            })();
        } else if (replacement instanceof cheddar.string) {
            replacement = replacement.value;
        } else {
            return 'Replacement was of type ' + (replacement.Name || replacement.constructor.Name) + ', expected string or function';
        }

        var res = void 0;

        try {
            res = _xregexp2.default.replace(string, regex, replacement);
        } catch (e) {
            return 'Replacement returned ' + e.message + ', expected string.';
        }

        return cheddar.init(cheddar.string, res);
    }))];
};

module.exports = exports['default'];

},{"xregexp":163}],99:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["tail", api.var(new api.func([["A", {
        Type: api.number
    }]], function (scope, input) {
        var item = input("self").value;
        return api.init(api.string, item.substring(-Math.abs(input("A").value)));
    }))];
};

module.exports = exports["default"];

},{}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (api) {
    return ["upper", api.prop(new api.func([], function (_, input) {
        return api.init(api.string, input("self").value.toUpperCase());
    }))];
};

module.exports = exports["default"];

},{}],101:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Array = require('../../../interpreter/core/primitives/Array');

var _Array2 = _interopRequireDefault(_Array);

var _String = require('../../../interpreter/core/primitives/String');

var _String2 = _interopRequireDefault(_String);

var _init = require('../../../helpers/init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = new Map([["letters", { Value: _init2.default.apply(undefined, [_Array2.default].concat(_toConsumableArray([].concat(_toConsumableArray("abcdefghijklmnopqrstuvwxyz")).map(function (s) {
        return (0, _init2.default)(_String2.default, s);
    })))) }], ["digits", { Value: _init2.default.apply(undefined, [_Array2.default].concat(_toConsumableArray([].concat(_toConsumableArray("0123456789")).map(function (s) {
        return (0, _init2.default)(_String2.default, s);
    })))) }], ["alphanumeric", { Value: _init2.default.apply(undefined, [_Array2.default].concat(_toConsumableArray([].concat(_toConsumableArray("abcdefghijklmnopqrstuvwxyz0123456789")).map(function (s) {
        return (0, _init2.default)(_String2.default, s);
    })))) }], ["dquo", { Value: (0, _init2.default)(_String2.default, '"') }], ["squo", { Value: (0, _init2.default)(_String2.default, "'") }]]);
module.exports = exports['default'];

},{"../../../helpers/init":3,"../../../interpreter/core/primitives/Array":21,"../../../interpreter/core/primitives/String":26}],102:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STDLIB = new Map();
STDLIB.Item = function (Name) {
    var NOT_SAFE = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (NOT_SAFE && global.SAFE_MODE) {
        return;
    } else {
        STDLIB.set(Name, _api2.default.var(require("./ns/" + Name)(_api2.default)));
    }
};
STDLIB.p = function (Name, Item) {
    STDLIB.set(Name, _api2.default.var(Item));
    STDLIB.set(Name.toLowerCase(), _api2.default.var(Item));
};

/** Global Libraries **/
STDLIB.Item("cheddar");

STDLIB.Item("Math");
STDLIB.Item("Rational");

// Interface Libraries
STDLIB.Item("Encoding");
STDLIB.Item("Buffer");
STDLIB.Item("IO", true);

/** Primitives **/
STDLIB.p("String", _api2.default.string);
STDLIB.p("Symbol", _api2.default.symbol);
STDLIB.p("Regex", _api2.default.regex);
STDLIB.p("Number", _api2.default.number);
STDLIB.p("Array", _api2.default.array);
STDLIB.p("Boolean", _api2.default.bool);

exports.default = STDLIB;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./api":51}],103:[function(require,module,exports){
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

var TOKEN_START = exports.TOKEN_START = MALPHA + '_$';
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

/*== Regex Data ==*/
var REGEX_DELIMITER = exports.REGEX_DELIMITER = '/';
var REGEX_ESCAPE = exports.REGEX_ESCAPE = '\\';
var REGEX_FLAGS = exports.REGEX_FLAGS = 'nsxgimc';

/*== Array Data ==*/
var ARRAY_OPEN = exports.ARRAY_OPEN = '[';
var ARRAY_CLOSE = exports.ARRAY_CLOSE = ']';
var ARRAY_SEPARATOR = exports.ARRAY_SEPARATOR = ',';

/*== String Data ==*/
var STRING_ESCAPES = exports.STRING_ESCAPES = new Map([['0', String.fromCharCode(0)], ['a', String.fromCharCode(8)], ['b', '\b'], ['t', '\t'], ['n', '\n'], ['v', '\v'], ['f', '\f'], ['r', '\r'], ['e', String.fromCharCode(27)]]);

/*== Number Data ==*/
var BASE_IDENTIFIERS = exports.BASE_IDENTIFIERS = ['b', 'o', 'x'];
var BASE_RESPECTIVE_NUMBERS = exports.BASE_RESPECTIVE_NUMBERS = [2, 8, 16];

/*== Conflict Data ==*/
var RESERVED = exports.RESERVED = ['sqrt', 'cos', 'sin', 'sign'];

},{}],104:[function(require,module,exports){
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

},{}],105:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _err = require("./err");

var _SyntaxError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = new Map([[_SyntaxError.EXIT_NOTFOUND, "Abnormal syntax at $LOC"], [_SyntaxError.UNEXPECTED_TOKEN, "Unexpected token at $LOC"], [_SyntaxError.UNMATCHED_DELIMITER, "Expected a matching delimiter for `$1` at $LOC"], [_SyntaxError.EXPECTED_BLOCK, "Expected a code block at $LOC"]]);
module.exports = exports["default"];

},{"./err":104}],106:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * DEFAULT Operators
 * OP - Operators
 * UOP - Unary operators
**/

var RESERVED_KEYWORDS = exports.RESERVED_KEYWORDS = new Set(['sqrt', 'cbrt', 'root', 'sin', 'cos', 'tan', 'acos', 'asin', 'atan', 'log', 'has', 'floor', 'ceil', 'round', 'abs', 'repr', 'sign', 'print', 'what', 'is', 'actually', 'as',
// States
'var', 'const', 'if', 'for', 'while', 'break', 'return', 'func', 'class',
// Literals
'true', 'false', 'nil']);

var EXCLUDE_META_ASSIGNMENT = exports.EXCLUDE_META_ASSIGNMENT = new Set(['==', '!=', '<=', '>=']);

var OP = exports.OP = ['**', '*', '/', '%', '+', '-', '<=', '>=', '<', '>', '==', '&', '|', '^', '&&', '||', '!=', '=', '+=', '-=', '*=', '/=', '^=', '%=', '&=', '|=', '<<', '>>', '<<=', '>>=', '|>', '::', 'as', '@"', 'has', 'log', 'sign', 'root', 'is', 'actually'].sort(function (a, b) {
    return b.length - a.length;
});

// Unary operators
var UOP = exports.UOP = ['-', '+', '!', '|>', 'sqrt', 'cbrt', 'sin', 'cos', 'tan', 'acos', 'asin', 'atan', 'floor', 'ceil', 'round', 'abs', 'repr', 'print', 'log', 'sign', '@"', 'what', 'is'];

var UNARY_PRECEDENCE = exports.UNARY_PRECEDENCE = new Map([['!', 20000], ['-', 20000], ['+', 20000], ['|>', 18000], ['@"', 17000], ['what', 16000], ['is', 15000], ['sqrt', 15000], ['cbrt', 15000], ['cos', 15000], ['sin', 15000], ['tan', 15000], ['acos', 15000], ['asin', 15000], ['atan', 15000], ['log', 15000], ['floor', 15000], ['ceil', 15000], ['abs', 15000], ['repr', 15000], ['round', 15000], ['sign', 15000], ['print', 0]]);

var PRECEDENCE = exports.PRECEDENCE = new Map([['::', 16000], ['@"', 15000], ['|>', 15000], ['as', 14000], ['log', 14000], ['is', 14000], ['actually', 14000], ['root', 14000], ['*', 13000], ['/', 13000], ['%', 13000], ['+', 12000], ['-', 12000], ['<<', 11000], ['>>', 11000], ['<', 10000], ['>', 10000], ['<=', 10000], ['>=', 10000], ['sign', 10000], ['has', 9000], ['==', 9000], ['!=', 9000], ['&', 8000], ['^', 7000], ['|', 6000], ['&&', 2001], ['||', 2000]]);

var RA_PRECEDENCE = exports.RA_PRECEDENCE = new Map([['**', 14000], ['+=', 1000], ['-=', 1000], ['*=', 1000], ['/=', 1000], ['%=', 1000], ['&=', 1000], ['|=', 1000], ['^=', 1000], ['<<=', 1000], ['>>=', 1000], ['=', 1000]]);

var TYPE = exports.TYPE = {
    UNARY: Symbol('Unary Operator'),
    LTR: Symbol('LTR Operator'),
    RTL: Symbol('RTL Operator')
};

},{}],107:[function(require,module,exports){
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

},{}],108:[function(require,module,exports){
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

},{"../consts/err":104,"../consts/types":107,"./primitive":116}],109:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _array = require('../parsers/array');

var _array2 = _interopRequireDefault(_array);

var _expr = require('../parsers/expr');

var _expr2 = _interopRequireDefault(_expr);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarDictItemToken = function (_CheddarLexer) {
    _inherits(CheddarDictItemToken, _CheddarLexer);

    function CheddarDictItemToken() {
        _classCallCheck(this, CheddarDictItemToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarDictItemToken).apply(this, arguments));
    }

    _createClass(CheddarDictItemToken, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            // Match the key
            var key = this.initParser(_expr2.default);
            var key_tokens = key.exec(true);

            if (!(key_tokens instanceof _lex2.default)) {
                this.Index = key.Index;
                return key_tokens;
            }

            this.Index = key_tokens.Index;
            this.Tokens = key_tokens;

            // Check if `:`, not then not dict
            if (!this.jumpLiteral(":")) {
                return CheddarError.EXIT_NOTFOUND;
            }

            this.jumpWhite();

            // Match the value
            var value = this.initParser(_expr2.default);
            var value_tokens = value.exec(true);

            if (!(value_tokens instanceof _lex2.default)) {
                this.Index = value.Index;
                return value_tokens;
            }

            this.Index = value_tokens.Index;
            this.Tokens = value_tokens;

            return this.close();
        }
    }]);

    return CheddarDictItemToken;
}(_lex2.default);

var CheddarDictToken = function (_CheddarPrimitive) {
    _inherits(CheddarDictToken, _CheddarPrimitive);

    function CheddarDictToken() {
        _classCallCheck(this, CheddarDictToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarDictToken).apply(this, arguments));
    }

    _createClass(CheddarDictToken, [{
        key: 'exec',
        value: function exec() {
            this.open(false);
            var res_init = new _array2.default(this.Code, this.Index);
            var res = res_init.exec('[', ']', CheddarDictItemToken);

            if (!(res instanceof _lex2.default)) {
                this.Index = res_init.Index;
                return res;
            }

            this.Index = res.Index;
            this.Tokens = res;

            return this.close();
        }
    }]);

    return CheddarDictToken;
}(_primitive2.default);

exports.default = CheddarDictToken;
module.exports = exports['default'];

},{"../consts/err":104,"../parsers/array":124,"../parsers/expr":126,"../tok/lex":140,"./primitive":116}],110:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ops = require('../consts/ops');

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _err = require('../consts/err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Functionized operators


var OPERATORS = _ops.UOP.concat(_ops.OP).sort(function (a, b) {
    return b.length - a.length;
});

var CheddarFunctionizedOperatorToken = function (_CheddarPrimitive) {
    _inherits(CheddarFunctionizedOperatorToken, _CheddarPrimitive);

    function CheddarFunctionizedOperatorToken() {
        _classCallCheck(this, CheddarFunctionizedOperatorToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarFunctionizedOperatorToken).apply(this, arguments));
    }

    _createClass(CheddarFunctionizedOperatorToken, [{
        key: 'exec',
        value: function exec() {
            var FOP = this.grammar(true, ['(', _ops.OP.concat(_ops.UOP), [':'], ')']);

            return FOP;
        }
    }]);

    return CheddarFunctionizedOperatorToken;
}(_primitive2.default);

exports.default = CheddarFunctionizedOperatorToken;
module.exports = exports['default'];

},{"../consts/err":104,"../consts/ops":106,"./primitive":116}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ops = require('../consts/ops');

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _property = require('../parsers/property');

var _property2 = _interopRequireDefault(_property);

var _custom = require('../parsers/custom');

var _custom2 = _interopRequireDefault(_custom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Functionized operators


var CheddarFunctionizedPropertyToken = function (_CheddarPrimitive) {
    _inherits(CheddarFunctionizedPropertyToken, _CheddarPrimitive);

    function CheddarFunctionizedPropertyToken() {
        _classCallCheck(this, CheddarFunctionizedPropertyToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarFunctionizedPropertyToken).apply(this, arguments));
    }

    _createClass(CheddarFunctionizedPropertyToken, [{
        key: 'exec',
        value: function exec() {
            var FPROP = this.grammar(true, ['@.', (0, _custom2.default)(_property2.default, true)]);

            return FPROP;
        }
    }]);

    return CheddarFunctionizedPropertyToken;
}(_primitive2.default);

exports.default = CheddarFunctionizedPropertyToken;
module.exports = exports['default'];

},{"../consts/ops":106,"../parsers/custom":125,"../parsers/property":129,"./primitive":116}],112:[function(require,module,exports){
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

},{"../consts/chars":103,"../consts/err":104,"../tok/lex":140}],113:[function(require,module,exports){
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

},{"../consts/err":104,"../consts/types":107,"./primitive":116}],114:[function(require,module,exports){
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

                if (this.Code[this.Index - 1] === ".") {
                    --this.Index;
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

},{"../consts/chars":103,"../consts/err":104,"../consts/types":107,"./primitive":116}],115:[function(require,module,exports){
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

},{"../consts/err":104,"../consts/ops":106,"../tok/lex":140}],116:[function(require,module,exports){
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

},{"./literal":112}],117:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _chars = require('../consts/chars');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheddarRegexToken = function (_CheddarPrimitive) {
    _inherits(CheddarRegexToken, _CheddarPrimitive);

    function CheddarRegexToken() {
        _classCallCheck(this, CheddarRegexToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarRegexToken).apply(this, arguments));
    }

    _createClass(CheddarRegexToken, [{
        key: 'exec',
        value: function exec() {

            this.open();

            if (this.getChar() === _chars.REGEX_DELIMITER) {
                var loc = this.Index - 1;
                // in a string

                var chr = void 0;

                while (chr = this.getChar()) {
                    if (chr === _chars.REGEX_DELIMITER) {
                        break;
                    } else if (this.isLast) {
                        this.Index = loc;
                        return this.error(CheddarError.UNMATCHED_DELIMITER);
                    } else if (chr === _chars.REGEX_ESCAPE) {
                        this.addToken(_chars.REGEX_ESCAPE + this.getChar());
                    } else {
                        this.addToken(chr);
                    }
                }

                // Match flags
                this.newToken(); // Flag to store token
                while (_chars.REGEX_FLAGS.indexOf(this.Code[this.Index]) > -1) {
                    this.addToken(this.Code[this.Index++]);
                }

                return this.close();
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND);
            }
        }
    }]);

    return CheddarRegexToken;
}(_primitive2.default);

exports.default = CheddarRegexToken;
module.exports = exports['default'];

},{"../consts/chars":103,"../consts/err":104,"./primitive":116}],118:[function(require,module,exports){
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
                var esc = void 0;

                while (chr = this.getChar()) {
                    if (chr === qt) {
                        break;
                    } else if (this.isLast) {
                        this.Index = loc;
                        return this.error(CheddarError.UNMATCHED_DELIMITER);
                    } else if (chr === _chars.STRING_ESCAPE) {
                        this.addToken(_chars.STRING_ESCAPES.has(esc = this.getChar()) ? _chars.STRING_ESCAPES.get(esc) : esc);
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

},{"../consts/chars":103,"../consts/err":104,"../consts/types":107,"./primitive":116}],119:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _primitive = require('./primitive');

var _primitive2 = _interopRequireDefault(_primitive);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _var = require('./var');

var _var2 = _interopRequireDefault(_var);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SYMBOL_OPEN = '@';

var CheddarSymbolToken = function (_CheddarPrimitive) {
    _inherits(CheddarSymbolToken, _CheddarPrimitive);

    function CheddarSymbolToken() {
        _classCallCheck(this, CheddarSymbolToken);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CheddarSymbolToken).apply(this, arguments));
    }

    _createClass(CheddarSymbolToken, [{
        key: 'exec',
        value: function exec() {
            this.open();

            if (this.getChar() === SYMBOL_OPEN) {
                var varparse = this.initParser(_var2.default);
                var res = varparse.exec();

                if (!(res instanceof _lex2.default)) {
                    return res;
                } else {
                    this.addToken(varparse._Tokens[0]);
                    this.Index = varparse.Index;
                    return this.close();
                }
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND);
            }
        }
    }]);

    return CheddarSymbolToken;
}(_primitive2.default);

exports.default = CheddarSymbolToken;
module.exports = exports['default'];

},{"../consts/err":104,"../tok/lex":140,"./primitive":116,"./var":120}],120:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

var _chars = require('../consts/chars');

var _ops = require('../consts/ops');

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
                } // if a reserved keyword was matched
                if (_ops.RESERVED_KEYWORDS.has(this._Tokens[0])) {
                    // Ignore it
                    return this.error(CheddarError.EXIT_NOTFOUND);
                }

                return this.close();
            } else {
                return this.error(CheddarError.EXIT_NOTFOUND);
            }
        }
    }]);

    return CheddarVariableToken;
}(_lex2.default);

exports.default = CheddarVariableToken;
module.exports = exports['default'];

},{"../consts/chars":103,"../consts/err":104,"../consts/ops":106,"../tok/lex":140}],121:[function(require,module,exports){
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

var _regex = require('../literals/regex');

var _regex2 = _interopRequireDefault(_regex);

var _dict = require('../literals/dict');

var _dict2 = _interopRequireDefault(_dict);

var _symbol = require('../literals/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _fop = require('../literals/fop');

var _fop2 = _interopRequireDefault(_fop);

var _fprop = require('../literals/fprop');

var _fprop2 = _interopRequireDefault(_fprop);

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

            var attempt = this.attempt(_fprop2.default, _fop2.default, _dict2.default, _string2.default, _number2.default, _boolean2.default, _nil2.default, _array2.default, _regex2.default, _symbol2.default);

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

},{"../literals/boolean":108,"../literals/dict":109,"../literals/fop":110,"../literals/fprop":111,"../literals/literal":112,"../literals/nil":113,"../literals/number":114,"../literals/regex":117,"../literals/string":118,"../literals/symbol":119,"./array":124}],122:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _var = require('../../literals/var');

var _var2 = _interopRequireDefault(_var);

var _typed_var = require('./typed_var');

var _typed_var2 = _interopRequireDefault(_typed_var);

var _expr = require('../../states/expr');

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
            this.open(false);

            return this.grammar(true, [_typed_var2.default, ['?'], [['=', _expr2.default]]]);
        }
    }]);

    return CheddarArgumentToken;
}(_lex2.default);

exports.default = CheddarArgumentToken;
module.exports = exports['default'];

},{"../../literals/var":120,"../../states/expr":134,"../../tok/lex":140,"./typed_var":123}],123:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _literal = require('../../literals/literal');

var _literal2 = _interopRequireDefault(_literal);

var _var = require('../../literals/var');

var _var2 = _interopRequireDefault(_var);

var _lex = require('../../tok/lex');

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

            return this.grammar(true, [V, [[':', L]]]);
        }
    }]);

    return CheddarTypedVariableToken;
}(_lex2.default);

exports.default = CheddarTypedVariableToken;
module.exports = exports['default'];

},{"../../literals/literal":112,"../../literals/var":120,"../../tok/lex":140}],124:[function(require,module,exports){
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

},{"../consts/chars":103,"../consts/err":104,"../consts/types":107,"../literals/primitive":116,"../tok/lex":140,"./expr":126}],125:[function(require,module,exports){
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

},{"../tok/lex":140}],126:[function(require,module,exports){
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

var UNARY = (0, _custom2.default)(_op2.default, true);

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

var E = (0, _custom2.default)(CheddarExpressionToken, true, false);

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
        // Store index in case ternary is not found
        var current_index = this.Index;

        // Lookahead for ternary `?`
        if (!this.lookAhead("?")) {
            // If it doesn't exist, just exit
            // Set back to last safe index
            this.Index = current_index;

            // Backtrack single whitespace
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

},{"../consts/err":104,"../consts/ops":106,"../literals/op":115,"../tok/lex":140,"./custom":125,"./function":127,"./property":129}],127:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expr = require('../states/expr');

var _expr2 = _interopRequireDefault(_expr);

var _var = require('../literals/var');

var _var2 = _interopRequireDefault(_var);

var _block = require('../patterns/block');

var _block2 = _interopRequireDefault(_block);

var _array = require('./array');

var _array2 = _interopRequireDefault(_array);

var _argument = require('./args/argument');

var _argument2 = _interopRequireDefault(_argument);

var _custom = require('./custom');

var _custom2 = _interopRequireDefault(_custom);

var _primitive = require('../literals/primitive');

var _primitive2 = _interopRequireDefault(_primitive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var A = (0, _custom2.default)(_array2.default, '(', ')', _argument2.default, true);
var ExpressionToken = (0, _custom2.default)(_expr2.default, true);

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

            /**
             This basically runs the following:
              "->" ARG_LIST? (CODE BLOCK | EXPRESSION)
              */

            var grammar = this.grammar(true, [[A, _argument2.default, ""], [_var2.default], "->", [_block2.default, ExpressionToken]]);

            return grammar;
        }
    }]);

    return CheddarFunctionToken;
}(_primitive2.default);

exports.default = CheddarFunctionToken;
module.exports = exports['default'];

},{"../literals/primitive":116,"../literals/var":120,"../patterns/block":131,"../states/expr":134,"./args/argument":122,"./array":124,"./custom":125}],128:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expr = require('./expr');

var _expr2 = _interopRequireDefault(_expr);

var _custom = require('./custom');

var _custom2 = _interopRequireDefault(_custom);

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var expr = (0, _custom2.default)(_expr2.default, true);

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

            var resp = this.grammar(true, ['(', expr, ')']);

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

},{"../tok/lex":140,"./custom":125,"./expr":126}],129:[function(require,module,exports){
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
            var Initial = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            this.open(false);

            this.Type = _types.PropertyType.Property;

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

},{"../consts/err":104,"../consts/types":107,"../literals/primitive":116,"../literals/var":120,"../tok/lex":140,"./any":121,"./array":124,"./expr":126,"./paren_expr":128}],130:[function(require,module,exports){
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

},{"../tok/lex":140}],131:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

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
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {
                tok: require('../tok'),
                args: {}
            } : arguments[0];

            var tokenizer = _ref.tok;
            var _ref$args = _ref.args;
            var ENDS = _ref$args.ENDS;
            var PARSERS = _ref$args.PARSERS;

            if (!this.lookAhead("{")) return CheddarError.EXIT_NOTFOUND;

            this.jumpLiteral("{");

            var RUN = this.initParser(tokenizer);
            var RES = RUN.exec("}", PARSERS);

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

},{"../consts/err":104,"../parsers/custom":125,"../tok":139,"../tok/lex":140}],132:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _expr = require('../parsers/expr');

var _expr2 = _interopRequireDefault(_expr);

var _typed_var = require('../parsers/args/typed_var');

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

            var DEFS = ['var', 'let', 'const'];
            return this.grammar(true, [DEFS, this.jumpWhite, _typed_var2.default, CheddarError.UNEXPECTED_TOKEN, [['=', _expr2.default]]]);
        }
    }]);

    return StatementAssign;
}(_lex2.default);

exports.default = StatementAssign;
module.exports = exports['default'];

},{"../consts/err":104,"../parsers/args/typed_var":123,"../parsers/expr":126,"../tok/lex":140}],133:[function(require,module,exports){
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

var StatementBreak = function (_CheddarLexer) {
    _inherits(StatementBreak, _CheddarLexer);

    function StatementBreak() {
        _classCallCheck(this, StatementBreak);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StatementBreak).apply(this, arguments));
    }

    _createClass(StatementBreak, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            this.jumpWhite();

            if (!this.jumpLiteral("break")) return CheddarError.EXIT_NOTFOUND;

            if (_chars.TOKEN_END.indexOf(this.Code[this.Index]) > -1) return CheddarError.EXIT_NOTFOUND;

            this.Tokens = "break";

            return this.close();
        }
    }]);

    return StatementBreak;
}(_lex2.default);

exports.default = StatementBreak;
module.exports = exports['default'];

},{"../consts/chars":103,"../consts/err":104,"../tok/lex":140}],134:[function(require,module,exports){
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

},{"../parsers/expr":126,"../tok/lex":140}],135:[function(require,module,exports){
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

var _break = require('./break');

var _break2 = _interopRequireDefault(_break);

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
        value: function exec(tokenizer) {
            this.open();

            if (tokenizer) {
                tokenizer.args.PARSERS.push(_break2.default);
            }

            var codeblock = (0, _custom2.default)(_block2.default, tokenizer);

            if (!this.lookAhead("for")) return CheddarError.EXIT_NOTFOUND;

            this.jumpLiteral("for");

            var FOR = this.grammar(true, ['(', [_assign2.default, _expr2.default], ';', _expr2.default, ';', _expr2.default, ')', codeblock], ['(', [DECONSTRUCT, _var2.default], 'in', _expr2.default, ')', codeblock]);

            return FOR;
        }
    }]);

    return StatementFor;
}(_EXPLICIT2.default);

exports.default = StatementFor;
module.exports = exports['default'];

},{"../consts/err":104,"../literals/var":120,"../parsers/array":124,"../parsers/custom":125,"../patterns/EXPLICIT":130,"../patterns/block":131,"./assign":132,"./break":133,"./expr":134}],136:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _block = require('../patterns/block');

var _block2 = _interopRequireDefault(_block);

var _array = require('../parsers/array');

var _array2 = _interopRequireDefault(_array);

var _argument = require('../parsers/args/argument');

var _argument2 = _interopRequireDefault(_argument);

var _var = require('../literals/var');

var _var2 = _interopRequireDefault(_var);

var _custom = require('../parsers/custom');

var _custom2 = _interopRequireDefault(_custom);

var _return = require('./return');

var _return2 = _interopRequireDefault(_return);

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var A = (0, _custom2.default)(_array2.default, '(', ')', _argument2.default, true);

var StatementFunc = function (_CheddarLexer) {
    _inherits(StatementFunc, _CheddarLexer);

    function StatementFunc() {
        _classCallCheck(this, StatementFunc);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StatementFunc).apply(this, arguments));
    }

    _createClass(StatementFunc, [{
        key: 'exec',
        value: function exec(tokenizer) {
            this.open(false);
            this.jumpWhite();

            if (!this.lookAhead("func")) return CheddarError.EXIT_NOTFOUND;

            this.jumpLiteral("func");

            if (tokenizer) {
                tokenizer.args.PARSERS.unshift(_return2.default);
            }

            var codeblock = (0, _custom2.default)(_block2.default, tokenizer);

            var grammar = this.grammar(true, [_var2.default, A, codeblock]);

            return grammar;
        }
    }]);

    return StatementFunc;
}(_lex2.default);

exports.default = StatementFunc;
module.exports = exports['default'];

},{"../consts/err":104,"../literals/var":120,"../parsers/args/argument":122,"../parsers/array":124,"../parsers/custom":125,"../patterns/block":131,"../tok/lex":140,"./return":138}],137:[function(require,module,exports){
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
        value: function exec(tokenizer) {
            this.open();

            if (!this.lookAhead("if")) return CheddarError.EXIT_NOTFOUND;

            this.jumpLiteral("if");

            var EXPRESSION = (0, _custom2.default)(_expr2.default, true);

            // Match the `expr { block }` format
            var FORMAT = ['(', EXPRESSION, ')', (0, _custom2.default)(_block2.default, tokenizer), CheddarError.EXPECTED_BLOCK];

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
                    var RES = RUN.exec(tokenizer);

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

},{"../consts/err":104,"../parsers/custom":125,"../patterns/EXPLICIT":130,"../patterns/block":131,"./expr":134}],138:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('../tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _expr = require('./expr');

var _expr2 = _interopRequireDefault(_expr);

var _chars = require('../consts/chars');

var _err = require('../consts/err');

var CheddarError = _interopRequireWildcard(_err);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatementReturn = function (_CheddarLexer) {
    _inherits(StatementReturn, _CheddarLexer);

    function StatementReturn() {
        _classCallCheck(this, StatementReturn);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StatementReturn).apply(this, arguments));
    }

    _createClass(StatementReturn, [{
        key: 'exec',
        value: function exec() {
            this.open(false);

            this.jumpWhite();

            if (!this.jumpLiteral("return")) return CheddarError.EXIT_NOTFOUND;

            if (_chars.TOKEN_END.indexOf(this.Code[this.Index]) > -1) return CheddarError.EXIT_NOTFOUND;

            this.Tokens = "return";

            var parser = this.initParser(_expr2.default);
            var res = parser.exec();

            if (!(res instanceof _lex2.default)) {
                this.Index = parser.Index;
                return res;
            }

            this.Index = res.Index;
            this.Tokens = res;

            return this.close();
        }
    }]);

    return StatementReturn;
}(_lex2.default);

exports.default = StatementReturn;
module.exports = exports['default'];

},{"../consts/chars":103,"../consts/err":104,"../tok/lex":140,"./expr":134}],139:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lex = require('./tok/lex');

var _lex2 = _interopRequireDefault(_lex);

var _custom = require('./parsers/custom');

var _custom2 = _interopRequireDefault(_custom);

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

var _func = require('./states/func');

var _func2 = _interopRequireDefault(_func);

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
var WHITESPACE = /\s/;
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
            var PARSERS = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];


            var MATCH = this.attempt(PARSERS.concat([_assign2.default, _if2.default, _for2.default, _func2.default, _expr2.default]), {
                tok: this.constructor,
                args: { ENDS: ENDS, PARSERS: PARSERS }
            });

            if (MATCH instanceof _lex2.default && MATCH.Errored !== true) {

                this.Tokens = MATCH;
                this.Index = MATCH.Index;

                // Whether or not it backtracked for a newline
                var backtracked = false;

                while (SINGLELINE_WHITESPACE.test(this.Code[this.Index])) {
                    backtracked = true;
                    this.Index--;
                }

                if (backtracked) {
                    if (NEWLINE.test(this.Code[this.Index - 1])) {
                        this.Index--;
                    } else if (SINGLELINE_WHITESPACE.test(this.Code[this.Index + 1])) {
                        this.Index++;
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

},{"../helpers/loc":4,"./consts/err":104,"./consts/err_msg":105,"./parsers/custom":125,"./patterns/EXPLICIT":130,"./states/assign":132,"./states/expr":134,"./states/for":135,"./states/func":136,"./states/if":137,"./tok/lex":140}],140:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
        key: 'toAST',
        value: function toAST() {
            var node = this,
                tokens = this._Tokens;

            while (tokens.length === 1 && tokens[0].isExpression) {
                node = tokens[0];
                tokens = tokens[0]._Tokens;
            }

            if (tokens.length === 1 && tokens[0] instanceof CheddarLexer) {
                node = tokens[0];
                tokens = tokens[0]._Tokens;
            }

            return node.constructor.name.replace(/^Cheddar/g, '') + '\n' + tokens.map(function (t) {
                return typeof t === 'string' ? "'" + t + "'" : t;
            }).map(function (t) {
                return t.toAST ? t.toAST() : t.toString();
            }).join(tokens.every(function (o) {
                return !(o instanceof CheddarLexer);
            }) ? ' ' : '\n').replace(/^/gm, ' │').replace(/^ │(?! [└├│┬])/gm, ' ├');
            //.replace(/^((?: [^└├│┬])*)├/gm, '└'); //wait only the last one
        }
    }, {
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
            for (var _len = arguments.length, parsers = Array(_len), _key = 0; _key < _len; _key++) {
                parsers[_key] = arguments[_key];
            }

            var global_tokenizer = void 0;
            if (Array.isArray(parsers[0])) {
                var _parsers = parsers;

                var _parsers2 = _slicedToArray(_parsers, 2);

                parsers = _parsers2[0];
                global_tokenizer = _parsers2[1];
            }

            var attempt = void 0;
            var furthest = this.Index;
            for (var i = 0; i < parsers.length; i++) {
                if (parsers[i] instanceof CheddarLexer) {
                    parsers[i].Code = this.Code;
                    parsers[i].Index = this.Index;
                    attempt = parsers[i].exec(global_tokenizer);
                } else {
                    parsers[i] = this.initParser(parsers[i]);
                    attempt = parsers[i].exec(global_tokenizer);
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
                } else {
                    furthest = Math.max(furthest, parsers[i].Index);
                }
            }

            this.Index = furthest;
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
                            var success = false;
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
                                        success = true;
                                        match = defs[i][j][k];
                                        index = this.Index;
                                        break;
                                    }
                                }
                            }
                            this.Index = _oldIndex3;
                            if (match || success) {
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

},{"../consts/err":104}],141:[function(require,module,exports){
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

},{"../consts/err":104,"../consts/ops":106,"../literals/op":115,"./lex":140}],142:[function(require,module,exports){
// bases.js
// Utility for converting numbers to/from different bases/alphabets.
// See README.md for details.

var bases = (typeof exports !== 'undefined' ? exports : (window.Bases = {}));

// Returns a string representation of the given number for the given alphabet:
bases.toAlphabet = function (num, alphabet) {
    var base = alphabet.length;
    var digits = [];    // these will be in reverse order since arrays are stacks

    // execute at least once, even if num is 0, since we should return the '0':
    do {
        digits.push(num % base);    // TODO handle negatives properly?
        num = Math.floor(num / base);
    } while (num > 0);

    var chars = [];
    while (digits.length) {
        chars.push(alphabet[digits.pop()]);
    }
    return chars.join('');
};

// Returns an integer representation of the given string for the given alphabet:
bases.fromAlphabet = function (str, alphabet) {
    var base = alphabet.length;
    var pos = 0;
    var num = 0;
    var c;

    while (str.length) {
        c = str[str.length - 1];
        str = str.substr(0, str.length - 1);
        num += Math.pow(base, pos) * alphabet.indexOf(c);
        pos++;
    }

    return num;
};

// Known alphabets:
bases.NUMERALS = '0123456789';
bases.LETTERS_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
bases.LETTERS_UPPERCASE = bases.LETTERS_LOWERCASE.toUpperCase();
bases.KNOWN_ALPHABETS = {};

// Each of the number ones, starting from base-2 (base-1 doesn't make sense?):
for (var i = 2; i <= 10; i++) {
    bases.KNOWN_ALPHABETS[i] = bases.NUMERALS.substr(0, i);
}

// Node's native hex is 0-9 followed by *lowercase* a-f, so we'll take that
// approach for everything from base-11 to base-16:
for (var i = 11; i <= 16; i++) {
    bases.KNOWN_ALPHABETS[i] = bases.NUMERALS + bases.LETTERS_LOWERCASE.substr(0, i - 10);
}

// We also model base-36 off of that, just using the full letter alphabet:
bases.KNOWN_ALPHABETS[36] = bases.NUMERALS + bases.LETTERS_LOWERCASE;

// And base-62 will be the uppercase letters added:
bases.KNOWN_ALPHABETS[62] = bases.NUMERALS + bases.LETTERS_LOWERCASE + bases.LETTERS_UPPERCASE;

// For base-26, we'll assume the user wants just the letter alphabet:
bases.KNOWN_ALPHABETS[26] = bases.LETTERS_LOWERCASE;

// We'll also add a similar base-52, just letters, lowercase then uppercase:
bases.KNOWN_ALPHABETS[52] = bases.LETTERS_LOWERCASE + bases.LETTERS_UPPERCASE;

// Base-64 is a formally-specified alphabet that has a particular order:
// http://en.wikipedia.org/wiki/Base64 (and Node.js follows this too)
// TODO FIXME But our code above doesn't add padding! Don't use this yet...
bases.KNOWN_ALPHABETS[64] = bases.LETTERS_UPPERCASE + bases.LETTERS_LOWERCASE + bases.NUMERALS + '+/';

// Flickr and others also have a base-58 that removes confusing characters, but
// there isn't consensus on the order of lowercase vs. uppercase... =/
// http://www.flickr.com/groups/api/discuss/72157616713786392/
// https://en.bitcoin.it/wiki/Base58Check_encoding#Base58_symbol_chart
// https://github.com/dougal/base58/blob/master/lib/base58.rb
// http://icoloma.blogspot.com/2010/03/create-your-own-bitly-using-base58.html
// We'll arbitrarily stay consistent with the above and using lowercase first:
bases.KNOWN_ALPHABETS[58] = bases.KNOWN_ALPHABETS[62].replace(/[0OlI]/g, '');

// And Douglas Crockford shared a similar base-32 from base-36:
// http://www.crockford.com/wrmg/base32.html
// Unlike our base-36, he explicitly specifies uppercase letters
bases.KNOWN_ALPHABETS[32] = bases.NUMERALS + bases.LETTERS_UPPERCASE.replace(/[ILOU]/g, '');

// Closure helper for convenience aliases like bases.toBase36():
function makeAlias (base, alphabet) {
    bases['toBase' + base] = function (num) {
        return bases.toAlphabet(num, alphabet);
    };
    bases['fromBase' + base] = function (str) {
        return bases.fromAlphabet(str, alphabet);
    };
}

// Do this for all known alphabets:
for (var base in bases.KNOWN_ALPHABETS) {
    if (bases.KNOWN_ALPHABETS.hasOwnProperty(base)) {
        makeAlias(base, bases.KNOWN_ALPHABETS[base]);
    }
}

// And a generic alias too:
bases.toBase = function (num, base) {
    return bases.toAlphabet(num, bases.KNOWN_ALPHABETS[base]);
};

bases.fromBase = function (str, base) {
    return bases.fromAlphabet(str, bases.KNOWN_ALPHABETS[base]);
};

},{}],143:[function(require,module,exports){

},{}],144:[function(require,module,exports){
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
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
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
    var timeout = runTimeout(cleanUpNextTick);
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
    runClearTimeout(timeout);
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
        runTimeout(drainQueue);
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

},{}],145:[function(require,module,exports){
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
},{"./custom/trap":146,"./custom/zalgo":147,"./maps/america":150,"./maps/rainbow":151,"./maps/random":152,"./maps/zebra":153,"./styles":154,"./system/supports-colors":155}],146:[function(require,module,exports){
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

},{}],147:[function(require,module,exports){
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

},{}],148:[function(require,module,exports){
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
},{"./colors":145}],149:[function(require,module,exports){
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
},{"./colors":145,"./extendStringPrototype":148}],150:[function(require,module,exports){
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
},{"../colors":145}],151:[function(require,module,exports){
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


},{"../colors":145}],152:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = (function () {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  return function(letter, i, exploded) {
    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
  };
})();
},{"../colors":145}],153:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = function (letter, i, exploded) {
  return i % 2 === 0 ? letter : colors.inverse(letter);
};
},{"../colors":145}],154:[function(require,module,exports){
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
},{}],155:[function(require,module,exports){
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
},{"_process":144}],156:[function(require,module,exports){
/*!
 * XRegExp.build 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2012-2016 MIT License
 * Inspired by Lea Verou's RegExp.create <lea.verou.me>
 */

module.exports = function(XRegExp) {
    'use strict';

    var REGEX_DATA = 'xregexp';
    var subParts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g;
    var parts = XRegExp.union([/\({{([\w$]+)}}\)|{{([\w$]+)}}/, subParts], 'g');

    /**
     * Strips a leading `^` and trailing unescaped `$`, if both are present.
     *
     * @param {String} pattern Pattern to process.
     * @returns {String} Pattern with edge anchors removed.
     */
    function deanchor(pattern) {
        // Allow any number of empty noncapturing groups before/after anchors, because regexes
        // built/generated by XRegExp sometimes include them
        var leadingAnchor = /^(?:\(\?:\))*\^/,
            trailingAnchor = /\$(?:\(\?:\))*$/;

        if (
            leadingAnchor.test(pattern) &&
            trailingAnchor.test(pattern) &&
            // Ensure that the trailing `$` isn't escaped
            trailingAnchor.test(pattern.replace(/\\[\s\S]/g, ''))
        ) {
            return pattern.replace(leadingAnchor, '').replace(trailingAnchor, '');
        }

        return pattern;
    }

    /**
     * Converts the provided value to an XRegExp. Native RegExp flags are not preserved.
     *
     * @param {String|RegExp} value Value to convert.
     * @returns {RegExp} XRegExp object with XRegExp syntax applied.
     */
    function asXRegExp(value) {
        return XRegExp.isRegExp(value) ?
            (value[REGEX_DATA] && value[REGEX_DATA].captureNames ?
                // Don't recompile, to preserve capture names
                value :
                // Recompile as XRegExp
                XRegExp(value.source)
            ) :
            // Compile string as XRegExp
            XRegExp(value);
    }

    /**
     * Builds regexes using named subpatterns, for readability and pattern reuse. Backreferences in
     * the outer pattern and provided subpatterns are automatically renumbered to work correctly.
     * Native flags used by provided subpatterns are ignored in favor of the `flags` argument.
     *
     * @param {String} pattern XRegExp pattern using `{{name}}` for embedded subpatterns. Allows
     *   `({{name}})` as shorthand for `(?<name>{{name}})`. Patterns cannot be embedded within
     *   character classes.
     * @param {Object} subs Lookup object for named subpatterns. Values can be strings or regexes. A
     *   leading `^` and trailing unescaped `$` are stripped from subpatterns, if both are present.
     * @param {String} [flags] Any combination of XRegExp flags.
     * @returns {RegExp} Regex with interpolated subpatterns.
     * @example
     *
     * var time = XRegExp.build('(?x)^ {{hours}} ({{minutes}}) $', {
     *   hours: XRegExp.build('{{h12}} : | {{h24}}', {
     *     h12: /1[0-2]|0?[1-9]/,
     *     h24: /2[0-3]|[01][0-9]/
     *   }, 'x'),
     *   minutes: /^[0-5][0-9]$/
     * });
     * time.test('10:59'); // -> true
     * XRegExp.exec('10:59', time).minutes; // -> '59'
     */
    XRegExp.build = function(pattern, subs, flags) {
        var inlineFlags = /^\(\?([\w$]+)\)/.exec(pattern),
            data = {},
            numCaps = 0, // 'Caps' is short for captures
            numPriorCaps,
            numOuterCaps = 0,
            outerCapsMap = [0],
            outerCapNames,
            sub,
            p;

        // Add flags within a leading mode modifier to the overall pattern's flags
        if (inlineFlags) {
            flags = flags || '';
            inlineFlags[1].replace(/./g, function(flag) {
                // Don't add duplicates
                flags += (flags.indexOf(flag) > -1 ? '' : flag);
            });
        }

        for (p in subs) {
            if (subs.hasOwnProperty(p)) {
                // Passing to XRegExp enables extended syntax and ensures independent validity,
                // lest an unescaped `(`, `)`, `[`, or trailing `\` breaks the `(?:)` wrapper. For
                // subpatterns provided as native regexes, it dies on octals and adds the property
                // used to hold extended regex instance data, for simplicity
                sub = asXRegExp(subs[p]);
                data[p] = {
                    // Deanchoring allows embedding independently useful anchored regexes. If you
                    // really need to keep your anchors, double them (i.e., `^^...$$`)
                    pattern: deanchor(sub.source),
                    names: sub[REGEX_DATA].captureNames || []
                };
            }
        }

        // Passing to XRegExp dies on octals and ensures the outer pattern is independently valid;
        // helps keep this simple. Named captures will be put back
        pattern = asXRegExp(pattern);
        outerCapNames = pattern[REGEX_DATA].captureNames || [];
        pattern = pattern.source.replace(parts, function($0, $1, $2, $3, $4) {
            var subName = $1 || $2,
                capName,
                intro,
                localCapIndex;
            // Named subpattern
            if (subName) {
                if (!data.hasOwnProperty(subName)) {
                    throw new ReferenceError('Undefined property ' + $0);
                }
                // Named subpattern was wrapped in a capturing group
                if ($1) {
                    capName = outerCapNames[numOuterCaps];
                    outerCapsMap[++numOuterCaps] = ++numCaps;
                    // If it's a named group, preserve the name. Otherwise, use the subpattern name
                    // as the capture name
                    intro = '(?<' + (capName || subName) + '>';
                } else {
                    intro = '(?:';
                }
                numPriorCaps = numCaps;
                return intro + data[subName].pattern.replace(subParts, function(match, paren, backref) {
                    // Capturing group
                    if (paren) {
                        capName = data[subName].names[numCaps - numPriorCaps];
                        ++numCaps;
                        // If the current capture has a name, preserve the name
                        if (capName) {
                            return '(?<' + capName + '>';
                        }
                    // Backreference
                    } else if (backref) {
                        localCapIndex = +backref - 1;
                        // Rewrite the backreference
                        return data[subName].names[localCapIndex] ?
                            // Need to preserve the backreference name in case using flag `n`
                            '\\k<' + data[subName].names[localCapIndex] + '>' :
                            '\\' + (+backref + numPriorCaps);
                    }
                    return match;
                }) + ')';
            }
            // Capturing group
            if ($3) {
                capName = outerCapNames[numOuterCaps];
                outerCapsMap[++numOuterCaps] = ++numCaps;
                // If the current capture has a name, preserve the name
                if (capName) {
                    return '(?<' + capName + '>';
                }
            // Backreference
            } else if ($4) {
                localCapIndex = +$4 - 1;
                // Rewrite the backreference
                return outerCapNames[localCapIndex] ?
                    // Need to preserve the backreference name in case using flag `n`
                    '\\k<' + outerCapNames[localCapIndex] + '>' :
                    '\\' + outerCapsMap[+$4];
            }
            return $0;
        });

        return XRegExp(pattern, flags);
    };

};

},{}],157:[function(require,module,exports){
/*!
 * XRegExp.matchRecursive 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2009-2016 MIT License
 */

module.exports = function(XRegExp) {
    'use strict';

    /**
     * Returns a match detail object composed of the provided values.
     */
    function row(name, value, start, end) {
        return {
            name: name,
            value: value,
            start: start,
            end: end
        };
    }

    /**
     * Returns an array of match strings between outermost left and right delimiters, or an array of
     * objects with detailed match parts and position data. An error is thrown if delimiters are
     * unbalanced within the data.
     *
     * @param {String} str String to search.
     * @param {String} left Left delimiter as an XRegExp pattern.
     * @param {String} right Right delimiter as an XRegExp pattern.
     * @param {String} [flags] Any native or XRegExp flags, used for the left and right delimiters.
     * @param {Object} [options] Lets you specify `valueNames` and `escapeChar` options.
     * @returns {Array} Array of matches, or an empty array.
     * @example
     *
     * // Basic usage
     * var str = '(t((e))s)t()(ing)';
     * XRegExp.matchRecursive(str, '\\(', '\\)', 'g');
     * // -> ['t((e))s', '', 'ing']
     *
     * // Extended information mode with valueNames
     * str = 'Here is <div> <div>an</div></div> example';
     * XRegExp.matchRecursive(str, '<div\\s*>', '</div>', 'gi', {
     *   valueNames: ['between', 'left', 'match', 'right']
     * });
     * // -> [
     * // {name: 'between', value: 'Here is ',       start: 0,  end: 8},
     * // {name: 'left',    value: '<div>',          start: 8,  end: 13},
     * // {name: 'match',   value: ' <div>an</div>', start: 13, end: 27},
     * // {name: 'right',   value: '</div>',         start: 27, end: 33},
     * // {name: 'between', value: ' example',       start: 33, end: 41}
     * // ]
     *
     * // Omitting unneeded parts with null valueNames, and using escapeChar
     * str = '...{1}.\\{{function(x,y){return {y:x}}}';
     * XRegExp.matchRecursive(str, '{', '}', 'g', {
     *   valueNames: ['literal', null, 'value', null],
     *   escapeChar: '\\'
     * });
     * // -> [
     * // {name: 'literal', value: '...',  start: 0, end: 3},
     * // {name: 'value',   value: '1',    start: 4, end: 5},
     * // {name: 'literal', value: '.\\{', start: 6, end: 9},
     * // {name: 'value',   value: 'function(x,y){return {y:x}}', start: 10, end: 37}
     * // ]
     *
     * // Sticky mode via flag y
     * str = '<1><<<2>>><3>4<5>';
     * XRegExp.matchRecursive(str, '<', '>', 'gy');
     * // -> ['1', '<<2>>', '3']
     */
    XRegExp.matchRecursive = function(str, left, right, flags, options) {
        flags = flags || '';
        options = options || {};
        var global = flags.indexOf('g') > -1,
            sticky = flags.indexOf('y') > -1,
            // Flag `y` is controlled internally
            basicFlags = flags.replace(/y/g, ''),
            escapeChar = options.escapeChar,
            vN = options.valueNames,
            output = [],
            openTokens = 0,
            delimStart = 0,
            delimEnd = 0,
            lastOuterEnd = 0,
            outerStart,
            innerStart,
            leftMatch,
            rightMatch,
            esc;
        left = XRegExp(left, basicFlags);
        right = XRegExp(right, basicFlags);

        if (escapeChar) {
            if (escapeChar.length > 1) {
                throw new Error('Cannot use more than one escape character');
            }
            escapeChar = XRegExp.escape(escapeChar);
            // Using `XRegExp.union` safely rewrites backreferences in `left` and `right`
            esc = new RegExp(
                '(?:' + escapeChar + '[\\S\\s]|(?:(?!' +
                    XRegExp.union([left, right]).source +
                    ')[^' + escapeChar + '])+)+',
                // Flags `gy` not needed here
                flags.replace(/[^imu]+/g, '')
            );
        }

        while (true) {
            // If using an escape character, advance to the delimiter's next starting position,
            // skipping any escaped characters in between
            if (escapeChar) {
                delimEnd += (XRegExp.exec(str, esc, delimEnd, 'sticky') || [''])[0].length;
            }
            leftMatch = XRegExp.exec(str, left, delimEnd);
            rightMatch = XRegExp.exec(str, right, delimEnd);
            // Keep the leftmost match only
            if (leftMatch && rightMatch) {
                if (leftMatch.index <= rightMatch.index) {
                    rightMatch = null;
                } else {
                    leftMatch = null;
                }
            }
            // Paths (LM: leftMatch, RM: rightMatch, OT: openTokens):
            // LM | RM | OT | Result
            // 1  | 0  | 1  | loop
            // 1  | 0  | 0  | loop
            // 0  | 1  | 1  | loop
            // 0  | 1  | 0  | throw
            // 0  | 0  | 1  | throw
            // 0  | 0  | 0  | break
            // The paths above don't include the sticky mode special case. The loop ends after the
            // first completed match if not `global`.
            if (leftMatch || rightMatch) {
                delimStart = (leftMatch || rightMatch).index;
                delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
            } else if (!openTokens) {
                break;
            }
            if (sticky && !openTokens && delimStart > lastOuterEnd) {
                break;
            }
            if (leftMatch) {
                if (!openTokens) {
                    outerStart = delimStart;
                    innerStart = delimEnd;
                }
                ++openTokens;
            } else if (rightMatch && openTokens) {
                if (!--openTokens) {
                    if (vN) {
                        if (vN[0] && outerStart > lastOuterEnd) {
                            output.push(row(vN[0], str.slice(lastOuterEnd, outerStart), lastOuterEnd, outerStart));
                        }
                        if (vN[1]) {
                            output.push(row(vN[1], str.slice(outerStart, innerStart), outerStart, innerStart));
                        }
                        if (vN[2]) {
                            output.push(row(vN[2], str.slice(innerStart, delimStart), innerStart, delimStart));
                        }
                        if (vN[3]) {
                            output.push(row(vN[3], str.slice(delimStart, delimEnd), delimStart, delimEnd));
                        }
                    } else {
                        output.push(str.slice(innerStart, delimStart));
                    }
                    lastOuterEnd = delimEnd;
                    if (!global) {
                        break;
                    }
                }
            } else {
                throw new Error('Unbalanced delimiter found in string');
            }
            // If the delimiter matched an empty string, avoid an infinite loop
            if (delimStart === delimEnd) {
                ++delimEnd;
            }
        }

        if (global && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
            output.push(row(vN[0], str.slice(lastOuterEnd), lastOuterEnd, str.length));
        }

        return output;
    };

};

},{}],158:[function(require,module,exports){
/*!
 * XRegExp Unicode Base 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2008-2016 MIT License
 */

module.exports = function(XRegExp) {
    'use strict';

    /**
     * Adds base support for Unicode matching:
     * - Adds syntax `\p{..}` for matching Unicode tokens. Tokens can be inverted using `\P{..}` or
     *   `\p{^..}`. Token names ignore case, spaces, hyphens, and underscores. You can omit the
     *   braces for token names that are a single letter (e.g. `\pL` or `PL`).
     * - Adds flag A (astral), which enables 21-bit Unicode support.
     * - Adds the `XRegExp.addUnicodeData` method used by other addons to provide character data.
     *
     * Unicode Base relies on externally provided Unicode character data. Official addons are
     * available to provide data for Unicode categories, scripts, blocks, and properties.
     *
     * @requires XRegExp
     */

    // ==--------------------------==
    // Private stuff
    // ==--------------------------==

    // Storage for Unicode data
    var unicode = {};

    // Reuse utils
    var dec = XRegExp._dec;
    var hex = XRegExp._hex;
    var pad4 = XRegExp._pad4;

    // Generates a token lookup name: lowercase, with hyphens, spaces, and underscores removed
    function normalize(name) {
        return name.replace(/[- _]+/g, '').toLowerCase();
    }

    // Gets the decimal code of a literal code unit, \xHH, \uHHHH, or a backslash-escaped literal
    function charCode(chr) {
        var esc = /^\\[xu](.+)/.exec(chr);
        return esc ?
            dec(esc[1]) :
            chr.charCodeAt(chr.charAt(0) === '\\' ? 1 : 0);
    }

    // Inverts a list of ordered BMP characters and ranges
    function invertBmp(range) {
        var output = '';
        var lastEnd = -1;
        XRegExp.forEach(
            range,
            /(\\x..|\\u....|\\?[\s\S])(?:-(\\x..|\\u....|\\?[\s\S]))?/,
            function(m) {
                var start = charCode(m[1]);
                if (start > (lastEnd + 1)) {
                    output += '\\u' + pad4(hex(lastEnd + 1));
                    if (start > (lastEnd + 2)) {
                        output += '-\\u' + pad4(hex(start - 1));
                    }
                }
                lastEnd = charCode(m[2] || m[1]);
            }
        );
        if (lastEnd < 0xFFFF) {
            output += '\\u' + pad4(hex(lastEnd + 1));
            if (lastEnd < 0xFFFE) {
                output += '-\\uFFFF';
            }
        }
        return output;
    }

    // Generates an inverted BMP range on first use
    function cacheInvertedBmp(slug) {
        var prop = 'b!';
        return unicode[slug][prop] || (
            unicode[slug][prop] = invertBmp(unicode[slug].bmp)
        );
    }

    // Combines and optionally negates BMP and astral data
    function buildAstral(slug, isNegated) {
        var item = unicode[slug],
            combined = '';
        if (item.bmp && !item.isBmpLast) {
            combined = '[' + item.bmp + ']' + (item.astral ? '|' : '');
        }
        if (item.astral) {
            combined += item.astral;
        }
        if (item.isBmpLast && item.bmp) {
            combined += (item.astral ? '|' : '') + '[' + item.bmp + ']';
        }
        // Astral Unicode tokens always match a code point, never a code unit
        return isNegated ?
            '(?:(?!' + combined + ')(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\0-\uFFFF]))' :
            '(?:' + combined + ')';
    }

    // Builds a complete astral pattern on first use
    function cacheAstral(slug, isNegated) {
        var prop = isNegated ? 'a!' : 'a=';
        return unicode[slug][prop] || (
            unicode[slug][prop] = buildAstral(slug, isNegated)
        );
    }

    // ==--------------------------==
    // Core functionality
    // ==--------------------------==

    /*
     * Add Unicode token syntax: \p{..}, \P{..}, \p{^..}. Also add astral mode (flag A).
     */
    XRegExp.addToken(
        // Use `*` instead of `+` to avoid capturing `^` as the token name in `\p{^}`
        /\\([pP])(?:{(\^?)([^}]*)}|([A-Za-z]))/,
        function(match, scope, flags) {
            var ERR_DOUBLE_NEG = 'Invalid double negation ',
                ERR_UNKNOWN_NAME = 'Unknown Unicode token ',
                ERR_UNKNOWN_REF = 'Unicode token missing data ',
                ERR_ASTRAL_ONLY = 'Astral mode required for Unicode token ',
                ERR_ASTRAL_IN_CLASS = 'Astral mode does not support Unicode tokens within character classes',
                // Negated via \P{..} or \p{^..}
                isNegated = match[1] === 'P' || !!match[2],
                // Switch from BMP (0-FFFF) to astral (0-10FFFF) mode via flag A
                isAstralMode = flags.indexOf('A') > -1,
                // Token lookup name. Check `[4]` first to avoid passing `undefined` via `\p{}`
                slug = normalize(match[4] || match[3]),
                // Token data object
                item = unicode[slug];

            if (match[1] === 'P' && match[2]) {
                throw new SyntaxError(ERR_DOUBLE_NEG + match[0]);
            }
            if (!unicode.hasOwnProperty(slug)) {
                throw new SyntaxError(ERR_UNKNOWN_NAME + match[0]);
            }

            // Switch to the negated form of the referenced Unicode token
            if (item.inverseOf) {
                slug = normalize(item.inverseOf);
                if (!unicode.hasOwnProperty(slug)) {
                    throw new ReferenceError(ERR_UNKNOWN_REF + match[0] + ' -> ' + item.inverseOf);
                }
                item = unicode[slug];
                isNegated = !isNegated;
            }

            if (!(item.bmp || isAstralMode)) {
                throw new SyntaxError(ERR_ASTRAL_ONLY + match[0]);
            }
            if (isAstralMode) {
                if (scope === 'class') {
                    throw new SyntaxError(ERR_ASTRAL_IN_CLASS);
                }

                return cacheAstral(slug, isNegated);
            }

            return scope === 'class' ?
                (isNegated ? cacheInvertedBmp(slug) : item.bmp) :
                (isNegated ? '[^' : '[') + item.bmp + ']';
        },
        {
            scope: 'all',
            optionalFlags: 'A',
            leadChar: '\\'
        }
    );

    /**
     * Adds to the list of Unicode tokens that XRegExp regexes can match via `\p` or `\P`.
     *
     * @param {Array} data Objects with named character ranges. Each object may have properties
     *   `name`, `alias`, `isBmpLast`, `inverseOf`, `bmp`, and `astral`. All but `name` are
     *   optional, although one of `bmp` or `astral` is required (unless `inverseOf` is set). If
     *   `astral` is absent, the `bmp` data is used for BMP and astral modes. If `bmp` is absent,
     *   the name errors in BMP mode but works in astral mode. If both `bmp` and `astral` are
     *   provided, the `bmp` data only is used in BMP mode, and the combination of `bmp` and
     *   `astral` data is used in astral mode. `isBmpLast` is needed when a token matches orphan
     *   high surrogates *and* uses surrogate pairs to match astral code points. The `bmp` and
     *   `astral` data should be a combination of literal characters and `\xHH` or `\uHHHH` escape
     *   sequences, with hyphens to create ranges. Any regex metacharacters in the data should be
     *   escaped, apart from range-creating hyphens. The `astral` data can additionally use
     *   character classes and alternation, and should use surrogate pairs to represent astral code
     *   points. `inverseOf` can be used to avoid duplicating character data if a Unicode token is
     *   defined as the exact inverse of another token.
     * @example
     *
     * // Basic use
     * XRegExp.addUnicodeData([{
     *   name: 'XDigit',
     *   alias: 'Hexadecimal',
     *   bmp: '0-9A-Fa-f'
     * }]);
     * XRegExp('\\p{XDigit}:\\p{Hexadecimal}+').test('0:3D'); // -> true
     */
    XRegExp.addUnicodeData = function(data) {
        var ERR_NO_NAME = 'Unicode token requires name',
            ERR_NO_DATA = 'Unicode token has no character data ',
            item,
            i;

        for (i = 0; i < data.length; ++i) {
            item = data[i];
            if (!item.name) {
                throw new Error(ERR_NO_NAME);
            }
            if (!(item.inverseOf || item.bmp || item.astral)) {
                throw new Error(ERR_NO_DATA + item.name);
            }
            unicode[normalize(item.name)] = item;
            if (item.alias) {
                unicode[normalize(item.alias)] = item;
            }
        }

        // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and
        // flags might now produce different results
        XRegExp.cache.flush('patterns');
    };

};

},{}],159:[function(require,module,exports){
/*!
 * XRegExp Unicode Blocks 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2010-2016 MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */

module.exports = function(XRegExp) {
    'use strict';

    /**
     * Adds support for all Unicode blocks. Block names use the prefix 'In'. E.g.,
     * `\p{InBasicLatin}`. Token names are case insensitive, and any spaces, hyphens, and
     * underscores are ignored.
     *
     * Uses Unicode 8.0.0.
     *
     * @requires XRegExp, Unicode Base
     */

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Blocks');
    }

    XRegExp.addUnicodeData([
        {
            name: 'InAegean_Numbers',
            astral: '\uD800[\uDD00-\uDD3F]'
        },
        {
            name: 'InAhom',
            astral: '\uD805[\uDF00-\uDF3F]'
        },
        {
            name: 'InAlchemical_Symbols',
            astral: '\uD83D[\uDF00-\uDF7F]'
        },
        {
            name: 'InAlphabetic_Presentation_Forms',
            bmp: '\uFB00-\uFB4F'
        },
        {
            name: 'InAnatolian_Hieroglyphs',
            astral: '\uD811[\uDC00-\uDE7F]'
        },
        {
            name: 'InAncient_Greek_Musical_Notation',
            astral: '\uD834[\uDE00-\uDE4F]'
        },
        {
            name: 'InAncient_Greek_Numbers',
            astral: '\uD800[\uDD40-\uDD8F]'
        },
        {
            name: 'InAncient_Symbols',
            astral: '\uD800[\uDD90-\uDDCF]'
        },
        {
            name: 'InArabic',
            bmp: '\u0600-\u06FF'
        },
        {
            name: 'InArabic_Extended_A',
            bmp: '\u08A0-\u08FF'
        },
        {
            name: 'InArabic_Mathematical_Alphabetic_Symbols',
            astral: '\uD83B[\uDE00-\uDEFF]'
        },
        {
            name: 'InArabic_Presentation_Forms_A',
            bmp: '\uFB50-\uFDFF'
        },
        {
            name: 'InArabic_Presentation_Forms_B',
            bmp: '\uFE70-\uFEFF'
        },
        {
            name: 'InArabic_Supplement',
            bmp: '\u0750-\u077F'
        },
        {
            name: 'InArmenian',
            bmp: '\u0530-\u058F'
        },
        {
            name: 'InArrows',
            bmp: '\u2190-\u21FF'
        },
        {
            name: 'InAvestan',
            astral: '\uD802[\uDF00-\uDF3F]'
        },
        {
            name: 'InBalinese',
            bmp: '\u1B00-\u1B7F'
        },
        {
            name: 'InBamum',
            bmp: '\uA6A0-\uA6FF'
        },
        {
            name: 'InBamum_Supplement',
            astral: '\uD81A[\uDC00-\uDE3F]'
        },
        {
            name: 'InBasic_Latin',
            bmp: '\0-\x7F'
        },
        {
            name: 'InBassa_Vah',
            astral: '\uD81A[\uDED0-\uDEFF]'
        },
        {
            name: 'InBatak',
            bmp: '\u1BC0-\u1BFF'
        },
        {
            name: 'InBengali',
            bmp: '\u0980-\u09FF'
        },
        {
            name: 'InBlock_Elements',
            bmp: '\u2580-\u259F'
        },
        {
            name: 'InBopomofo',
            bmp: '\u3100-\u312F'
        },
        {
            name: 'InBopomofo_Extended',
            bmp: '\u31A0-\u31BF'
        },
        {
            name: 'InBox_Drawing',
            bmp: '\u2500-\u257F'
        },
        {
            name: 'InBrahmi',
            astral: '\uD804[\uDC00-\uDC7F]'
        },
        {
            name: 'InBraille_Patterns',
            bmp: '\u2800-\u28FF'
        },
        {
            name: 'InBuginese',
            bmp: '\u1A00-\u1A1F'
        },
        {
            name: 'InBuhid',
            bmp: '\u1740-\u175F'
        },
        {
            name: 'InByzantine_Musical_Symbols',
            astral: '\uD834[\uDC00-\uDCFF]'
        },
        {
            name: 'InCJK_Compatibility',
            bmp: '\u3300-\u33FF'
        },
        {
            name: 'InCJK_Compatibility_Forms',
            bmp: '\uFE30-\uFE4F'
        },
        {
            name: 'InCJK_Compatibility_Ideographs',
            bmp: '\uF900-\uFAFF'
        },
        {
            name: 'InCJK_Compatibility_Ideographs_Supplement',
            astral: '\uD87E[\uDC00-\uDE1F]'
        },
        {
            name: 'InCJK_Radicals_Supplement',
            bmp: '\u2E80-\u2EFF'
        },
        {
            name: 'InCJK_Strokes',
            bmp: '\u31C0-\u31EF'
        },
        {
            name: 'InCJK_Symbols_and_Punctuation',
            bmp: '\u3000-\u303F'
        },
        {
            name: 'InCJK_Unified_Ideographs',
            bmp: '\u4E00-\u9FFF'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_A',
            bmp: '\u3400-\u4DBF'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_B',
            astral: '[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF]'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_C',
            astral: '\uD86D[\uDC00-\uDF3F]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD869[\uDF00-\uDFFF]'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_D',
            astral: '\uD86D[\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1F]'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_E',
            astral: '[\uD86F-\uD872][\uDC00-\uDFFF]|\uD873[\uDC00-\uDEAF]|\uD86E[\uDC20-\uDFFF]'
        },
        {
            name: 'InCarian',
            astral: '\uD800[\uDEA0-\uDEDF]'
        },
        {
            name: 'InCaucasian_Albanian',
            astral: '\uD801[\uDD30-\uDD6F]'
        },
        {
            name: 'InChakma',
            astral: '\uD804[\uDD00-\uDD4F]'
        },
        {
            name: 'InCham',
            bmp: '\uAA00-\uAA5F'
        },
        {
            name: 'InCherokee',
            bmp: '\u13A0-\u13FF'
        },
        {
            name: 'InCherokee_Supplement',
            bmp: '\uAB70-\uABBF'
        },
        {
            name: 'InCombining_Diacritical_Marks',
            bmp: '\u0300-\u036F'
        },
        {
            name: 'InCombining_Diacritical_Marks_Extended',
            bmp: '\u1AB0-\u1AFF'
        },
        {
            name: 'InCombining_Diacritical_Marks_Supplement',
            bmp: '\u1DC0-\u1DFF'
        },
        {
            name: 'InCombining_Diacritical_Marks_for_Symbols',
            bmp: '\u20D0-\u20FF'
        },
        {
            name: 'InCombining_Half_Marks',
            bmp: '\uFE20-\uFE2F'
        },
        {
            name: 'InCommon_Indic_Number_Forms',
            bmp: '\uA830-\uA83F'
        },
        {
            name: 'InControl_Pictures',
            bmp: '\u2400-\u243F'
        },
        {
            name: 'InCoptic',
            bmp: '\u2C80-\u2CFF'
        },
        {
            name: 'InCoptic_Epact_Numbers',
            astral: '\uD800[\uDEE0-\uDEFF]'
        },
        {
            name: 'InCounting_Rod_Numerals',
            astral: '\uD834[\uDF60-\uDF7F]'
        },
        {
            name: 'InCuneiform',
            astral: '\uD808[\uDC00-\uDFFF]'
        },
        {
            name: 'InCuneiform_Numbers_and_Punctuation',
            astral: '\uD809[\uDC00-\uDC7F]'
        },
        {
            name: 'InCurrency_Symbols',
            bmp: '\u20A0-\u20CF'
        },
        {
            name: 'InCypriot_Syllabary',
            astral: '\uD802[\uDC00-\uDC3F]'
        },
        {
            name: 'InCyrillic',
            bmp: '\u0400-\u04FF'
        },
        {
            name: 'InCyrillic_Extended_A',
            bmp: '\u2DE0-\u2DFF'
        },
        {
            name: 'InCyrillic_Extended_B',
            bmp: '\uA640-\uA69F'
        },
        {
            name: 'InCyrillic_Supplement',
            bmp: '\u0500-\u052F'
        },
        {
            name: 'InDeseret',
            astral: '\uD801[\uDC00-\uDC4F]'
        },
        {
            name: 'InDevanagari',
            bmp: '\u0900-\u097F'
        },
        {
            name: 'InDevanagari_Extended',
            bmp: '\uA8E0-\uA8FF'
        },
        {
            name: 'InDingbats',
            bmp: '\u2700-\u27BF'
        },
        {
            name: 'InDomino_Tiles',
            astral: '\uD83C[\uDC30-\uDC9F]'
        },
        {
            name: 'InDuployan',
            astral: '\uD82F[\uDC00-\uDC9F]'
        },
        {
            name: 'InEarly_Dynastic_Cuneiform',
            astral: '\uD809[\uDC80-\uDD4F]'
        },
        {
            name: 'InEgyptian_Hieroglyphs',
            astral: '\uD80C[\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F]'
        },
        {
            name: 'InElbasan',
            astral: '\uD801[\uDD00-\uDD2F]'
        },
        {
            name: 'InEmoticons',
            astral: '\uD83D[\uDE00-\uDE4F]'
        },
        {
            name: 'InEnclosed_Alphanumeric_Supplement',
            astral: '\uD83C[\uDD00-\uDDFF]'
        },
        {
            name: 'InEnclosed_Alphanumerics',
            bmp: '\u2460-\u24FF'
        },
        {
            name: 'InEnclosed_CJK_Letters_and_Months',
            bmp: '\u3200-\u32FF'
        },
        {
            name: 'InEnclosed_Ideographic_Supplement',
            astral: '\uD83C[\uDE00-\uDEFF]'
        },
        {
            name: 'InEthiopic',
            bmp: '\u1200-\u137F'
        },
        {
            name: 'InEthiopic_Extended',
            bmp: '\u2D80-\u2DDF'
        },
        {
            name: 'InEthiopic_Extended_A',
            bmp: '\uAB00-\uAB2F'
        },
        {
            name: 'InEthiopic_Supplement',
            bmp: '\u1380-\u139F'
        },
        {
            name: 'InGeneral_Punctuation',
            bmp: '\u2000-\u206F'
        },
        {
            name: 'InGeometric_Shapes',
            bmp: '\u25A0-\u25FF'
        },
        {
            name: 'InGeometric_Shapes_Extended',
            astral: '\uD83D[\uDF80-\uDFFF]'
        },
        {
            name: 'InGeorgian',
            bmp: '\u10A0-\u10FF'
        },
        {
            name: 'InGeorgian_Supplement',
            bmp: '\u2D00-\u2D2F'
        },
        {
            name: 'InGlagolitic',
            bmp: '\u2C00-\u2C5F'
        },
        {
            name: 'InGothic',
            astral: '\uD800[\uDF30-\uDF4F]'
        },
        {
            name: 'InGrantha',
            astral: '\uD804[\uDF00-\uDF7F]'
        },
        {
            name: 'InGreek_Extended',
            bmp: '\u1F00-\u1FFF'
        },
        {
            name: 'InGreek_and_Coptic',
            bmp: '\u0370-\u03FF'
        },
        {
            name: 'InGujarati',
            bmp: '\u0A80-\u0AFF'
        },
        {
            name: 'InGurmukhi',
            bmp: '\u0A00-\u0A7F'
        },
        {
            name: 'InHalfwidth_and_Fullwidth_Forms',
            bmp: '\uFF00-\uFFEF'
        },
        {
            name: 'InHangul_Compatibility_Jamo',
            bmp: '\u3130-\u318F'
        },
        {
            name: 'InHangul_Jamo',
            bmp: '\u1100-\u11FF'
        },
        {
            name: 'InHangul_Jamo_Extended_A',
            bmp: '\uA960-\uA97F'
        },
        {
            name: 'InHangul_Jamo_Extended_B',
            bmp: '\uD7B0-\uD7FF'
        },
        {
            name: 'InHangul_Syllables',
            bmp: '\uAC00-\uD7AF'
        },
        {
            name: 'InHanunoo',
            bmp: '\u1720-\u173F'
        },
        {
            name: 'InHatran',
            astral: '\uD802[\uDCE0-\uDCFF]'
        },
        {
            name: 'InHebrew',
            bmp: '\u0590-\u05FF'
        },
        {
            name: 'InHigh_Private_Use_Surrogates',
            bmp: '\uDB80-\uDBFF'
        },
        {
            name: 'InHigh_Surrogates',
            bmp: '\uD800-\uDB7F'
        },
        {
            name: 'InHiragana',
            bmp: '\u3040-\u309F'
        },
        {
            name: 'InIPA_Extensions',
            bmp: '\u0250-\u02AF'
        },
        {
            name: 'InIdeographic_Description_Characters',
            bmp: '\u2FF0-\u2FFF'
        },
        {
            name: 'InImperial_Aramaic',
            astral: '\uD802[\uDC40-\uDC5F]'
        },
        {
            name: 'InInscriptional_Pahlavi',
            astral: '\uD802[\uDF60-\uDF7F]'
        },
        {
            name: 'InInscriptional_Parthian',
            astral: '\uD802[\uDF40-\uDF5F]'
        },
        {
            name: 'InJavanese',
            bmp: '\uA980-\uA9DF'
        },
        {
            name: 'InKaithi',
            astral: '\uD804[\uDC80-\uDCCF]'
        },
        {
            name: 'InKana_Supplement',
            astral: '\uD82C[\uDC00-\uDCFF]'
        },
        {
            name: 'InKanbun',
            bmp: '\u3190-\u319F'
        },
        {
            name: 'InKangxi_Radicals',
            bmp: '\u2F00-\u2FDF'
        },
        {
            name: 'InKannada',
            bmp: '\u0C80-\u0CFF'
        },
        {
            name: 'InKatakana',
            bmp: '\u30A0-\u30FF'
        },
        {
            name: 'InKatakana_Phonetic_Extensions',
            bmp: '\u31F0-\u31FF'
        },
        {
            name: 'InKayah_Li',
            bmp: '\uA900-\uA92F'
        },
        {
            name: 'InKharoshthi',
            astral: '\uD802[\uDE00-\uDE5F]'
        },
        {
            name: 'InKhmer',
            bmp: '\u1780-\u17FF'
        },
        {
            name: 'InKhmer_Symbols',
            bmp: '\u19E0-\u19FF'
        },
        {
            name: 'InKhojki',
            astral: '\uD804[\uDE00-\uDE4F]'
        },
        {
            name: 'InKhudawadi',
            astral: '\uD804[\uDEB0-\uDEFF]'
        },
        {
            name: 'InLao',
            bmp: '\u0E80-\u0EFF'
        },
        {
            name: 'InLatin_Extended_Additional',
            bmp: '\u1E00-\u1EFF'
        },
        {
            name: 'InLatin_Extended_A',
            bmp: '\u0100-\u017F'
        },
        {
            name: 'InLatin_Extended_B',
            bmp: '\u0180-\u024F'
        },
        {
            name: 'InLatin_Extended_C',
            bmp: '\u2C60-\u2C7F'
        },
        {
            name: 'InLatin_Extended_D',
            bmp: '\uA720-\uA7FF'
        },
        {
            name: 'InLatin_Extended_E',
            bmp: '\uAB30-\uAB6F'
        },
        {
            name: 'InLatin_1_Supplement',
            bmp: '\x80-\xFF'
        },
        {
            name: 'InLepcha',
            bmp: '\u1C00-\u1C4F'
        },
        {
            name: 'InLetterlike_Symbols',
            bmp: '\u2100-\u214F'
        },
        {
            name: 'InLimbu',
            bmp: '\u1900-\u194F'
        },
        {
            name: 'InLinear_A',
            astral: '\uD801[\uDE00-\uDF7F]'
        },
        {
            name: 'InLinear_B_Ideograms',
            astral: '\uD800[\uDC80-\uDCFF]'
        },
        {
            name: 'InLinear_B_Syllabary',
            astral: '\uD800[\uDC00-\uDC7F]'
        },
        {
            name: 'InLisu',
            bmp: '\uA4D0-\uA4FF'
        },
        {
            name: 'InLow_Surrogates',
            bmp: '\uDC00-\uDFFF'
        },
        {
            name: 'InLycian',
            astral: '\uD800[\uDE80-\uDE9F]'
        },
        {
            name: 'InLydian',
            astral: '\uD802[\uDD20-\uDD3F]'
        },
        {
            name: 'InMahajani',
            astral: '\uD804[\uDD50-\uDD7F]'
        },
        {
            name: 'InMahjong_Tiles',
            astral: '\uD83C[\uDC00-\uDC2F]'
        },
        {
            name: 'InMalayalam',
            bmp: '\u0D00-\u0D7F'
        },
        {
            name: 'InMandaic',
            bmp: '\u0840-\u085F'
        },
        {
            name: 'InManichaean',
            astral: '\uD802[\uDEC0-\uDEFF]'
        },
        {
            name: 'InMathematical_Alphanumeric_Symbols',
            astral: '\uD835[\uDC00-\uDFFF]'
        },
        {
            name: 'InMathematical_Operators',
            bmp: '\u2200-\u22FF'
        },
        {
            name: 'InMeetei_Mayek',
            bmp: '\uABC0-\uABFF'
        },
        {
            name: 'InMeetei_Mayek_Extensions',
            bmp: '\uAAE0-\uAAFF'
        },
        {
            name: 'InMende_Kikakui',
            astral: '\uD83A[\uDC00-\uDCDF]'
        },
        {
            name: 'InMeroitic_Cursive',
            astral: '\uD802[\uDDA0-\uDDFF]'
        },
        {
            name: 'InMeroitic_Hieroglyphs',
            astral: '\uD802[\uDD80-\uDD9F]'
        },
        {
            name: 'InMiao',
            astral: '\uD81B[\uDF00-\uDF9F]'
        },
        {
            name: 'InMiscellaneous_Mathematical_Symbols_A',
            bmp: '\u27C0-\u27EF'
        },
        {
            name: 'InMiscellaneous_Mathematical_Symbols_B',
            bmp: '\u2980-\u29FF'
        },
        {
            name: 'InMiscellaneous_Symbols',
            bmp: '\u2600-\u26FF'
        },
        {
            name: 'InMiscellaneous_Symbols_and_Arrows',
            bmp: '\u2B00-\u2BFF'
        },
        {
            name: 'InMiscellaneous_Symbols_and_Pictographs',
            astral: '\uD83D[\uDC00-\uDDFF]|\uD83C[\uDF00-\uDFFF]'
        },
        {
            name: 'InMiscellaneous_Technical',
            bmp: '\u2300-\u23FF'
        },
        {
            name: 'InModi',
            astral: '\uD805[\uDE00-\uDE5F]'
        },
        {
            name: 'InModifier_Tone_Letters',
            bmp: '\uA700-\uA71F'
        },
        {
            name: 'InMongolian',
            bmp: '\u1800-\u18AF'
        },
        {
            name: 'InMro',
            astral: '\uD81A[\uDE40-\uDE6F]'
        },
        {
            name: 'InMultani',
            astral: '\uD804[\uDE80-\uDEAF]'
        },
        {
            name: 'InMusical_Symbols',
            astral: '\uD834[\uDD00-\uDDFF]'
        },
        {
            name: 'InMyanmar',
            bmp: '\u1000-\u109F'
        },
        {
            name: 'InMyanmar_Extended_A',
            bmp: '\uAA60-\uAA7F'
        },
        {
            name: 'InMyanmar_Extended_B',
            bmp: '\uA9E0-\uA9FF'
        },
        {
            name: 'InNKo',
            bmp: '\u07C0-\u07FF'
        },
        {
            name: 'InNabataean',
            astral: '\uD802[\uDC80-\uDCAF]'
        },
        {
            name: 'InNew_Tai_Lue',
            bmp: '\u1980-\u19DF'
        },
        {
            name: 'InNumber_Forms',
            bmp: '\u2150-\u218F'
        },
        {
            name: 'InOgham',
            bmp: '\u1680-\u169F'
        },
        {
            name: 'InOl_Chiki',
            bmp: '\u1C50-\u1C7F'
        },
        {
            name: 'InOld_Hungarian',
            astral: '\uD803[\uDC80-\uDCFF]'
        },
        {
            name: 'InOld_Italic',
            astral: '\uD800[\uDF00-\uDF2F]'
        },
        {
            name: 'InOld_North_Arabian',
            astral: '\uD802[\uDE80-\uDE9F]'
        },
        {
            name: 'InOld_Permic',
            astral: '\uD800[\uDF50-\uDF7F]'
        },
        {
            name: 'InOld_Persian',
            astral: '\uD800[\uDFA0-\uDFDF]'
        },
        {
            name: 'InOld_South_Arabian',
            astral: '\uD802[\uDE60-\uDE7F]'
        },
        {
            name: 'InOld_Turkic',
            astral: '\uD803[\uDC00-\uDC4F]'
        },
        {
            name: 'InOptical_Character_Recognition',
            bmp: '\u2440-\u245F'
        },
        {
            name: 'InOriya',
            bmp: '\u0B00-\u0B7F'
        },
        {
            name: 'InOrnamental_Dingbats',
            astral: '\uD83D[\uDE50-\uDE7F]'
        },
        {
            name: 'InOsmanya',
            astral: '\uD801[\uDC80-\uDCAF]'
        },
        {
            name: 'InPahawh_Hmong',
            astral: '\uD81A[\uDF00-\uDF8F]'
        },
        {
            name: 'InPalmyrene',
            astral: '\uD802[\uDC60-\uDC7F]'
        },
        {
            name: 'InPau_Cin_Hau',
            astral: '\uD806[\uDEC0-\uDEFF]'
        },
        {
            name: 'InPhags_pa',
            bmp: '\uA840-\uA87F'
        },
        {
            name: 'InPhaistos_Disc',
            astral: '\uD800[\uDDD0-\uDDFF]'
        },
        {
            name: 'InPhoenician',
            astral: '\uD802[\uDD00-\uDD1F]'
        },
        {
            name: 'InPhonetic_Extensions',
            bmp: '\u1D00-\u1D7F'
        },
        {
            name: 'InPhonetic_Extensions_Supplement',
            bmp: '\u1D80-\u1DBF'
        },
        {
            name: 'InPlaying_Cards',
            astral: '\uD83C[\uDCA0-\uDCFF]'
        },
        {
            name: 'InPrivate_Use_Area',
            bmp: '\uE000-\uF8FF'
        },
        {
            name: 'InPsalter_Pahlavi',
            astral: '\uD802[\uDF80-\uDFAF]'
        },
        {
            name: 'InRejang',
            bmp: '\uA930-\uA95F'
        },
        {
            name: 'InRumi_Numeral_Symbols',
            astral: '\uD803[\uDE60-\uDE7F]'
        },
        {
            name: 'InRunic',
            bmp: '\u16A0-\u16FF'
        },
        {
            name: 'InSamaritan',
            bmp: '\u0800-\u083F'
        },
        {
            name: 'InSaurashtra',
            bmp: '\uA880-\uA8DF'
        },
        {
            name: 'InSharada',
            astral: '\uD804[\uDD80-\uDDDF]'
        },
        {
            name: 'InShavian',
            astral: '\uD801[\uDC50-\uDC7F]'
        },
        {
            name: 'InShorthand_Format_Controls',
            astral: '\uD82F[\uDCA0-\uDCAF]'
        },
        {
            name: 'InSiddham',
            astral: '\uD805[\uDD80-\uDDFF]'
        },
        {
            name: 'InSinhala',
            bmp: '\u0D80-\u0DFF'
        },
        {
            name: 'InSinhala_Archaic_Numbers',
            astral: '\uD804[\uDDE0-\uDDFF]'
        },
        {
            name: 'InSmall_Form_Variants',
            bmp: '\uFE50-\uFE6F'
        },
        {
            name: 'InSora_Sompeng',
            astral: '\uD804[\uDCD0-\uDCFF]'
        },
        {
            name: 'InSpacing_Modifier_Letters',
            bmp: '\u02B0-\u02FF'
        },
        {
            name: 'InSpecials',
            bmp: '\uFFF0-\uFFFF'
        },
        {
            name: 'InSundanese',
            bmp: '\u1B80-\u1BBF'
        },
        {
            name: 'InSundanese_Supplement',
            bmp: '\u1CC0-\u1CCF'
        },
        {
            name: 'InSuperscripts_and_Subscripts',
            bmp: '\u2070-\u209F'
        },
        {
            name: 'InSupplemental_Arrows_A',
            bmp: '\u27F0-\u27FF'
        },
        {
            name: 'InSupplemental_Arrows_B',
            bmp: '\u2900-\u297F'
        },
        {
            name: 'InSupplemental_Arrows_C',
            astral: '\uD83E[\uDC00-\uDCFF]'
        },
        {
            name: 'InSupplemental_Mathematical_Operators',
            bmp: '\u2A00-\u2AFF'
        },
        {
            name: 'InSupplemental_Punctuation',
            bmp: '\u2E00-\u2E7F'
        },
        {
            name: 'InSupplemental_Symbols_and_Pictographs',
            astral: '\uD83E[\uDD00-\uDDFF]'
        },
        {
            name: 'InSupplementary_Private_Use_Area_A',
            astral: '[\uDB80-\uDBBF][\uDC00-\uDFFF]'
        },
        {
            name: 'InSupplementary_Private_Use_Area_B',
            astral: '[\uDBC0-\uDBFF][\uDC00-\uDFFF]'
        },
        {
            name: 'InSutton_SignWriting',
            astral: '\uD836[\uDC00-\uDEAF]'
        },
        {
            name: 'InSyloti_Nagri',
            bmp: '\uA800-\uA82F'
        },
        {
            name: 'InSyriac',
            bmp: '\u0700-\u074F'
        },
        {
            name: 'InTagalog',
            bmp: '\u1700-\u171F'
        },
        {
            name: 'InTagbanwa',
            bmp: '\u1760-\u177F'
        },
        {
            name: 'InTags',
            astral: '\uDB40[\uDC00-\uDC7F]'
        },
        {
            name: 'InTai_Le',
            bmp: '\u1950-\u197F'
        },
        {
            name: 'InTai_Tham',
            bmp: '\u1A20-\u1AAF'
        },
        {
            name: 'InTai_Viet',
            bmp: '\uAA80-\uAADF'
        },
        {
            name: 'InTai_Xuan_Jing_Symbols',
            astral: '\uD834[\uDF00-\uDF5F]'
        },
        {
            name: 'InTakri',
            astral: '\uD805[\uDE80-\uDECF]'
        },
        {
            name: 'InTamil',
            bmp: '\u0B80-\u0BFF'
        },
        {
            name: 'InTelugu',
            bmp: '\u0C00-\u0C7F'
        },
        {
            name: 'InThaana',
            bmp: '\u0780-\u07BF'
        },
        {
            name: 'InThai',
            bmp: '\u0E00-\u0E7F'
        },
        {
            name: 'InTibetan',
            bmp: '\u0F00-\u0FFF'
        },
        {
            name: 'InTifinagh',
            bmp: '\u2D30-\u2D7F'
        },
        {
            name: 'InTirhuta',
            astral: '\uD805[\uDC80-\uDCDF]'
        },
        {
            name: 'InTransport_and_Map_Symbols',
            astral: '\uD83D[\uDE80-\uDEFF]'
        },
        {
            name: 'InUgaritic',
            astral: '\uD800[\uDF80-\uDF9F]'
        },
        {
            name: 'InUnified_Canadian_Aboriginal_Syllabics',
            bmp: '\u1400-\u167F'
        },
        {
            name: 'InUnified_Canadian_Aboriginal_Syllabics_Extended',
            bmp: '\u18B0-\u18FF'
        },
        {
            name: 'InVai',
            bmp: '\uA500-\uA63F'
        },
        {
            name: 'InVariation_Selectors',
            bmp: '\uFE00-\uFE0F'
        },
        {
            name: 'InVariation_Selectors_Supplement',
            astral: '\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'InVedic_Extensions',
            bmp: '\u1CD0-\u1CFF'
        },
        {
            name: 'InVertical_Forms',
            bmp: '\uFE10-\uFE1F'
        },
        {
            name: 'InWarang_Citi',
            astral: '\uD806[\uDCA0-\uDCFF]'
        },
        {
            name: 'InYi_Radicals',
            bmp: '\uA490-\uA4CF'
        },
        {
            name: 'InYi_Syllables',
            bmp: '\uA000-\uA48F'
        },
        {
            name: 'InYijing_Hexagram_Symbols',
            bmp: '\u4DC0-\u4DFF'
        }
    ]);

};

},{}],160:[function(require,module,exports){
/*!
 * XRegExp Unicode Categories 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2010-2016 MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */

module.exports = function(XRegExp) {
    'use strict';

    /**
     * Adds support for Unicode's general categories. E.g., `\p{Lu}` or `\p{Uppercase Letter}`. See
     * category descriptions in UAX #44 <http://unicode.org/reports/tr44/#GC_Values_Table>. Token
     * names are case insensitive, and any spaces, hyphens, and underscores are ignored.
     *
     * Uses Unicode 8.0.0.
     *
     * @requires XRegExp, Unicode Base
     */

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Categories');
    }

    XRegExp.addUnicodeData([
        {
            name: 'C',
            alias: 'Other',
            isBmpLast: true,
            bmp: '\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0530\u0557\u0558\u0560\u0588\u058B\u058C\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08B5-\u08E2\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0AF8\u0AFA-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0BFF\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D00\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5E\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u169D-\u169F\u16F9-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180E\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE\u1AAF\u1ABF-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7\u1CFA-\u1CFF\u1DF6-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BF-\u20CF\u20F1-\u20FF\u218C-\u218F\u23FB-\u23FF\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2B97\u2BBA-\u2BBC\u2BC9\u2BD2-\u2BEB\u2BF0-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E43-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FD6-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA6F8-\uA6FF\uA7AE\uA7AF\uA7B8-\uA7F6\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FE\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB66-\uAB6F\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF',
            astral: '\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDD73-\uDD7A\uDDE9-\uDDFF\uDE46-\uDEFF\uDF57-\uDF5F\uDF72-\uDFFF]|\uD836[\uDE8C-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD6F\uDD9B-\uDDE5\uDE03-\uDE0F\uDE3B-\uDE3F\uDE49-\uDE4F\uDE52-\uDEFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6D\uDE70-\uDECF\uDEEE\uDEEF\uDEF6-\uDEFF\uDF46-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD809[\uDC6F\uDC75-\uDC7F\uDD44-\uDFFF]|\uD81B[\uDC00-\uDEFF\uDF45-\uDF4F\uDF7F-\uDF8E\uDFA0-\uDFFF]|\uD86E[\uDC1E\uDC1F]|\uD83D[\uDD7A\uDDA4\uDED1-\uDEDF\uDEED-\uDEEF\uDEF4-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6E\uDD70-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8D-\uDD8F\uDD9C-\uDD9F\uDDA1-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEFC-\uDEFF\uDF24-\uDF2F\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]|\uD804[\uDC4E-\uDC51\uDC70-\uDC7E\uDCBD\uDCC2-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD44-\uDD4F\uDD77-\uDD7F\uDDCE\uDDCF\uDDE0\uDDF5-\uDDFF\uDE12\uDE3E-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEAA-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF3B\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD7-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD86D[\uDF35-\uDF3F]|[\uD807\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD81C-\uD82B\uD82D\uD82E\uD830-\uD833\uD837-\uD839\uD83F\uD874-\uD87D\uD87F-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD806[\uDC00-\uDC9F\uDCF3-\uDCFE\uDD00-\uDEBF\uDEF9-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD00-\uDE5F\uDE7F-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD805[\uDC00-\uDC7F\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDDE-\uDDFF\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB8-\uDEBF\uDECA-\uDEFF\uDF1A-\uDF1C\uDF2C-\uDF2F\uDF40-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE34-\uDE37\uDE3B-\uDE3E\uDE48-\uDE4F\uDE59-\uDE5F\uDEA0-\uDEBF\uDEE7-\uDEEA\uDEF7-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDF98\uDF9D-\uDFA8\uDFB0-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A\uDC9B\uDCA0-\uDFFF]|\uD82C[\uDC02-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDD0F\uDD19-\uDD7F\uDD85-\uDDBF\uDDC1-\uDFFF]|\uD873[\uDEA2-\uDFFF]'
        },
        {
            name: 'Cc',
            alias: 'Control',
            bmp: '\0-\x1F\x7F-\x9F'
        },
        {
            name: 'Cf',
            alias: 'Format',
            bmp: '\xAD\u0600-\u0605\u061C\u06DD\u070F\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB',
            astral: '\uDB40[\uDC01\uDC20-\uDC7F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uD804\uDCBD'
        },
        {
            name: 'Cn',
            alias: 'Unassigned',
            bmp: '\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0530\u0557\u0558\u0560\u0588\u058B\u058C\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u05FF\u061D\u070E\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08B5-\u08E2\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0AF8\u0AFA-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0BFF\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D00\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5E\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u169D-\u169F\u16F9-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE\u1AAF\u1ABF-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7\u1CFA-\u1CFF\u1DF6-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u2065\u2072\u2073\u208F\u209D-\u209F\u20BF-\u20CF\u20F1-\u20FF\u218C-\u218F\u23FB-\u23FF\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2B97\u2BBA-\u2BBC\u2BC9\u2BD2-\u2BEB\u2BF0-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E43-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FD6-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA6F8-\uA6FF\uA7AE\uA7AF\uA7B8-\uA7F6\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FE\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB66-\uAB6F\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD\uFEFE\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE\uFFFF',
            astral: '\uDB40[\uDC00\uDC02-\uDC1F\uDC80-\uDCFF\uDDF0-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDDE9-\uDDFF\uDE46-\uDEFF\uDF57-\uDF5F\uDF72-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD6F\uDD9B-\uDDE5\uDE03-\uDE0F\uDE3B-\uDE3F\uDE49-\uDE4F\uDE52-\uDEFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6D\uDE70-\uDECF\uDEEE\uDEEF\uDEF6-\uDEFF\uDF46-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD809[\uDC6F\uDC75-\uDC7F\uDD44-\uDFFF]|\uD81B[\uDC00-\uDEFF\uDF45-\uDF4F\uDF7F-\uDF8E\uDFA0-\uDFFF]|\uD86E[\uDC1E\uDC1F]|\uD83D[\uDD7A\uDDA4\uDED1-\uDEDF\uDEED-\uDEEF\uDEF4-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6E\uDD70-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8D-\uDD8F\uDD9C-\uDD9F\uDDA1-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEFC-\uDEFF\uDF24-\uDF2F\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|[\uDBBF\uDBFF][\uDFFE\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A\uDC9B\uDCA4-\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD7-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD86D[\uDF35-\uDF3F]|[\uD807\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD81C-\uD82B\uD82D\uD82E\uD830-\uD833\uD837-\uD839\uD83F\uD874-\uD87D\uD87F-\uDB3F\uDB41-\uDB7F][\uDC00-\uDFFF]|\uD806[\uDC00-\uDC9F\uDCF3-\uDCFE\uDD00-\uDEBF\uDEF9-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD00-\uDE5F\uDE7F-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD836[\uDE8C-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD805[\uDC00-\uDC7F\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDDE-\uDDFF\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB8-\uDEBF\uDECA-\uDEFF\uDF1A-\uDF1C\uDF2C-\uDF2F\uDF40-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE34-\uDE37\uDE3B-\uDE3E\uDE48-\uDE4F\uDE59-\uDE5F\uDEA0-\uDEBF\uDEE7-\uDEEA\uDEF7-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDF98\uDF9D-\uDFA8\uDFB0-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD804[\uDC4E-\uDC51\uDC70-\uDC7E\uDCC2-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD44-\uDD4F\uDD77-\uDD7F\uDDCE\uDDCF\uDDE0\uDDF5-\uDDFF\uDE12\uDE3E-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEAA-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF3B\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD82C[\uDC02-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDD0F\uDD19-\uDD7F\uDD85-\uDDBF\uDDC1-\uDFFF]|\uD873[\uDEA2-\uDFFF]'
        },
        {
            name: 'Co',
            alias: 'Private_Use',
            bmp: '\uE000-\uF8FF',
            astral: '[\uDB80-\uDBBE\uDBC0-\uDBFE][\uDC00-\uDFFF]|[\uDBBF\uDBFF][\uDC00-\uDFFD]'
        },
        {
            name: 'Cs',
            alias: 'Surrogate',
            bmp: '\uD800-\uDFFF'
        },
        {
            name: 'L',
            alias: 'Letter',
            bmp: 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
            astral: '\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD83A[\uDC00-\uDCC4]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD80D[\uDC00-\uDC2E]|\uD87E[\uDC00-\uDE1D]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD809[\uDC80-\uDD43]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD808[\uDC00-\uDF99]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD811[\uDC00-\uDE46]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD82C[\uDC00\uDC01]|\uD873[\uDC00-\uDEA1]'
        },
        {
            name: 'Ll',
            alias: 'Lowercase_Letter',
            bmp: 'a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A',
            astral: '\uD803[\uDCC0-\uDCF2]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD801[\uDC28-\uDC4F]|\uD806[\uDCC0-\uDCDF]'
        },
        {
            name: 'Lm',
            alias: 'Modifier_Letter',
            bmp: '\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F',
            astral: '\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F]'
        },
        {
            name: 'Lo',
            alias: 'Other_Letter',
            bmp: '\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
            astral: '\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD83A[\uDC00-\uDCC4]|\uD803[\uDC00-\uDC48]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD80D[\uDC00-\uDC2E]|\uD87E[\uDC00-\uDE1D]|\uD81B[\uDF00-\uDF44\uDF50]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCFF\uDEC0-\uDEF8]|\uD809[\uDC80-\uDD43]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD808[\uDC00-\uDF99]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD811[\uDC00-\uDE46]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD82C[\uDC00\uDC01]|\uD873[\uDC00-\uDEA1]'
        },
        {
            name: 'Lt',
            alias: 'Titlecase_Letter',
            bmp: '\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC'
        },
        {
            name: 'Lu',
            alias: 'Uppercase_Letter',
            bmp: 'A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A',
            astral: '\uD806[\uDCA0-\uDCBF]|\uD803[\uDC80-\uDCB2]|\uD801[\uDC00-\uDC27]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]'
        },
        {
            name: 'M',
            alias: 'Mark',
            bmp: '\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F',
            astral: '\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDEAB-\uDEB7\uDF1D-\uDF2B]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDCA-\uDDCC\uDE2C-\uDE37\uDEDF-\uDEEA\uDF00-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD82F[\uDC9D\uDC9E]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'Mc',
            alias: 'Spacing_Mark',
            bmp: '\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BE-\u09C0\u09C7\u09C8\u09CB\u09CC\u09D7\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD7\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0-\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0D02\u0D03\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D57\u0D82\u0D83\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DF2\u0DF3\u0F3E\u0F3F\u0F7F\u102B\u102C\u1031\u1038\u103B\u103C\u1056\u1057\u1062-\u1064\u1067-\u106D\u1083\u1084\u1087-\u108C\u108F\u109A-\u109C\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1B04\u1B35\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF2\u1CF3\u302E\u302F\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BD-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAA7B\uAA7D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC',
            astral: '\uD834[\uDD65\uDD66\uDD6D-\uDD72]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3E\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63]|\uD805[\uDCB0-\uDCB2\uDCB9\uDCBB-\uDCBE\uDCC1\uDDAF-\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF20\uDF21\uDF26]|\uD81B[\uDF51-\uDF7E]'
        },
        {
            name: 'Me',
            alias: 'Enclosing_Mark',
            bmp: '\u0488\u0489\u1ABE\u20DD-\u20E0\u20E2-\u20E4\uA670-\uA672'
        },
        {
            name: 'Mn',
            alias: 'Nonspacing_Mark',
            bmp: '\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F',
            astral: '\uD805[\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC01\uDC38-\uDC46\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDCA-\uDDCC\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'N',
            alias: 'Number',
            bmp: '0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19',
            astral: '\uD800[\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23\uDF41\uDF4A\uDFD1-\uDFD5]|\uD801[\uDCA0-\uDCA9]|\uD803[\uDCFA-\uDCFF\uDE60-\uDE7E]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDCC7-\uDCCF]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59\uDF5B-\uDF61]|\uD806[\uDCE0-\uDCF2]|\uD804[\uDC52-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDDE1-\uDDF4\uDEF0-\uDEF9]|\uD834[\uDF60-\uDF71]|\uD83C[\uDD00-\uDD0C]|\uD809[\uDC00-\uDC6E]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE47\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD805[\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF3B]'
        },
        {
            name: 'Nd',
            alias: 'Decimal_Number',
            bmp: '0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19',
            astral: '\uD801[\uDCA0-\uDCA9]|\uD835[\uDFCE-\uDFFF]|\uD805[\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF39]|\uD806[\uDCE0-\uDCE9]|\uD804[\uDC66-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDEF0-\uDEF9]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59]'
        },
        {
            name: 'Nl',
            alias: 'Letter_Number',
            bmp: '\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF',
            astral: '\uD809[\uDC00-\uDC6E]|\uD800[\uDD40-\uDD74\uDF41\uDF4A\uDFD1-\uDFD5]'
        },
        {
            name: 'No',
            alias: 'Other_Number',
            bmp: '\xB2\xB3\xB9\xBC-\xBE\u09F4-\u09F9\u0B72-\u0B77\u0BF0-\u0BF2\u0C78-\u0C7E\u0D70-\u0D75\u0F2A-\u0F33\u1369-\u137C\u17F0-\u17F9\u19DA\u2070\u2074-\u2079\u2080-\u2089\u2150-\u215F\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA830-\uA835',
            astral: '\uD804[\uDC52-\uDC65\uDDE1-\uDDF4]|\uD803[\uDCFA-\uDCFF\uDE60-\uDE7E]|\uD83C[\uDD00-\uDD0C]|\uD806[\uDCEA-\uDCF2]|\uD83A[\uDCC7-\uDCCF]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE47\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD805[\uDF3A\uDF3B]|\uD81A[\uDF5B-\uDF61]|\uD834[\uDF60-\uDF71]|\uD800[\uDD07-\uDD33\uDD75-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23]'
        },
        {
            name: 'P',
            alias: 'Punctuation',
            bmp: '\x21-\x23\x25-\\x2A\x2C-\x2F\x3A\x3B\\x3F\x40\\x5B-\\x5D\x5F\\x7B\x7D\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65',
            astral: '\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD809[\uDC70-\uDC74]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD836[\uDE87-\uDE8B]|\uD801\uDD6F|\uD82F\uDC9F|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]'
        },
        {
            name: 'Pc',
            alias: 'Connector_Punctuation',
            bmp: '\x5F\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F'
        },
        {
            name: 'Pd',
            alias: 'Dash_Punctuation',
            bmp: '\\x2D\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u2E40\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D'
        },
        {
            name: 'Pe',
            alias: 'Close_Punctuation',
            bmp: '\\x29\\x5D\x7D\u0F3B\u0F3D\u169C\u2046\u207E\u208E\u2309\u230B\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E23\u2E25\u2E27\u2E29\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3E\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63'
        },
        {
            name: 'Pf',
            alias: 'Final_Punctuation',
            bmp: '\xBB\u2019\u201D\u203A\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21'
        },
        {
            name: 'Pi',
            alias: 'Initial_Punctuation',
            bmp: '\xAB\u2018\u201B\u201C\u201F\u2039\u2E02\u2E04\u2E09\u2E0C\u2E1C\u2E20'
        },
        {
            name: 'Po',
            alias: 'Other_Punctuation',
            bmp: '\x21-\x23\x25-\x27\\x2A\x2C\\x2E\x2F\x3A\x3B\\x3F\x40\\x5C\xA1\xA7\xB6\xB7\xBF\u037E\u0387\u055A-\u055F\u0589\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u166D\u166E\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u1805\u1807-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203B-\u203E\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205E\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00\u2E01\u2E06-\u2E08\u2E0B\u2E0E-\u2E16\u2E18\u2E19\u2E1B\u2E1E\u2E1F\u2E2A-\u2E2E\u2E30-\u2E39\u2E3C-\u2E3F\u2E41\u3001-\u3003\u303D\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFE10-\uFE16\uFE19\uFE30\uFE45\uFE46\uFE49-\uFE4C\uFE50-\uFE52\uFE54-\uFE57\uFE5F-\uFE61\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF07\uFF0A\uFF0C\uFF0E\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3C\uFF61\uFF64\uFF65',
            astral: '\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD809[\uDC70-\uDC74]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD836[\uDE87-\uDE8B]|\uD801\uDD6F|\uD82F\uDC9F|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]'
        },
        {
            name: 'Ps',
            alias: 'Open_Punctuation',
            bmp: '\\x28\\x5B\\x7B\u0F3A\u0F3C\u169B\u201A\u201E\u2045\u207D\u208D\u2308\u230A\u2329\u2768\u276A\u276C\u276E\u2770\u2772\u2774\u27C5\u27E6\u27E8\u27EA\u27EC\u27EE\u2983\u2985\u2987\u2989\u298B\u298D\u298F\u2991\u2993\u2995\u2997\u29D8\u29DA\u29FC\u2E22\u2E24\u2E26\u2E28\u2E42\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u3018\u301A\u301D\uFD3F\uFE17\uFE35\uFE37\uFE39\uFE3B\uFE3D\uFE3F\uFE41\uFE43\uFE47\uFE59\uFE5B\uFE5D\uFF08\uFF3B\uFF5B\uFF5F\uFF62'
        },
        {
            name: 'S',
            alias: 'Symbol',
            bmp: '\\x24\\x2B\x3C-\x3E\\x5E\x60\\x7C\x7E\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BE\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u23FA\u2400-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD1\u2BEC-\u2BEF\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u32FE\u3300-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD',
            astral: '\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD10-\uDD18\uDD80-\uDD84\uDDC0]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD2E\uDD30-\uDD6B\uDD70-\uDD9A\uDDE6-\uDE02\uDE10-\uDE3A\uDE40-\uDE48\uDE50\uDE51\uDF00-\uDFFF]|\uD83D[\uDC00-\uDD79\uDD7B-\uDDA3\uDDA5-\uDED0\uDEE0-\uDEEC\uDEF0-\uDEF3\uDF00-\uDF73\uDF80-\uDFD4]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC]|\uD82F\uDC9C|\uD805\uDF3F|\uD802[\uDC77\uDC78\uDEC8]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD83B[\uDEF0\uDEF1]'
        },
        {
            name: 'Sc',
            alias: 'Currency_Symbol',
            bmp: '\\x24\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BE\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6'
        },
        {
            name: 'Sk',
            alias: 'Modifier_Symbol',
            bmp: '\\x5E\x60\xA8\xAF\xB4\xB8\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u309B\u309C\uA700-\uA716\uA720\uA721\uA789\uA78A\uAB5B\uFBB2-\uFBC1\uFF3E\uFF40\uFFE3',
            astral: '\uD83C[\uDFFB-\uDFFF]'
        },
        {
            name: 'Sm',
            alias: 'Math_Symbol',
            bmp: '\\x2B\x3C-\x3E\\x7C\x7E\xAC\xB1\xD7\xF7\u03F6\u0606-\u0608\u2044\u2052\u207A-\u207C\u208A-\u208C\u2118\u2140-\u2144\u214B\u2190-\u2194\u219A\u219B\u21A0\u21A3\u21A6\u21AE\u21CE\u21CF\u21D2\u21D4\u21F4-\u22FF\u2320\u2321\u237C\u239B-\u23B3\u23DC-\u23E1\u25B7\u25C1\u25F8-\u25FF\u266F\u27C0-\u27C4\u27C7-\u27E5\u27F0-\u27FF\u2900-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2AFF\u2B30-\u2B44\u2B47-\u2B4C\uFB29\uFE62\uFE64-\uFE66\uFF0B\uFF1C-\uFF1E\uFF5C\uFF5E\uFFE2\uFFE9-\uFFEC',
            astral: '\uD83B[\uDEF0\uDEF1]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]'
        },
        {
            name: 'So',
            alias: 'Other_Symbol',
            bmp: '\xA6\xA9\xAE\xB0\u0482\u058D\u058E\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u09FA\u0B70\u0BF3-\u0BF8\u0BFA\u0C7F\u0D79\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116\u2117\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u214A\u214C\u214D\u214F\u218A\u218B\u2195-\u2199\u219C-\u219F\u21A1\u21A2\u21A4\u21A5\u21A7-\u21AD\u21AF-\u21CD\u21D0\u21D1\u21D3\u21D5-\u21F3\u2300-\u2307\u230C-\u231F\u2322-\u2328\u232B-\u237B\u237D-\u239A\u23B4-\u23DB\u23E2-\u23FA\u2400-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u25B6\u25B8-\u25C0\u25C2-\u25F7\u2600-\u266E\u2670-\u2767\u2794-\u27BF\u2800-\u28FF\u2B00-\u2B2F\u2B45\u2B46\u2B4D-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD1\u2BEC-\u2BEF\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u32FE\u3300-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA828-\uA82B\uA836\uA837\uA839\uAA77-\uAA79\uFDFD\uFFE4\uFFE8\uFFED\uFFEE\uFFFC\uFFFD',
            astral: '\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD10-\uDD18\uDD80-\uDD84\uDDC0]|\uD83D[\uDC00-\uDD79\uDD7B-\uDDA3\uDDA5-\uDED0\uDEE0-\uDEEC\uDEF0-\uDEF3\uDF00-\uDF73\uDF80-\uDFD4]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD2E\uDD30-\uDD6B\uDD70-\uDD9A\uDDE6-\uDE02\uDE10-\uDE3A\uDE40-\uDE48\uDE50\uDE51\uDF00-\uDFFA]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC]|\uD82F\uDC9C|\uD805\uDF3F|\uD802[\uDC77\uDC78\uDEC8]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]'
        },
        {
            name: 'Z',
            alias: 'Separator',
            bmp: '\x20\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000'
        },
        {
            name: 'Zl',
            alias: 'Line_Separator',
            bmp: '\u2028'
        },
        {
            name: 'Zp',
            alias: 'Paragraph_Separator',
            bmp: '\u2029'
        },
        {
            name: 'Zs',
            alias: 'Space_Separator',
            bmp: '\x20\xA0\u1680\u2000-\u200A\u202F\u205F\u3000'
        }
    ]);

};

},{}],161:[function(require,module,exports){
/*!
 * XRegExp Unicode Properties 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2012-2016 MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */

module.exports = function(XRegExp) {
    'use strict';

    /**
     * Adds properties to meet the UTS #18 Level 1 RL1.2 requirements for Unicode regex support. See
     * <http://unicode.org/reports/tr18/#RL1.2>. Following are definitions of these properties from
     * UAX #44 <http://unicode.org/reports/tr44/>:
     *
     * - Alphabetic
     *   Characters with the Alphabetic property. Generated from: Lowercase + Uppercase + Lt + Lm +
     *   Lo + Nl + Other_Alphabetic.
     *
     * - Default_Ignorable_Code_Point
     *   For programmatic determination of default ignorable code points. New characters that should
     *   be ignored in rendering (unless explicitly supported) will be assigned in these ranges,
     *   permitting programs to correctly handle the default rendering of such characters when not
     *   otherwise supported.
     *
     * - Lowercase
     *   Characters with the Lowercase property. Generated from: Ll + Other_Lowercase.
     *
     * - Noncharacter_Code_Point
     *   Code points permanently reserved for internal use.
     *
     * - Uppercase
     *   Characters with the Uppercase property. Generated from: Lu + Other_Uppercase.
     *
     * - White_Space
     *   Spaces, separator characters and other control characters which should be treated by
     *   programming languages as "white space" for the purpose of parsing elements.
     *
     * The properties ASCII, Any, and Assigned are also included but are not defined in UAX #44. UTS
     * #18 RL1.2 additionally requires support for Unicode scripts and general categories. These are
     * included in XRegExp's Unicode Categories and Unicode Scripts addons.
     *
     * Token names are case insensitive, and any spaces, hyphens, and underscores are ignored.
     *
     * Uses Unicode 8.0.0.
     *
     * @requires XRegExp, Unicode Base
     */

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Properties');
    }

    var unicodeData = [
        {
            name: 'ASCII',
            bmp: '\0-\x7F'
        },
        {
            name: 'Alphabetic',
            bmp: 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0345\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0657\u0659-\u065F\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06ED-\u06EF\u06FA-\u06FC\u06FF\u0710-\u073F\u074D-\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0817\u081A-\u082C\u0840-\u0858\u08A0-\u08B4\u08E3-\u08E9\u08F0-\u093B\u093D-\u094C\u094E-\u0950\u0955-\u0963\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C4\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B\u0A4C\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC5\u0AC7-\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0-\u0AE3\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D-\u0B44\u0B47\u0B48\u0B4B\u0B4C\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCC\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D57\u0D5F-\u0D63\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E46\u0E4D\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0ECD\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F81\u0F88-\u0F97\u0F99-\u0FBC\u1000-\u1036\u1038\u103B-\u103F\u1050-\u1062\u1065-\u1068\u106E-\u1086\u108E\u109C\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1713\u1720-\u1733\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17C8\u17D7\u17DC\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u1938\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A61-\u1A74\u1AA7\u1B00-\u1B33\u1B35-\u1B43\u1B45-\u1B4B\u1B80-\u1BA9\u1BAC-\u1BAF\u1BBA-\u1BE5\u1BE7-\u1BF1\u1C00-\u1C35\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1D00-\u1DBF\u1DE7-\u1DF4\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA674-\uA67B\uA67F-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA827\uA840-\uA873\uA880-\uA8C3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA92A\uA930-\uA952\uA960-\uA97C\uA980-\uA9B2\uA9B4-\uA9BF\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A\uAA7E-\uAABE\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
            astral: '\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD804[\uDC00-\uDC45\uDC82-\uDCB8\uDCD0-\uDCE8\uDD00-\uDD32\uDD50-\uDD72\uDD76\uDD80-\uDDBF\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE34\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEE8\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D-\uDF44\uDF47\uDF48\uDF4B\uDF4C\uDF50\uDF57\uDF5D-\uDF63]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD83A[\uDC00-\uDCC4]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF36\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89]|\uD80D[\uDC00-\uDC2E]|\uD87E[\uDC00-\uDE1D]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9E]|\uD808[\uDC00-\uDF99]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD805[\uDC80-\uDCC1\uDCC4\uDCC5\uDCC7\uDD80-\uDDB5\uDDB8-\uDDBE\uDDD8-\uDDDD\uDE00-\uDE3E\uDE40\uDE44\uDE80-\uDEB5\uDF00-\uDF19\uDF1D-\uDF2A]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD811[\uDC00-\uDE46]|\uD82C[\uDC00\uDC01]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF93-\uDF9F]|\uD873[\uDC00-\uDEA1]'
        },
        {
            name: 'Any',
            isBmpLast: true,
            bmp: '\0-\uFFFF',
            astral: '[\uD800-\uDBFF][\uDC00-\uDFFF]'
        },
        {
            name: 'Default_Ignorable_Code_Point',
            bmp: '\xAD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8',
            astral: '[\uDB40-\uDB43][\uDC00-\uDFFF]|\uD834[\uDD73-\uDD7A]|\uD82F[\uDCA0-\uDCA3]'
        },
        {
            name: 'Lowercase',
            bmp: 'a-z\xAA\xB5\xBA\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02B8\u02C0\u02C1\u02E0-\u02E4\u0345\u0371\u0373\u0377\u037A-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1DBF\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u2071\u207F\u2090-\u209C\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2170-\u217F\u2184\u24D0-\u24E9\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7D\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B-\uA69D\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7F8-\uA7FA\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A',
            astral: '\uD803[\uDCC0-\uDCF2]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD801[\uDC28-\uDC4F]|\uD806[\uDCC0-\uDCDF]'
        },
        {
            name: 'Noncharacter_Code_Point',
            bmp: '\uFDD0-\uFDEF\uFFFE\uFFFF',
            astral: '[\uDB3F\uDB7F\uDBBF\uDBFF\uD83F\uD87F\uD8BF\uDAFF\uD97F\uD9BF\uD9FF\uDA3F\uD8FF\uDABF\uDA7F\uD93F][\uDFFE\uDFFF]'
        },
        {
            name: 'Uppercase',
            bmp: 'A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2160-\u216F\u2183\u24B6-\u24CF\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A',
            astral: '\uD806[\uDCA0-\uDCBF]|\uD803[\uDC80-\uDCB2]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD801[\uDC00-\uDC27]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89]'
        },
        {
            name: 'White_Space',
            bmp: '\x09-\x0D\x20\x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000'
        }
    ];

    // Add non-generated data
    unicodeData.push({
        name: 'Assigned',
        // Since this is defined as the inverse of Unicode category Cn (Unassigned), the Unicode
        // Categories addon is required to use this property
        inverseOf: 'Cn'
    });

    XRegExp.addUnicodeData(unicodeData);

};

},{}],162:[function(require,module,exports){
/*!
 * XRegExp Unicode Scripts 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2010-2016 MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */

module.exports = function(XRegExp) {
    'use strict';

    /**
     * Adds support for all Unicode scripts. E.g., `\p{Latin}`. Token names are case insensitive,
     * and any spaces, hyphens, and underscores are ignored.
     *
     * Uses Unicode 8.0.0.
     *
     * @requires XRegExp, Unicode Base
     */

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Scripts');
    }

    XRegExp.addUnicodeData([
        {
            name: 'Ahom',
            astral: '\uD805[\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF3F]'
        },
        {
            name: 'Anatolian_Hieroglyphs',
            astral: '\uD811[\uDC00-\uDE46]'
        },
        {
            name: 'Arabic',
            bmp: '\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u08A0-\u08B4\u08E3-\u08FF\uFB50-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFD\uFE70-\uFE74\uFE76-\uFEFC',
            astral: '\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]'
        },
        {
            name: 'Armenian',
            bmp: '\u0531-\u0556\u0559-\u055F\u0561-\u0587\u058A\u058D-\u058F\uFB13-\uFB17'
        },
        {
            name: 'Avestan',
            astral: '\uD802[\uDF00-\uDF35\uDF39-\uDF3F]'
        },
        {
            name: 'Balinese',
            bmp: '\u1B00-\u1B4B\u1B50-\u1B7C'
        },
        {
            name: 'Bamum',
            bmp: '\uA6A0-\uA6F7',
            astral: '\uD81A[\uDC00-\uDE38]'
        },
        {
            name: 'Bassa_Vah',
            astral: '\uD81A[\uDED0-\uDEED\uDEF0-\uDEF5]'
        },
        {
            name: 'Batak',
            bmp: '\u1BC0-\u1BF3\u1BFC-\u1BFF'
        },
        {
            name: 'Bengali',
            bmp: '\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FB'
        },
        {
            name: 'Bopomofo',
            bmp: '\u02EA\u02EB\u3105-\u312D\u31A0-\u31BA'
        },
        {
            name: 'Brahmi',
            astral: '\uD804[\uDC00-\uDC4D\uDC52-\uDC6F\uDC7F]'
        },
        {
            name: 'Braille',
            bmp: '\u2800-\u28FF'
        },
        {
            name: 'Buginese',
            bmp: '\u1A00-\u1A1B\u1A1E\u1A1F'
        },
        {
            name: 'Buhid',
            bmp: '\u1740-\u1753'
        },
        {
            name: 'Canadian_Aboriginal',
            bmp: '\u1400-\u167F\u18B0-\u18F5'
        },
        {
            name: 'Carian',
            astral: '\uD800[\uDEA0-\uDED0]'
        },
        {
            name: 'Caucasian_Albanian',
            astral: '\uD801[\uDD30-\uDD63\uDD6F]'
        },
        {
            name: 'Chakma',
            astral: '\uD804[\uDD00-\uDD34\uDD36-\uDD43]'
        },
        {
            name: 'Cham',
            bmp: '\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA5C-\uAA5F'
        },
        {
            name: 'Cherokee',
            bmp: '\u13A0-\u13F5\u13F8-\u13FD\uAB70-\uABBF'
        },
        {
            name: 'Common',
            bmp: '\0-\x40\\x5B-\x60\\x7B-\xA9\xAB-\xB9\xBB-\xBF\xD7\xF7\u02B9-\u02DF\u02E5-\u02E9\u02EC-\u02FF\u0374\u037E\u0385\u0387\u0589\u0605\u060C\u061B\u061C\u061F\u0640\u06DD\u0964\u0965\u0E3F\u0FD5-\u0FD8\u10FB\u16EB-\u16ED\u1735\u1736\u1802\u1803\u1805\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u2000-\u200B\u200E-\u2064\u2066-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20BE\u2100-\u2125\u2127-\u2129\u212C-\u2131\u2133-\u214D\u214F-\u215F\u2189-\u218B\u2190-\u23FA\u2400-\u2426\u2440-\u244A\u2460-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD1\u2BEC-\u2BEF\u2E00-\u2E42\u2FF0-\u2FFB\u3000-\u3004\u3006\u3008-\u3020\u3030-\u3037\u303C-\u303F\u309B\u309C\u30A0\u30FB\u30FC\u3190-\u319F\u31C0-\u31E3\u3220-\u325F\u327F-\u32CF\u3358-\u33FF\u4DC0-\u4DFF\uA700-\uA721\uA788-\uA78A\uA830-\uA839\uA92E\uA9CF\uAB5B\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFF70\uFF9E\uFF9F\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD',
            astral: '\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD10-\uDD18\uDD80-\uDD84\uDDC0]|\uD82F[\uDCA0-\uDCA3]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDFCB\uDFCE-\uDFFF]|\uDB40[\uDC01\uDC20-\uDC7F]|\uD83D[\uDC00-\uDD79\uDD7B-\uDDA3\uDDA5-\uDED0\uDEE0-\uDEEC\uDEF0-\uDEF3\uDF00-\uDF73\uDF80-\uDFD4]|\uD800[\uDD00-\uDD02\uDD07-\uDD33\uDD37-\uDD3F\uDD90-\uDD9B\uDDD0-\uDDFC\uDEE1-\uDEFB]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD66\uDD6A-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDF00-\uDF56\uDF60-\uDF71]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD00-\uDD0C\uDD10-\uDD2E\uDD30-\uDD6B\uDD70-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE10-\uDE3A\uDE40-\uDE48\uDE50\uDE51\uDF00-\uDFFF]'
        },
        {
            name: 'Coptic',
            bmp: '\u03E2-\u03EF\u2C80-\u2CF3\u2CF9-\u2CFF'
        },
        {
            name: 'Cuneiform',
            astral: '\uD809[\uDC00-\uDC6E\uDC70-\uDC74\uDC80-\uDD43]|\uD808[\uDC00-\uDF99]'
        },
        {
            name: 'Cypriot',
            astral: '\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F]'
        },
        {
            name: 'Cyrillic',
            bmp: '\u0400-\u0484\u0487-\u052F\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F'
        },
        {
            name: 'Deseret',
            astral: '\uD801[\uDC00-\uDC4F]'
        },
        {
            name: 'Devanagari',
            bmp: '\u0900-\u0950\u0953-\u0963\u0966-\u097F\uA8E0-\uA8FD'
        },
        {
            name: 'Duployan',
            astral: '\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9C-\uDC9F]'
        },
        {
            name: 'Egyptian_Hieroglyphs',
            astral: '\uD80C[\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]'
        },
        {
            name: 'Elbasan',
            astral: '\uD801[\uDD00-\uDD27]'
        },
        {
            name: 'Ethiopic',
            bmp: '\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E'
        },
        {
            name: 'Georgian',
            bmp: '\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u10FF\u2D00-\u2D25\u2D27\u2D2D'
        },
        {
            name: 'Glagolitic',
            bmp: '\u2C00-\u2C2E\u2C30-\u2C5E'
        },
        {
            name: 'Gothic',
            astral: '\uD800[\uDF30-\uDF4A]'
        },
        {
            name: 'Grantha',
            astral: '\uD804[\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]'
        },
        {
            name: 'Greek',
            bmp: '\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65',
            astral: '\uD800[\uDD40-\uDD8C\uDDA0]|\uD834[\uDE00-\uDE45]'
        },
        {
            name: 'Gujarati',
            bmp: '\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9'
        },
        {
            name: 'Gurmukhi',
            bmp: '\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75'
        },
        {
            name: 'Han',
            bmp: '\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9',
            astral: '\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD87E[\uDC00-\uDE1D]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD873[\uDC00-\uDEA1]'
        },
        {
            name: 'Hangul',
            bmp: '\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC'
        },
        {
            name: 'Hanunoo',
            bmp: '\u1720-\u1734'
        },
        {
            name: 'Hatran',
            astral: '\uD802[\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDCFF]'
        },
        {
            name: 'Hebrew',
            bmp: '\u0591-\u05C7\u05D0-\u05EA\u05F0-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F'
        },
        {
            name: 'Hiragana',
            bmp: '\u3041-\u3096\u309D-\u309F',
            astral: '\uD82C\uDC01|\uD83C\uDE00'
        },
        {
            name: 'Imperial_Aramaic',
            astral: '\uD802[\uDC40-\uDC55\uDC57-\uDC5F]'
        },
        {
            name: 'Inherited',
            bmp: '\u0300-\u036F\u0485\u0486\u064B-\u0655\u0670\u0951\u0952\u1AB0-\u1ABE\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u200C\u200D\u20D0-\u20F0\u302A-\u302D\u3099\u309A\uFE00-\uFE0F\uFE20-\uFE2D',
            astral: '\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD]|\uD800[\uDDFD\uDEE0]|\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'Inscriptional_Pahlavi',
            astral: '\uD802[\uDF60-\uDF72\uDF78-\uDF7F]'
        },
        {
            name: 'Inscriptional_Parthian',
            astral: '\uD802[\uDF40-\uDF55\uDF58-\uDF5F]'
        },
        {
            name: 'Javanese',
            bmp: '\uA980-\uA9CD\uA9D0-\uA9D9\uA9DE\uA9DF'
        },
        {
            name: 'Kaithi',
            astral: '\uD804[\uDC80-\uDCC1]'
        },
        {
            name: 'Kannada',
            bmp: '\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2'
        },
        {
            name: 'Katakana',
            bmp: '\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D',
            astral: '\uD82C\uDC00'
        },
        {
            name: 'Kayah_Li',
            bmp: '\uA900-\uA92D\uA92F'
        },
        {
            name: 'Kharoshthi',
            astral: '\uD802[\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F-\uDE47\uDE50-\uDE58]'
        },
        {
            name: 'Khmer',
            bmp: '\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u19E0-\u19FF'
        },
        {
            name: 'Khojki',
            astral: '\uD804[\uDE00-\uDE11\uDE13-\uDE3D]'
        },
        {
            name: 'Khudawadi',
            astral: '\uD804[\uDEB0-\uDEEA\uDEF0-\uDEF9]'
        },
        {
            name: 'Lao',
            bmp: '\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF'
        },
        {
            name: 'Latin',
            bmp: 'A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A'
        },
        {
            name: 'Lepcha',
            bmp: '\u1C00-\u1C37\u1C3B-\u1C49\u1C4D-\u1C4F'
        },
        {
            name: 'Limbu',
            bmp: '\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1940\u1944-\u194F'
        },
        {
            name: 'Linear_A',
            astral: '\uD801[\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]'
        },
        {
            name: 'Linear_B',
            astral: '\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA]'
        },
        {
            name: 'Lisu',
            bmp: '\uA4D0-\uA4FF'
        },
        {
            name: 'Lycian',
            astral: '\uD800[\uDE80-\uDE9C]'
        },
        {
            name: 'Lydian',
            astral: '\uD802[\uDD20-\uDD39\uDD3F]'
        },
        {
            name: 'Mahajani',
            astral: '\uD804[\uDD50-\uDD76]'
        },
        {
            name: 'Malayalam',
            bmp: '\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D75\u0D79-\u0D7F'
        },
        {
            name: 'Mandaic',
            bmp: '\u0840-\u085B\u085E'
        },
        {
            name: 'Manichaean',
            astral: '\uD802[\uDEC0-\uDEE6\uDEEB-\uDEF6]'
        },
        {
            name: 'Meetei_Mayek',
            bmp: '\uAAE0-\uAAF6\uABC0-\uABED\uABF0-\uABF9'
        },
        {
            name: 'Mende_Kikakui',
            astral: '\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6]'
        },
        {
            name: 'Meroitic_Cursive',
            astral: '\uD802[\uDDA0-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDDFF]'
        },
        {
            name: 'Meroitic_Hieroglyphs',
            astral: '\uD802[\uDD80-\uDD9F]'
        },
        {
            name: 'Miao',
            astral: '\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]'
        },
        {
            name: 'Modi',
            astral: '\uD805[\uDE00-\uDE44\uDE50-\uDE59]'
        },
        {
            name: 'Mongolian',
            bmp: '\u1800\u1801\u1804\u1806-\u180E\u1810-\u1819\u1820-\u1877\u1880-\u18AA'
        },
        {
            name: 'Mro',
            astral: '\uD81A[\uDE40-\uDE5E\uDE60-\uDE69\uDE6E\uDE6F]'
        },
        {
            name: 'Multani',
            astral: '\uD804[\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA9]'
        },
        {
            name: 'Myanmar',
            bmp: '\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F'
        },
        {
            name: 'Nabataean',
            astral: '\uD802[\uDC80-\uDC9E\uDCA7-\uDCAF]'
        },
        {
            name: 'New_Tai_Lue',
            bmp: '\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u19DE\u19DF'
        },
        {
            name: 'Nko',
            bmp: '\u07C0-\u07FA'
        },
        {
            name: 'Ogham',
            bmp: '\u1680-\u169C'
        },
        {
            name: 'Ol_Chiki',
            bmp: '\u1C50-\u1C7F'
        },
        {
            name: 'Old_Hungarian',
            astral: '\uD803[\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDCFF]'
        },
        {
            name: 'Old_Italic',
            astral: '\uD800[\uDF00-\uDF23]'
        },
        {
            name: 'Old_North_Arabian',
            astral: '\uD802[\uDE80-\uDE9F]'
        },
        {
            name: 'Old_Permic',
            astral: '\uD800[\uDF50-\uDF7A]'
        },
        {
            name: 'Old_Persian',
            astral: '\uD800[\uDFA0-\uDFC3\uDFC8-\uDFD5]'
        },
        {
            name: 'Old_South_Arabian',
            astral: '\uD802[\uDE60-\uDE7F]'
        },
        {
            name: 'Old_Turkic',
            astral: '\uD803[\uDC00-\uDC48]'
        },
        {
            name: 'Oriya',
            bmp: '\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77'
        },
        {
            name: 'Osmanya',
            astral: '\uD801[\uDC80-\uDC9D\uDCA0-\uDCA9]'
        },
        {
            name: 'Pahawh_Hmong',
            astral: '\uD81A[\uDF00-\uDF45\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]'
        },
        {
            name: 'Palmyrene',
            astral: '\uD802[\uDC60-\uDC7F]'
        },
        {
            name: 'Pau_Cin_Hau',
            astral: '\uD806[\uDEC0-\uDEF8]'
        },
        {
            name: 'Phags_Pa',
            bmp: '\uA840-\uA877'
        },
        {
            name: 'Phoenician',
            astral: '\uD802[\uDD00-\uDD1B\uDD1F]'
        },
        {
            name: 'Psalter_Pahlavi',
            astral: '\uD802[\uDF80-\uDF91\uDF99-\uDF9C\uDFA9-\uDFAF]'
        },
        {
            name: 'Rejang',
            bmp: '\uA930-\uA953\uA95F'
        },
        {
            name: 'Runic',
            bmp: '\u16A0-\u16EA\u16EE-\u16F8'
        },
        {
            name: 'Samaritan',
            bmp: '\u0800-\u082D\u0830-\u083E'
        },
        {
            name: 'Saurashtra',
            bmp: '\uA880-\uA8C4\uA8CE-\uA8D9'
        },
        {
            name: 'Sharada',
            astral: '\uD804[\uDD80-\uDDCD\uDDD0-\uDDDF]'
        },
        {
            name: 'Shavian',
            astral: '\uD801[\uDC50-\uDC7F]'
        },
        {
            name: 'Siddham',
            astral: '\uD805[\uDD80-\uDDB5\uDDB8-\uDDDD]'
        },
        {
            name: 'SignWriting',
            astral: '\uD836[\uDC00-\uDE8B\uDE9B-\uDE9F\uDEA1-\uDEAF]'
        },
        {
            name: 'Sinhala',
            bmp: '\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4',
            astral: '\uD804[\uDDE1-\uDDF4]'
        },
        {
            name: 'Sora_Sompeng',
            astral: '\uD804[\uDCD0-\uDCE8\uDCF0-\uDCF9]'
        },
        {
            name: 'Sundanese',
            bmp: '\u1B80-\u1BBF\u1CC0-\u1CC7'
        },
        {
            name: 'Syloti_Nagri',
            bmp: '\uA800-\uA82B'
        },
        {
            name: 'Syriac',
            bmp: '\u0700-\u070D\u070F-\u074A\u074D-\u074F'
        },
        {
            name: 'Tagalog',
            bmp: '\u1700-\u170C\u170E-\u1714'
        },
        {
            name: 'Tagbanwa',
            bmp: '\u1760-\u176C\u176E-\u1770\u1772\u1773'
        },
        {
            name: 'Tai_Le',
            bmp: '\u1950-\u196D\u1970-\u1974'
        },
        {
            name: 'Tai_Tham',
            bmp: '\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD'
        },
        {
            name: 'Tai_Viet',
            bmp: '\uAA80-\uAAC2\uAADB-\uAADF'
        },
        {
            name: 'Takri',
            astral: '\uD805[\uDE80-\uDEB7\uDEC0-\uDEC9]'
        },
        {
            name: 'Tamil',
            bmp: '\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA'
        },
        {
            name: 'Telugu',
            bmp: '\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7F'
        },
        {
            name: 'Thaana',
            bmp: '\u0780-\u07B1'
        },
        {
            name: 'Thai',
            bmp: '\u0E01-\u0E3A\u0E40-\u0E5B'
        },
        {
            name: 'Tibetan',
            bmp: '\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FD4\u0FD9\u0FDA'
        },
        {
            name: 'Tifinagh',
            bmp: '\u2D30-\u2D67\u2D6F\u2D70\u2D7F'
        },
        {
            name: 'Tirhuta',
            astral: '\uD805[\uDC80-\uDCC7\uDCD0-\uDCD9]'
        },
        {
            name: 'Ugaritic',
            astral: '\uD800[\uDF80-\uDF9D\uDF9F]'
        },
        {
            name: 'Vai',
            bmp: '\uA500-\uA62B'
        },
        {
            name: 'Warang_Citi',
            astral: '\uD806[\uDCA0-\uDCF2\uDCFF]'
        },
        {
            name: 'Yi',
            bmp: '\uA000-\uA48C\uA490-\uA4C6'
        }
    ]);

};

},{}],163:[function(require,module,exports){
var XRegExp = require('./xregexp');

require('./addons/build')(XRegExp);
require('./addons/matchrecursive')(XRegExp);
require('./addons/unicode-base')(XRegExp);
require('./addons/unicode-blocks')(XRegExp);
require('./addons/unicode-categories')(XRegExp);
require('./addons/unicode-properties')(XRegExp);
require('./addons/unicode-scripts')(XRegExp);

module.exports = XRegExp;

},{"./addons/build":156,"./addons/matchrecursive":157,"./addons/unicode-base":158,"./addons/unicode-blocks":159,"./addons/unicode-categories":160,"./addons/unicode-properties":161,"./addons/unicode-scripts":162,"./xregexp":164}],164:[function(require,module,exports){
/*!
 * XRegExp 3.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2007-2016 MIT License
 */

'use strict';

/**
 * XRegExp provides augmented, extensible regular expressions. You get additional regex syntax and
 * flags, beyond what browsers support natively. XRegExp is also a regex utility belt with tools to
 * make your client-side grepping simpler and more powerful, while freeing you from related
 * cross-browser inconsistencies.
 */

// ==--------------------------==
// Private stuff
// ==--------------------------==

// Property name used for extended regex instance data
var REGEX_DATA = 'xregexp';
// Optional features that can be installed and uninstalled
var features = {
    astral: false,
    natives: false
};
// Native methods to use and restore ('native' is an ES3 reserved keyword)
var nativ = {
    exec: RegExp.prototype.exec,
    test: RegExp.prototype.test,
    match: String.prototype.match,
    replace: String.prototype.replace,
    split: String.prototype.split
};
// Storage for fixed/extended native methods
var fixed = {};
// Storage for regexes cached by `XRegExp.cache`
var regexCache = {};
// Storage for pattern details cached by the `XRegExp` constructor
var patternCache = {};
// Storage for regex syntax tokens added internally or by `XRegExp.addToken`
var tokens = [];
// Token scopes
var defaultScope = 'default';
var classScope = 'class';
// Regexes that match native regex syntax, including octals
var nativeTokens = {
    // Any native multicharacter token in default scope, or any single character
    'default': /\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|\(\?(?:[:=!]|<[=!])|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,
    // Any native multicharacter token in character class scope, or any single character
    'class': /\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|[\s\S]/
};
// Any backreference or dollar-prefixed character in replacement strings
var replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g;
// Check for correct `exec` handling of nonparticipating capturing groups
var correctExecNpcg = nativ.exec.call(/()??/, '')[1] === undefined;
// Check for ES6 `flags` prop support
var hasFlagsProp = /x/.flags !== undefined;
// Shortcut to `Object.prototype.toString`
var toString = {}.toString;

function hasNativeFlag(flag) {
    // Can't check based on the presense of properties/getters since browsers might support such
    // properties even when they don't support the corresponding flag in regex construction (tested
    // in Chrome 48, where `'unicode' in /x/` is true but trying to construct a regex with flag `u`
    // throws an error)
    var isSupported = true;
    try {
        // Can't use regex literals for testing even in a `try` because regex literals with
        // unsupported flags cause a compilation error in IE
        new RegExp('', flag);
    } catch (exception) {
        isSupported = false;
    }
    if (isSupported && flag === 'y') {
        // Work around Safari 9.1.1 bug
        return new RegExp('aa|.', 'y').test('b');
    }
    return isSupported;
}
// Check for ES6 `u` flag support
var hasNativeU = hasNativeFlag('u');
// Check for ES6 `y` flag support
var hasNativeY = hasNativeFlag('y');
// Tracker for known flags, including addon flags
var registeredFlags = {
    g: true,
    i: true,
    m: true,
    u: hasNativeU,
    y: hasNativeY
};

/**
 * Attaches extended data and `XRegExp.prototype` properties to a regex object.
 *
 * @param {RegExp} regex Regex to augment.
 * @param {Array} captureNames Array with capture names, or `null`.
 * @param {String} xSource XRegExp pattern used to generate `regex`, or `null` if N/A.
 * @param {String} xFlags XRegExp flags used to generate `regex`, or `null` if N/A.
 * @param {Boolean} [isInternalOnly=false] Whether the regex will be used only for internal
 *   operations, and never exposed to users. For internal-only regexes, we can improve perf by
 *   skipping some operations like attaching `XRegExp.prototype` properties.
 * @returns {RegExp} Augmented regex.
 */
function augment(regex, captureNames, xSource, xFlags, isInternalOnly) {
    var p;

    regex[REGEX_DATA] = {
        captureNames: captureNames
    };

    if (isInternalOnly) {
        return regex;
    }

    // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value
    if (regex.__proto__) {
        regex.__proto__ = XRegExp.prototype;
    } else {
        for (p in XRegExp.prototype) {
            // An `XRegExp.prototype.hasOwnProperty(p)` check wouldn't be worth it here, since this
            // is performance sensitive, and enumerable `Object.prototype` or `RegExp.prototype`
            // extensions exist on `regex.prototype` anyway
            regex[p] = XRegExp.prototype[p];
        }
    }

    regex[REGEX_DATA].source = xSource;
    // Emulate the ES6 `flags` prop by ensuring flags are in alphabetical order
    regex[REGEX_DATA].flags = xFlags ? xFlags.split('').sort().join('') : xFlags;

    return regex;
}

/**
 * Removes any duplicate characters from the provided string.
 *
 * @param {String} str String to remove duplicate characters from.
 * @returns {String} String with any duplicate characters removed.
 */
function clipDuplicates(str) {
    return nativ.replace.call(str, /([\s\S])(?=[\s\S]*\1)/g, '');
}

/**
 * Copies a regex object while preserving extended data and augmenting with `XRegExp.prototype`
 * properties. The copy has a fresh `lastIndex` property (set to zero). Allows adding and removing
 * flags g and y while copying the regex.
 *
 * @param {RegExp} regex Regex to copy.
 * @param {Object} [options] Options object with optional properties:
 *   <li>`addG` {Boolean} Add flag g while copying the regex.
 *   <li>`addY` {Boolean} Add flag y while copying the regex.
 *   <li>`removeG` {Boolean} Remove flag g while copying the regex.
 *   <li>`removeY` {Boolean} Remove flag y while copying the regex.
 *   <li>`isInternalOnly` {Boolean} Whether the copied regex will be used only for internal
 *     operations, and never exposed to users. For internal-only regexes, we can improve perf by
 *     skipping some operations like attaching `XRegExp.prototype` properties.
 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
 */
function copyRegex(regex, options) {
    if (!XRegExp.isRegExp(regex)) {
        throw new TypeError('Type RegExp expected');
    }

    var xData = regex[REGEX_DATA] || {},
        flags = getNativeFlags(regex),
        flagsToAdd = '',
        flagsToRemove = '',
        xregexpSource = null,
        xregexpFlags = null;

    options = options || {};

    if (options.removeG) {flagsToRemove += 'g';}
    if (options.removeY) {flagsToRemove += 'y';}
    if (flagsToRemove) {
        flags = nativ.replace.call(flags, new RegExp('[' + flagsToRemove + ']+', 'g'), '');
    }

    if (options.addG) {flagsToAdd += 'g';}
    if (options.addY) {flagsToAdd += 'y';}
    if (flagsToAdd) {
        flags = clipDuplicates(flags + flagsToAdd);
    }

    if (!options.isInternalOnly) {
        if (xData.source !== undefined) {
            xregexpSource = xData.source;
        }
        // null or undefined; don't want to add to `flags` if the previous value was null, since
        // that indicates we're not tracking original precompilation flags
        if (xData.flags != null) {
            // Flags are only added for non-internal regexes by `XRegExp.globalize`. Flags are never
            // removed for non-internal regexes, so don't need to handle it
            xregexpFlags = flagsToAdd ? clipDuplicates(xData.flags + flagsToAdd) : xData.flags;
        }
    }

    // Augment with `XRegExp.prototype` properties, but use the native `RegExp` constructor to avoid
    // searching for special tokens. That would be wrong for regexes constructed by `RegExp`, and
    // unnecessary for regexes constructed by `XRegExp` because the regex has already undergone the
    // translation to native regex syntax
    regex = augment(
        new RegExp(regex.source, flags),
        hasNamedCapture(regex) ? xData.captureNames.slice(0) : null,
        xregexpSource,
        xregexpFlags,
        options.isInternalOnly
    );

    return regex;
}

/**
 * Converts hexadecimal to decimal.
 *
 * @param {String} hex
 * @returns {Number}
 */
function dec(hex) {
    return parseInt(hex, 16);
}

/**
 * Returns native `RegExp` flags used by a regex object.
 *
 * @param {RegExp} regex Regex to check.
 * @returns {String} Native flags in use.
 */
function getNativeFlags(regex) {
    return hasFlagsProp ?
        regex.flags :
        // Explicitly using `RegExp.prototype.toString` (rather than e.g. `String` or concatenation
        // with an empty string) allows this to continue working predictably when
        // `XRegExp.proptotype.toString` is overriden
        nativ.exec.call(/\/([a-z]*)$/i, RegExp.prototype.toString.call(regex))[1];
}

/**
 * Determines whether a regex has extended instance data used to track capture names.
 *
 * @param {RegExp} regex Regex to check.
 * @returns {Boolean} Whether the regex uses named capture.
 */
function hasNamedCapture(regex) {
    return !!(regex[REGEX_DATA] && regex[REGEX_DATA].captureNames);
}

/**
 * Converts decimal to hexadecimal.
 *
 * @param {Number|String} dec
 * @returns {String}
 */
function hex(dec) {
    return parseInt(dec, 10).toString(16);
}

/**
 * Returns the first index at which a given value can be found in an array.
 *
 * @param {Array} array Array to search.
 * @param {*} value Value to locate in the array.
 * @returns {Number} Zero-based index at which the item is found, or -1.
 */
function indexOf(array, value) {
    var len = array.length, i;

    for (i = 0; i < len; ++i) {
        if (array[i] === value) {
            return i;
        }
    }

    return -1;
}

/**
 * Determines whether a value is of the specified type, by resolving its internal [[Class]].
 *
 * @param {*} value Object to check.
 * @param {String} type Type to check for, in TitleCase.
 * @returns {Boolean} Whether the object matches the type.
 */
function isType(value, type) {
    return toString.call(value) === '[object ' + type + ']';
}

/**
 * Checks whether the next nonignorable token after the specified position is a quantifier.
 *
 * @param {String} pattern Pattern to search within.
 * @param {Number} pos Index in `pattern` to search at.
 * @param {String} flags Flags used by the pattern.
 * @returns {Boolean} Whether the next token is a quantifier.
 */
function isQuantifierNext(pattern, pos, flags) {
    return nativ.test.call(
        flags.indexOf('x') > -1 ?
            // Ignore any leading whitespace, line comments, and inline comments
            /^(?:\s|#[^#\n]*|\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/ :
            // Ignore any leading inline comments
            /^(?:\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/,
        pattern.slice(pos)
    );
}

/**
 * Adds leading zeros if shorter than four characters. Used for fixed-length hexadecimal values.
 *
 * @param {String} str
 * @returns {String}
 */
function pad4(str) {
    while (str.length < 4) {
        str = '0' + str;
    }
    return str;
}

/**
 * Checks for flag-related errors, and strips/applies flags in a leading mode modifier. Offloads
 * the flag preparation logic from the `XRegExp` constructor.
 *
 * @param {String} pattern Regex pattern, possibly with a leading mode modifier.
 * @param {String} flags Any combination of flags.
 * @returns {Object} Object with properties `pattern` and `flags`.
 */
function prepareFlags(pattern, flags) {
    var i;

    // Recent browsers throw on duplicate flags, so copy this behavior for nonnative flags
    if (clipDuplicates(flags) !== flags) {
        throw new SyntaxError('Invalid duplicate regex flag ' + flags);
    }

    // Strip and apply a leading mode modifier with any combination of flags except g or y
    pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function($0, $1) {
        if (nativ.test.call(/[gy]/, $1)) {
            throw new SyntaxError('Cannot use flag g or y in mode modifier ' + $0);
        }
        // Allow duplicate flags within the mode modifier
        flags = clipDuplicates(flags + $1);
        return '';
    });

    // Throw on unknown native or nonnative flags
    for (i = 0; i < flags.length; ++i) {
        if (!registeredFlags[flags.charAt(i)]) {
            throw new SyntaxError('Unknown regex flag ' + flags.charAt(i));
        }
    }

    return {
        pattern: pattern,
        flags: flags
    };
}

/**
 * Prepares an options object from the given value.
 *
 * @param {String|Object} value Value to convert to an options object.
 * @returns {Object} Options object.
 */
function prepareOptions(value) {
    var options = {};

    if (isType(value, 'String')) {
        XRegExp.forEach(value, /[^\s,]+/, function(match) {
            options[match] = true;
        });

        return options;
    }

    return value;
}

/**
 * Registers a flag so it doesn't throw an 'unknown flag' error.
 *
 * @param {String} flag Single-character flag to register.
 */
function registerFlag(flag) {
    if (!/^[\w$]$/.test(flag)) {
        throw new Error('Flag must be a single character A-Za-z0-9_$');
    }

    registeredFlags[flag] = true;
}

/**
 * Runs built-in and custom regex syntax tokens in reverse insertion order at the specified
 * position, until a match is found.
 *
 * @param {String} pattern Original pattern from which an XRegExp object is being built.
 * @param {String} flags Flags being used to construct the regex.
 * @param {Number} pos Position to search for tokens within `pattern`.
 * @param {Number} scope Regex scope to apply: 'default' or 'class'.
 * @param {Object} context Context object to use for token handler functions.
 * @returns {Object} Object with properties `matchLength`, `output`, and `reparse`; or `null`.
 */
function runTokens(pattern, flags, pos, scope, context) {
    var i = tokens.length,
        leadChar = pattern.charAt(pos),
        result = null,
        match,
        t;

    // Run in reverse insertion order
    while (i--) {
        t = tokens[i];
        if (
            (t.leadChar && t.leadChar !== leadChar) ||
            (t.scope !== scope && t.scope !== 'all') ||
            (t.flag && flags.indexOf(t.flag) === -1)
        ) {
            continue;
        }

        match = XRegExp.exec(pattern, t.regex, pos, 'sticky');
        if (match) {
            result = {
                matchLength: match[0].length,
                output: t.handler.call(context, match, scope, flags),
                reparse: t.reparse
            };
            // Finished with token tests
            break;
        }
    }

    return result;
}

/**
 * Enables or disables implicit astral mode opt-in. When enabled, flag A is automatically added to
 * all new regexes created by XRegExp. This causes an error to be thrown when creating regexes if
 * the Unicode Base addon is not available, since flag A is registered by that addon.
 *
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
function setAstral(on) {
    features.astral = on;
}

/**
 * Enables or disables native method overrides.
 *
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
function setNatives(on) {
    RegExp.prototype.exec = (on ? fixed : nativ).exec;
    RegExp.prototype.test = (on ? fixed : nativ).test;
    String.prototype.match = (on ? fixed : nativ).match;
    String.prototype.replace = (on ? fixed : nativ).replace;
    String.prototype.split = (on ? fixed : nativ).split;

    features.natives = on;
}

/**
 * Returns the object, or throws an error if it is `null` or `undefined`. This is used to follow
 * the ES5 abstract operation `ToObject`.
 *
 * @param {*} value Object to check and return.
 * @returns {*} The provided object.
 */
function toObject(value) {
    // null or undefined
    if (value == null) {
        throw new TypeError('Cannot convert null or undefined to object');
    }

    return value;
}

// ==--------------------------==
// Constructor
// ==--------------------------==

/**
 * Creates an extended regular expression object for matching text with a pattern. Differs from a
 * native regular expression in that additional syntax and flags are supported. The returned object
 * is in fact a native `RegExp` and works with all native methods.
 *
 * @class XRegExp
 * @constructor
 * @param {String|RegExp} pattern Regex pattern string, or an existing regex object to copy.
 * @param {String} [flags] Any combination of flags.
 *   Native flags:
 *     <li>`g` - global
 *     <li>`i` - ignore case
 *     <li>`m` - multiline anchors
 *     <li>`u` - unicode (ES6)
 *     <li>`y` - sticky (Firefox 3+, ES6)
 *   Additional XRegExp flags:
 *     <li>`n` - explicit capture
 *     <li>`s` - dot matches all (aka singleline)
 *     <li>`x` - free-spacing and line comments (aka extended)
 *     <li>`A` - astral (requires the Unicode Base addon)
 *   Flags cannot be provided when constructing one `RegExp` from another.
 * @returns {RegExp} Extended regular expression object.
 * @example
 *
 * // With named capture and flag x
 * XRegExp('(?<year>  [0-9]{4} ) -?  # year  \n\
 *          (?<month> [0-9]{2} ) -?  # month \n\
 *          (?<day>   [0-9]{2} )     # day   ', 'x');
 *
 * // Providing a regex object copies it. Native regexes are recompiled using native (not XRegExp)
 * // syntax. Copies maintain extended data, are augmented with `XRegExp.prototype` properties, and
 * // have fresh `lastIndex` properties (set to zero).
 * XRegExp(/regex/);
 */
function XRegExp(pattern, flags) {
    if (XRegExp.isRegExp(pattern)) {
        if (flags !== undefined) {
            throw new TypeError('Cannot supply flags when copying a RegExp');
        }
        return copyRegex(pattern);
    }

    // Copy the argument behavior of `RegExp`
    pattern = pattern === undefined ? '' : String(pattern);
    flags = flags === undefined ? '' : String(flags);

    if (XRegExp.isInstalled('astral') && flags.indexOf('A') === -1) {
        // This causes an error to be thrown if the Unicode Base addon is not available
        flags += 'A';
    }

    if (!patternCache[pattern]) {
        patternCache[pattern] = {};
    }

    if (!patternCache[pattern][flags]) {
        var context = {
            hasNamedCapture: false,
            captureNames: []
        };
        var scope = defaultScope;
        var output = '';
        var pos = 0;
        var result;

        // Check for flag-related errors, and strip/apply flags in a leading mode modifier
        var applied = prepareFlags(pattern, flags);
        var appliedPattern = applied.pattern;
        var appliedFlags = applied.flags;

        // Use XRegExp's tokens to translate the pattern to a native regex pattern.
        // `appliedPattern.length` may change on each iteration if tokens use `reparse`
        while (pos < appliedPattern.length) {
            do {
                // Check for custom tokens at the current position
                result = runTokens(appliedPattern, appliedFlags, pos, scope, context);
                // If the matched token used the `reparse` option, splice its output into the
                // pattern before running tokens again at the same position
                if (result && result.reparse) {
                    appliedPattern = appliedPattern.slice(0, pos) +
                        result.output +
                        appliedPattern.slice(pos + result.matchLength);
                }
            } while (result && result.reparse);

            if (result) {
                output += result.output;
                pos += (result.matchLength || 1);
            } else {
                // Get the native token at the current position
                var token = XRegExp.exec(appliedPattern, nativeTokens[scope], pos, 'sticky')[0];
                output += token;
                pos += token.length;
                if (token === '[' && scope === defaultScope) {
                    scope = classScope;
                } else if (token === ']' && scope === classScope) {
                    scope = defaultScope;
                }
            }
        }

        patternCache[pattern][flags] = {
            // Use basic cleanup to collapse repeated empty groups like `(?:)(?:)` to `(?:)`. Empty
            // groups are sometimes inserted during regex transpilation in order to keep tokens
            // separated. However, more than one empty group in a row is never needed.
            pattern: nativ.replace.call(output, /(?:\(\?:\))+/g, '(?:)'),
            // Strip all but native flags
            flags: nativ.replace.call(appliedFlags, /[^gimuy]+/g, ''),
            // `context.captureNames` has an item for each capturing group, even if unnamed
            captures: context.hasNamedCapture ? context.captureNames : null
        };
    }

    var generated = patternCache[pattern][flags];
    return augment(
        new RegExp(generated.pattern, generated.flags),
        generated.captures,
        pattern,
        flags
    );
}

// Add `RegExp.prototype` to the prototype chain
XRegExp.prototype = new RegExp();

// ==--------------------------==
// Public properties
// ==--------------------------==

/**
 * The XRegExp version number as a string containing three dot-separated parts. For example,
 * '2.0.0-beta-3'.
 *
 * @static
 * @type String
 */
XRegExp.version = '3.1.1';

// ==--------------------------==
// Public methods
// ==--------------------------==

// Intentionally undocumented; used in tests and addons
XRegExp._hasNativeFlag = hasNativeFlag;
XRegExp._dec = dec;
XRegExp._hex = hex;
XRegExp._pad4 = pad4;

/**
 * Extends XRegExp syntax and allows custom flags. This is used internally and can be used to
 * create XRegExp addons. If more than one token can match the same string, the last added wins.
 *
 * @param {RegExp} regex Regex object that matches the new token.
 * @param {Function} handler Function that returns a new pattern string (using native regex syntax)
 *   to replace the matched token within all future XRegExp regexes. Has access to persistent
 *   properties of the regex being built, through `this`. Invoked with three arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The regex scope where the match was found: 'default' or 'class'.
 *   <li>The flags used by the regex, including any flags in a leading mode modifier.
 *   The handler function becomes part of the XRegExp construction process, so be careful not to
 *   construct XRegExps within the function or you will trigger infinite recursion.
 * @param {Object} [options] Options object with optional properties:
 *   <li>`scope` {String} Scope where the token applies: 'default', 'class', or 'all'.
 *   <li>`flag` {String} Single-character flag that triggers the token. This also registers the
 *     flag, which prevents XRegExp from throwing an 'unknown flag' error when the flag is used.
 *   <li>`optionalFlags` {String} Any custom flags checked for within the token `handler` that are
 *     not required to trigger the token. This registers the flags, to prevent XRegExp from
 *     throwing an 'unknown flag' error when any of the flags are used.
 *   <li>`reparse` {Boolean} Whether the `handler` function's output should not be treated as
 *     final, and instead be reparseable by other tokens (including the current token). Allows
 *     token chaining or deferring.
 *   <li>`leadChar` {String} Single character that occurs at the beginning of any successful match
 *     of the token (not always applicable). This doesn't change the behavior of the token unless
 *     you provide an erroneous value. However, providing it can increase the token's performance
 *     since the token can be skipped at any positions where this character doesn't appear.
 * @example
 *
 * // Basic usage: Add \a for the ALERT control code
 * XRegExp.addToken(
 *   /\\a/,
 *   function() {return '\\x07';},
 *   {scope: 'all'}
 * );
 * XRegExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
 *
 * // Add the U (ungreedy) flag from PCRE and RE2, which reverses greedy and lazy quantifiers.
 * // Since `scope` is not specified, it uses 'default' (i.e., transformations apply outside of
 * // character classes only)
 * XRegExp.addToken(
 *   /([?*+]|{\d+(?:,\d*)?})(\??)/,
 *   function(match) {return match[1] + (match[2] ? '' : '?');},
 *   {flag: 'U'}
 * );
 * XRegExp('a+', 'U').exec('aaa')[0]; // -> 'a'
 * XRegExp('a+?', 'U').exec('aaa')[0]; // -> 'aaa'
 */
XRegExp.addToken = function(regex, handler, options) {
    options = options || {};
    var optionalFlags = options.optionalFlags, i;

    if (options.flag) {
        registerFlag(options.flag);
    }

    if (optionalFlags) {
        optionalFlags = nativ.split.call(optionalFlags, '');
        for (i = 0; i < optionalFlags.length; ++i) {
            registerFlag(optionalFlags[i]);
        }
    }

    // Add to the private list of syntax tokens
    tokens.push({
        regex: copyRegex(regex, {
            addG: true,
            addY: hasNativeY,
            isInternalOnly: true
        }),
        handler: handler,
        scope: options.scope || defaultScope,
        flag: options.flag,
        reparse: options.reparse,
        leadChar: options.leadChar
    });

    // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and flags
    // might now produce different results
    XRegExp.cache.flush('patterns');
};

/**
 * Caches and returns the result of calling `XRegExp(pattern, flags)`. On any subsequent call with
 * the same pattern and flag combination, the cached copy of the regex is returned.
 *
 * @param {String} pattern Regex pattern string.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Cached XRegExp object.
 * @example
 *
 * while (match = XRegExp.cache('.', 'gs').exec(str)) {
 *   // The regex is compiled once only
 * }
 */
XRegExp.cache = function(pattern, flags) {
    if (!regexCache[pattern]) {
        regexCache[pattern] = {};
    }
    return regexCache[pattern][flags] || (
        regexCache[pattern][flags] = XRegExp(pattern, flags)
    );
};

// Intentionally undocumented; used in tests
XRegExp.cache.flush = function(cacheName) {
    if (cacheName === 'patterns') {
        // Flush the pattern cache used by the `XRegExp` constructor
        patternCache = {};
    } else {
        // Flush the regex cache populated by `XRegExp.cache`
        regexCache = {};
    }
};

/**
 * Escapes any regular expression metacharacters, for use when matching literal strings. The result
 * can safely be used at any point within a regex that uses any flags.
 *
 * @param {String} str String to escape.
 * @returns {String} String with regex metacharacters escaped.
 * @example
 *
 * XRegExp.escape('Escaped? <.>');
 * // -> 'Escaped\?\ <\.>'
 */
XRegExp.escape = function(str) {
    return nativ.replace.call(toObject(str), /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
 * regex uses named capture, named backreference properties are included on the match array.
 * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
 * must start at the specified position only. The `lastIndex` property of the provided regex is not
 * used, but is updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.exec` and can be used reliably cross-browser.
 *
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Array} Match array with named backreference properties, or `null`.
 * @example
 *
 * // Basic use, with named backreference
 * var match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
 * match.hex; // -> '2620'
 *
 * // With pos and sticky, in a loop
 * var pos = 2, result = [], match;
 * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
 *   result.push(match[1]);
 *   pos = match.index + match[0].length;
 * }
 * // result -> ['2', '3', '4']
 */
XRegExp.exec = function(str, regex, pos, sticky) {
    var cacheKey = 'g',
        addY = false,
        match,
        r2;

    addY = hasNativeY && !!(sticky || (regex.sticky && sticky !== false));
    if (addY) {
        cacheKey += 'y';
    }

    regex[REGEX_DATA] = regex[REGEX_DATA] || {};

    // Shares cached copies with `XRegExp.match`/`replace`
    r2 = regex[REGEX_DATA][cacheKey] || (
        regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
            addG: true,
            addY: addY,
            removeY: sticky === false,
            isInternalOnly: true
        })
    );

    r2.lastIndex = pos = pos || 0;

    // Fixed `exec` required for `lastIndex` fix, named backreferences, etc.
    match = fixed.exec.call(r2, str);

    if (sticky && match && match.index !== pos) {
        match = null;
    }

    if (regex.global) {
        regex.lastIndex = match ? r2.lastIndex : 0;
    }

    return match;
};

/**
 * Executes a provided function once per regex match. Searches always start at the beginning of the
 * string and continue until the end, regardless of the state of the regex's `global` property and
 * initial `lastIndex`.
 *
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Function} callback Function to execute for each match. Invoked with four arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The zero-based match index.
 *   <li>The string being traversed.
 *   <li>The regex object being used to traverse the string.
 * @example
 *
 * // Extracts every other digit from a string
 * var evens = [];
 * XRegExp.forEach('1a2345', /\d/, function(match, i) {
 *   if (i % 2) evens.push(+match[0]);
 * });
 * // evens -> [2, 4]
 */
XRegExp.forEach = function(str, regex, callback) {
    var pos = 0,
        i = -1,
        match;

    while ((match = XRegExp.exec(str, regex, pos))) {
        // Because `regex` is provided to `callback`, the function could use the deprecated/
        // nonstandard `RegExp.prototype.compile` to mutate the regex. However, since `XRegExp.exec`
        // doesn't use `lastIndex` to set the search position, this can't lead to an infinite loop,
        // at least. Actually, because of the way `XRegExp.exec` caches globalized versions of
        // regexes, mutating the regex will not have any effect on the iteration or matched strings,
        // which is a nice side effect that brings extra safety.
        callback(match, ++i, str, regex);

        pos = match.index + (match[0].length || 1);
    }
};

/**
 * Copies a regex object and adds flag `g`. The copy maintains extended data, is augmented with
 * `XRegExp.prototype` properties, and has a fresh `lastIndex` property (set to zero). Native
 * regexes are not recompiled using XRegExp syntax.
 *
 * @param {RegExp} regex Regex to globalize.
 * @returns {RegExp} Copy of the provided regex with flag `g` added.
 * @example
 *
 * var globalCopy = XRegExp.globalize(/regex/);
 * globalCopy.global; // -> true
 */
XRegExp.globalize = function(regex) {
    return copyRegex(regex, {addG: true});
};

/**
 * Installs optional features according to the specified options. Can be undone using
 * `XRegExp.uninstall`.
 *
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.install({
 *   // Enables support for astral code points in Unicode addons (implicitly sets flag A)
 *   astral: true,
 *
 *   // DEPRECATED: Overrides native regex methods with fixed/extended versions
 *   natives: true
 * });
 *
 * // With an options string
 * XRegExp.install('astral natives');
 */
XRegExp.install = function(options) {
    options = prepareOptions(options);

    if (!features.astral && options.astral) {
        setAstral(true);
    }

    if (!features.natives && options.natives) {
        setNatives(true);
    }
};

/**
 * Checks whether an individual optional feature is installed.
 *
 * @param {String} feature Name of the feature to check. One of:
 *   <li>`astral`
 *   <li>`natives`
 * @returns {Boolean} Whether the feature is installed.
 * @example
 *
 * XRegExp.isInstalled('astral');
 */
XRegExp.isInstalled = function(feature) {
    return !!(features[feature]);
};

/**
 * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
 * created in another frame, when `instanceof` and `constructor` checks would fail.
 *
 * @param {*} value Object to check.
 * @returns {Boolean} Whether the object is a `RegExp` object.
 * @example
 *
 * XRegExp.isRegExp('string'); // -> false
 * XRegExp.isRegExp(/regex/i); // -> true
 * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
 * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
 */
XRegExp.isRegExp = function(value) {
    return toString.call(value) === '[object RegExp]';
    //return isType(value, 'RegExp');
};

/**
 * Returns the first matched string, or in global mode, an array containing all matched strings.
 * This is essentially a more convenient re-implementation of `String.prototype.match` that gives
 * the result types you actually want (string instead of `exec`-style array in match-first mode,
 * and an empty array instead of `null` when no matches are found in match-all mode). It also lets
 * you override flag g and ignore `lastIndex`, and fixes browser bugs.
 *
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {String} [scope='one'] Use 'one' to return the first match as a string. Use 'all' to
 *   return an array of all matched strings. If not explicitly specified and `regex` uses flag g,
 *   `scope` is 'all'.
 * @returns {String|Array} In match-first mode: First match as a string, or `null`. In match-all
 *   mode: Array of all matched strings, or an empty array.
 * @example
 *
 * // Match first
 * XRegExp.match('abc', /\w/); // -> 'a'
 * XRegExp.match('abc', /\w/g, 'one'); // -> 'a'
 * XRegExp.match('abc', /x/g, 'one'); // -> null
 *
 * // Match all
 * XRegExp.match('abc', /\w/g); // -> ['a', 'b', 'c']
 * XRegExp.match('abc', /\w/, 'all'); // -> ['a', 'b', 'c']
 * XRegExp.match('abc', /x/, 'all'); // -> []
 */
XRegExp.match = function(str, regex, scope) {
    var global = (regex.global && scope !== 'one') || scope === 'all',
        cacheKey = ((global ? 'g' : '') + (regex.sticky ? 'y' : '')) || 'noGY',
        result,
        r2;

    regex[REGEX_DATA] = regex[REGEX_DATA] || {};

    // Shares cached copies with `XRegExp.exec`/`replace`
    r2 = regex[REGEX_DATA][cacheKey] || (
        regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
            addG: !!global,
            removeG: scope === 'one',
            isInternalOnly: true
        })
    );

    result = nativ.match.call(toObject(str), r2);

    if (regex.global) {
        regex.lastIndex = (
            (scope === 'one' && result) ?
                // Can't use `r2.lastIndex` since `r2` is nonglobal in this case
                (result.index + result[0].length) : 0
        );
    }

    return global ? (result || []) : (result && result[0]);
};

/**
 * Retrieves the matches from searching a string using a chain of regexes that successively search
 * within previous matches. The provided `chain` array can contain regexes and or objects with
 * `regex` and `backref` properties. When a backreference is specified, the named or numbered
 * backreference is passed forward to the next regex or returned.
 *
 * @param {String} str String to search.
 * @param {Array} chain Regexes that each search for matches within preceding results.
 * @returns {Array} Matches by the last regex in the chain, or an empty array.
 * @example
 *
 * // Basic usage; matches numbers within <b> tags
 * XRegExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
 *   XRegExp('(?is)<b>.*?</b>'),
 *   /\d+/
 * ]);
 * // -> ['2', '4', '56']
 *
 * // Passing forward and returning specific backreferences
 * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
 *         <a href="http://www.google.com/">Google</a>';
 * XRegExp.matchChain(html, [
 *   {regex: /<a href="([^"]+)">/i, backref: 1},
 *   {regex: XRegExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
 * ]);
 * // -> ['xregexp.com', 'www.google.com']
 */
XRegExp.matchChain = function(str, chain) {
    return (function recurseChain(values, level) {
        var item = chain[level].regex ? chain[level] : {regex: chain[level]};
        var matches = [];

        function addMatch(match) {
            if (item.backref) {
                // Safari 4.0.5 (but not 5.0.5+) inappropriately uses sparse arrays to hold the
                // `undefined`s for backreferences to nonparticipating capturing groups. In such
                // cases, a `hasOwnProperty` or `in` check on its own would inappropriately throw
                // the exception, so also check if the backreference is a number that is within the
                // bounds of the array.
                if (!(match.hasOwnProperty(item.backref) || +item.backref < match.length)) {
                    throw new ReferenceError('Backreference to undefined group: ' + item.backref);
                }

                matches.push(match[item.backref] || '');
            } else {
                matches.push(match[0]);
            }
        }

        for (var i = 0; i < values.length; ++i) {
            XRegExp.forEach(values[i], item.regex, addMatch);
        }

        return ((level === chain.length - 1) || !matches.length) ?
            matches :
            recurseChain(matches, level + 1);
    }([str], 0));
};

/**
 * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
 * or regex, and the replacement can be a string or a function to be called for each match. To
 * perform a global search and replace, use the optional `scope` argument or include flag g if using
 * a regex. Replacement strings can use `${n}` for named and numbered backreferences. Replacement
 * functions can use named backreferences via `arguments[0].name`. Also fixes browser bugs compared
 * to the native `String.prototype.replace` and can be used reliably cross-browser.
 *
 * @param {String} str String to search.
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 *   Replacement strings can include special replacement syntax:
 *     <li>$$ - Inserts a literal $ character.
 *     <li>$&, $0 - Inserts the matched substring.
 *     <li>$` - Inserts the string that precedes the matched substring (left context).
 *     <li>$' - Inserts the string that follows the matched substring (right context).
 *     <li>$n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
 *       backreference n/nn.
 *     <li>${n} - Where n is a name or any number of digits that reference an existent capturing
 *       group, inserts backreference n.
 *   Replacement functions are invoked with three or more arguments:
 *     <li>The matched substring (corresponds to $& above). Named backreferences are accessible as
 *       properties of this first argument.
 *     <li>0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
 *     <li>The zero-based index of the match within the total search string.
 *     <li>The total string being searched.
 * @param {String} [scope='one'] Use 'one' to replace the first match only, or 'all'. If not
 *   explicitly specified and using a regex with flag g, `scope` is 'all'.
 * @returns {String} New string with one or all matches replaced.
 * @example
 *
 * // Regex search, using named backreferences in replacement string
 * var name = XRegExp('(?<first>\\w+) (?<last>\\w+)');
 * XRegExp.replace('John Smith', name, '${last}, ${first}');
 * // -> 'Smith, John'
 *
 * // Regex search, using named backreferences in replacement function
 * XRegExp.replace('John Smith', name, function(match) {
 *   return match.last + ', ' + match.first;
 * });
 * // -> 'Smith, John'
 *
 * // String search, with replace-all
 * XRegExp.replace('RegExp builds RegExps', 'RegExp', 'XRegExp', 'all');
 * // -> 'XRegExp builds XRegExps'
 */
XRegExp.replace = function(str, search, replacement, scope) {
    var isRegex = XRegExp.isRegExp(search),
        global = (search.global && scope !== 'one') || scope === 'all',
        cacheKey = ((global ? 'g' : '') + (search.sticky ? 'y' : '')) || 'noGY',
        s2 = search,
        result;

    if (isRegex) {
        search[REGEX_DATA] = search[REGEX_DATA] || {};

        // Shares cached copies with `XRegExp.exec`/`match`. Since a copy is used, `search`'s
        // `lastIndex` isn't updated *during* replacement iterations
        s2 = search[REGEX_DATA][cacheKey] || (
            search[REGEX_DATA][cacheKey] = copyRegex(search, {
                addG: !!global,
                removeG: scope === 'one',
                isInternalOnly: true
            })
        );
    } else if (global) {
        s2 = new RegExp(XRegExp.escape(String(search)), 'g');
    }

    // Fixed `replace` required for named backreferences, etc.
    result = fixed.replace.call(toObject(str), s2, replacement);

    if (isRegex && search.global) {
        // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
        search.lastIndex = 0;
    }

    return result;
};

/**
 * Performs batch processing of string replacements. Used like `XRegExp.replace`, but accepts an
 * array of replacement details. Later replacements operate on the output of earlier replacements.
 * Replacement details are accepted as an array with a regex or string to search for, the
 * replacement string or function, and an optional scope of 'one' or 'all'. Uses the XRegExp
 * replacement text syntax, which supports named backreference properties via `${name}`.
 *
 * @param {String} str String to search.
 * @param {Array} replacements Array of replacement detail arrays.
 * @returns {String} New string with all replacements.
 * @example
 *
 * str = XRegExp.replaceEach(str, [
 *   [XRegExp('(?<name>a)'), 'z${name}'],
 *   [/b/gi, 'y'],
 *   [/c/g, 'x', 'one'], // scope 'one' overrides /g
 *   [/d/, 'w', 'all'],  // scope 'all' overrides lack of /g
 *   ['e', 'v', 'all'],  // scope 'all' allows replace-all for strings
 *   [/f/g, function($0) {
 *     return $0.toUpperCase();
 *   }]
 * ]);
 */
XRegExp.replaceEach = function(str, replacements) {
    var i, r;

    for (i = 0; i < replacements.length; ++i) {
        r = replacements[i];
        str = XRegExp.replace(str, r[0], r[1], r[2]);
    }

    return str;
};

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 *
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * XRegExp.split('a b c', ' ');
 * // -> ['a', 'b', 'c']
 *
 * // With limit
 * XRegExp.split('a b c', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * XRegExp.split('..word1..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', '..']
 */
XRegExp.split = function(str, separator, limit) {
    return fixed.split.call(toObject(str), separator, limit);
};

/**
 * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
 * `sticky` arguments specify the search start position, and whether the match must start at the
 * specified position only. The `lastIndex` property of the provided regex is not used, but is
 * updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.test` and can be used reliably cross-browser.
 *
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Boolean} Whether the regex matched the provided value.
 * @example
 *
 * // Basic use
 * XRegExp.test('abc', /c/); // -> true
 *
 * // With pos and sticky
 * XRegExp.test('abc', /c/, 0, 'sticky'); // -> false
 * XRegExp.test('abc', /c/, 2, 'sticky'); // -> true
 */
XRegExp.test = function(str, regex, pos, sticky) {
    // Do this the easy way :-)
    return !!XRegExp.exec(str, regex, pos, sticky);
};

/**
 * Uninstalls optional features according to the specified options. All optional features start out
 * uninstalled, so this is used to undo the actions of `XRegExp.install`.
 *
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.uninstall({
 *   // Disables support for astral code points in Unicode addons
 *   astral: true,
 *
 *   // DEPRECATED: Restores native regex methods
 *   natives: true
 * });
 *
 * // With an options string
 * XRegExp.uninstall('astral natives');
 */
XRegExp.uninstall = function(options) {
    options = prepareOptions(options);

    if (features.astral && options.astral) {
        setAstral(false);
    }

    if (features.natives && options.natives) {
        setNatives(false);
    }
};

/**
 * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
 * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
 * Backreferences in provided regex objects are automatically renumbered to work correctly within
 * the larger combined pattern. Native flags used by provided regexes are ignored in favor of the
 * `flags` argument.
 *
 * @param {Array} patterns Regexes and strings to combine.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Union of the provided regexes and strings.
 * @example
 *
 * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
 * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
 */
XRegExp.union = function(patterns, flags) {
    var numCaptures = 0;
    var numPriorCaptures;
    var captureNames;

    function rewrite(match, paren, backref) {
        var name = captureNames[numCaptures - numPriorCaptures];

        // Capturing group
        if (paren) {
            ++numCaptures;
            // If the current capture has a name, preserve the name
            if (name) {
                return '(?<' + name + '>';
            }
        // Backreference
        } else if (backref) {
            // Rewrite the backreference
            return '\\' + (+backref + numPriorCaptures);
        }

        return match;
    }

    if (!(isType(patterns, 'Array') && patterns.length)) {
        throw new TypeError('Must provide a nonempty array of patterns to merge');
    }

    var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g;
    var output = [];
    var pattern;
    for (var i = 0; i < patterns.length; ++i) {
        pattern = patterns[i];

        if (XRegExp.isRegExp(pattern)) {
            numPriorCaptures = numCaptures;
            captureNames = (pattern[REGEX_DATA] && pattern[REGEX_DATA].captureNames) || [];

            // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns are
            // independently valid; helps keep this simple. Named captures are put back
            output.push(nativ.replace.call(XRegExp(pattern.source).source, parts, rewrite));
        } else {
            output.push(XRegExp.escape(pattern));
        }
    }

    return XRegExp(output.join('|'), flags);
};

// ==--------------------------==
// Fixed/extended native methods
// ==--------------------------==

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `RegExp.prototype.exec`. Calling `XRegExp.install('natives')` uses this to
 * override the native method. Use via `XRegExp.exec` without overriding natives.
 *
 * @param {String} str String to search.
 * @returns {Array} Match array with named backreference properties, or `null`.
 */
fixed.exec = function(str) {
    var origLastIndex = this.lastIndex,
        match = nativ.exec.apply(this, arguments),
        name,
        r2,
        i;

    if (match) {
        // Fix browsers whose `exec` methods don't return `undefined` for nonparticipating capturing
        // groups. This fixes IE 5.5-8, but not IE 9's quirks mode or emulation of older IEs. IE 9
        // in standards mode follows the spec.
        if (!correctExecNpcg && match.length > 1 && indexOf(match, '') > -1) {
            r2 = copyRegex(this, {
                removeG: true,
                isInternalOnly: true
            });
            // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
            // matching due to characters outside the match
            nativ.replace.call(String(str).slice(match.index), r2, function() {
                var len = arguments.length, i;
                // Skip index 0 and the last 2
                for (i = 1; i < len - 2; ++i) {
                    if (arguments[i] === undefined) {
                        match[i] = undefined;
                    }
                }
            });
        }

        // Attach named capture properties
        if (this[REGEX_DATA] && this[REGEX_DATA].captureNames) {
            // Skip index 0
            for (i = 1; i < match.length; ++i) {
                name = this[REGEX_DATA].captureNames[i - 1];
                if (name) {
                    match[name] = match[i];
                }
            }
        }

        // Fix browsers that increment `lastIndex` after zero-length matches
        if (this.global && !match[0].length && (this.lastIndex > match.index)) {
            this.lastIndex = match.index;
        }
    }

    if (!this.global) {
        // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
        this.lastIndex = origLastIndex;
    }

    return match;
};

/**
 * Fixes browser bugs in the native `RegExp.prototype.test`. Calling `XRegExp.install('natives')`
 * uses this to override the native method.
 *
 * @param {String} str String to search.
 * @returns {Boolean} Whether the regex matched the provided value.
 */
fixed.test = function(str) {
    // Do this the easy way :-)
    return !!fixed.exec.call(this, str);
};

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `String.prototype.match`. Calling `XRegExp.install('natives')` uses this to
 * override the native method.
 *
 * @param {RegExp|*} regex Regex to search with. If not a regex object, it is passed to `RegExp`.
 * @returns {Array} If `regex` uses flag g, an array of match strings or `null`. Without flag g,
 *   the result of calling `regex.exec(this)`.
 */
fixed.match = function(regex) {
    var result;

    if (!XRegExp.isRegExp(regex)) {
        // Use the native `RegExp` rather than `XRegExp`
        regex = new RegExp(regex);
    } else if (regex.global) {
        result = nativ.match.apply(this, arguments);
        // Fixes IE bug
        regex.lastIndex = 0;

        return result;
    }

    return fixed.exec.call(regex, toObject(this));
};

/**
 * Adds support for `${n}` tokens for named and numbered backreferences in replacement text, and
 * provides named backreferences to replacement functions as `arguments[0].name`. Also fixes browser
 * bugs in replacement text syntax when performing a replacement using a nonregex search value, and
 * the value of a replacement regex's `lastIndex` property during replacement iterations and upon
 * completion. Calling `XRegExp.install('natives')` uses this to override the native method. Note
 * that this doesn't support SpiderMonkey's proprietary third (`flags`) argument. Use via
 * `XRegExp.replace` without overriding natives.
 *
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 * @returns {String} New string with one or all matches replaced.
 */
fixed.replace = function(search, replacement) {
    var isRegex = XRegExp.isRegExp(search),
        origLastIndex,
        captureNames,
        result;

    if (isRegex) {
        if (search[REGEX_DATA]) {
            captureNames = search[REGEX_DATA].captureNames;
        }
        // Only needed if `search` is nonglobal
        origLastIndex = search.lastIndex;
    } else {
        search += ''; // Type-convert
    }

    // Don't use `typeof`; some older browsers return 'function' for regex objects
    if (isType(replacement, 'Function')) {
        // Stringifying `this` fixes a bug in IE < 9 where the last argument in replacement
        // functions isn't type-converted to a string
        result = nativ.replace.call(String(this), search, function() {
            var args = arguments, i;
            if (captureNames) {
                // Change the `arguments[0]` string primitive to a `String` object that can store
                // properties. This really does need to use `String` as a constructor
                args[0] = new String(args[0]);
                // Store named backreferences on the first argument
                for (i = 0; i < captureNames.length; ++i) {
                    if (captureNames[i]) {
                        args[0][captureNames[i]] = args[i + 1];
                    }
                }
            }
            // Update `lastIndex` before calling `replacement`. Fixes IE, Chrome, Firefox, Safari
            // bug (last tested IE 9, Chrome 17, Firefox 11, Safari 5.1)
            if (isRegex && search.global) {
                search.lastIndex = args[args.length - 2] + args[0].length;
            }
            // ES6 specs the context for replacement functions as `undefined`
            return replacement.apply(undefined, args);
        });
    } else {
        // Ensure that the last value of `args` will be a string when given nonstring `this`,
        // while still throwing on null or undefined context
        result = nativ.replace.call(this == null ? this : String(this), search, function() {
            // Keep this function's `arguments` available through closure
            var args = arguments;
            return nativ.replace.call(String(replacement), replacementToken, function($0, $1, $2) {
                var n;
                // Named or numbered backreference with curly braces
                if ($1) {
                    // XRegExp behavior for `${n}`:
                    // 1. Backreference to numbered capture, if `n` is an integer. Use `0` for the
                    //    entire match. Any number of leading zeros may be used.
                    // 2. Backreference to named capture `n`, if it exists and is not an integer
                    //    overridden by numbered capture. In practice, this does not overlap with
                    //    numbered capture since XRegExp does not allow named capture to use a bare
                    //    integer as the name.
                    // 3. If the name or number does not refer to an existing capturing group, it's
                    //    an error.
                    n = +$1; // Type-convert; drop leading zeros
                    if (n <= args.length - 3) {
                        return args[n] || '';
                    }
                    // Groups with the same name is an error, else would need `lastIndexOf`
                    n = captureNames ? indexOf(captureNames, $1) : -1;
                    if (n < 0) {
                        throw new SyntaxError('Backreference to undefined group ' + $0);
                    }
                    return args[n + 1] || '';
                }
                // Else, special variable or numbered backreference without curly braces
                if ($2 === '$') { // $$
                    return '$';
                }
                if ($2 === '&' || +$2 === 0) { // $&, $0 (not followed by 1-9), $00
                    return args[0];
                }
                if ($2 === '`') { // $` (left context)
                    return args[args.length - 1].slice(0, args[args.length - 2]);
                }
                if ($2 === "'") { // $' (right context)
                    return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
                }
                // Else, numbered backreference without curly braces
                $2 = +$2; // Type-convert; drop leading zero
                // XRegExp behavior for `$n` and `$nn`:
                // - Backrefs end after 1 or 2 digits. Use `${..}` for more digits.
                // - `$1` is an error if no capturing groups.
                // - `$10` is an error if less than 10 capturing groups. Use `${1}0` instead.
                // - `$01` is `$1` if at least one capturing group, else it's an error.
                // - `$0` (not followed by 1-9) and `$00` are the entire match.
                // Native behavior, for comparison:
                // - Backrefs end after 1 or 2 digits. Cannot reference capturing group 100+.
                // - `$1` is a literal `$1` if no capturing groups.
                // - `$10` is `$1` followed by a literal `0` if less than 10 capturing groups.
                // - `$01` is `$1` if at least one capturing group, else it's a literal `$01`.
                // - `$0` is a literal `$0`.
                if (!isNaN($2)) {
                    if ($2 > args.length - 3) {
                        throw new SyntaxError('Backreference to undefined group ' + $0);
                    }
                    return args[$2] || '';
                }
                // `$` followed by an unsupported char is an error, unlike native JS
                throw new SyntaxError('Invalid token ' + $0);
            });
        });
    }

    if (isRegex) {
        if (search.global) {
            // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
            search.lastIndex = 0;
        } else {
            // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
            search.lastIndex = origLastIndex;
        }
    }

    return result;
};

/**
 * Fixes browser bugs in the native `String.prototype.split`. Calling `XRegExp.install('natives')`
 * uses this to override the native method. Use via `XRegExp.split` without overriding natives.
 *
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 */
fixed.split = function(separator, limit) {
    if (!XRegExp.isRegExp(separator)) {
        // Browsers handle nonregex split correctly, so use the faster native method
        return nativ.split.apply(this, arguments);
    }

    var str = String(this),
        output = [],
        origLastIndex = separator.lastIndex,
        lastLastIndex = 0,
        lastLength;

    // Values for `limit`, per the spec:
    // If undefined: pow(2,32) - 1
    // If 0, Infinity, or NaN: 0
    // If positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32);
    // If negative number: pow(2,32) - floor(abs(limit))
    // If other: Type-convert, then use the above rules
    // This line fails in very strange ways for some values of `limit` in Opera 10.5-10.63, unless
    // Opera Dragonfly is open (go figure). It works in at least Opera 9.5-10.1 and 11+
    limit = (limit === undefined ? -1 : limit) >>> 0;

    XRegExp.forEach(str, separator, function(match) {
        // This condition is not the same as `if (match[0].length)`
        if ((match.index + match[0].length) > lastLastIndex) {
            output.push(str.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < str.length) {
                Array.prototype.push.apply(output, match.slice(1));
            }
            lastLength = match[0].length;
            lastLastIndex = match.index + lastLength;
        }
    });

    if (lastLastIndex === str.length) {
        if (!nativ.test.call(separator, '') || lastLength) {
            output.push('');
        }
    } else {
        output.push(str.slice(lastLastIndex));
    }

    separator.lastIndex = origLastIndex;
    return output.length > limit ? output.slice(0, limit) : output;
};

// ==--------------------------==
// Built-in syntax/flag tokens
// ==--------------------------==

/*
 * Letter escapes that natively match literal characters: `\a`, `\A`, etc. These should be
 * SyntaxErrors but are allowed in web reality. XRegExp makes them errors for cross-browser
 * consistency and to reserve their syntax, but lets them be superseded by addons.
 */
XRegExp.addToken(
    /\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4}|{[\dA-Fa-f]+})|x(?![\dA-Fa-f]{2}))/,
    function(match, scope) {
        // \B is allowed in default scope only
        if (match[1] === 'B' && scope === defaultScope) {
            return match[0];
        }
        throw new SyntaxError('Invalid escape ' + match[0]);
    },
    {
        scope: 'all',
        leadChar: '\\'
    }
);

/*
 * Unicode code point escape with curly braces: `\u{N..}`. `N..` is any one or more digit
 * hexadecimal number from 0-10FFFF, and can include leading zeros. Requires the native ES6 `u` flag
 * to support code points greater than U+FFFF. Avoids converting code points above U+FFFF to
 * surrogate pairs (which could be done without flag `u`), since that could lead to broken behavior
 * if you follow a `\u{N..}` token that references a code point above U+FFFF with a quantifier, or
 * if you use the same in a character class.
 */
XRegExp.addToken(
    /\\u{([\dA-Fa-f]+)}/,
    function(match, scope, flags) {
        var code = dec(match[1]);
        if (code > 0x10FFFF) {
            throw new SyntaxError('Invalid Unicode code point ' + match[0]);
        }
        if (code <= 0xFFFF) {
            // Converting to \uNNNN avoids needing to escape the literal character and keep it
            // separate from preceding tokens
            return '\\u' + pad4(hex(code));
        }
        // If `code` is between 0xFFFF and 0x10FFFF, require and defer to native handling
        if (hasNativeU && flags.indexOf('u') > -1) {
            return match[0];
        }
        throw new SyntaxError('Cannot use Unicode code point above \\u{FFFF} without flag u');
    },
    {
        scope: 'all',
        leadChar: '\\'
    }
);

/*
 * Empty character class: `[]` or `[^]`. This fixes a critical cross-browser syntax inconsistency.
 * Unless this is standardized (per the ES spec), regex syntax can't be accurately parsed because
 * character class endings can't be determined.
 */
XRegExp.addToken(
    /\[(\^?)]/,
    function(match) {
        // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
        // (?!) should work like \b\B, but is unreliable in some versions of Firefox
        return match[1] ? '[\\s\\S]' : '\\b\\B';
    },
    {leadChar: '['}
);

/*
 * Comment pattern: `(?# )`. Inline comments are an alternative to the line comments allowed in
 * free-spacing mode (flag x).
 */
XRegExp.addToken(
    /\(\?#[^)]*\)/,
    function(match, scope, flags) {
        // Keep tokens separated unless the following token is a quantifier. This avoids e.g.
        // inadvertedly changing `\1(?#)1` to `\11`.
        return isQuantifierNext(match.input, match.index + match[0].length, flags) ?
            '' : '(?:)';
    },
    {leadChar: '('}
);

/*
 * Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
 */
XRegExp.addToken(
    /\s+|#[^\n]*\n?/,
    function(match, scope, flags) {
        // Keep tokens separated unless the following token is a quantifier. This avoids e.g.
        // inadvertedly changing `\1 1` to `\11`.
        return isQuantifierNext(match.input, match.index + match[0].length, flags) ?
            '' : '(?:)';
    },
    {flag: 'x'}
);

/*
 * Dot, in dotall mode (aka singleline mode, flag s) only.
 */
XRegExp.addToken(
    /\./,
    function() {
        return '[\\s\\S]';
    },
    {
        flag: 's',
        leadChar: '.'
    }
);

/*
 * Named backreference: `\k<name>`. Backreference names can use the characters A-Z, a-z, 0-9, _,
 * and $ only. Also allows numbered backreferences as `\k<n>`.
 */
XRegExp.addToken(
    /\\k<([\w$]+)>/,
    function(match) {
        // Groups with the same name is an error, else would need `lastIndexOf`
        var index = isNaN(match[1]) ? (indexOf(this.captureNames, match[1]) + 1) : +match[1],
            endIndex = match.index + match[0].length;
        if (!index || index > this.captureNames.length) {
            throw new SyntaxError('Backreference to undefined group ' + match[0]);
        }
        // Keep backreferences separate from subsequent literal numbers. This avoids e.g.
        // inadvertedly changing `(?<n>)\k<n>1` to `()\11`.
        return '\\' + index + (
            endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ?
                '' : '(?:)'
        );
    },
    {leadChar: '\\'}
);

/*
 * Numbered backreference or octal, plus any following digits: `\0`, `\11`, etc. Octals except `\0`
 * not followed by 0-9 and backreferences to unopened capture groups throw an error. Other matches
 * are returned unaltered. IE < 9 doesn't support backreferences above `\99` in regex syntax.
 */
XRegExp.addToken(
    /\\(\d+)/,
    function(match, scope) {
        if (
            !(
                scope === defaultScope &&
                /^[1-9]/.test(match[1]) &&
                +match[1] <= this.captureNames.length
            ) &&
            match[1] !== '0'
        ) {
            throw new SyntaxError('Cannot use octal escape or backreference to undefined group ' +
                match[0]);
        }
        return match[0];
    },
    {
        scope: 'all',
        leadChar: '\\'
    }
);

/*
 * Named capturing group; match the opening delimiter only: `(?<name>`. Capture names can use the
 * characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers. Supports Python-style
 * `(?P<name>` as an alternate syntax to avoid issues in some older versions of Opera which natively
 * supported the Python-style syntax. Otherwise, XRegExp might treat numbered backreferences to
 * Python-style named capture as octals.
 */
XRegExp.addToken(
    /\(\?P?<([\w$]+)>/,
    function(match) {
        // Disallow bare integers as names because named backreferences are added to match arrays
        // and therefore numeric properties may lead to incorrect lookups
        if (!isNaN(match[1])) {
            throw new SyntaxError('Cannot use integer as capture name ' + match[0]);
        }
        if (match[1] === 'length' || match[1] === '__proto__') {
            throw new SyntaxError('Cannot use reserved word as capture name ' + match[0]);
        }
        if (indexOf(this.captureNames, match[1]) > -1) {
            throw new SyntaxError('Cannot use same name for multiple groups ' + match[0]);
        }
        this.captureNames.push(match[1]);
        this.hasNamedCapture = true;
        return '(';
    },
    {leadChar: '('}
);

/*
 * Capturing group; match the opening parenthesis only. Required for support of named capturing
 * groups. Also adds explicit capture mode (flag n).
 */
XRegExp.addToken(
    /\((?!\?)/,
    function(match, scope, flags) {
        if (flags.indexOf('n') > -1) {
            return '(?:';
        }
        this.captureNames.push(null);
        return '(';
    },
    {
        optionalFlags: 'n',
        leadChar: '('
    }
);

module.exports = XRegExp;

},{}]},{},[1]);
