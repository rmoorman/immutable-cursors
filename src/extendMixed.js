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
export default function extendMixed(ParentClass, ...mixins) {
	class MixedClass extends ParentClass {}
	mixins.forEach(mixin => {
		Object.keys(mixin).forEach(prop => {
			MixedClass.prototype[prop] = mixin[prop];
		});
	});

	return MixedClass;
}
