import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function PersonTable({ map }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="task assignment table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '100px'}}>Day</TableCell>
            <TableCell sx={{ width: '100px'}}>Person</TableCell>
            <TableCell>Task</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map(day => (
            map[day] && map[day].map((assignment, index) => (
              <TableRow key={`${day}-${index}`}>
                {index === 0 && (
                  <TableCell rowSpan={map[day].length} component="th" scope="row">
                    {day}
                  </TableCell>
                )}
                <TableCell>{assignment.Person}</TableCell>
                <TableCell>{assignment.Task}</TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PersonTable;
