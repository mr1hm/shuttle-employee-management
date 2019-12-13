import React from 'react';

class AddUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      role: 'default',
      special: '0',
      status: 'active',
      uciNetId: ''
    };

    this.emailDomain = '@uci.edu';
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  inputChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const formValues = { ...this.state, email: this.state.uciNetId + this.emailDomain };

    console.log('Form Values:', formValues);
  }

  render() {
    const { open } = this.props;

    if (!open) {
      return null;
    }

    const { firstName, lastName, role, special, status, uciNetId } = this.state;

    return (
      <div className="add-user-modal">
        <div className="add-user-modal-content">
          <form className="p-4" onSubmit={this.handleSubmit}>
            <h3>Add New User</h3>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="uciNetId">UCI Net ID</label>
                  <input className="form-control" type="text" id="uciNetId" name="uciNetId" value={uciNetId} onChange={this.inputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input className="form-control" type="text" id="firstName" name="firstName" value={firstName} onChange={this.inputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input className="form-control" type="text" id="lastName" name="lastName" value={lastName} onChange={this.inputChange} />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input className="form-control" type="email" id="email" value={uciNetId + this.emailDomain} readOnly />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="roles">User Role</label>
                  <select className="form-control" id="roles" name="role" value={role} onChange={this.inputChange}>
                    <option value="default" disabled>Select a role</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">User Status</label>
                  <select className="form-control" id="status" name="status" value={status} onChange={this.inputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="special">Special Routes Okay?</label>
                  <select className="form-control" id="special" name="special" value={special} onChange={this.inputChange}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="d-flex justify-content-center pt-5">
                  <button className="btn btn-danger mr-3" type="button">Cancel</button>
                  <button className="btn btn-success">Add User</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// class AddUserModal extends React.Component {
//   render() {
//     return (
//       <div className={this.props.showAddUserModal ? 'modal display-block' : 'modal display-none'}>
//         <section className='modal-main'>
//           <div className="d-flex justify-content-around">
//             <div className="d-flex justify-content-center">
//               <form onSubmit={this.addUserToDatabase}>
//                 <div className="mt-5 ml-2 mr-2 mb-2">
//                   <div>UCI-ID</div>
//                   <input type='text' className='form-control' name="userId" value={''} contentEditable="true" onChange={this.handleFormEntry} />
//                 </div>
//                 <div className="m-2">
//                   <div>First Name</div>
//                   <input type='text' className='form-control' name="firstName" value={''} contentEditable="true" onChange={this.handleFormEntry} />
//                 </div>
//                 <div className="m-2">
//                   <div>Last Name</div>
//                   <input type='text' className='form-control' name="lastName" value={''} contentEditable="true" onChange={this.handleFormEntry} />
//                 </div>
//                 <div className="m-2">
//                   <div>Role</div>
//                   <select name="role" value={'operator'} onChange={this.handleFormEntry}>
//                     <option></option>
//                     <option value='operator'>operator</option>
//                     <option value='operations'>operations</option>
//                     <option value='trainer'>trainer</option>
//                     <option value='trainee'>trainer</option>
//                   </select>
//                 </div>
//                 <div className="m-2">
//                   <div>Status</div>
//                   <select name="status" value={'active'} onChange={this.handleFormEntry}>
//                     <option></option>
//                     <option value='active'>active</option>
//                     <option value='inactive'>inactive</option>
//                   </select>
//                 </div>
//                 <div className="m-2">
//                   <div>Special Route OK</div>
//                   <select name="specialRouteOK" value={'0'} onChange={this.handleFormEntry}>
//                     <option></option>
//                     <option value='0'>True</option>
//                     <option value='1'>False</option>
//                   </select>
//                 </div>
//                 <div className="m-2">
//                   <div>Email</div>
//                   <input type='text' className='form-control' name="email" value={''} contentEditable="true" onChange={this.handleFormEntry} />
//                 </div>
//                 <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
//                   <button className="btn-success mr-2" type='submit'>Submit</button>
//                   <button className="btn-danger ml-2" type='reset' onClick={this.closeAddUserModalClearInfo} >Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }

export default AddUserModal;
