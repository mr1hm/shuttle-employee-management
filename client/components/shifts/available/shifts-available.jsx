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

const DAYS_OF_WEEK = Object.freeze([
  null,
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]);

const tableColumns = {
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
  const availableShifts = useAvailableShifts();

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

  const tableContent = (
    Array.isArray(availableShifts)
    ? availableShifts.map(shift => ({
      [COLUMNS.PERMANENT]: shift.recurring,
      [COLUMNS.DAY_OF_WEEK]: DAYS_OF_WEEK[shift.day_of_week],
      [COLUMNS.DATE_START]: formatDate(shift.start_date),
      [COLUMNS.DATE_END]: formatDate(shift.end_date),
      [COLUMNS.TIME_START]: formatTimeOfDay(shift.start_time),
      [COLUMNS.TIME_END]: formatTimeOfDay(shift.end_time),
      [COLUMNS.SCHEDULE]: shift.session.name,
      [COLUMNS.POSTED_BY]: (
        typeof shift.posted_by === 'string'
        ? shift.posted_by
        : `${shift.posted_by.first_name} ${shift.posted_by.last_name} - ${shift.posted_by.uci_net_id}`
      ),
      [COLUMNS.ROUTE]: `${shift.bus_info.line_name} Line`,
      [COLUMNS.BUS_NUMBER]: shift.bus_info.bus_number,
      [COLUMNS.NUMBER_OF_ROUNDS]: shift.rounds.length,
      [COLUMNS.ACTION]: (
        shift.conflicts.filter(conflict => conflict.fatal).length > 0
        ? (<button type="button" className="btn btn-secondary">Shift Conflict</button>)
        : (<button type="button" className="btn btn-primary">Take Shift</button>)
      ),
    }))
    : availableShifts
  );

  return (
    <main className="container">
      <h1>Shift Posts</h1>
      <h2>Available Shifts</h2>
      <Table colOrder={tableColumnOrder} columns={tableColumns} content={tableContent} />
    </main>
  );
}

function formatDate(date){
  return new Date(date).toDateString().slice(4, -5);
}

function formatTimeOfDay(timeString){
  const hour24Format = Number(timeString.slice(0,-2));
  const hour12Format = (hour24Format + 11) % 12 + 1;
  const minuteFormat = timeString.slice(-2);
  const amPmFormat = (hour24Format >= 12) ? 'PM' : 'AM';
  return `${hour12Format}:${minuteFormat} ${amPmFormat}`;
}

function useAvailableShifts(){
  const [availableShifts, setAvailableShifts] = useState(null);

  useEffect(() => {
    let abort = false;

    fetch('/api/shifts-available.php', {
      method: 'GET',
      cache: 'no-cache',
    })
    .then(response => {
      if (abort){ return; }
      if (!response.ok){
        return setAvailableShifts('Could not retrieve available shifts. Please try again later.');
      }
      return response.json()
      .then(responseBody => {
        if (!abort){
          setAvailableShifts(responseBody);
        }
      });
    })
    .catch(() => {
      if (!abort){
        setAvailableShifts('No connection available, please try again later.');
      }
    });

    return () => { abort = true; };
  }, []);

  return availableShifts;
}

export default ShiftsAvailable;
