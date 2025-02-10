import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SimpleExpression } from "../models";
import { SimpleExpressionWithInput } from "../components";
import { useEffect, useState } from "react";

interface Props {
    timeout: number;
    expressions: SimpleExpression[];
    onFinished: (duration: number, answers: number[]) => void;
}

function getDurationInSeconds(startDate: Date): number {
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - startDate.getTime();
    return differenceInMilliseconds / 1000;
}

export function Exercise({ timeout, expressions, onFinished }: Props) {
    const [answers, setAnswers] = useState<number[]>(() => Array(expressions.length).fill(null));

    const startDate = new Date();

    // useEffect(() => {
    //     const timerId = setTimeout(() => {
    //         const duration = getDurationInSeconds(startDate);
    //         onFinished(duration, answers);
    //     }, timeout * 1000);

    //     return () => clearTimeout(timerId);
    // }, [timeout, onFinished, answers, startDate]);

    const handleAnswerChange = (id: number, answer: number) => {
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[id] = answer;
            return newAnswers;
        });
    };

    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
            {expressions.map((expression, id) => (
                <Grid key={id} size={6}>
                    <SimpleExpressionWithInput
                        id={id}
                        expression={expression}
                        onAnswer={(answer) => handleAnswerChange(id, answer)}
                    />
                </Grid>
            ))}
            <Grid size={12} style={{
                display: "flex",
                justifyContent: "center",
            }}>
                <Button variant="outlined" onClick={() => {
                    const duration = getDurationInSeconds(startDate);
                    onFinished(duration, answers);
                }}>Готово</Button>
            </Grid>
        </Grid>
    );
}
