import { emit } from '../socket';
// action types
export const ActionTypes = {
  ADMIN_CHANGE_MODE: '@@ADMIN_CHANGE_MODE',
  ADMIN_START_QUESTION: '@@ADMIN_START_QUESTION',
  ADMIN_START_ANSWER: '@@ADMIN_START_ANSWER',
  ADMIN_REVEAL_ANSWER: '@@ADMIN_REVEAL_ANSWER',
  ADMIN_SHOW_SCORE: '@@ADMIN_SHOW_SCORE'
};

// reducer with initial state
const initialState = {
  password: null,
};

export const Actions = {
  changeMode: (mode) => () => {
    emit({ type: ActionTypes.ADMIN_CHANGE_MODE, payload: mode })
  },
  startQuestion: () => (dispatch, getState) => {
    console.log(getState());
    emit({ type: ActionTypes.ADMIN_START_QUESTION })
  },
  startAnswer: () => (dispatch) => {
    emit({ type: ActionTypes.ADMIN_START_ANSWER })
  },
  revealAnswer: () => (dispatch) => {
    emit({ type: ActionTypes.ADMIN_REVEAL_ANSWER })
  },
  showScore: () => (dispatch) => {
    emit({ type: ActionTypes.ADMIN_SHOW_SCORE })
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
