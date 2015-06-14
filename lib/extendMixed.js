"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = extendMixed;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function extendMixed(Parent) {
	for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		mixins[_key - 1] = arguments[_key];
	}

	var Mixed = (function (_Parent) {
		function Mixed() {
			_classCallCheck(this, Mixed);

			if (_Parent != null) {
				_Parent.apply(this, arguments);
			}
		}

		_inherits(Mixed, _Parent);

		return Mixed;
	})(Parent);

	mixins.forEach(function (mixin) {
		Object.keys(mixin).forEach(function (prop) {
			Mixed.prototype[prop] = mixin[prop];
		});
	});

	return Mixed;
}

module.exports = exports["default"];