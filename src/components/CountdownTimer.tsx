import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface Props {
    timeout: number;
    onExpired: () => void;
}

function minsToSecs(mins: number): number {
    return mins * 60;
}

export function CountdownTimer({ timeout, onExpired }: Props) {
    const [seconds, setSeconds] = useState(minsToSecs(timeout));

    useEffect(() => {
        let interval = 0;

        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else {
            clearInterval(interval);
            onExpired();
        }

        return () => clearInterval(interval);
    }, [seconds]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <Typography variant="h3" color="primary">
            {formatTime(seconds)}
        </Typography>
    );
}
