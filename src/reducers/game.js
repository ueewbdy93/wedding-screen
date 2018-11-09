import { emit } from '../socket';
import Cookies from 'js-cookie';
import { GameStage } from '../constants';

// action types
const CLIENT_ADD_PLAYER = '@@CLIENT_ADD_PLAYER';
const CLIENT_CHECK_PLAYER = '@@CLIENT_CHECK_PLAYER';
const CLIENT_SELECT_OPTION = '@@PLAYER_ANSWER';

// reducer with initial state
const initialState = {
  stage: GameStage.JOIN,
  player: null,
  players: [],
  question: null,
  options: [],
  rank: [],
  answer: null,
  selectedOption: null,
  intervalMs: 8000,
  vote: null,
};

export const Actions = {
  init: () => (dispatch) => {
    const player = Cookies.getJSON('player');
    if (player && player.id) {
      emit({ type: CLIENT_CHECK_PLAYER, payload: player });
    }
  },
  addPlayer: (name) => () => {
    emit({ type: CLIENT_ADD_PLAYER, payload: name })
  },
  selectOption: (answerID) => (dispatch, getState) => {
    const playerID = getState().game.player.id;
    emit({ type: CLIENT_SELECT_OPTION, payload: { answerID, playerID } });
  }
}

export default function reducer(state = initialState, action) {
  const { payload, type } = action;
  if (type === 'GAME_CHANGE' && payload.player) {
    Cookies.set('player', payload.player);
  }
  switch (type) {
    case 'GAME_CHANGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
