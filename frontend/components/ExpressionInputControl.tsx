import React, { useState } from "react";
import { TextField } from "@mui/material";

interface Props {
    expression: string;
    answer: string;
    readOnly: boolean;
    onAnswer: (answer: string) => void;
}

export function ExpressionInputControl({ expression, answer, readOnly, onAnswer }: Props) {
    const [answerVal, setAnswer] = useState<string>(answer);

    const answwerChanged = (event) => {
        const answer = event.target.value.trim();
        if (answer === "")
            return;

        setAnswer(answer);
        onAnswer(answer);
    }

    return (
        <>
            {readOnly ? expression : <TextField variant="outlined" value={expression} />}
            <span>=</span>
            <TextField
                style={{
                    width: "100px",
                }}
                size="small"
                variant="outlined"
                value={answerVal}
                onChange={answwerChanged}
            />
        </>
    );
}
