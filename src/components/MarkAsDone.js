import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { updateVal } from '../utils';

function MarkAsDone({ assignment, uploadImageAndUpdateSchedule }) {
  const [open, setOpen] = useState(false);
  const [completerName, setCompleterName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCompleterName('');
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (completerName && selectedFile) {
      uploadImageAndUpdateSchedule(selectedFile, assignment, completerName);
      updateVal("Schedule", assignment.id, "completed_by", completerName);
      handleClose();
    } else {
      alert("Please provide your name and select a file.");
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Mark as done
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Mark Task as Done</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide your name and select an image to mark this task as done.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your Name"
            type="text"
            fullWidth
            value={completerName}
            onChange={(e) => setCompleterName(e.target.value)}
          />
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span">
              Select Image
            </Button>
          </label>
          {selectedFile && <p>{selectedFile.name}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MarkAsDone;
