// action types
const CHANGE_MODE = 'common/CHANGE_MODE';

// reducer with initial state
const initialState = {
  mode: -1
};

export const Actions = {
  changeMode: (mode) => (dispatch) => {
    dispatch({ type: CHANGE_MODE, data: mode });
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'MODE_CHANGE':
      return { ...action.payload };
    default:
      return state;
  }
}
