import { emit } from '../socket';

// action types
const INIT_DONE = 'INIT_DONE';

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
    case 'SLIDE_CHANGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
