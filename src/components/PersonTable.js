import React, { useState } from 'react';
import { 
    TableContainer, Paper, 
    Table, TableHead, TableBody, 
    TableRow, TableCell
  } from '@mui/material';
import { uploadImageAndUpdateSchedule } from '../utils';
import CustomSelect from './CustomSelect';
import FinishedCell from './FinishedCell';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const users = ["Peter", "Sara", "Jeff", "James"];

function PersonTable({ map }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedUser, setSelectedUser] = useState('')

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  }

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  }

  const dayHeaderStyle = {
    fontWeight: 'bold',
    borderBottom: '2px solid black',
    backgroundColor: '#f0f0f0', // Optional: adds a light background to distinguish day rows
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
    
  
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="task assignment table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '100px'}}>Day</TableCell>
            <TableCell sx={{ width: '100px'}}>Person</TableCell>
            <TableCell sx={{ width: '150px'}}>Task</TableCell>
            <TableCell>Done</TableCell>
            <TableCell>Completed by</TableCell>
            <TableCell>Approved By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {days.filter(day => selectedDay === '' || day === selectedDay).map(day => (
              map[day] && map[day].filter(assignment => selectedUser === '' || assignment.Person === selectedUser)
              .map((assignment, index) => (
              <TableRow key={`${day}-${index}`}>
                {index === 0 && (
                  <TableCell 
                    rowSpan={map[day].filter(a => selectedUser === '' || a.Person === selectedUser).length} 
                    component="th" 
                    scope="row"
                    style={dayHeaderStyle}
                  >
                    {day}
                  </TableCell>
                )}
                <TableCell style={index === 0 ? firstRowStyle : null}>{assignment.Person}</TableCell>
                <TableCell style={index === 0 ? firstRowStyle : null}>{assignment.Task}</TableCell>
                <TableCell style={index === 0 ? firstRowStyle : null}>
                  <FinishedCell 
                    assignment={assignment} 
                    setOpen={setOpen}
                    open={open}
                    setUserName={setUserName}
                    userName={userName}
                    uploadImageAndUpdateSchedule={uploadImageAndUpdateSchedule}
                  />
                </TableCell>
                <TableCell style={index === 0 ? firstRowStyle : null}>{assignment.completed_by}</TableCell>
                <TableCell style={index === 0 ? firstRowStyle : null}>{assignment.approved_by}</TableCell>

              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

export default PersonTable;
