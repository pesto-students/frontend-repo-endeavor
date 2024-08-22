import React, { useState } from 'react';

const MultiStringInput = ({ onStringsChange, strings }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        if (event.target.value === ',') {
            setInputValue('');
        } else {
            setInputValue(event.target.value);
        }
    };

    const handleKeyPress = (event) => {
        if ((event.key === 'Enter' || event.key === ',') && inputValue.trim() !== '') {
            event.preventDefault();  // Prevent the default behavior of inserting the comma
            const trimmedInput = inputValue.trim();
            if (!strings.includes(trimmedInput)) {
                const updatedStrings = [...strings, trimmedInput];
                setInputValue('');
                onStringsChange(updatedStrings); // Update parent component
            } else {
                setInputValue(''); // Clear the input if duplicate
            }
        }
    };

    const handleDelete = (index) => {
        const updatedStrings = strings.filter((_, i) => i !== index);
        onStringsChange(updatedStrings); // Update parent component
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            border: '1px solid #ccc',
            padding: '5px',
            borderRadius: '5px',
            alignItems: 'center'
        }}>
            {strings.map((string, index) => (
                <div key={index} style={{ margin: '2px', padding: '5px', backgroundColor: '#f0f0f0', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
                    {string}
                    <button
                        onClick={() => handleDelete(index)}
                        style={{
                            marginLeft: '5px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ff0000'
                        }}
                    >
                        &times;
                    </button>
                </div>
            ))}
            {strings.length < 10 && <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    minWidth: '100px'
                }}
                placeholder={strings.length < 10 ? 'Add a service...' : ''}
            />}
        </div>
    );
};

export default MultiStringInput;
