jest.autoMockOff();

let Immutable = require('immutable');
let Cursor = require('../lib/');

jasmine.getEnv().addEqualityTester((a, b) =>
    a instanceof Immutable.Iterable && b instanceof Immutable.Iterable ?
        Immutable.is(a, b) :
        jasmine.undefined
);

describe('Cursor', () => {

    let json = { a: { b: { c: 1 } } };

    it('gets from its path', () => {
        let data = Immutable.fromJS(json);
        let cursor = Cursor.from(data);
        expect(cursor.deref()).toBe(data);

        let deepCursor = cursor.cursor(['a', 'b']);
        expect(deepCursor.deref().toJS()).toEqual(json.a.b);
        expect(deepCursor.deref()).toBe(data.getIn(['a', 'b']));
        expect(deepCursor.get('c')).toBe(1);

        let leafCursor = deepCursor.cursor('c');
        expect(leafCursor.deref()).toBe(1);

        let missCursor = leafCursor.cursor('d');
        expect(missCursor.deref()).toBe(undefined);
    });

    it('gets return new cursors', () => {
        let data = Immutable.fromJS(json);
        let cursor = Cursor.from(data);
        let deepCursor = cursor.getIn(['a', 'b']);
        expect(deepCursor.deref()).toBe(data.getIn(['a', 'b']));
    });

    it('gets return new cursors using List', () => {
        let data = Immutable.fromJS(json);
        let cursor = Cursor.from(data);
        let deepCursor = cursor.getIn(Immutable.fromJS(['a', 'b']));
        expect(deepCursor.deref()).toBe(data.getIn(Immutable.fromJS(['a', 'b'])));
    });

    it('cursor return new cursors of correct type', () => {
        let data = Immutable.fromJS({ a: [1, 2, 3] });
        let cursor = Cursor.from(data);
        let deepCursor = cursor.cursor('a');
        expect(deepCursor.findIndex).toBeDefined();
    });

    it('can be treated as a value', () => {
        let data = Immutable.fromJS(json);
        let cursor = Cursor.from(data, ['a', 'b']);
        expect(cursor.toJS()).toEqual(json.a.b);
        expect(cursor).toEqual(data.getIn(['a', 'b']));
        expect(cursor.size).toBe(1);
        expect(cursor.get('c')).toBe(1);
    });

    it('can be value compared to a primitive', () => {
        let data = Immutable.Map({ a: 'A' });
        let aCursor = Cursor.from(data, 'a');
        expect(aCursor.size).toBe(undefined);
        expect(aCursor.deref()).toBe('A');
        expect(Immutable.is(aCursor, 'A')).toBe(true);
    });

    it('updates at its path', () => {
        let onChange = jest.genMockFunction();

        let data = Immutable.fromJS(json);
        let aCursor = Cursor.from(data, 'a', onChange);

        let deepCursor = aCursor.cursor(['b', 'c']);
        expect(deepCursor.deref()).toBe(1);

        // cursor edits return new cursors:
        let newDeepCursor = deepCursor.update(x => x + 1);
        expect(newDeepCursor.deref()).toBe(2);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a:{b:{c:2}}}),
            data,
            ['a', 'b', 'c']
        );

        let newestDeepCursor = newDeepCursor.update(x => x + 1);
        expect(newestDeepCursor.deref()).toBe(3);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a:{b:{c:3}}}),
            Immutable.fromJS({a:{b:{c:2}}}),
            ['a', 'b', 'c']
        );

        // meanwhile, data is still immutable:
        expect(data.toJS()).toEqual(json);

        // as is the original cursor.
        expect(deepCursor.deref()).toBe(1);
        let otherNewDeepCursor = deepCursor.update(x => x + 10);
        expect(otherNewDeepCursor.deref()).toBe(11);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a:{b:{c:11}}}),
            data,
            ['a', 'b', 'c']
        );

        // and update has been called exactly thrice.
        expect(onChange.mock.calls.length).toBe(3);
    });

    it('updates with the return value of onChange', () => {
        let onChange = jest.genMockFunction();

        let data = Immutable.fromJS(json);
        let deepCursor = Cursor.from(data, ['a', 'b', 'c'], onChange);

        onChange.mockReturnValueOnce(undefined);
        // onChange returning undefined has no effect
        let newCursor = deepCursor.update(x => x + 1);
        expect(newCursor.deref()).toBe(2);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a:{b:{c:2}}}),
            data,
            ['a', 'b', 'c']
        );

        onChange.mockReturnValueOnce(Immutable.fromJS({a:{b:{c:11}}}));
        // onChange returning something else has an effect
        newCursor = newCursor.update(() => 999);
        expect(newCursor.deref()).toBe(11);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a:{b:{c:999}}}),
            Immutable.fromJS({a:{b:{c:2}}}),
            ['a', 'b', 'c']
        );

        // and update has been called exactly twice
        expect(onChange.mock.calls.length).toBe(2);
    });

    it('has map API for update shorthand', () => {
        let onChange = jest.genMockFunction();

        let data = Immutable.fromJS(json);
        let aCursor = Cursor.from(data, 'a', onChange);
        let bCursor = aCursor.cursor('b');

        expect(bCursor.set('c', 10).deref()).toEqual(
            Immutable.fromJS({ c: 10 })
        );
        expect(onChange).lastCalledWith(
            Immutable.fromJS({ a: { b: { c: 10 } } }),
            data,
            ['a', 'b', 'c']
        );
    });

    it('creates maps as necessary', () => {
        let data = Immutable.Map();
        let cursor = Cursor.from(data, ['a', 'b', 'c']);
        expect(cursor.deref()).toBe(undefined);
        cursor = cursor.set('d', 3);
        expect(cursor.deref()).toEqual(Immutable.Map({d: 3}));
    });

    it('can set undefined', () => {
        let data = Immutable.Map();
        let cursor = Cursor.from(data, ['a', 'b', 'c']);
        expect(cursor.deref()).toBe(undefined);
        cursor = cursor.set('d', undefined);
        expect(cursor.toJS()).toEqual({d: undefined});
    });

    it('has the sequence API', () => {
        let data = Immutable.Map({a: 1, b: 2, c: 3});
        let cursor = Cursor.from(data);
        expect(cursor.map((x) => x * x)).toEqual(Immutable.Map({a: 1, b: 4, c: 9}));
    });

    it('can push values on a List', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({a: {b: [0, 1, 2]}});
        let cursor = Cursor.from(data, ['a', 'b'], onChange);

        expect(cursor.push(3,4)).toEqual(Immutable.List([0, 1, 2, 3, 4]));
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a: {b: [0, 1, 2, 3, 4]}}),
            data,
            ['a', 'b']
        );
    });

    it('can pop values of a List', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({a: {b: [0, 1, 2]}});
        let cursor = Cursor.from(data, ['a', 'b'], onChange);

        expect(cursor.pop()).toEqual(Immutable.List([0, 1]));
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a: {b: [0, 1]}}),
            data,
            ['a', 'b']
        );
    });

    it('can unshift values on a List', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({a: {b: [0, 1, 2]}});
        let cursor = Cursor.from(data, ['a', 'b'], onChange);

        expect(cursor.unshift(-2, -1)).toEqual(Immutable.List([-2, -1, 0, 1, 2]));
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a: {b: [-2, -1, 0, 1, 2]}}),
            data,
            ['a', 'b']
        );
    });

    it('can shift values of a List', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({a: {b: [0, 1, 2]}});
        let cursor = Cursor.from(data, ['a', 'b'], onChange);

        expect(cursor.shift()).toEqual(Immutable.List([1, 2]));
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a: {b: [1, 2]}}),
            data,
            ['a', 'b']
        );
    });


    it('returns wrapped values for sequence API', () => {
        let data = Immutable.fromJS({a: {v: 1}, b: {v: 2}, c: {v: 3}});
        let onChange = jest.genMockFunction();
        let cursor = Cursor.from(data, [], onChange);

        let found = cursor.find(map => map.get('v') === 2);
        expect(typeof found.deref).toBe('function'); // is a cursor!
        found = found.set('v', 20);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a: {v: 1}, b: {v: 20}, c: {v: 3}}),
            data,
            ['b', 'v']
        );
    });

    it('returns wrapped values for iteration API', () => {
        let jsData = [{val: 0}, {val: 1}, {val: 2}];
        let data = Immutable.fromJS(jsData);
        let cursor = Cursor.from(data);
        cursor.forEach(function (c, i) {
            expect(typeof c.deref).toBe('function'); // is a cursor!
            expect(c.get('val')).toBe(i);
        });
    });

    it('can map over values to get subcursors', () => {
        let data = Immutable.fromJS({a: {v: 1}, b: {v: 2}, c: {v: 3}});
        let cursor = Cursor.from(data);

        let mapped = cursor.map(val => {
            expect(typeof val.deref).toBe('function'); // mapped values are cursors.
            return val;
        }).toMap();
        // Mapped is not a cursor, but it is a sequence of cursors.
        expect(typeof (mapped).deref).not.toBe('function');
        expect(typeof (mapped.get('a')).deref).toBe('function');

        // Same for indexed cursors
        let data2 = Immutable.fromJS({x: [{v: 1}, {v: 2}, {v: 3}]});
        let cursor2 = Cursor.from(data2);

        let mapped2 = cursor2.get('x').map(val => {
            expect(typeof val.deref).toBe('function'); // mapped values are cursors.
            return val;
        }).toList();
        // Mapped is not a cursor, but it is a sequence of cursors.
        expect(typeof mapped2.deref).not.toBe('function');
        expect(typeof mapped2.get(0).deref).toBe('function');
    });

    it('can have mutations apply with a single callback', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({'a': 1});

        let c1 = Cursor.from(data, [], onChange);
        let c2 = c1.withMutations(m => m.set('b', 2).set('c', 3).set('d', 4));

        expect(c1.deref().toObject()).toEqual({'a': 1});
        expect(c2.deref().toObject()).toEqual({'a': 1, 'b': 2, 'c': 3, 'd': 4});
        expect(onChange.mock.calls.length).toBe(1);
    });

    it('can use withMutations on an unfulfilled cursor', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({});

        let c1 = Cursor.from(data, ['a', 'b', 'c'], onChange);
        let c2 = c1.withMutations(m => m.set('x', 1).set('y', 2).set('z', 3));

        expect(c1.deref()).toEqual(undefined);
        expect(c2.deref()).toEqual(Immutable.fromJS(
            { x: 1, y: 2, z: 3 }
        ));
        expect(onChange.mock.calls.length).toBe(1);
    });

    it('maintains indexed sequences', () => {
        let data = Immutable.fromJS([]);
        let c = Cursor.from(data);
        expect(c.toJS()).toEqual([]);
    });

    it('properly acts as an iterable', () => {
        let data = Immutable.fromJS({key: {val: 1}});
        let c = Cursor.from(data).values();
        let c1 = c.next().value.get('val');
        expect(c1).toBe(1);
    });

    it('can update deeply', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({a:{b:{c:1}}});
        let c = Cursor.from(data, ['a'], onChange);
        let c1 = c.updateIn(['b', 'c'], x => x * 10);
        expect(c1.getIn(['b', 'c'])).toBe(10);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a:{b:{c:10}}}),
            data,
            ['a', 'b', 'c']
        );
    });

    it('can set deeply', () => {
        let onChange = jest.genMockFunction();
        let data = Immutable.fromJS({a:{b:{c:1}}});
        let c = Cursor.from(data, ['a'], onChange);
        let c1 = c.setIn(['b', 'c'], 10);
        expect(c1.getIn(['b', 'c'])).toBe(10);
        expect(onChange).lastCalledWith(
            Immutable.fromJS({a:{b:{c:10}}}),
            data,
            ['a', 'b', 'c']
        );
    });

});
