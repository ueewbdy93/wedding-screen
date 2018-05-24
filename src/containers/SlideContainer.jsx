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
        pictures.map(({ blur }, i) => {
          if ((i + 1) % pictures.length === index) {
            return <div key={i} className="slide-blur hidden" style={{ backgroundImage: `url("${blur}")` }}></div>
          } else if (i === index) {
            return (<div key={i} className="slide-blur visible" style={{ backgroundImage: `url("${blur}")` }}></div>)
          }
          return <div key={i} className="slide-blur hidden" style={{ backgroundImage: `url("${blur}")` }}></div>
        })
      }
      {
        pictures.map(({ origin }, i) => {
          if ((i + 1) % pictures.length === index) {
            return <div key={i} className="slide hidden" style={{ backgroundImage: `url("${origin}")` }}></div>
          } else if (i === index) {
            return (<div key={i} className="slide visible" style={{ backgroundImage: `url("${origin}")` }}></div>)
          }
          return <div key={i} className="slide hidden" style={{ backgroundImage: `url("${origin}")` }}></div>
        })
      }
    </div>
  )
}

class Slide extends Component {
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
    const { index, pictures, newComment } = this.props;
    return (
      <div>
        <PicSlider index={index} pictures={pictures} />
        <BulletCommentRiver silence={silence} newComment={newComment} />
        <CommentInput silence={silence} toggleSilence={this.toggleSilence} addComment={this.addComment} />
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
