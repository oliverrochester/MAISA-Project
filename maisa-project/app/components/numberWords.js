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
            console.error('Error sorting text:', error);
        }
    };

    return (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
                sx={{ width: '30rem' }}
                label="Enter a comma separated list of whole numbers"
                variant="outlined"
                value={inputNumberListString}
                onChange={(e) => setInputNumberListString(e.target.value)}
                error={Boolean(validationError)}
                helperText={validationError ?? undefined}
            />
            <Button sx={{ mt: 2 }} variant="contained" onClick={handleSortText}>Sort Text</Button>
            {validOutput && (
                <Box sx={{ mt: 2, maxWidth: '40rem', width: '100%' }}>
                    {returnedOutput.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                mt: 1,
                                p: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                            }}
                        >

                            {item.type === "text" && (
                                <Box component="span">{item.value}</Box>
                            )}

                            {item.type === 'image' && (
                                <Box sx={{ mt: 1 }}>
                                    {item.image ? (
                                        <Box
                                            component="img"
                                            src={item.image}
                                            alt=""
                                            sx={{ maxWidth: '100%', display: 'block' }}
                                        />
                                    ) : (
                                        <Box component="span" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
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
