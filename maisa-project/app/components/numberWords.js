'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, TextField, CircularProgress, Alert,Stack, Divider, Button } from '@mui/material';
import { sortText } from '../apiUtils/sortText';


export default function NumberWords() {

    const [inputNumberListString, setInputNumberListString] = useState('');
    const [validOutput, setValidOutput] = useState(false);
    const [returnedOutput, setReturnedOutput] = useState([]);

    const handleSortText = async () => {
        try {
            const response = await sortText(inputNumberListString);
            setReturnedOutput(response.data);
            setValidOutput(true);
        } catch (error) {
            console.error('Error sorting text:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <TextField sx={{ width: '30rem' }} label="Enter a comma separated list of numbers" variant="outlined" value={inputNumberListString} onChange={(e) => setInputNumberListString(e.target.value)} />
            <Button sx={{ mt: 2 }} variant="contained" onClick={handleSortText}>Sort Text</Button>
            {validOutput && (
                <Box>
                    {returnedOutput}
                </Box>
            )}
        </Box>
    );
}