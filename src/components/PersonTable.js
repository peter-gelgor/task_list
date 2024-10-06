import React, { useEffect, useRef, useState } from 'react';
import { 
    TableContainer, Paper, 
    Table, TableHead, TableBody, 
    TableRow, TableCell,
    Typography
  } from '@mui/material';
import { uploadImageAndUpdateSchedule } from '../utils';
import CustomSelect from './CustomSelect';
import FinishedCell from './FinishedCell';
import zIndex from '@mui/material/styles/zIndex';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const users = ["Peter", "Sara", "Jeff", "James"];

function PersonTable({ map }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const dayRefs = useRef(days.map(() => React.createRef()));
  const containerRef = useRef(null);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  }

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;
      const headerHeight = 50; // Adjust this value based on your actual header height

      for (let i = 0; i < dayRefs.current.length; i++) {
        const dayRef = dayRefs.current[i];
        if (dayRef.current) {
          const dayTop = dayRef.current.getBoundingClientRect().top - containerTop - headerHeight;
          if (dayTop <= 0) {
            setCurrentDay(dayRef.current.dataset.day);
          } else {
            break;
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const dayHeaderStyle = {
    position: 'sticky',
    top: 0,
    fontWeight: 'bold',
    borderBottom: '2px solid black',
    backgroundColor: '#f0f0f0', // Optional: adds a light background to distinguish day rows
    padding: '10px',
    zIndex: 1000,
  };

  const firstRowStyle = {
    borderTop: '2px solid black',
  };

  return (
    <>
      <CustomSelect 
        labelId="day-select-label"
        id="day-select"
        label="Select Day"
        value={selectedDay}
        onChange={handleDayChange}
        defaultOption="All Days"
        menuOptions={days}
      />
      <CustomSelect
        labelId="user-select-label"
        id="user-select"
        label="Select User"
        value={selectedUser}
        onChange={handleUserChange}
        defaultOption="All Users"
        menuOptions={users} 
      />
    
    <Typography variant="h6" style={dayHeaderStyle}>
      {currentDay}
    </Typography>
    <TableContainer component={Paper} ref={containerRef} style={{maxHeight: 'calc(100vh - 150px)', overflow: 'auto'}}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="task assignment table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '100px'}}>Person</TableCell>
              <TableCell sx={{ width: '150px'}}>Task</TableCell>
              <TableCell>Done</TableCell>
              <TableCell>Completed by</TableCell>
              <TableCell>Approved By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.filter(day => selectedDay === '' || day === selectedDay).map((day, dayIndex) => (
              <React.Fragment key={day}>
                <TableRow ref={dayRefs.current[dayIndex]} data-day={day} sx={{height: 0}}>
                  <TableCell colSpan={5} sx={{height: 0, borderBottom: '2px solid black'}}>
                    {day}
                  </TableCell>
                </TableRow>
                {map[day] && map[day].filter(assignment => selectedUser === '' || assignment.Person === selectedUser)
                  .map((assignment, index) => (
                    <TableRow key={`${day}-${index}`}>
                      <TableCell>{assignment.Person}</TableCell>
                      <TableCell>{assignment.Task}</TableCell>
                      <TableCell>
                        <FinishedCell 
                          assignment={assignment} 
                          setOpen={setOpen}
                          open={open}
                          setUserName={setUserName}
                          userName={userName}
                          uploadImageAndUpdateSchedule={uploadImageAndUpdateSchedule}
                        />
                      </TableCell>
                      <TableCell>{assignment.completed_by}</TableCell>
                      <TableCell>{assignment.approved_by}</TableCell>
                    </TableRow>
                  ))
                }
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PersonTable;
