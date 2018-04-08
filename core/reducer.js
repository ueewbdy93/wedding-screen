const { List, Map } = require('immutable');
const Actions = require('./actions');
const socketManager = require('./socketmanager');
const config = require('../config');

class CoreReducer {
  /**
   * @param {Map} state
   * @param {Object} comment
   * @param {string} comment.content
   * @param {string} comment.name
   * @param {string} comment.type
   * @param {Date} comment.createTime
   */
  static addComment(state, comment) {
    const offset = Math.min(
      comment.createTime - state.get('currentRoundStartTime'),
      state.get('commentOffsetMaxMs')
    );
    const newComment = Map({ ...comment, offset });
    return state.update(
      'nextRoundComment',
      List(),
      nextRoundComment => nextRoundComment.push(newComment)
    ).set('currentComment', newComment);
  }

  static printComment(state) {
    const comment = state.get('currentRoundComment').get(0);
    return state.set('currentRoundComment', state.get('currentRoundComment').slice(1))
      .set('nextRoundComment', state.get('nextRoundComment').push(comment))
      .set('currentComment', comment);
  }

  static reset(state) {
    return state.set('currentRoundStartTime', new Date())
      .set('currentRoundComment', state.get('nextRoundComment').concat(state.get('currentRoundComment')))
      .set('nextRoundComment', List())
      .set('currentComment', null);
  }
}


const InitState = Map({
  commentOffsetMaxMs: (config.pic.srcs.length * config.pic.interval) - 1000,
  currentRoundStartTime: new Date(),
  currentRoundComment: List(),
  nextRoundComment: List(),
  currentComment: null,
  socketManager
});

function reducer(state = InitState, action) {
  switch (action.type) {
    case Actions.ADD_COMMENT:
      return CoreReducer.addComment(state, action.comment);
    case Actions.PRINT_COMMENT:
      return CoreReducer.printComment(state);
    case Actions.RESET:
      return CoreReducer.reset(state);
    default:
      return state;
  }
}


module.exports = reducer;
