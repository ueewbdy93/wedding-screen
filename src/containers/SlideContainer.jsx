import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommentInput from './CommentInput';
import BulletCommentRiver from './BulletCommentRiver';
import './slide.css';

const STYLE = {
  position: 'absolute',
  top: '0px',
  bottom: '0px',
  width: '100%',
  /* Center and scale the image nicely */
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}

function PicSlider({ showPicIndex, picUrls }) {
  return (
    <div>{
      picUrls.map((url, i) => {
        if ((i + 1) % picUrls.length === showPicIndex) {
          return <div key={i} className="hidden" style={{ ...STYLE, backgroundImage: `url("${url}")` }}></div>
        } else if (i === showPicIndex) {
          return <div key={i} className="visible" style={{ ...STYLE, backgroundImage: `url("${url}")` }}></div>
        }
        return <div key={i} className="hidden" style={{ ...STYLE, backgroundImage: `url("${url}")` }}></div>
      })
    }</div>
  )
}

class Slide extends Component {
  render() {
    const { initing, showPicIndex, picUrls, insertComment, newComment } = this.props;
    return (
      <div>
        {initing && <span>initing</span>}
        {!initing && <PicSlider showPicIndex={showPicIndex} picUrls={picUrls} />}
        <BulletCommentRiver newComment={newComment} />
        <CommentInput insertComment={insertComment} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    picUrls: state.picUrls,
    showPicIndex: state.showPicIndex,
    initing: state.initing,
    newComment: state.newComment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    insertComment: (comment) => dispatch({ type: 'INSERT_COMMENT', data: comment })
    // onRequestDog: () => dispatch({ type: "API_CALL_REQUEST" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Slide);
