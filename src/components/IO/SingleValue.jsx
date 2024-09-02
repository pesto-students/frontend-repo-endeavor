import { TextField } from "@mui/material";
import { useState } from "react";

const SingleValue = ({ pageType, type, value, onChange, label, minLength, maxLength, minValue, maxValue, isMobile, mobileLength=10, errors = {}, errorKey, setErrors }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        if (pageType === "View") {
            return;
        }
        const newValue = event.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = new RegExp(`^[1-9][0-9]{${mobileLength-1}}$`);
        let isError = false;

        if (type === "text") {
            if (!newValue.trim()) {
                isError = true;
                setErrorMessage("Cannot be blank");
            } else if (minLength && newValue.length < minLength) {
                isError = true;
                setErrorMessage(`Minimum length is ${minLength} characters`);
            } else if (maxLength && newValue.length > maxLength) {
                isError = true;
                setErrorMessage(`Maximum length is ${maxLength} characters`);
            }
        } else if (type === "email" && !emailRegex.test(newValue)) {
            isError = true;
            setErrorMessage("Invalid email format");
        } else if (type === "number") {
            if (isMobile && !phoneRegex.test(newValue)) {
                isError = true;
                setErrorMessage(`Should be a valid ${mobileLength}-digit mobile number`);
            } else if (minValue !== undefined && newValue < minValue) {
                isError = true;
                setErrorMessage(`Should be greater than or equal to ${minValue}`);
            } else if (maxValue !== undefined && newValue > maxValue) {
                isError = true;
                setErrorMessage(`Should be less than or equal to ${maxValue}`);
            }
        }

        if (isError !== errors[errorKey]) {
            setErrors({ ...errors, [errorKey]: isError });
        }

        if (!isError && errorMessage !== "") setErrorMessage("");

        onChange(event); // Pass the event to the parent onChange handler
    };

    return <TextField
        required={pageType !== "View"}
        id="outlined-required"
        type={type}
        label={label}
        value={!value ? "" : value}
        onChange={handleChange}
        onFocus={handleChange}
        error={errors[errorKey] ? errors[errorKey] : false}
        helperText={errors[errorKey] ? errorMessage : ""}
        InputProps={{
            readOnly: pageType === "View",
        }}
        fullWidth
    />
}

export default SingleValue;