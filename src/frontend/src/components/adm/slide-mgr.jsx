import React from 'react';

const HEIGHT = document.documentElement.clientHeight * 0.7;

class SlideMgr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      disabled: true
    };
    this.onClearComment = this.onClearComment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onClearComment() {
    if (window.confirm('確定要清除所有留言?')) {
      this.props.onClearComment();
    }
  }
  onChange(e) {
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
    const { onInsertComment } = this.props;
    if (!disabled) {
      onInsertComment(comment.trim());
      this.setState({ comment: '', disabled: true });
    }
  }
  render() {
    const { comments } = this.props;
    const { disabled, comment } = this.state;
    return (
      <div className="h-100 position-relative w-100">
        <div
          className="position-absolute w-100"
          style={{ overflowY: 'auto', top: '0px', bottom: '50px' }}>
          {comments.length === 0 && <small>目前沒有留言</small>}
          {
            comments.length > 0 && comments.map(comment => (
              <span key={comment.id} style={{ display: 'block' }}>
                <small>{comment.datetime}</small>{` ${comment.content}`}
              </span>
            ))
          }
        </div>
        <form
          className="position-absolute w-100"
          style={{ bottom: '0px', height: '50px' }}
          onSubmit={this.onSubmit}>
          <div className="form-row align-items-center">
            <div className="col">
              <input
                className="form-control"
                maxLength="64"
                type="text"
                value={comment}
                placeholder="我要留言..."
                onChange={this.onChange} />
            </div>
            <div className="col-auto">
              <input
                className="btn btn-primary"
                disabled={disabled}
                type="submit"
                value="送出"
                onClick={this.onSubmit} />
            </div>
          </div>
          <button className="btn btn-link btn-sm" onClick={this.onClearComment}>清除所有留言</button>
        </form>
      </div>
    );
  }
}

export default SlideMgr;