import React from "react";
import { Button, Container, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import { Util } from "../util";
import { ExerciseContainer } from "../components";

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
    answers.forEach((value, idx) => {
        if (value === correctAnswers[idx])
            ++correctAnswersAmount;
        else
            ++incorrectAnswersAmount;
    });

    return (
        <ExerciseContainer>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "15px 0"
            }}>
                <Typography variant="h5" component="h5" color="info">
                    Время: {Util.formatTime(duration)}
                </Typography>
                <Typography variant="h5" component="h5" color="success">
                    Правильные ответы: {correctAnswersAmount} ({toPercents(correctAnswersAmount, problemsAmount)})
                </Typography>
                <Typography variant="h5" component="h5" color="error">
                    Неправильные ответы: {incorrectAnswersAmount} ({toPercents(incorrectAnswersAmount, problemsAmount)})
                </Typography>
            </Container>

            <Container
                style={{
                    overflow: "hidden auto",
                    padding: "10px 0"
                }}
            >
                {problems.map((problem, id) => (
                    <>
                        <Container key={id} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}>
                            <Typography variant="h6" component="div">
                                {id + 1})
                            </Typography>
                            <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                                {problem}
                            </pre>
                            <Typography variant="subtitle1">
                                Ответ: {answers[id]}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color={answers[id] === correctAnswers[id] ? 'success' : 'error'}
                            >
                                Правильный ответ: {correctAnswers[id]}
                            </Typography>

                        </Container>

                        <Divider />
                    </>
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
        </ExerciseContainer>
    );
}
