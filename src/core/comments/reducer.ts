import lodash from 'lodash';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { addComment, removeComments, setCurrentRoundStartOffset } from './actions';
import { ActionTypes, Comment } from './types';

export type CommentState = {
  readonly comments: ReadonlyArray<Comment>,
  readonly currentRoundStartOffset: number,
};

export const commentsReducer = combineReducers<CommentState, ActionTypes>({
  comments: (state = [], action) => {
    switch (action.type) {
      case getType(addComment):
        return state.concat(action.payload);
      case getType(removeComments):
        return [];
      default:
        return state;
    }
  },
  currentRoundStartOffset: (state = 0, action) => {
    switch (action.type) {
      case getType(setCurrentRoundStartOffset):
        return action.payload.offset;
      default:
        return state;
    }
  },
});


// class CoreReducer {
//   /**
//    * @param {Map} state
//    * @param {Object} comment
//    * @param {string} comment.content
//    * @param {string} comment.name
//    * @param {string} comment.type
//    * @param {Date} comment.createTime
//    */
//   static addComment(state, comment) {
//     const offset = Math.min(
//       comment.createTime - state.get('currentRoundStartTime'),
//       state.get('commentOffsetMaxMs')
//     );
//     const newComment = Map({ ...comment, offset });
//     return state.update(
//       'nextRoundComment',
//       List(),
//       nextRoundComment => nextRoundComment.push(newComment)
//     ).set('currentComment', newComment);
//   }

//   static printComment(state) {
//     const comment = state.get('currentRoundComment').get(0);
//     return state.set('currentRoundComment', state.get('currentRoundComment').slice(1))
//       .set('nextRoundComment', state.get('nextRoundComment').push(comment))
//       .set('currentComment', comment);
//   }

//   static reset(state) {
//     return state.set('currentRoundStartTime', new Date())
//       .set('currentRoundComment', state.get('nextRoundComment')
//       .concat(state.get('currentRoundComment')))
//       .set('nextRoundComment', List())
//       .set('currentComment', null)
//       .set('currentPicIndex', 0);
//   }

//   static nextPicture(state) {
//     return state.update('currentPicIndex', 0, val => (val + 1) % state.get('picCount'));
//   }
// }

// const InitState = Map({
//   commentOffsetMaxMs: ((config.pic.srcs.length * config.pic.interval) / 2) - 1000,
//   currentRoundStartTime: new Date(),
//   currentRoundComment: List(),
//   nextRoundComment: List(),
//   currentComment: null,

//   picCount: config.pic.srcs.length / 2,
//   currentPicIndex: 0
// });

// function reducer(state = InitState, action) {
//   switch (action.type) {
//     case Actions.ADD_COMMENT:
//       return CoreReducer.addComment(state, action.comment);
//     case Actions.PRINT_COMMENT:
//       return CoreReducer.printComment(state);
//     case Actions.RESET:
//       return CoreReducer.reset(state);
//     case Actions.NEXT_PICTURE:
//       return CoreReducer.nextPicture(state);
//     default:
//       return state;
//   }
// }
