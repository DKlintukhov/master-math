import React from "react";
import { Box, Typography } from "@mui/material";
import { AppInfo } from "../models";

interface Props {
    appInfo: AppInfo;
}

export function Watermark({ appInfo }: Props) {
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
                    {appInfo.name} v{appInfo.version}
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
