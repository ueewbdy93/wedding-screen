import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../reducers/slide';
import CommentInput from './CommentInput';
import BulletCommentRiver from './BulletCommentRiver';
import './slide.css';

function PicSlider({ index, pictures }) {
  return (
    <div>
      {
        pictures.map((url, i) => {
          if ((i + 1) % pictures.length === index) {
            return <div key={i} className="slide-blur hidden" style={{ backgroundImage: `url("${url}")` }}></div>
          } else if (i === index) {
            return (<div key={i} className="slide-blur visible" style={{ backgroundImage: `url("${url}")` }}></div>)
          }
          return <div key={i} className="slide-blur hidden" style={{ backgroundImage: `url("${url}")` }}></div>
        })
      }
      {
        pictures.map((url, i) => {
          if ((i + 1) % pictures.length === index) {
            return <div key={i} className="slide hidden" style={{ backgroundImage: `url("${url}")` }}></div>
          } else if (i === index) {
            return (<div key={i} className="slide visible" style={{ backgroundImage: `url("${url}")` }}></div>)
          }
          return <div key={i} className="slide hidden" style={{ backgroundImage: `url("${url}")` }}></div>
        })
      }
    </div>
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
