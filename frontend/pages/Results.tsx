import React from "react";
import { Button, Container, OutlinedInput, Typography } from "@mui/material";
import { Util } from "../util";

interface Props {
    problems: string[];
    answers: string[];
    correctAnswers: string[];
    duration: number;
    onReplay: () => void;
    onFinished: () => void;
}

function toPercents(a: number, b: number): string {
    return (a / b * 100).toFixed() + "%";
}

export function Results({ problems, answers, correctAnswers, duration, onReplay, onFinished }: Props) {
    const problemsAmount = answers.length;
    let correctAnswersAmount = 0;
    let incorrectAnswersAmount = 0;
    console.log(correctAnswers)
    console.log(answers)
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
                    Правильные ответы: {correctAnswersAmount} ({toPercents(correctAnswersAmount, problemsAmount)})
                </Typography>
                <Typography variant="h4" component="h2" color="error">
                    Неправильные ответы: {incorrectAnswersAmount} ({toPercents(incorrectAnswersAmount, problemsAmount)})
                </Typography>
            </Container>

            <Container
                style={{
                    overflow: "hidden auto",
                    padding: "10px 0"
                }}
            >
                {problems.map((problem, idx) => (
                    <Container key={idx} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "5px 0"
                    }}>
                        <Typography fontSize="24px">
                            <span style={{ width: "25px" }}>{idx + 1}) </span>
                            {problem}
                        </Typography>

                        <Typography style={{ fontSize: "24px", width: "7px" }}>
                            =
                        </Typography>

                        <OutlinedInput
                            style={{ width: "150px", textAlignLast: "center" }}
                            size="medium"
                            value={answers[idx] === null ? "" : answers[idx]}
                            error={answers[idx] !== correctAnswers[idx]}
                            readOnly={true}
                        />
                        <OutlinedInput
                            style={{ width: "150px", textAlignLast: "center" }}
                            size="medium"
                            value={correctAnswers[idx] === null ? "" : correctAnswers[idx]}
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
