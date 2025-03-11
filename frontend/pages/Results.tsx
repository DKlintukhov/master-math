import React from "react";
import { Button, Container, OutlinedInput, Typography } from "@mui/material";
import { Util } from "../util";

interface Props {
    expressions: string[];
    answers: string[];
    correctAnswers: string[];
    duration: number;
    onReplay: () => void;
    onFinished: () => void;
}

function toPercents(a: number, b: number): string {
    return (a / b * 100).toFixed() + "%";
}

export function Results({ expressions, answers, correctAnswers, duration, onReplay, onFinished }: Props) {
    const expressionsAmount = answers.length;
    let correctAnswersAmount = 0;
    let incorrectAnswersAmount = 0;
    answers.forEach((value, idx) => {
        if (value === correctAnswers[idx])
            ++correctAnswersAmount;
        else
            ++incorrectAnswersAmount;
    });

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            height: "100%"
        }}>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "15px 0"
            }}>
                <Typography variant="h4" component="h2" color="info">
                    Время: {Util.formatTime(duration)}
                </Typography>
                <Typography variant="h4" component="h2" color="success">
                    Правильные ответы: {correctAnswersAmount} ({toPercents(correctAnswersAmount, expressionsAmount)})
                </Typography>
                <Typography variant="h4" component="h2" color="error">
                    Неправильные ответы: {incorrectAnswersAmount} ({toPercents(incorrectAnswersAmount, expressionsAmount)})
                </Typography>
            </Container>

            <Container
                style={{
                    overflow: "hidden auto",
                    padding: "10px 0"
                }}
            >
                {expressions.map((expression, idx) => (
                    <Container key={idx} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        padding: "5px 0"
                    }}>
                        <span style={{ width: "25px" }}>{idx + 1})</span>
                        {expression}
                        <span style={{ width: "7px" }}>=</span>
                        <OutlinedInput
                            style={{ height: "25px", width: "90px", textAlignLast: "center" }}
                            size="small"
                            value={answers[idx] === null ? "" : answers[idx]}
                            error={answers[idx] != correctAnswers[idx]}
                            readOnly={true}
                        />
                        <OutlinedInput
                            style={{ height: "25px", width: "90px", textAlignLast: "center" }}
                            size="small"
                            value={correctAnswers[idx] === null ? NaN : correctAnswers[idx]}
                            readOnly={true}
                        />
                    </Container>
                ))}
            </Container>

            <Container style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                padding: "15px 0",
            }}>
                <Button variant="outlined" onClick={onReplay}>Повтор</Button>
                <Button variant="outlined" onClick={() => onFinished()}>Закончить</Button>
            </Container>
        </Container >
    );
}
