import { adminEmit } from '../socket';
// action types
export const ActionTypes = {
    SET_PASSWORD: 'SET_PASSWORD',
    ADMIN_LOGIN: '@@ADMIN_LOGIN',
    ADMIN_CHANGE_MODE: '@@ADMIN_CHANGE_MODE',
    ADMIN_START_QUESTION: '@@ADMIN_START_QUESTION',
    ADMIN_START_ANSWER: '@@ADMIN_START_ANSWER',
    ADMIN_REVEAL_ANSWER: '@@ADMIN_REVEAL_ANSWER',
    ADMIN_SHOW_SCORE: '@@ADMIN_SHOW_SCORE',
    ADMIN_CLEAR_COMMENT: '@@ADMIN_CLEAR_COMMENT',
    ADMIN_INSERT_COMMENT: '@@ADMIN_INSERT_COMMENT',
    ADMIN_RESET_GAME: '@@ADMIN_RESET_GAME',
};

// reducer with initial state
const initialState = {
    password: null,
    login: false,
    playerVotes: {},
    comments: [],
    question: null
};

export const Actions = {
    onResetGame: () => (dispatch, getState) => {
        const password = getState().admin.password;
        adminEmit({ type: ActionTypes.ADMIN_RESET_GAME, password });
    },
    onInsertComment: (content) => (dispatch, getState) => {
        const password = getState().admin.password;
        adminEmit({ type: ActionTypes.ADMIN_INSERT_COMMENT, password, payload: { content } });
    },
    onClearComment: () => (dispatch, getState) => {
        const password = getState().admin.password;
        adminEmit({ type: ActionTypes.ADMIN_CLEAR_COMMENT, password })
    },
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

const DATE_OPTIONS = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
function dateToString(ts) {
    const date = new Date(ts);
    return `${date.toLocaleTimeString('en-US', DATE_OPTIONS)}`;
}

export default function reducer(state = initialState, action) {
    if (action.type === ActionTypes.SET_PASSWORD) {
        return { ...state, password: action.payload };
    }
    if (action.type !== 'ADMIN_CHANGE') {
        return state;
    }
    if (action.payload.newComment) {
        const { newComment } = action.payload;
        state.comments = [{
            ...newComment, datetime: dateToString(newComment.createAt)
        }, ...state.comments];
    }
    if (action.payload.comments) {
        state.comments = action.payload.comments.map(c => {
            c.datetime = dateToString(c.createAt);
            return c;
        }).reverse();
    }
    return { ...state, ...action.payload };
}
