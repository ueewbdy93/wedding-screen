import React from 'react';

const STYLE = {
  position: 'absolute',
  left: 'auto',
  whiteSpace: 'nowrap'
}

function calculate(candidates) {
  const sum = candidates.reduce((pre, cur) => pre + cur, 0);
  let rand = Math.floor(Math.random() * sum);
  for (let i = 0; i < candidates.length; i += 1) {
    if (rand < candidates[i]) {
      return i;
    }
    rand = rand - candidates[i];
  }
  return candidates.length - 1;
}

class BulletCommentRiver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: new Array(32).fill(64),
      comments: []
    }
  }
  componentDidMount() {
    this.handler = setInterval(() => {
      this.setState((preState) => {
        const comments = preState.comments
          .filter(({ offset }) => offset < 10000)
          .map(comment => ({ ...comment, offset: comment.offset + comment.step }));
        return { ...preState, comments };
      })
    }, 60)
  }
  componentWillUnmount() {
    if (this.handler) {
      clearInterval(this.handler);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.newComment !== nextProps.newComment) {
      this.setState((preState) => {
        const chooseSlot = calculate(preState.candidates);
        const candidates = preState.candidates.map((v, i) => {
          if (i === chooseSlot) {
            return Math.max(v - 31, 0);
          }
          return v + 1;
        });
        const comments = [...preState.comments];
        const step = Math.floor(Math.random() * 5) + 1;
        comments.push({ slot: chooseSlot, offset: 0, comment: nextProps.newComment, step });
        return { candidates, comments };
      })
    }
  }
  render() {
    const { comments } = this.state;
    return (
      <div style={{ overflow: 'hidden' }}>
        {comments.map((comment, i) => (
          <span key={comment.comment} style={{ ...STYLE, right: `${comment.offset}px`, top: `${(comment.slot + 1) * 2.5}%` }}>
            {comment.comment}
          </span>
        ))}
      </div>
    );
  }
}

export default BulletCommentRiver;