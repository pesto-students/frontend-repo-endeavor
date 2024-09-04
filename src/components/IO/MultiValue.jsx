import React, { useState } from 'react';
import { TextField, Chip, Box, IconButton, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const MultiValue = ({ pageType, values, onValuesChange, type = 'text', maxItems = 10, minValueLength = 1, maxValueLength = 20, label = 'Values' }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const theme = useTheme(); // Access the current theme

    const handleAddValue = () => {
        const trimmedValue = inputValue.trim();

        if (trimmedValue.length < minValueLength) {
            setError(`Value must be at least ${minValueLength} characters.`);
            return;
        }

        if (trimmedValue.length > maxValueLength) {
            setError(`Value must be no more than ${maxValueLength} characters.`);
            return;
        }

        if (trimmedValue !== '' && !values.includes(trimmedValue)) {
            const newValues = [...values, trimmedValue];
            setInputValue('');
            setError('');
            onValuesChange(newValues);
        }
    };

    const handleDeleteValue = (valueToDelete) => {
        const newValues = values.filter((value) => value !== valueToDelete);
        onValuesChange(newValues);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAddValue();
        }
    };

    return (
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <legend
                style={{
                    fontSize: '0.75rem',
                    padding: '0 5px',
                    position: 'absolute',
                    top: '-10px',
                    left: '10px',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                {pageType !== "View" ? `${label} *` : label}
            </legend>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: 1,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                }}
            >
                {pageType !== "View" && values.length < maxItems && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            type={type}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={`Add ${label.toLocaleLowerCase()}`}
                            error={Boolean(error)}
                            helperText={error}
                            fullWidth
                        />
                        <IconButton onClick={handleAddValue} color="primary">
                            <AddIcon />
                        </IconButton>
                    </Box>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {values.map((value, index) => (
                        <Chip
                            key={index}
                            label={value}
                            onDelete={pageType !== 'View' ? () => handleDeleteValue(value) : undefined}
                            color="primary"
                            sx={{ margin: '4px' }}
                        />
                    ))}
                </Box>
            </Box>
            {pageType !== "View" && values.length >= maxItems && (
                <Typography variant="body2" color="textSecondary">
                    Maximum of {maxItems} {label.toLowerCase()} reached.
                </Typography>
            )}
        </Box>
    );
};

export default MultiValue;
