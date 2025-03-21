import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
    version: string;
}

export function Watermark({ version }: Props) {
    return (
        <Box sx={{
            position: "absolute",
            bottom: 2,
            right: 2,
            padding: 1,
            fontSize: '0.8rem',
            color: "text.secondary",
            zIndex: 1000,
            borderRadius: 1,
            opacity: 0.3
        }}>
            <p>
                <Typography variant="caption">
                    MasterMath {version}
                </Typography>
            </p>
            <p>
                <Typography variant="caption">
                    License: MIT
                </Typography>
            </p>
            <p>
                <Typography variant="caption">
                    © 2025 Denis Klintukhov
                </Typography>
            </p>
        </Box>
    );
}
