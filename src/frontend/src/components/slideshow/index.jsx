import React from 'react';
import CommentInput from './comment-input';
import BulletCommentRiver from './bulletcomment-river';
import styles from './slideshow.css';

function PicSlider({ curImage, images }) {
  return (
    <div>
      {
        images.map(image => (
          <div key={image}
            className={`${styles.blur} ${image === curImage ? styles.visible : styles.hidden}`}
            style={{ backgroundImage: `url("${image}")` }}>
          </div>
        ))
      }
      {
        images.map(image => (
          <div key={image}
            className={`${styles.slide} ${image === curImage ? styles.visible : styles.hidden}`}
            style={{ backgroundImage: `url("${image}")` }}>
          </div>
        ))
      }
    </div>
  )
}

class Slideshow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      silence: false
    };
    this.toggleSilence = this.toggleSilence.bind(this);
    this.addComment = this.addComment.bind(this);
  }
  addComment(comment) {
    this.setState({ silence: false });
    this.props.addComment(comment);
  }
  toggleSilence() {
    this.setState((preState) => {
      return { silence: !preState.silence }
    });
  }
  render() {
    const { silence } = this.state;
    const { curImage, images, comments } = this.props;
    return (
      <div>
        <PicSlider curImage={curImage} images={images} />
        <BulletCommentRiver silence={silence} comments={comments} />
        <CommentInput
          silence={silence}
          toggleSilence={this.toggleSilence}
          addComment={this.addComment} />
      </div>
    );
  }
}

export default Slideshow;
