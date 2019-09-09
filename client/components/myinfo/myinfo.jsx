import React from 'react';
import './my-info-page.css';
import TopMenuGeneral from '../topmenu/topmenu-general';

class MyInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      editButton:false,
      userInfo:[]
    }
    this.fetchCallMethod=this.fetchCallMethod.bind(this);
    this.handleEditButton=this.handleEditButton.bind(this);
  }
  componentDidMount(){
    this.fetchCallMethod();
  }

  fetchCallMethod() {
    fetch(`/api/my-info-page.php?id=`+ 20, {
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

    handleEditButton(){
      this.setState({
        editButton:true
      })
      fetch(`/api/my-info-update.php?id=` + 20,{
        method:'GET'
      })
        .then(response => {
          return response.json()
        })
        .catch(error => { throw (error) });
    }

  render() {
    const stateUserInfo = this.state.userInfo;
    const stateEditButton = this.state.editButton;
    if(!stateUserInfo.length){return null};
    if(stateEditButton === true){
      return (
        <React.Fragment>
          <TopMenuGeneral title="MY INFO" />
          <div className="container" className="col" style={{ top: "40%", left: "40%", position: "absolute" }}>
            <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >MY INFO
              <form action="/api/my-info-update.php" method="POST">
                <input type="hidden" name="id" value="20"/>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Email</label>
                  <div className="col-sm-10">
                    <input type="text" name="email"  placeholder="Email"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Phone Number</label>
                  <div className="col-sm-10">
                   <input type="text" name="phone" placeholder="Phone Number" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Cell Provider</label>
                  <div className="col-sm-10">
                    <input type="text" name="cellProvider" placeholder="Cell Provider" />
                  </div>
                </div>
                <div className="form-group row">
                 <label className="col-sm-2 col-form-label">Shirt Size</label>
                  <div className="col-sm-10">
                    <input type="text" name="shirtSize" placeholder="Shirt Size" />
                  </div>
                </div>
                <button className="save" type="submit" name="submit">SAVE</button>
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
          <button className="upload">Upload Photo ></button>
        </div>
        <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
          <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >MY INFO
            <div className="row">
              <div className="col">UCINetID</div>
              <div className="w-0"></div>
              <div className="col">{stateUserInfo[0].uci_net_id}</div>
            </div>
            <div className="row">
              <div className="col">Email</div>
              <div className="w-0"></div>
              <div className="col">{stateUserInfo[0].email}</div>
            </div>
            <div className="row">
              <div className="col">Phone Number</div>
              <div className="w-0"></div>
              <div className="col">{stateUserInfo[0].phone}</div>
            </div>
            <div className="row">
              <div className="col">Cell Provider</div>
              <div className="w-0"></div>
              <div className="col">{stateUserInfo[0].cell_provider}</div>
            </div>
            <div className="row">
              <div className="col">Shirt Size</div>
              <div className="w-0"></div>
              <div className="col">{stateUserInfo[0].shirt_size}</div>
            </div>
            <button onClick={this.handleEditButton} className="btn btn-primary">Edit Info</button>
          </div>
        </div>

      </React.Fragment>
    );

  }
}

export default MyInfo;
