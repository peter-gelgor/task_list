import { InputLabel, Select, MenuItem, FormControl } from "@mui/material"

function CustomSelect({ labelId, id, label, value, onChange, defaultOption, menuOptions }) {
    return (<FormControl margin="normal">
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
            labelId={labelId}
            id={id}
            value={value}
            onChange={onChange}
            sx={{ 
                width: '200px',
                height: '36.5px',
                '& .MuiSelect-select': {
                  paddingTop: '6px',
                  paddingBottom: '7px',
                }
              }}
        >
            <MenuItem value="">
              <em>{defaultOption}</em>
            </MenuItem>
            {menuOptions.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </Select>
    </FormControl>)
}
export default CustomSelect