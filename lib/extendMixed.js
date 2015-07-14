/**
 * @id extendMixed
 * @lookup extendMixed
 *
 * ### *function* extendMixed
 * This is a tiny helper function that takes any class / function and extends its
 * prototype with whatever mixins you pass.
 *
 * ```js
 *
 * import mixed from 'immutable-cursors/lib/extendMixed';
 *
 * class MyClass extends mixed(BaseClass, Mixin1, Mixin2) {
 *    // your class logic
 * }
 * ```
 *
 * ###### Signature:
 * ```js
 * extendMixed(
 *    ParentClass: Function,
 *    ...mixins: Array<Object>
 * )
 * ```
 *
 * ###### Arguments:
 * * `ParentClass` - The class you want to extend.
 * * `...mixins` - An arbitrary amount of objects whose properties you want to have on the prototype of `ParentClass`.
 *
 * ###### Returns:
 * A copy of the parent class with all mixin extensions.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports["default"] = extendMixed;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function extendMixed(ParentClass) {
  for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    mixins[_key - 1] = arguments[_key];
  }

  var MixedClass = (function (_ParentClass) {
    _inherits(MixedClass, _ParentClass);

    function MixedClass() {
      _classCallCheck(this, MixedClass);

      _get(Object.getPrototypeOf(MixedClass.prototype), "constructor", this).apply(this, arguments);
    }

    return MixedClass;
  })(ParentClass);

  mixins.forEach(function (mixin) {
    Object.keys(mixin).forEach(function (prop) {
      MixedClass.prototype[prop] = mixin[prop];
    });
  });

  return MixedClass;
}

module.exports = exports["default"];