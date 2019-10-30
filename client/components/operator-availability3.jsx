import React from 'react';
// import TableDragSelect from 'react-table-drag-select';
// import 'react-table-drag-select/style.css';
// import TableDragSelect from './table-drag-select';
// import 'react-table-drag-select/style.css';

import TopMenuGeneral from './topmenu/topmenu-general';
import './operator-availability.css';
// import SubmitModal from './operator-submit-modal';

class OperatorAvailability3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: [
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false]
      ]
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <TopMenuGeneral title="MY AVAILABILITY"/>
        <TableDragSelect value={this.state.cells}
          onChange={this.handleChange}>
          <tr>
            <td disabled />
            <td disabled>Sunday</td>
            <td disabled>Monday</td>
            <td disabled>Tuesday</td>
            <td disabled>Wednesday</td>
            <td disabled>Thursday</td>
            <td disabled>Friday</td>
            <td disabled>Saturday</td>
          </tr>
          <tr>
            <td disabled>10:00</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td disabled>11:00</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td disabled>12:00</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td disabled>13:00</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td disabled>14:00</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td disabled>15:00</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td disabled>16:00</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
        </TableDragSelect>
        <button onClick={this.handleReset}>Reset</button>
      </React.Fragment>
    );
  }

  handleChange(cells) {
    this.setState({
      cells
    });
  }

  handleReset() {
    const cells = [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false]
    ];
    this.setState({
      cells: cells
    });
  }
}

export default OperatorAvailability3;
