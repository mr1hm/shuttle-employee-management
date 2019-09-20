import React from 'react';
import './my-info-page.css';
import TopMenuGeneral from '../topmenu/topmenu-general';

class MyInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      editButton:false,
      userInfo:[],
      userId: 19,
      cellProvider:[]
    }
    this.saveUploadedImageTofile = this.saveUploadedImageTofile.bind(this);
    this.fetchCellProvider = this.fetchCellProvider.bind(this);
    this.handlePhoneValidation = this.handlePhoneValidation.bind(this);
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.handleEditButton = this.handleEditButton.bind(this);
  }
  componentDidMount(){
    this.fetchCallMethod();
    this.fetchCellProvider();
  }

  fetchCallMethod() {
    fetch(`/api/my-info-page.php?id=`+ this.state.userId, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          userInfo: response
        })
      })
      .catch(error => { throw (error) });
    }

    fetchCellProvider(){
      fetch(`/api/my-info-cell-provider.php`, {
        method: 'GET'
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
          this.setState({
            cellProvider: response
          })
        })
        .catch(error => { throw (error) });
    }

    saveUploadedImageTofile(event){
      event.preventDefault();
      const form = new FormData(event.target);
        fetch(`/api/my-info-uploadimage.php`, {
          method: 'POST',
          body: form
        })
          .then(response => {
            return response.json()
          })
          .then(response => {
            console.log(response)
          })
          .catch(error => { throw (error) });

    }

    handleEditButton(){
      this.setState({
        editButton: true
      })
    }

    handlePhoneValidation(event){
    this.state.userInfo[0].cell_provider += event.currentTarget.value;
    }

  render() {
    const stateCellProvider= this.state.cellProvider;
    const stateUserInfo = this.state.userInfo;
    const stateEditButton = this.state.editButton;
    if(!stateUserInfo.length){return null};
    if(stateEditButton === true){
      return (
        <React.Fragment>
          <TopMenuGeneral title="MY INFO" />
          <div className="profileName">{stateUserInfo[0].first_name}{stateUserInfo[0].last_name}</div>
          <div className="imageHolder">
            <img className="myInfoPic" src={stateUserInfo[0].url} />
            <form method="POST" encType="multipart/form-data" onSubmit={(event => this.saveUploadedImageTofile(event))}>
              <label htmlFor="files" className="upload">Upload Image ></label>
              <input name="fileName" accept="image/png, image/jpeg" id="files" style={{ visibility: "hidden" }} type="file" />
              <input className="upload " type="submit" value="Save Profile Image" />
            </form>
          </div>
          <div className="container" className="w-50" style={{ top: "14%", left: "40%", position: "absolute" }}>
            <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >
              <form action="/api/my-info-update.php" method="POST">
                <input type="hidden" name="id" value={this.state.userId} />
                <div className="row">
                  <div className="col-6">UCINetID</div>
                  <div className="col-6" className="mb-3">{stateUserInfo[0].uci_net_id}</div>
                </div>
                <div className="row">
                  <div className="col-6">Email</div>
                  <div className="col-6" className="mb-3">{stateUserInfo[0].email}</div>
                </div>
                  <div className="row">
                  <div className="col-6">Phone Number</div>
                  <small className="phoneLabel">format:(0000000000)</small>
                  <input className="col-6 mb-3 editInput" pattern="^[0-9]{10}$" required id="phoneNumberInput" type="tel" name="phone"
                     onChange={this.handlePhoneValidation} defaultValue={stateUserInfo[0].phone} />
                </div>
                  <div className="row">
                  <div className="col-6">Cell Provider</div>
                  <select className="col-6 mb-3 editInput" type="text" name="cellProvider"
                    placeholder="Cell Provider" defaultValue={stateUserInfo[0].cell_provider}>
                    {this.state.cellProvider.map((cell, index) => <option key={index} value={cell.cell_provider}>{cell.cell_provider}</option>)}
                  </select>
                </div>
                  <div className="row">
                  <div className="col-6">Shirt Size</div>
                  <select className="col-6 mb-2 editInput" placeholder="Shirt Size" type="text" name="shirtSize"
                    defaultValue={stateUserInfo[0].shirt_size}>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <button className="save" type="submit" name="submit" className="btn btn-primary but">SAVE</button>
              </form>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <TopMenuGeneral title="MY INFO" />
        <div className="profileName">{stateUserInfo[0].first_name}{stateUserInfo[0].last_name}</div>
        <div className="imageHolder">
          <img className="myInfoPic" src={stateUserInfo[0].url}/>
        </div>
        <div className="container" className="w-50" style={{ top: "14%", left: "40%", position: "absolute" }}>
          <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >
            <div className="row">
              <div className="col-6">UCINetID</div>
              <div className="col-6" className="mb-3">{stateUserInfo[0].uci_net_id}</div>
            </div>
            <div className="row">
              <div className="col-6">Email</div>
              <div className="col-6" className="mb-3">{stateUserInfo[0].email}</div>
            </div>
            <div className="row">
              <div className="col-6">Phone Number</div>
              <div className="col-6" className="mb-3">{stateUserInfo[0].phone}</div>
            </div>
            <div className="row">
              <div className="col-6">Cell Provider</div>
              <div className="col-6" className="mb-3">{stateUserInfo[0].cell_provider}</div>
            </div>
            <div className="row">
              <div className="col-6">Shirt Size</div>
              <div className="col-6" className="mb-2">{stateUserInfo[0].shirt_size}</div>
            </div>
            <button onClick={this.handleEditButton} className="btn btn-primary but">Edit Info</button>
          </div>
        </div>
      </React.Fragment>
    );

  }
}

export default MyInfo;
