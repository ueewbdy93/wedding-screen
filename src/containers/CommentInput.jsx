import React from 'react';

const STYLE = {
  position: 'absolute',
  right: '0px',
  bottom: '10px',
  height: '20px',
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
      const { value = '' } = e.target;
      this.setState({ comment: value.trim() });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const { comment } = this.state;
    const { addComment } = this.props;
    if (comment) {
      addComment(comment);
      this.setState({ comment: '' });
    }
  }
  render() {
    const { comment } = this.state;
    return (
      <div style={STYLE}>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={comment} onChange={this.onChange} />
        </form>
      </div>
    )
  }
}

export default CommentInput;