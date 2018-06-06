import React from 'react';
import CommentInput from './commentInput';
import BulletCommentRiver from './bulletCommentRiver';
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

class Slide extends React.Component {
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

export default Slide;
