import React, { useState } from 'react';
import { 
    TableContainer, Paper, Table, TableHead, TableBody, 
    TableRow, TableCell, Button, IconButton, 
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    TextField
  } from '@mui/material';
  import CheckIcon from '@mui/icons-material/Check';
import { updateVal, uploadImageAndUpdateSchedule } from '../utils';

import MarkAsDone from './MarkAsDone';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



function PersonTable({ map }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');

  return (
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
                {assignment.done === "2" ? (
                    <IconButton color="primary" aria-label="done">
                    <CheckIcon />
                    </IconButton>
                ) : assignment.done === "1" ? (
                  <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          window.open(assignment.photo_link);
                          setOpen(true);
                        } }
                      >
                        Approve
                      </Button>
                      <Dialog open={open} onClose={() => setOpen(false)}>
                      <DialogTitle>Approve Task</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Do you want to approve this task?
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Your name"
                          type="text"
                          fullWidth
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={async () => {
                          if (userName !== "") {
                            await updateVal("Schedule", assignment.id, "approved_by", userName + " (DISAPPROVED)");
                            await updateVal("Schedule", assignment.id, "done", 0);
                            window.location.reload();
                          }
                          else {
                            alert("you need to provide your name to disaprove");
                          }
                          }}>No</Button>
                        <Button onClick={async () => {
                          if (userName !== "") {
                            await updateVal("Schedule", assignment.id, "approved_by", userName);
                            await updateVal("Schedule", assignment.id, "done", 2);
                            window.location.reload();
                          }
                          else {
                            alert("you need to provide your name to approve");
                          }
                        }}>Yes</Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                    
                ) : (
                  <MarkAsDone assignment={assignment} uploadImageAndUpdateSchedule={uploadImageAndUpdateSchedule}></MarkAsDone>
                )}
                </TableCell>
                <TableCell>{assignment.completed_by}</TableCell>
                <TableCell>{assignment.approved_by}</TableCell>

              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PersonTable;
