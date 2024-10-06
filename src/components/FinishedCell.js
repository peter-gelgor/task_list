import { 
    IconButton, Button, 
    Dialog, DialogTitle, DialogContent, 
    DialogContentText, TextField, DialogActions,
 } from "@mui/material";
 import CheckIcon from '@mui/icons-material/Check';

 import MarkAsDone from "./MarkAsDone";
 import { updateVal } from "../utils";

function FinishedCell({ assignment, setOpen, open, userName, setUserName, uploadImageAndUpdateSchedule}) {
    return (
        <>
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
        </>
    );
}

export default FinishedCell;