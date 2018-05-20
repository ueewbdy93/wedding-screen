// action types

// reducer with initial state
const initialState = {
  stage: null,
  player: null,
  players: [],
  question: null,
  options: [],
  score: [],
  solution: null
};

export const Actions = {
  startQuestion: () => (dispatch) => { },
  startAnswer: () => (dispatch) => { }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
