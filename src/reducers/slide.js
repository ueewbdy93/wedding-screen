import { emit } from '../socket';

// action types
const INIT = 'INIT';
const INIT_DONE = 'INIT_DONE';
const NEXT_PIC = 'NEXT_PIC';
const INSERT_COMMENT = 'INSERT_COMMENT';
const NEW_COMMENT = 'NEW_COMMENT';

// reducer with initial state
const initialState = {
  pictures: [],
  index: 0,
  newComment: null
};

export const Actions = {
  addComment: (content) => (dispatch) => {
    emit({ type: '@@CLIENT_ADD_COMMENT', payload: { content } });
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_DONE:
      return { ...state, initing: false, ...action.payload.slide };
      break;
    case 'SLIDE_CHANGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
