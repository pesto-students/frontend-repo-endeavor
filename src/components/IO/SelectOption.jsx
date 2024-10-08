import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SingleValue from './SingleValue';

const SelectOption = ({ pageType, label, value, onChange, options }) => {
    if (pageType == "View") {
        return <SingleValue pageType={pageType} type="text" value={value} onChange={onChange} label={label} />;
    } else {
        return (
            <FormControl required={pageType !== "Search"} fullWidth>
                <InputLabel id="demo-simple-select-required-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={!value ? "-- Default --" : value}
                    label={label}
                    onChange={onChange}
                >
                    <MenuItem value="-- Default --">-- Select --</MenuItem>
                    {options.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default SelectOption;