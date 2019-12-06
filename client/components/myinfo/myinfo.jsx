import React from 'react';
import { connect } from 'react-redux';
import { getUserData } from '../../actions';
import './my-info-page.css';
import TopMenuGeneral from '../topmenu/topmenu-general';

class MyInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editButton: false,
      cellProviderArray: [],
      userInfo: [],
      phone: '',
      cellProvider: '',
      shirt: '',
      image: ''
    };
    this.fetchCellProvider = this.fetchCellProvider.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.handleEditButton = this.handleEditButton.bind(this);
    this.imageSelectedHandler = this.imageSelectedHandler.bind(this);
    this.updateUserInDatabase = this.updateUserInDatabase.bind(this);
  }

  componentDidMount() {
    console.log('Info COmponent Mounted:');
    this.props.getUserData();
    // this.fetchCellProvider();
  }

  handleFormEntry(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  getUserInfo() {
    // const data = {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     'id': this.state.userId
    //   }),
    //   headers: { 'Content-Type': 'application/json' }
    // };
    // fetch(`/api/operator-info.php`, data)
    //   .then(response => response.json())
    //   .then(data => {
    //     this.setState({
    //       userInfo: data,
    //       phone: data[0].phone,
    //       cellProvider: data[0].cell_provider,
    //       shirt: data[0].shirt_size,
    //       image: data[0].url
    //     });
    //   })
    //   .catch(error => { throw (error); });
  }

  // probably a good idea to avoid updating user id this way
  // see line 80
  fetchCellProvider() {
    fetch(`/api/cell-provider.php`, {
      method: 'GET'
    })
      .then(response => {
        this.updateUserId();
        return response.json();
      })
      .then(data => {
        this.setState({
          cellProviderArray: data
        });
      })
      .catch(error => { throw (error); });
  }

  updateUserInDatabase(event) {
    event.preventDefault();
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'id': this.state.userId,
        'phone': this.state.phone,
        'cell_provider': this.state.cellProvider,
        'shirt': this.state.shirt,
        'image': this.state.image
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/operator-update-user.php', data)
      .then(response => { })
      .then(data => {
        this.getUserInfo();
        this.setState({
          editButton: false
        });
      })
      .catch(error => { throw (error); });
  }

  handleEditButton() {
    this.setState({
      editButton: true
    });
  }

  imageSelectedHandler(event) {
    this.setState({
      image: event.target.files[0]
    });
  }

  render() {
    const { profile, profileError } = this.props;
    if (!profile) return <p>Loading...</p>;
    if (profileError) return <p className="text-danger">{profileError}</p>;

    // if (this.state.editButton) {
    //   return (
    //     <React.Fragment>
    //       <TopMenuGeneral title="MY INFO" />
    //       <div className="container d-flex ml-4">
    //         <div className="d-flex flex-column">
    //           <div className="profileName">{stateUserInfo[0].first_name + ' ' + stateUserInfo[0].last_name}</div>
    //           <div className="imageHolder"></div>
    //           <img className="myInfoPic" src={stateUserInfo[0].url} />
    //           <input className="photoInput mt-2" type="file" accept="image/png, image/jpeg" onChange={this.imageSelectedHandler} style={{ border: 'thin solid black', width: '100%' }}/>
    //         </div>
    //         <div className="container ml-4 mt-4">
    //           <form onSubmit={this.updateUserInDatabase}>
    //             <input type="hidden" name="id" value={this.state.userId} />
    //             <div className="row">
    //               <div className="col-6">UCINetID:</div>
    //               <div className="col-6 mb-3">{stateUserInfo[0].uci_net_id}</div>
    //             </div>
    //             <div className="row">
    //               <div className="col-6">Email:</div>
    //               <div className="col-6 mb-3">{stateUserInfo[0].email}</div>
    //             </div>
    //             <div className="row">
    //               <div className="col-6">Phone #:</div>
    //               <input className="col-6 mb-3 editInput" pattern="^[0-9]{10}$" required id="phoneNumberInput" type="tel" name="phone"
    //                 onChange={this.handleFormEntry} defaultValue={stateUserInfo[0].phone} />
    //             </div>
    //             <div className="row">
    //               <div className="col-6">Cell Provider:</div>
    //               <select className="col-6 mb-3 editInput" placeholder="Cell Provider" type="text" name="cellProvider" onChange={this.handleFormEntry} defaultValue={stateUserInfo[0].cell_provider}>
    //                 {this.state.cellProviderArray.map((cell, index) => <option key={index} value={cell.cell_provider}>{cell.cell_provider}</option>)}
    //               </select>
    //             </div>
    //             <div className="row">
    //               <div className="col-6">Shirt Size</div>
    //               <select className="col-6 mb-2 editInput" placeholder="Shirt Size" type="text" name="shirt" onChange={this.handleFormEntry} defaultValue={stateUserInfo[0].shirt_size}>
    //                 <option value="S">S</option>
    //                 <option value="M">M</option>
    //                 <option value="L">L</option>
    //                 <option value="XL">XL</option>
    //                 <option value="XXL">XXL</option>
    //               </select>
    //             </div>
    //             <div className="d-flex justify-content-end mt-4">
    //               <button className='btn btn-primary' type="submit" name="submit">SAVE</button>
    //             </div>
    //           </form>
    //         </div>
    //       </div>
    //     </React.Fragment>
    // );
    // }
    const { cellProvider, email, firstName, lastName, phone, shirtSize, uciNetId, url } = profile;

    return (
      <React.Fragment>
        <TopMenuGeneral userId={this.props.userId} title="MY INFO" />
        <div className='container d-flex ml-5 mr-3'>
          <div className="d-flex flex-column mr-2">
            <div className="profileName mb-3">{`${firstName} ${lastName}`}</div>
            <div className="imageHolder">
              <img className="myInfoPic" src={url}/>
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

function mapStateToProps({ user }) {
  return {
    profile: user.profile,
    profileError: user.profileError
  };
}

export default connect(mapStateToProps, { getUserData })(MyInfo);
