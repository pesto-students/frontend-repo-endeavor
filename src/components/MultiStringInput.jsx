import React, { useEffect, useState } from 'react';

const MultiStringInput = ({ onStringsChange, initStrings = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const [strings, setStrings] = useState(initStrings);

    useEffect(() => {
        setStrings(initStrings);
    }, [initStrings]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyPress = (event) => {
        if ((event.key === 'Enter' || event.key === ',') && inputValue.trim() !== '' && strings.length < 10) {
            event.preventDefault();  // Prevent the default behavior of inserting the comma
            const trimmedInput = inputValue.trim();
            if (!strings.includes(trimmedInput)) {
                const updatedStrings = [...strings, trimmedInput];
                setStrings(updatedStrings);
                setInputValue('');
                onStringsChange(updatedStrings); // Update parent component
            } else {
                setInputValue(''); // Clear the input if duplicate
            }
        }
    };

    const handleDelete = (index) => {
        const updatedStrings = strings.filter((_, i) => i !== index);
        setStrings(updatedStrings);
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
            <input
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
            />
        </div>
    );
};

export default MultiStringInput;
