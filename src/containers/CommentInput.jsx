import React from 'react';

const STYLE = {
  textAlign: 'center',
  position: 'absolute',
  bottom: '0px',
  height: '40px',
  width: '100%'
}

const INPUT_STYLE = {
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  width: '80%',
  textAlign: 'center',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: 'whitesmoke',
  padding: '2px 10px',
  fontSize: '26px',
}

class CommentInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    if (e && e.target) {
      const { value } = e.target;
      this.setState({ comment: value || '' });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const { comment } = this.state;
    const { addComment } = this.props;
    const timedComment = comment.trim();
    if (timedComment) {
      addComment(timedComment);
      this.setState({ comment: '' });
    }
  }
  render() {
    const { comment } = this.state;
    return (
      <div style={STYLE}>
        <form onSubmit={this.onSubmit}>
          <input
            style={INPUT_STYLE}
            maxLength="64"
            type="text"
            value={comment}
            placeholder="我要留言..."
            onChange={this.onChange} />
        </form>
      </div>
    )
  }
}

export default CommentInput;