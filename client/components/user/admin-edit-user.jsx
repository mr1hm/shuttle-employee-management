import React from 'react';

class AdminUserEdit extends React.Component {
  render() {
    const { profile, profileError } = this.props;

    if (!profile) return <p>Loading...</p>;
    if (profileError) return <p className="text-danger">{profileError}</p>;

    const { cellProvider, email, firstName, lastName, phone, shirtSize, uciNetId, url } = profile;

    return (
      <React.Fragment>
        <div className='container d-flex ml-5 mr-3'>
          <div className="d-flex flex-column mr-2">
            <div className="profileName mb-3">{`${firstName} ${lastName}`}</div>
            <div className="imageHolder">
              <img className="myInfoPic" src={url} />
            </div>
          </div>
          <div className="container mt-4" >
            <div className="row d-inline" >
              <div className="row">
                <div className="col-6">UCINetID:</div>
                <div className="col-6 mb-2">{uciNetId}</div>
              </div>
              <div className="row">
                <div className="col-6">Email:</div>
                <div className="col-6 mb-2">{email}</div>
              </div>
              <div className="row">
                <div className="col-6">Phone Number:</div>
                <div className="col-6 mb-2">{phone}</div>
              </div>
              <div className="row">
                <div className="col-6">Cell Provider:</div>
                <div className="col-6 mb-2">{cellProvider}</div>
              </div>
              <div className="row">
                <div className="col-6">Shirt Size:</div>
                <div className="col-6 mb-2">{shirtSize}</div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button onClick={this.handleEditButton} className="btn-sm btn-primary mr-5">Edit Info</button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminUserEdit;
