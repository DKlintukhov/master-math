import React from 'react';
import { Container } from '@mui/material';

export function ExerciseContainer({ children }) {
    return (
        <Container maxWidth="lg" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: "15px",
            height: "100%",
            padding: "10px 0",
        }}>
            {children}
        </Container>
    );
}
