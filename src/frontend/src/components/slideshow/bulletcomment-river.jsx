import React, {useRef} from 'react';
import { Transition } from 'react-transition-group';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()({
  bulletComment: {
    fontSize: '40px',
    position: 'fixed',
    textShadow: '-1px 0 whitesmoke, 0 1px whitesmoke, 1px 0 whitesmoke, 0 -1px whitesmoke',
    textAlign: 'left',
    color: 'dimgray',
    zIndex: 100,
    whiteSpace: 'nowrap',
    width: 'max-content',
    fontWeight: 'bold',
    ['@media (max-width: 480px)']: {
      fontSize: '20px'
    }
  }
})

const transitionStyles = {
  exited: { transform: 'translateX(calc(50vw))' },
  entering: { transform: 'translateX(calc(-50vw - 100%))' },
  entered: { transform: 'translateX(calc(-50vw - 100%))' },
};

const Comment = React.memo(
  /**
   * @param {Object} props
   * @param {number} props.top
   * @param {string} props.text
   */
  ({top, text}) => {
  const { classes } = useStyles();
  const nodeRef = useRef(null);
  return (
    <Transition nodeRef={nodeRef} appear in mountOnEnter timeout={10000}>
      {
        (state) => {
          const style= {
            transition: `transform 10000ms linear`,
            top,
            ...transitionStyles[state],
          };
          return <span ref={nodeRef} className={classes.bulletComment} style={style}>
            {text}
          </span>
        }
      }
    </Transition>
  );
});

/**
 * 
 * @param {{comments: readonly {id: string; content: string; top: number}[]}} props 
 * @returns 
 */
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