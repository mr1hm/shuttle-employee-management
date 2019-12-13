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
    style: {},
  },
  [COLUMNS.DAY_OF_WEEK]: {
    title: 'Day of Week',
    style: {},
  },
  [COLUMNS.DATE_START]: {
    title: 'Start Date',
    style: {},
  },
  [COLUMNS.DATE_END]: {
    title: 'End Date',
    style: {},
  },
  [COLUMNS.TIME_START]: {
    title: 'Start Time',
    style: {},
  },
  [COLUMNS.TIME_END]: {
    title: 'End Time',
    style: {},
  },
  [COLUMNS.SCHEDULE]: {
    title: 'Schedule',
    style: {},
  },
  [COLUMNS.POSTED_BY]: {
    title: 'Posted By',
    style: {},
  },
  [COLUMNS.ROUTE]: {
    title: 'Route',
    style: {},
  },
  [COLUMNS.BUS_NUMBER]: {
    title: 'Bus #',
    style: {},
  },
  [COLUMNS.NUMBER_OF_ROUNDS]: {
    title: '# of Rounds',
    style: {},
  },
  [COLUMNS.ACTION]: {
    title: '',
    style: {},
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
      <Table order={tableColumnOrder} headers={tableHeaders}></Table>
    </>
  );
}

export default ShiftsAvailable;
