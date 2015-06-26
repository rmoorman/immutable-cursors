Immutable Cursors
=================

0.1.3

This CommonJS module provides cursors for Facebook's [ImmutableJS](http://facebook.github.io/immutable-js/) library. It is
essentially a standalone fork of the excellent
[contrib/cursor](https://github.com/facebook/immutable-js/tree/master/contrib/cursor) module that ships with every
distribution of ImmutableJS.

From their README:

> Cursors allow you to hold a reference to a path in a nested immutable data structure, allowing you to pass smaller sections of a larger nested collection to portions of your application while maintaining a central point aware of changes to the entire data structure: an onChange function which is called whenever a cursor or sub-cursor calls update.

> This is particularly useful when used in conjuction with component-based UI libraries like [React](http://facebook.github.io/react/) or to simulate "state" throughout an application while maintaining a single flow of logic.

This pretty much sums it up.


This module is for most parts a [contrib/cursor](https://github.com/facebook/immutable-js/tree/master/contrib/cursor) port to ES2015 including some minor additions and refactorings in order to provide a more extension-friendly and concise interface.

The CommonJS ES5/ES3 distribution is built with [Babel](babeljs.io).

## Getting started

The cursors implement the complete API of [KeyedSeq](http://facebook.github.io/immutable-js/docs/#/KeyedSeq) and [IndexedSeq](http://facebook.github.io/immutable-js/docs/#/IndexedSeq) respectively, so if you're familiar with ImmutableJS you should have no problems jumping right in. If not, you should probably have a glance at [their guides](https://facebook.github.io/immutable-js/) first.



### Install and setup

Install the package from [npm](https://www.npmjs.com/package/immutable-cursors):

```
npm install immutable-cursors
```

Import the module and provide some state:

```javascript
import Immutable from 'immutable';
import Cursor from 'immutable-cursors';

let data = Immutable.fromJS({
	name: {
		first: 'Luke',
		last: 'Skywalker'
	},
	age: 35
});
```

### Basic operations

Retrieve an initial cursor using [Cursor.from](#from):
```javascript
let cursor = Cursor.from(data);
cursor.getIn(['name', 'last']);
// 'Skywalker'
```

Retrieve nested initial state:

```javascript
let cursor = Cursor.from(data, ['name']);
cursor.get('last')
// 'Skywalker'
```

Access the [ImmutableJS](http://facebook.github.io/immutable-js/) value that is backing the cursor directly:

```javascript
let cursor = Cursor.from(data, ['name']);
data.get('name') === cursor.deref();
// true
```

Cursors are immutable as well:
```javascript
let modifiedAgeCursor = cursor.set('age', 45);

cursor.get('age');
// 35
modifiedAgeCursor.get('age');
// 45
```

Use cursors like regular ImmutableJS objects:
```
let firstNameOnly = cursor.get('name').take(1);
firstNameOnly.deref().toJS();
// {
//    name: 'Luke'
// }
```

Cursors support value equality (see [Immutable.is](https://facebook.github.io/immutable-js/docs/#/is)). This is especially helpful in situations where you want to compare current to new nested state or props in React components, most prominently in `shouldComponentUpdate`:
```javascript
let valueEqualCursor = Cursor.from(data);

cursor === valueEqualCursor;
// false
Immutable.is(cursor, valueEqualCursor);
// true
Immutable.is(valueEqualCursor, data);
// true
```

If a cursor references a [Record](http://facebook.github.io/immutable-js/docs/#/Record) object, all of the [Record](http://facebook.github.io/immutable-js/docs/#/Record)'s properties are present on the cursor as well:
```javascript
let Name = Immutable.Record({
	first: 'Luke',
	last: 'Skywalker'
});

let person = Immutable.Map({
	name: new Name();
});

let cursor = Cursor.from(person, ['name']);
cursor.first;
// 'Luke'
```

### Nested cursors

Retrieve a sub-cursor:
```javascript
let nameCursor = cursor.cursor(['name']);

nameCursor.get('first');
// 'Luke'
```

Methods `get` and `getIn` also return sub-cursors if they don't point to a primitive value:
```javascript
let nameCursor = cursor.get('name');

nameCursor.get('last');
// 'Skywalker'
```

### Handle change

Cursors and their sub-cursors share a common root state and a change handler that gets called, whenever modifications on the cursor tree occur.

Add a change handler to the initial [Cursor.from](#from) call:
```javascript
let cursor = Cursor.from(data, [], (nextState, currentState) => {
	let newFirstName = nextState.getIn(['name', 'first']);
	let currentFirstName = currentState.getIn(['name', 'first']);
	console.log(currentFirstName + ' => ' + newFirstName);
});

cursor.setIn(['name', 'first'], 'Anakin');
// 'Luke => Anakin'
```

You can intercept the state propagation by returning a state in your change handler to perform validation, rollbacks etc.:
```javascript
let cursor = Cursor.from(data, ['name'], (nextState, currentState) => {
	if (nextState.get('first') === 'Leia') {
		return nextState.set('last', 'Organa');
	}
});

let anakinCursor = cursor.set('first', 'Anakin');
anakinCursor.get('first');
// 'Anakin'

let leiaCursor = cursor.set('first', 'Leia');
leiaCursor.get('last');
// 'Organa'
```

## Simplistic React example

Note that in a production environment you hardly want to modify cursors in your components directly. We do that here for the sake of simplicity.

```javascript
import React from 'react';
import Immutable from 'immutable';
import Cursor from 'immutable-cursors';

let data = Immutable.fromJS({
	name: {
		first: 'Luke',
		last: 'Skywalker'
	},
	age: 35
});
let app;

class Input extends React.Component {

	shouldComponentUpdate(nextProps) {
		// This is as easy as it gets
		let shouldChange = !this.props.cursor.equals(nextProps.cursor);

		console.log('\tShould ' + this.props.name + 'update?', shouldChange)
		return shouldChange;
	}

	onChange(event) {
		this.props.cursor.set(this.props.key, event.target.value);
	}

	render() {
		return (
			<div>
				<label>{this.props.name}</label>
				<input
					type='text'
					value={this.props.cursor.get(this.props.key)}
					onChange={this.onChange.bind(this)}
				/>
			</div>
		)
	}
}

class Application extends React.Component {

	render() {
		console.log('\n Render root component.');
		return (
			<div>
				<Input name='First name' cursor={this.props.cursor('name')} key='first' />
				<Input name='Last name' cursor={this.props.cursor('name')} key='last' />
				<Input name='Age' cursor={this.props.cursor} key='age' />
			</div>
		);
	}
}

function changeHandler(nextState) {
	app.setProps(Cursor.from(nextState, changeHandler));
}

app = React.render(
	<Application cursor={Cursor.from(nextState, changeHandler)} />,
	document.body
);
```

## Development

Get the source:
```
git clone https://github.com/lukasbuenger/immutable-cursors
```

Install dependencies:
```
npm install
```

Lint the code:
```
npm run lint
```

Run the tests:
```
npm test
```

Build ES5/ES3:
```
npm run build
```

Build the docs / README:
```
npm run docs
```

Update all local dependencies:
```
npm run update-dependencies
```

## Docs

- - - 
<sub>[See Source](https://github.com/lukasbuenger/immutable-cursors/tree/v0.1.3/src/API.js)</sub>
- - - 
<a id="API"></a>



### *class* API

The main entry point for both client and internals. If you create a new cursor using an [API](#API) object, a reference of it will get passed to every (sub-)cursor you create from the initial one.

It consists mainly of refactored versions of the non-prototypical private functions found in [ImmutableJS](http://facebook.github.io/immutable-js/)'s [contrib/cursor](https://github.com/facebook/immutable-js/tree/master/contrib/cursor).

I made them sit in a class construct for extendibility and testability reasons. That way, one can easily roll his/her custom logic by subclassing from [API](#API).

The downsides of this approach are that every cursor has to carry another few more references and that more importantly the internal API is not really private anymore.
```js
let cursor = Cursor.from(state, ['data']);
messWithInternals(cursor._api);
```

[API](#API) objects, in contrary to [contrib/cursor](https://github.com/facebook/immutable-js/tree/master/contrib/cursor), convert key path arrays to [Seq](http://facebook.github.io/immutable-js/docs/#/Seq) objects internally. This is perfectly fine with the [ImmutableJS](http://facebook.github.io/immutable-js/) way of working on nested values and gives a couple of handy methods to work on key paths on top of another level of security because key paths are immutable as well.

**Extending**
The following example shows how you could establish access of nested cursors by using dot-string formatted key paths as well.
```js
import API from 'immutable-cursors/lib/API';

class CustomAPI extends API {
   path(...paths) {
      if (paths.length === 1 && typeof paths[0] === 'string') {
         paths = paths[0].split('.');
      }
      return super.path(...paths);
   }
}

let api = new CustomAPI();
export default api.export();
```
 

- - - 
<a id="API-cursorFrom"></a>



#### cursorFrom()

Returns a new default cursor.

###### Signature:
```js
cursorFrom(
   rootData: Immutable.Iterable,
   keyPath?: Immutable.Seq|Array<string>,
   onChange?: Function
): KeyedCursor|IndexedCursor
```

###### Arguments:
* `rootData` - The state.
* `keyPath` - An optional key path to a substate.
* `onChange` - An optional change handler.

###### Returns:
* A new cursor.
	 

- - - 
<a id="API-getCursorClass"></a>



#### getCursorClass()

Decides on and returns a cursor class by analyzing `value`. Returns [IndexedCursor](#IndexedCursor) if `Iterable.isIndexed(value) === true`, else [KeyedCursor](#KeyedCursor).

###### Signature:
```js
getCursorClass(
   value: Immutable.Iterable
): Function
```

###### Arguments:
* `value` - Any value in your state.

###### Returns:
* The class that should be used to create a new cursor for `value`.
	 

- - - 
<a id="API-makeCursor"></a>



#### makeCursor()

This is the main cursor factory. You probably should not subclass this method as it gives you all the options you need through its arguments. Instead of subclassing it, you should write your own method and call [makeCursor](#API-makeCursor) from there with your custom values.

**Enforce a custom cursor class**
```js
class CustomAPI extends API {
   getCustomCursor(rootData, keyPath, onChange) {
      return this.makeCursor(rootData, keyPath, onChange, undefined, MyCustomCursorClass);
   }

   export() {
      let api = super.export();
      api.getCustom = this.getCustomCursor.bind(this);
      return api;
   }
}

let api = new CustomAPI();
export default api.export();
```

**Equip cursors with shared options**
Some of the cursor properties like the change handler or the root data will get shared between all cursors that are derived from the same initial cursor, may it be through updating or retrieving a cursor to a nested state etc. In certain situations it might be helpful to have custom shared values in place.
```js
class CustomAPI extends API {
   getWithSharedName(rootData, keyPath, onChange, name) {
      return this.makeCursor(rootData, keyPath, onChange, undefined, undefined, {
         name: name
      });
   }

   export() {
      let api = super.export();
      api.getWithSharedName = this.getWithSharedName.bind(this);
      return api;
   }
}

let api = new CustomAPI();
let cursor = api.getWithSharedName(Immutable.fromJS({foo: 'bar'}), [], undefined, 'fooCursor');

cursor._sharedOptions.name;
// 'fooCursor'

cursor.set('foo', 'baz')._sharedOptions.name;
// 'fooCursor'

cursor.cursor('foo')._sharedOptions.name;
// 'fooCursor'
```

###### Signature:
```js
makeCursor(
   rootData: Immutable.Iterable,
   keyPath?: Immutable.Seq,
   onChange?: Function,
   value?: Immutable.Iterable|any,
   CursorClass?: Function,
   sharedOptions?: Object
): KeyedCursor|IndexedCursor
```

###### Arguments:
* `rootData` - An [ImmutableJS](http://facebook.github.io/immutable-js/) state.
* `keyPath` - A key path to a nested value.
* `onChange` - A change handler.
* `value` -  A value to determine the size and the `CursorClass` if not present. Default: `rootData.getIn(keyPath)`.
* `CursorClass` - Enforce a custom class to create the cursor with.
* `sharedOptions` - Pass additional shared options.

###### Returns:
* A new cursor
	 

- - - 
<a id="API-updateCursor"></a>



#### updateCursor()

Updates the current state with `changeFn` and calls the cursors change handler. Returns a new cursor backed by either the return value of the change handler or the result of `changeFn`.

###### Signature:
```js
updateCursor(
   cursor: KeyedCursor|IndexedCursor,
   changeFn: Function,
   changeKeyPath?: Immutable.Seq
): KeyedCursor|IndexedCursor
```

###### Arguments:
* `cursor` - The cursor to update.
* `changeFn` -  A function that performs and returns modifications on the given state.
* `changeKeyPath` - If present, indicates a deep change.

###### Returns:
* An new updated cursor.
	 

- - - 
<a id="API-NOT_SET"></a>



#### NOT_SET *[read-only]*

Constant for attempts on nested undefined values.

###### Returns
An empty object.

	 

- - - 
<a id="API-wrappedValue"></a>



#### wrappedValue()

Returns a sub-cursor if the given value is an [Iterable](http://facebook.github.io/immutable-js/docs/#/Iterable).
If not, returns the value itself.

###### Signature:
```js
wrappedValue(
   cursor: KeyedCursor|IndexedCursor,
   keyPath: Immutable.Seq,
   value: Immutable.isIterable|any
): KeyedCursor|IndexedCursor|any
```

###### Arguments:
* `cursor` - A cursor from which you want to retrieve a sub-cursor in case of `>Iterable.isIterable(value)`.
* `keyPath` - The key path where the value resides.
* `value` - The value to analyze.

###### Returns:
A sub-cursor or the value.
	 

- - - 
<a id="API-subCursor"></a>



#### subCursor()

Creates and returns a sub-cursor of `cursor` at `keyPath`.

###### Signature:
```js
subCursor(
   cursor: KeyedCursor|IndexedCursor,
   keyPath: Immutable.Seq,
   value: any
)
```

###### Arguments:
* `cursor` - The cursor you want to create a sub-cursor from.
* `keyPath` - The key path to the state your sub-cursor should point at.
* `value` - The value at `keyPath`.

###### Returns:
A new sub-cursor
	 

- - - 
<a id="API-defineRecordProperties"></a>



#### defineRecordProperties()

Extends a cursor with [Record](http://facebook.github.io/immutable-js/docs/#/Record) properties to export the same
interface as its backing value. Calls [setProp](#API-setProp) for each
property key.

###### Signature:
```js
defineRecordProperties(
   cursor: KeyedCursor|IndexedCursor,
   value: Immutable.Record
): KeyedCursor|IndexedCursor
```
###### Arguments:
* `cursor` - The cursor you want to extend.
* `value` - The [Record](http://facebook.github.io/immutable-js/docs/#/Record) object whose keys should get mapped on `cursor`.

###### Returns:
An extended cursor.
	 

- - - 
<a id="API-setProp"></a>



#### setProp

Defines an alias property on a cursor that delegates to `cursor.get(name)`.

###### Signature:
```js
setProp(
   cursor: KeyedCursor|IndexedCursor,
   name: string
)
```

###### Arguments:
* `cursor` - The cursor on which you want to have a getter property with name `name`.
* `name` - The name of the property
	 

- - - 
<a id="API-path"></a>



#### path()

Normalizes and concatenates any passed key paths and returns a single
[Seq](http://facebook.github.io/immutable-js/docs/#/Seq) object.

See [pathToSeq](#pathToSeq)

###### Signature:
```js
path(
   ...paths: Array<Immutable.Seq|Array<string>|string>
): Immutable.Seq
```

###### Returns:
A concatenated, validated key path as [Seq](http://facebook.github.io/immutable-js/docs/#/Seq)
	 

- - - 
<a id="api-export"></a>



#### export()

Should return an object containing all (bound) functions and properties that
you consider public. Recommended use:
```js
// in ./cursor/CustomAPI.js
import API from 'immutable-cursors/lib/API';

export default class CustomAPI extends API {
   export() {
      let api = super.export();
      api.version = '0.1';
      return api;
   }
}

// in ./cursor/index.js
import CustomAPI from './CustomAPI';

let api = new CustomAPI();
export default api.export();

// in ./client.js
import Cursor from './cursor';

console.log(Cursor.version);
let cursor = Cursor.from(state);
```

###### Signature:
```js
export(): Object
```

###### Returns:
The client API
	 

- - - 
<sub>[See Source](https://github.com/lukasbuenger/immutable-cursors/tree/v0.1.3/src/BaseCursor.js)</sub>
- - - 
<a id="BaseCursor"></a>



## *mixin* BaseCursor

The BaseCursor mixin contains methods that represent shared behavior of
both [KeyedCursor](#KeyedCursor) and [IndexedCursor](#IndexedCursor). The reason why these live in a mixin is,
that prototypical inheritance on the cursor classes is already occupied by the
ImmutableJS base classes KeyedSeq and IndexedSeq respectively.

Most of the methods in this mixin override these original Immutable.Seq interface, where
cursor implementation has to decorate / circumvent default ImmutableJS behavior.


If your are interested in how these overrides work, check out the source. This
document only lists the methods that are not part of the original ImmutableJS.Seq
interface.
 

- - - 

#### deref()

Returns the ImmutableJS object that is backing the cursor.

###### Signature:
```js
deref(
   notSetValue?: any
): Immutable.Iterable
```

###### Arguments:
* `notSetValue` - You'll get `notSetValue` returned if there is no backing value for this cursor.

###### Returns:
The ImmutableJS backing state of this cursor.
	 

- - - 

#### valueOf()

Alias of deref().
	 

- - - 
<sub>[See Source](https://github.com/lukasbuenger/immutable-cursors/tree/v0.1.3/src/extendMixed.js)</sub>
- - - 
<a id="extendMixed"></a>



### *function* extendMixed
This is a tiny helper function that takes any class / function and extends its
prototype with whatever mixins you pass.

```js

import mixed from 'immutable-cursors/lib/extendMixed';

class MyClass extends mixed(BaseClass, Mixin1, Mixin2) {
   // your class logic
}
```

###### Signature:
```js
extendMixed(
   ParentClass: Function,
   ...mixins: Array<Object>
)
```

###### Arguments:
* `ParentClass` - The class you want to extend.
* `...mixins` - An arbitrary amount of objects whose properties you want to have on the prototype of `ParentClass`.

###### Returns:
A copy of the parent class with all mixin extensions.
 

- - - 
<sub>[See Source](https://github.com/lukasbuenger/immutable-cursors/tree/v0.1.3/src/index.js)</sub>
- - - 


### *module* immutable-cursors

The public API

 

- - - 
<a id="from"></a>



#### function from

Returns a new cursor for the given state and key path.


###### Signature:
```js
from(
   state: Immutable.Iterable,
   keyPath?: Array<String>|Immutable.Seq,
   changeHandler?: Function
): KeyedCursor|IndexedCursor
```

###### Arguments:
* `state` - The root state.
* `keyPath` - The key path that points to the nested state you want to create a cursor for.
* `changeHandler` - A change handler function that gets called whenever changes occur on the cursor itself or on any sub-cursor. Its return value, if `!== undefined`, will replace `newState` as new root state of the resulting cursors shared state. It gets called with:
   * `newState` - The state *after* the update.
   * `oldState` - The state *before* the update.
   * `keyPath` - An Immutable.Seq key path that indicates where in the state the update occurred.

###### Returns
A new root cursor
 

- - - 
<sub>[See Source](https://github.com/lukasbuenger/immutable-cursors/tree/v0.1.3/src/IndexedCursor.js)</sub>
- - - 
<a id="IndexedCursor"></a>



### *class* IndexedCursor

<sub>**Extends:** [IndexedSeq](http://facebook.github.io/immutable-js/docs/#/IndexedSeq)</sub>

<sub>**Mixins:** [BaseCursor](#BaseCursor)</sub>

Used to represent indexed [ImmutableJS](http://facebook.github.io/immutable-js/) values.

###### Signature:
```js
new IndexedCursor(
   rootData: immutable.Iterable,
   keyPath: Immutable.Seq,
   onChange?: Function,
   size?: number,
   api: API,
   sharedOptions?: Object
)
```

###### Arguments:
* `rootData` - An [ImmutableJS](http://facebook.github.io/immutable-js/) state.
* `keyPath` - A key path to a nested value.
* `onChange` - A change handler.
* `size` -  A value that should be set as the size of the cursor. Default: `rootData.getIn(keyPath)`.
* `api` - A reference to the [API](#API) object from which the cursor was derived.
* `sharedOptions` - Pass additional shared options.

###### Returns:
* A new cursor
 

- - - 
<sub>[See Source](https://github.com/lukasbuenger/immutable-cursors/tree/v0.1.3/src/KeyedCursor.js)</sub>
- - - 
<a id="KeyedCursor"></a>



### *class* KeyedCursor

<sub>**Extends:** [KeyedSeq](http://facebook.github.io/immutable-js/docs/#/KeyedSeq)</sub>

<sub>**Mixins:** [BaseCursor](#BaseCursor)</sub>

Used to represent keyed [ImmutableJS](http://facebook.github.io/immutable-js/) values.

###### Signature:
```js
new IndexedCursor(
   rootData: immutable.Iterable,
   keyPath: Immutable.Seq,
   onChange?: Function,
   size?: number,
   api: API,
   sharedOptions?: Object
)
```

###### Arguments:
* `rootData` - An [ImmutableJS](http://facebook.github.io/immutable-js/) state.
* `keyPath` - A key path to a nested value.
* `onChange` - A change handler.
* `size` -  A value that should be set as the size of the cursor. Default: `rootData.getIn(keyPath)`.
* `api` - A reference to the [API](#API) object from which the cursor was derived.
* `sharedOptions` - Pass additional shared options.

###### Returns:
* A new cursor
 

- - - 
<sub>[See Source](https://github.com/lukasbuenger/immutable-cursors/tree/v0.1.3/src/pathToSeq.js)</sub>
- - - 
<a id="pathToSeq"></a>



## *function* pathToSeq()

Normalizes and concatenates any passed key paths and returns a single
[Seq](http://facebook.github.io/immutable-js/docs/#/Seq) object.

###### Signature:
```js
pathToSeq(
...paths: Array<Immutable.Seq|Array<string>|string>
): Immutable.Seq
```

###### Arguments:
* `...paths` -  Any values that you want to merge to a [Seq](http://facebook.github.io/immutable-js/docs/#/Seq) path

###### Returns:
An [Seq](http://facebook.github.io/immutable-js/docs/#/Seq) path
 



## Changelog

- **0.1.3** - API docs added. Fixed license referencing in package.json courtesy of [kemitchell](https://github.com/kemitchell).
- **0.1.2** - Support [Record](http://facebook.github.io/immutable-js/docs/#/Record) properties.

## Roadmap

- [ ] More examples
- [ ] Better test coverage
- [ ] Annotate source [Flow](http://flowtype)

## License

It's complicated. See [LICENSE](LICENSE) file.
