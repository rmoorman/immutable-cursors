'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = pathToSeq;

var _immutable = require('immutable');

/**
 * @id pathToSeq
 * @lookup pathToSeq
 *
 * ## *function* pathToSeq()
 *
 * Normalizes and concatenates any passed key paths and returns a single
 * >Immutable.Seq object.
 *
 * ###### Signature:
 * ```js
 * pathToSeq(
 * ...paths: Array<Immutable.Seq|Array<string>|string>
 * ): Immutable.Seq
 * ```
 *
 * ###### Arguments:
 * * `...paths` -  Any values that you want to merge to a >Immutable.Seq path
 *
 * ###### Returns:
 * An >Immutable.Seq path
 */

function pathToSeq() {
  for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return paths.length === 0 ? new _immutable.Seq() : paths.length === 1 && _immutable.Iterable.isIterable(paths[0]) ? paths[0] : paths.reduce(function (memo, value) {
    return typeof value === 'undefined' ? memo : memo.concat(value);
  }, new _immutable.Seq());
}

module.exports = exports['default'];