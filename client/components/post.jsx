import React from 'react';
import { Link } from 'react-router-dom';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedRounds: this.props.location.state.checkedRounds
    };
  }
  componentDidMount() {

  }
  getRounds() {

  }
  render() {
    const { checkedRounds } = this.state;
    return (
      <div className="container mt-2">
        <div className="row">
          <div className="col text-center">
            <h1>Would you like to post {checkedRounds.length > 1 ? 'these shifts?' : 'this shift?'}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">

          </div>
        </div>
      </div>
    );
  }
}

export default Post;
