import React from 'react';

const STYLE = {
  textAlign: 'center',
  position: 'absolute',
  bottom: '0px',
  height: '100%',
  width: '100%',
  zIndex: 10,
}

const INPUT_STYLE = {
  marginBottom: '20px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  width: '70%',
  textAlign: 'center',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: 'whitesmoke',
  padding: '5px 10px',
  fontSize: '16px',
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
        <table style={{ position: 'relative', height: '100%', width: '100%', verticalAlign: 'bottom' }}>
          <tbody>
            <tr style={{ verticalAlign: 'bottom' }}>
              <td>
                <button onClick={toggleSilence} style={{ ...INPUT_STYLE, width: '40px' }}>
                  <i className={silence ? 'fas fa-comment-slash' : 'fas fa-comment-dots'}></i>
                </button>
              </td>
              <td>
                <form onSubmit={this.onSubmit}>
                  <input
                    style={INPUT_STYLE}
                    maxLength="64"
                    type="text"
                    value={comment}
                    placeholder="我要留言..."
                    onChange={this.onChange} />
                  <input
                    disabled={disabled}
                    type="button"
                    style={{ ...INPUT_STYLE, width: '50px', marginLeft: '1px' }}
                    value="送出"
                    onClick={this.onSubmit} />
                </form>
              </td>
              </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default CommentInput;
