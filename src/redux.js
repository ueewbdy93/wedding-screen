// action types
const API_CALL_REQUEST = 'API_CALL_REQUEST';
const API_CALL_SUCCESS = 'API_CALL_SUCCESS';
const API_CALL_FAILURE = 'API_CALL_FAILURE';

// reducer with initial state
const initialState = {
  dog: null,
  error: null,
  fetching: false
};

export function reducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case API_CALL_REQUEST:
      return { ...state, fetching: true, error: null };
      break;
    case API_CALL_SUCCESS:
      return { ...state, fetching: false, dog: action.dog };
      break;
    case API_CALL_FAILURE:
      return {
        ...state, dog: null, error: action.error, fetching: false
      };
      break;
    default:
      return state;
  }
}
