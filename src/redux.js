// action types
const INIT = 'INIT';
const INIT_DONE = 'INIT_DONE';
const NEXT_PIC = 'NEXT_PIC';
const INSERT_COMMENT = 'INSERT_COMMENT';
const NEW_COMMENT = 'NEW_COMMENT';

// reducer with initial state
const initialState = {
  picUrls: [],
  showPicIndex: 0,
  initing: true,
  newComment: null
};

export function reducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case INIT:
      return { ...state, initing: true };
      break;
    case INIT_DONE:
      return { ...state, initing: false, ...action.data };
      break;
    case NEXT_PIC:
      return { ...state, ...action.data };
    case NEW_COMMENT:
      return { ...state, newComment: action.data };
    default:
      return state;
  }
}
