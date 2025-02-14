import { Button, Container } from "@mui/material";
import { SimpleExpression } from "../models";
import Grid from "@mui/material/Grid2";
import { SimpleExpressionWithInput, CountdownTimer } from "../components";
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

    useEffect(() => {
        const timerId = setTimeout(() => {
            const duration = getDurationInSeconds(startDate);
            onFinished(duration, answers);
        }, timeout * 60 * 1000);

        return () => clearTimeout(timerId);
    }, [timeout, onFinished]);

    const handleAnswerChange = (id: number, answer: number) => {
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[id] = answer;
            return newAnswers;
        });
    };

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            height: "100vh"
        }}>
            <CountdownTimer timeout={timeout} onExpired={() => onFinished(getDurationInSeconds(startDate), answers)} />

            <Grid container
                style={{
                    overflow: "hidden auto",
                    maxHeight: "70%",
                    minHeight: "15%",
                }}
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                columns={{ xs: 1, sm: 2, md: 3 }}
                gridAutoFlow="column"
            >
                {expressions.map((expression, id) => (
                    <SimpleExpressionWithInput
                        key={id}
                        id={id}
                        expression={expression}
                        onAnswer={(answer) => handleAnswerChange(id, answer)}
                    />
                ))}
            </Grid>

            <Button variant="outlined" onClick={() => {
                const duration = getDurationInSeconds(startDate);
                onFinished(duration, answers);
            }}>Готово</Button>
        </Container >
    );
}
