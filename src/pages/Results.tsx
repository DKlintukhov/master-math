import { Button, Container, OutlinedInput, Typography } from "@mui/material";
import { Expression } from "../models";
import { ExpressionInputControl } from "../components";
import { Util } from "../util";

interface Props {
    expressions: Expression[];
    answers: number[];
    correctAnswers: number[];
    duration: number;
    onFinished: () => void;
}

function toPercents(a: number, b: number): string {
    return (a / b * 100).toFixed() + "%";
}

export function Results({ expressions, answers, correctAnswers, duration, onFinished }: Props) {
    const expressionsAmount = answers.length;
    let correctAnswersAmount = 0;
    let incorrectAnswersAmount = 0;
    answers.forEach((value, idx) => {
        if (value == correctAnswers[idx])
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
            height: "100vh"
        }}>
            <Container
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "5px",
                    overflow: "hidden auto",
                    maxHeight: "85%",
                    minHeight: "15%",
                }}
            >
                {expressions.map((expression, idx) => (
                    <Container key={idx} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}>
                        <span style={{ width: "25px" }}>{idx + 1})</span>
                        <ExpressionInputControl
                            expression={expression}
                            readOnly={true}
                        />
                        <span style={{ width: "7px" }}>=</span>
                        <OutlinedInput
                            style={{ height: "25px", width: "80px" }}
                            size="small"
                            value={answers[idx]}
                            error={answers[idx] != correctAnswers[idx]}
                            readOnly={true}
                        />
                        <OutlinedInput
                            style={{ height: "25px", width: "80px" }}
                            size="small"
                            value={correctAnswers[idx] === null ? NaN : correctAnswers[idx]}
                            readOnly={true}
                        />
                    </Container>
                ))}
            </Container>

            <Container style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
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

                <Button variant="outlined" onClick={() => onFinished()}>Финиш</Button>
            </Container>
        </Container >
    );
}
