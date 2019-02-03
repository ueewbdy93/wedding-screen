import React from 'react';
import { Transition } from 'react-transition-group';
import styles from './bulletcomment.css';

const transitionStyles = {
  entering: { transform: 'translateX(100vw)' },
  entered: { transform: 'translateX(-100%)' },
};

class Comment extends React.Component {
  render() {
    const { top, text } = this.props;
    return (
      <Transition in appear timeout={100}>
        {
          (state) => (
            <span className={styles.bulletcomment} style={{
              ...transitionStyles[state],
              top
            }}>
              {text}
            </span>
          )
        }
      </Transition>
    );
  }
}

function BulletCommentRiver(props) {
  const { comments } = props;
  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          text={comment.content}
          top={comment.top} />
      ))}
    </div>
  );
}

export default BulletCommentRiver;