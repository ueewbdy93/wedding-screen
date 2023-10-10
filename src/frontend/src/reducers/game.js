import { emit } from '../socket';
import Cookies from 'js-cookie';
import { GameStage } from '../constants';

// action types
const CLIENT_ADD_PLAYER = '@@CLIENT_ADD_PLAYER';
const CLIENT_CHECK_PLAYER = '@@CLIENT_CHECK_PLAYER';
const CLIENT_SELECT_OPTION = '@@CLIENT_PLAYER_ANSWER';

// reducer with initial state
const initialState = {
  stage: GameStage.JOIN,
  player: null,
  players: [],
  question: null,
  options: [],
  answers: [],
  intervalMs: 8000,
  vote: null,
  curVote: null,
  questionIndex: 0,
  playerVotes: {},
};

export const Actions = {
  init: () => () => {
    try {

      const player = JSON.parse(Cookies.get('player') ?? '{}');
      if (player && player.id) {
        emit({ type: CLIENT_CHECK_PLAYER, payload: player });
      }
    } catch (err) {
      console.error(err);
    }
  },
  /**
   * @param {string} name 
   */
  addPlayer: (name) => () => {
    emit({ type: CLIENT_ADD_PLAYER, payload: name })
  },
  /**
   * 
   * @param {string} answerID 
   * @returns 
   */
  selectOption: (answerID) => (dispatch, getState) => {
    const playerID = getState().game.player.id;
    emit({ type: CLIENT_SELECT_OPTION, payload: { answerID, playerID } });
  }
}

export default function reducer(state = initialState, action) {
  const { payload, type } = action;
  if (type === 'GAME_CHANGE' && payload.player) {
    Cookies.set('player', JSON.stringify(payload.player));
  }
  if (type === 'GAME_CHANGE' && payload.players !== undefined) {
    try {
      const { id } = JSON.parse(Cookies.get('player') ?? '{"id":null}');
      const player = payload.players.find(p => p.id === id);
      payload.player = player;
    } catch (err) {
      console.error(err);
    }
  }
  switch (type) {
    case 'GAME_CHANGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
