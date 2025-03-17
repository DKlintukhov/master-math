import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

interface Props {
    problem: string;
    answer: string;
    readOnly: boolean;
    onChange: (expr: string) => void;
    onAnswer: (answer: string) => void;
}

export function ProblemInputControl({ problem, onChange, answer, readOnly, onAnswer }: Props) {
    const [problemVal, setProblem] = useState<string>(problem);
    const [answerVal, setAnswer] = useState<string>(answer);

    const answwerChanged = (event) => {
        const answer = event.target.value;
        setAnswer(answer);
        onAnswer(answer);
    }

    const expressionChanged = (event) => {
        const problem = event.target.value;
        setProblem(problem);
        onChange(problem);
    }

    useEffect(() => {
        setProblem(problem);
    }, [problem]);

    useEffect(() => {
        setAnswer(answer);
    }, [answer]);

    return (
        <>
            {readOnly ?
                problem :
                <TextField
                    size="small"
                    variant="outlined"
                    multiline
                    onChange={expressionChanged}
                    value={problemVal}
                />}
            <span> = </span>
            <TextField
                style={{
                    width: "100px",
                }}
                size="small"
                variant="outlined"
                value={answerVal}
                multiline
                onChange={answwerChanged}
            />
        </>
    );
}
