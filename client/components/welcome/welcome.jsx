import React from 'react';
import TopMenuGeneral from '../topmenu/topmenu-general';
import './welcome.css';
​
class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }
​
  render() {
    return (
      <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg">
        <TopMenuGeneral title="WELCOME" />
        <div class="col-md-5 p-lg-5 mx-auto my-5 bg-ae-blue">
          <kbd class="display-4 font-weight-normal bg-transparent">ANTEATER EXPRESS</kbd>
        </div>
        <p >Anteater Express is UCI's campus bus system. Our website is the shift scheduling platform for student drivers and administrators. It lets the drivers read, add, remove, trade, and swap desired shifts. Administrators are able to set up initial shifts and accept ordeny changes requested by drivers.</p>
      </div>
    );
  }
}
export default Welcome;