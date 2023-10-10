import React , { useCallback, useState }  from 'react';
import CommentInput from './comment-input';
import BulletCommentRiver from './bulletcomment-river';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()({
  visible: {
    opacity: 1,
    transition: 'opacity 2s linear',
  },
  hidden: {
    opacity: 0,
    transition: 'opacity 2s linear',
  },
  slide: {
    position: 'fixed',
    top: '0px',
    bottom: '0px',
    width: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    zIndex: 2,
    ['@media (max-width: 480px)']:{
      backgroundSize: 'contain',
    }
  },
  blur: {
    position: 'fixed',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    zIndex: 1,
  }
})

function PicSlider({ curImage, images }) {
  const { classes, cx } = useStyles();
  // Set "display: none" to the images that didn't show on the page to prevent
  // occupying memory, which would cause mobile safari crash.
  const curImageIndex = images.indexOf(curImage);
  const activeIndices = [
    curImageIndex,
    (curImageIndex + 1 + images.length) % images.length,
    (curImageIndex - 1 + images.length) % images.length
  ];
  return (
    <div>
      {
        images.map((image, index) => (
          <div key={image}
            className={cx({[classes.blur]: true, [classes.visible]: image === curImage, [classes.hidden]: image !== curImage})}
            style={{
              backgroundImage: `url("${image.replace('normal', 'blur')}")`,
              display: activeIndices.includes(index) ? 'block' : 'none'
            }}
          >
          </div>
        ))
      }
      {
        images.map((image, index) => (
          <div key={image}
            className={cx({[classes.slide]: true, [classes.visible]: image === curImage, [classes.hidden]: image !== curImage})}
            style={{
              backgroundImage: `url("${image}")`,
              display: activeIndices.includes(index) ? 'block' : 'none'
            }}>
          </div>
        ))
      }
    </div>
  )
}


/**
 * A slideshow component that displays a picture slider, a bullet comment river, and a comment input.
 * @param {Object} props - The props object containing the current image, an array of images, an array of comments, and a function to add a comment.
 * @param {string} props.curImage - The index of the current image being displayed.
 * @param {readonly string[]} props.images - An array of image objects containing the image URL and caption.
 * @param {readonly {id: string; content: string; top: number}[]} props.comments - An array of comment objects containing the comment text and timestamp.
 * @param {(comment: string)=>void} props.addComment - A function to add a comment to the comments array.
 */
function Slideshow({ curImage, images, comments, addComment }) {
  const [silence, setSilence] = useState(false);

  /**
   * Toggles the silence state.
   */
  const toggleSilence = () => {
    setSilence(prevState => !prevState);
  };


  const handleAddComment = useCallback(
    /**
     * @param {string} comment 
     */
    (comment) => {
      setSilence(false);
      addComment(comment);
    },
    [addComment]
  );

  return (
    <div>
      <PicSlider curImage={curImage} images={images} />
      <BulletCommentRiver comments={comments} />
      <CommentInput
        silence={silence}
        toggleSilence={toggleSilence}
        addComment={handleAddComment}
      />
    </div>
  );
}

export default Slideshow;
