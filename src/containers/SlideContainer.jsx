import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../reducers/slide';
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

function PicSlider({ index, pictures }) {
  return (
    <div>{
      pictures.map((url, i) => {
        if ((i + 1) % pictures.length === index) {
          return <div key={i} className="hidden" style={{ ...STYLE, backgroundImage: `url("${url}")` }}></div>
        } else if (i === index) {
          return <div key={i} className="visible" style={{ ...STYLE, backgroundImage: `url("${url}")` }}></div>
        }
        return <div key={i} className="hidden" style={{ ...STYLE, backgroundImage: `url("${url}")` }}></div>
      })
    }</div>
  )
}

class Slide extends Component {
  render() {
    const { index, pictures, addComment, newComment } = this.props;
    return (
      <div>
        <PicSlider index={index} pictures={pictures} />
        <BulletCommentRiver newComment={newComment} />
        <CommentInput addComment={addComment} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pictures: state.slide.pictures,
    index: state.slide.index,
    newComment: state.slide.newComment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addComment: bindActionCreators(Actions.addComment, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Slide);
