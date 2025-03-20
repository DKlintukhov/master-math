import React, { useEffect, useState } from "react";
import { TextField, Typography } from "@mui/material";

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
                <Typography fontSize="24px">
                    {problem}
                </Typography> :
                <TextField
                    style={{
                        width: "300px"
                    }}
                    size="medium"
                    variant="outlined"
                    multiline
                    onChange={expressionChanged}
                    value={problemVal}
                />}

            <TextField
                style={{ width: "150px", }}
                size="medium"
                variant="outlined"
                value={answerVal}
                multiline
                onChange={answwerChanged}
            />
        </>
    );
}
