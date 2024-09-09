import React from 'react';
import { 
    TableContainer, Paper, Table, TableHead, TableBody, 
    TableRow, TableCell, Button, IconButton 
  } from '@mui/material';
  import CheckIcon from '@mui/icons-material/Check';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function PersonTable({ map }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="task assignment table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '100px'}}>Day</TableCell>
            <TableCell sx={{ width: '100px'}}>Person</TableCell>
            <TableCell sx={{ width: '150px'}}>Task</TableCell>
            <TableCell>Done</TableCell>
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
                <TableCell>
                    {assignment.done ? (
                        <IconButton color="primary" aria-label = "done">
                            <CheckIcon />
                        </IconButton>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => {console.log("clicked");}}
                        >
                            Mark as done
                        </Button>
                    )}
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PersonTable;
