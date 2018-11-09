import { adminEmit } from '../socket';
// action types
export const ActionTypes = {
  SET_PASSWORD: 'SET_PASSWORD',
  ADMIN_LOGIN: '@@ADMIN_LOGIN',
  ADMIN_CHANGE_MODE: '@@ADMIN_CHANGE_MODE',
  ADMIN_START_QUESTION: '@@ADMIN_START_QUESTION',
  ADMIN_START_ANSWER: '@@ADMIN_START_ANSWER',
  ADMIN_REVEAL_ANSWER: '@@ADMIN_REVEAL_ANSWER',
  ADMIN_SHOW_SCORE: '@@ADMIN_SHOW_SCORE'
};

// reducer with initial state
const initialState = {
  password: null,
  login: false,
  playerAnswers: {},
};

export const Actions = {
  changeMode: (mode) => (dispatch, getState) => {
    const password = getState().admin.password;
    adminEmit({ type: ActionTypes.ADMIN_CHANGE_MODE, payload: mode, password })
  },
  startQuestion: () => (dispatch, getState) => {
    const password = getState().admin.password;
    adminEmit({ type: ActionTypes.ADMIN_START_QUESTION, password })
  },
  startAnswer: () => (dispatch, getState) => {
    const password = getState().admin.password;
    adminEmit({ type: ActionTypes.ADMIN_START_ANSWER, password })
  },
  revealAnswer: () => (dispatch, getState) => {
    const password = getState().admin.password;
    adminEmit({ type: ActionTypes.ADMIN_REVEAL_ANSWER, password })
  },
  showScore: () => (dispatch, getState) => {
    const password = getState().admin.password;
    adminEmit({ type: ActionTypes.ADMIN_SHOW_SCORE, password })
  },
  adminLogin: (password) => (dispatch) => {
    dispatch({ type: ActionTypes.SET_PASSWORD, payload: password })
    adminEmit({ type: ActionTypes.ADMIN_LOGIN, password })
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_PASSWORD:
      return { ...state, password: action.payload };
    case 'ADMIN_CHANGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
