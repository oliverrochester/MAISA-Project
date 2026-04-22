'use client';
import React from 'react';
import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { sortText } from '../apiUtils/sortText';
import validateCommaSeparatedNumbers from '../lib/validateCommaSeparatedNumbers';
import { Tooltip } from '@mui/material';


export default function NumberWords() {
    const [inputAsStringArray, setinputAsStringArray] = useState('');
    const [validationError, setValidationError] = useState(null);
    const [returnedOutput, setReturnedOutput] = useState([]);

    const handleSortText = async () => {
        const inputAsNumberArray = validateCommaSeparatedNumbers(inputAsStringArray);
        if (!inputAsNumberArray.ok) {
            setValidationError(inputAsNumberArray.error);
            return;
        }
        try {
            const response = await sortText(inputAsNumberArray.parts);
            setReturnedOutput(response.data);
            setValidationError(null);
        } catch (error) {
            setValidationError('An error occurred while sorting. Please try again later.');
        }
    };

    return (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
                sx={{ width: '30rem' }}
                label="Enter a comma separated list of whole numbers"
                variant="outlined"
                multiline
                rows={4}
                value={inputAsStringArray}
                onChange={(e) => setinputAsStringArray(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
                error={Boolean(validationError)}
                helperText={validationError ?? undefined}
            />
            <Button sx={{ mt: 2 }} variant="contained" onClick={handleSortText}>Sort Text</Button>
            {returnedOutput.length > 0 && (
                <Box sx={{ mt: 2, maxWidth: '30rem', width: '100%', maxHeight: '40rem', overflow: 'auto' }} data-testid="output-container">
                    {returnedOutput.map((item, index) => (
                        <Box
                            key={index}
                            data-testid={`output-item-container-${index}`}
                            sx={{
                                mt: 1,
                                p: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                justifyContent: 'center',
                                display: 'flex',
                            }}
                        >

                            {item.type === "text" && (
                                <Box component="span" data-testid={`output-text-item-${index}`}>
                                    {item.value}
                                </Box>
                            )}

                            {item.type === 'image' && (
                                <Tooltip title={item.value} placement="left">
                                    <Box sx={{ mt: 1 }} data-testid={`output-image-container-${index}`}>
                                        {item.image ? (
                                            <Box
                                                component="img"
                                                data-testid={`output-image-item-${index}`}
                                                src={item.image}
                                                alt=""
                                                sx={{ maxWidth: '100%', display: 'block' }}
                                            />
                                        ) : (
                                            <Box component="span" data-testid={`output-image-placeholder-${index}`} sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                Unable to load image.
                                            </Box>
                                        )}
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
