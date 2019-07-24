import React from 'react';


 class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="container" style={{ top: "40%", left: "20%", position: "absolute" }}>
        <div className="row" style={{ display: "inline", transform: "translate(-50%, -50%)"}} > This will be where Login, Welcome, and Shift will render</div>
      </div>

    );
  }
}
export default App;
