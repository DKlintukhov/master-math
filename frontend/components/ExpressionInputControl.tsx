import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

interface Props {
    expression: string;
    answer: string;
    readOnly: boolean;
    onChange: (expr: string) => void;
    onAnswer: (answer: string) => void;
}

export function ExpressionInputControl({ expression, onChange, answer, readOnly, onAnswer }: Props) {
    const [exprVal, setExpression] = useState<string>(expression);
    const [answerVal, setAnswer] = useState<string>(answer);

    const answwerChanged = (event) => {
        const answer = event.target.value.trim();
        setAnswer(answer);
        onAnswer(answer);
    }

    const expressionChanged = (event) => {
        const expr = event.target.value.trim();
        setExpression(expr);
        onChange(expr);
    }

    useEffect(() => {
        setExpression(expression);
    }, [expression]);

    useEffect(() => {
        setAnswer(answer);
    }, [answer]);

    return (
        <>
            {readOnly ?
                expression :
                <TextField
                    size="small"
                    variant="outlined"
                    onChange={expressionChanged}
                    value={exprVal}
                />}
            <span> = </span>
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
