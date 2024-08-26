import { TextField } from "@mui/material";

const SingleValue = ({ pageType, type, value, onChange, label }) => {
    return <TextField
        required={pageType !== "View"}
        id="outlined-required"
        type={type}
        label={label}
        value={!value ? "" : value}
        onChange={onChange}
        InputProps={{
            readOnly: pageType === "View",
        }}
    />
}

export default SingleValue;