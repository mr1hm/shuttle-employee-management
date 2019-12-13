import React, {
  useState,
  useEffect,
} from 'react';
// import ShiftsDay from '../day/shifts-day';
import Table from '../../general/table';

const COLUMNS = Object.freeze({
  PERMANENT: 'recurring',
  DAY_OF_WEEK: 'day_of_week',
  DATE_START: 'start_date',
  DATE_END: 'end_date',
  TIME_START: 'start_time',
  TIME_END: 'end_time',
  SCHEDULE: 'session',
  POSTED_BY: 'posted_by',
  ROUTE: 'line_name',
  BUS_NUMBER: 'bus_number',
  NUMBER_OF_ROUNDS: 'rounds',
  ACTION: 'take_action',
});

const tableHeaders = {
  [COLUMNS.PERMANENT]: {
    title: '',
    align: 'right',
  },
  [COLUMNS.DAY_OF_WEEK]: {
    title: 'Day of Week',
    align: 'center',
  },
  [COLUMNS.DATE_START]: {
    title: 'Start Date',
    align: 'right',
  },
  [COLUMNS.DATE_END]: {
    title: 'End Date',
    align: 'right',
  },
  [COLUMNS.TIME_START]: {
    title: 'Start Time',
    align: 'right',
  },
  [COLUMNS.TIME_END]: {
    title: 'End Time',
    align: 'right',
  },
  [COLUMNS.SCHEDULE]: {
    title: 'Schedule',
    align: 'left',
  },
  [COLUMNS.POSTED_BY]: {
    title: 'Posted By',
    align: 'left',
  },
  [COLUMNS.ROUTE]: {
    title: 'Route',
    align: 'center',
  },
  [COLUMNS.BUS_NUMBER]: {
    title: 'Bus #',
    align: 'center',
  },
  [COLUMNS.NUMBER_OF_ROUNDS]: {
    title: '# of Rounds',
    align: 'right',
  },
  [COLUMNS.ACTION]: {
    title: '',
    align: 'left',
  },
};

function ShiftsAvailable(props){
  const tableColumnOrder = [
    COLUMNS.DAY_OF_WEEK,
    COLUMNS.DATE_START,
    COLUMNS.TIME_START,
    COLUMNS.TIME_END,
    COLUMNS.SCHEDULE,
    COLUMNS.POSTED_BY,
    COLUMNS.ROUTE,
    COLUMNS.BUS_NUMBER,
    COLUMNS.NUMBER_OF_ROUNDS,
    COLUMNS.ACTION,
  ];

  return (
    <>
      <h1>Available Shifts</h1>
      <Table order={tableColumnOrder} headers={tableHeaders} />
    </>
  );
}

export default ShiftsAvailable;
