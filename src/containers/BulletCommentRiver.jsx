import React from 'react';
import { Transition } from 'react-transition-group';
import './bulletcomment.css';

const MAX_DURATION = 94; // second

const defaultStyle = {
  position: 'absolute',
  right: '0px',
  whiteSpace: 'nowrap',
  width: '0%',
  transitionTimingFunction: 'linear',
  transitionProperty: 'width',
  textShadow: '-1px 0 whitesmoke, 0 1px whitesmoke, 1px 0 whitesmoke, 0 -1px whitesmoke',
  textAlign: 'left',
  overflow: 'hidden',
  color: 'dimgray',
  zIndex: 100,
}

const transitionStyles = {
  entering: { width: '0%' },
  entered: { width: '500%' },
};

class Comment extends React.Component {
  render() {
    const { top, text, duration } = this.props;
    return (
      <Transition in appear timeout={100}>
        {(state) => (
          <span className="bulletcomment" style={{
            ...defaultStyle,
            ...transitionStyles[state],
            top,
            transitionDuration: `${duration}s`
          }}>
            {text}
          </span>
        )}
      </Transition>
    );
  }
}

function calculate(slotWeight) {
  const sum = slotWeight.reduce((pre, cur) => pre + cur, 0);
  let rand = Math.floor(Math.random() * sum);
  for (let i = 0; i < slotWeight.length; i += 1) {
    if (rand < slotWeight[i]) {
      return i;
    }
    rand = rand - slotWeight[i];
  }
  return slotWeight.length - 1;
}

class BulletCommentRiver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slotWeight: new Array(32).fill(64),
      comments: []
    }
  }

  normalizeLength(str) {
    const l = str.length;
    let len = 0;
    for (let i = 0; i < l; i += 1) {
      let cc = str.charCodeAt(i);
      while (cc > 0) {
        len += 1;
        cc = cc >> 8;
      }
    }
    return len;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newComment !== nextProps.newComment && nextProps.newComment && nextProps.silence === false) {
      this.setState((preState) => {
        const chooseSlot = calculate(preState.slotWeight);
        const slotWeight = preState.slotWeight.map((v, i) => {
          if (i === chooseSlot) {
            return Math.max(v - 31, 0);
          }
          return v + 1;
        });
        const now = Date.now();
        const comments = preState.comments.filter(({ createAt }) => now - createAt < MAX_DURATION * 1000);

        const duration = MAX_DURATION - Math.min(64, this.normalizeLength(nextProps.newComment.content) * 4);
        comments.push({
          ...nextProps.newComment,
          duration,
          top: `${(chooseSlot + 1) * 2.5}%`,
          createAt: Date.now()
        });
        return { slotWeight, comments };
      })
    }
  }
  render() {
    const { comments } = this.state;
    return (
      <div>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            text={comment.content}
            top={comment.top}
            duration={comment.duration} />
        ))}
      </div>
    );
  }
}

export default BulletCommentRiver;