import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Util } from "../util";

interface Props {
    timeout: number;
    onExpire: () => void;
}

function minsToSecs(mins: number): number {
    return mins * 60;
}

export function CountdownTimer({ timeout, onExpire }: Props) {
    const [seconds, setSeconds] = useState(minsToSecs(timeout));

    useEffect(() => {
        let interval = 0;

        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else {
            clearInterval(interval);
            onExpire();
        }

        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <Typography variant="h3" color="primary">
            {Util.formatTime(seconds)}
        </Typography>
    );
}
