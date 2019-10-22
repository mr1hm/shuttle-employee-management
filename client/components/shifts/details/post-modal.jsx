import React from 'react';
import './post-modal.css';

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.postShifts = this.postShifts.bind(this);
  }
  handleChange(e) {
    this.setState({ comment: e.currentTarget.value });
  }
  postShifts(e) {
    const { checkedRounds, userId, date } = this.props;
    const { comment } = this.state;
    fetch('/api/post-shift.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checkedRounds, userId, date, comment, type: 'post' })
    });
    /*
      ***
      REDIRECT HERE
      ***
    */

  }
  render() {
    const { toggleModal } = this.props;
    return (
      <>
      <div className="modal-shadow"></div>
      <div className="post-modal">
        <div className="container h-100 d-flex flex-column justify-content-around">
          <div className="row">
            <div className="col">
              <h3>Are you sure you want to post the selected shifts?</h3>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="comment">Please explain this posting:</label>
            <textarea onChange={this.handleChange} className="form-control" name="comment" id="comment" rows="6"></textarea>
          </div>
          <div className="row h-25">
            <div className="col">
              <button className="btn-secondary btn h-75 w-100" onClick={toggleModal}>
                  Cancel
              </button>
            </div>
            <div className="col">
              <button className="btn-primary btn h-75 w-100" onClick={this.postShifts}>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default PostModal;
