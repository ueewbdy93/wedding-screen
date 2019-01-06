import React from 'react';

const STYLE = {
  position: 'fixed',
  bottom: '10px',
  width: '100%',
  zIndex: 10,
}

class CommentInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      disabled: true,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    window.scrollTo(0, document.body.scrollHeight);
    if (e && e.target) {
      const { value } = e.target;
      this.setState({
        comment: value || '',
        disabled: !value || !value.trim()
      });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const { comment, disabled } = this.state;
    const { addComment } = this.props;
    if (!disabled) {
      addComment(comment.trim());
      this.setState({ comment: '', disabled: true });
    }
  }
  render() {
    const { comment, disabled } = this.state;
    const { toggleSilence, silence } = this.props;
    return (
      <div style={STYLE}>
        <form onSubmit={this.onSubmit} className="d-flex justify-content-center">
          <div className="col-auto mr-2">
            <button onClick={toggleSilence} className="close mt-1 text-white">
              <i className={silence ? 'fas fa-comment-slash' : 'fas fa-comment-dots'}></i>
            </button>
          </div>
          <div className="col-auto p-0">
            <input
              type="text"
              className="form-control"
              placeholder="我要留言…"
              value={comment}
              onChange={this.onChange} />
          </div>
          <div className="col-auto p-0">
            <button
              disabled={disabled}
              onClick={this.onSubmit}
              type="submit"
              className="btn">
              送出
              </button>
          </div>
        </form>
      </div >
    )
  }
}

export default CommentInput;
