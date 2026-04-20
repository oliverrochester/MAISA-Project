'use client';
import React from 'react';
import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { sortText } from '../apiUtils/sortText';
import validateCommaSeparatedNumbers from '../lib/validateCommaSeparatedNumbers';


export default function NumberWords() {
    const [inputNumberListString, setInputNumberListString] = useState('');
    const [validationError, setValidationError] = useState(null);
    const [validOutput, setValidOutput] = useState(false);
    const [returnedOutput, setReturnedOutput] = useState([]);

    const handleSortText = async () => {
        const parsed = validateCommaSeparatedNumbers(inputNumberListString);
        if (!parsed.ok) {
            setValidationError(parsed.error);
            return;
        }
        try {
            const response = await sortText(parsed.parts);
            setReturnedOutput(response.data);
            setValidOutput(true);
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
                value={inputNumberListString}
                onChange={(e) => setInputNumberListString(e.target.value)}
                error={Boolean(validationError)}
                helperText={validationError ?? undefined}
            />
            <Button sx={{ mt: 2 }} variant="contained" onClick={handleSortText}>Sort Text</Button>
            {validOutput && (
                <Box sx={{ mt: 2, maxWidth: '40rem', width: '100%', maxHeight: '40rem', overflow: 'auto' }} data-testid="output-container">
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
                            }}
                        >

                            {item.type === "text" && (
                                <Box component="span" data-testid={`output-text-item-${index}`}>
                                    {item.value}
                                </Box>
                            )}

                            {item.type === 'image' && (
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
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
