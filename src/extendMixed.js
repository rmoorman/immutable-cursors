export default function extendMixed(Parent, ...mixins) {
	class Mixed extends Parent {}
	mixins.forEach(mixin => {
		Object.keys(mixin).forEach(prop => {
			Mixed.prototype[prop] = mixin[prop];
		});
	});

	return Mixed;
}
