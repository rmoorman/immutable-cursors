import API from './API';
import KeyedCursor from './KeyedCursor';
import IndexedCursor from './IndexedCursor';

let api = new API();

export default {
	from: api.cursorFrom.bind(api),
	KeyedCursor: KeyedCursor,
	IndexedCursor: IndexedCursor,
	api: api,
	API: API
};
