import { Button, Checkbox, Dialog, FormControlLabel, FormGroup, DialogActions, InputLabel, Select } from '@mui/material';
import { DialogContent, DialogTitle, MenuItem } from '@mui/material'
import { useState } from 'react';
import { updateVal } from '../utils';

function ChangeAvailability() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [availability, setAvailability] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCheckboxChange = (event) => {
        setAvailability({
            ...availability,
            [event.target.name]: event.target.checked
        });
    };

    const handleSubmit = async () => {
        if (name == "") {
            alert("You need to select a name")
        }
        else {
            const personId = names[name];
            const availabilityList = [];
            if (availability.sunday) {
                availabilityList.push({"N": "0"});
            }
            if (availability.monday) {
                availabilityList.push({"N": "1"});
            }
            if (availability.tuesday) {
                availabilityList.push({"N": "2"});
            }
            if (availability.wednesday) {
                availabilityList.push({"N": "3"});
            }
            if (availability.thursday) {
                availabilityList.push({"N": "4"});
            }
            if (availability.friday) {
                availabilityList.push({"N": "5"});
            }
            if (availability.saturday) {
                availabilityList.push({"N": "6"});
            }

            await updateVal("people", personId, "availability", availabilityList);
            handleClose();
        }
    }

    const names = {
        "Peter": "0",
        "Sara": "1",
        "James": "2",
        "Jeff": "3"
    }

    return (
        <div>
            <Button 
            variant="contained"
            color="secondary"
            onClick={() => setOpen(true)}>
            Change availability
            </Button>
            <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Change availability</DialogTitle>
            <DialogContent>
                <InputLabel id="name-select-label">Name</InputLabel>
                <Select
                    labelId="name=select-label"
                    id="name-select"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Name"
                    >
                        {Object.keys(names).map((predefinedName) => (
                            <MenuItem key={predefinedName} value={predefinedName}>
                                {predefinedName}
                            </MenuItem>
                        ))}
                    </Select>
                <FormGroup>
                    {Object.keys(availability).map((day) => (
                        <FormControlLabel
                            key={day}
                            control={
                                <Checkbox
                                    checked={availability[day]}
                                    onChange={handleCheckboxChange}
                                    name={day}
                                />
                            }
                            label={day.charAt(0).toUpperCase() + day.slice(1)}
                        /> 
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
            </Dialog>
        </div>
    );
}

export default ChangeAvailability;
