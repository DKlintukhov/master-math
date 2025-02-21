import { Button, Container, OutlinedInput, Typography } from "@mui/material";
import { Answer, Expression } from "../models";
import { ExpressionInputControl } from "../components";
import { Util } from "../util";

interface Props {
    expressions: Expression[];
    answers: Answer[];
    duration: number;
    onFinished: () => void;
}

function toPercents(a: number, b: number): string {
    return (a / b * 100).toFixed() + "%";
}

export function Results({ expressions, answers, duration, onFinished }: Props) {
    const expressionsAmount = answers.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    answers.forEach(({ value, correctValue }) => {
        if (value == correctValue)
            ++correctAnswers;
        else
            ++incorrectAnswers;
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
                    maxHeight: "70%",
                    minHeight: "15%",
                }}
            >
                {expressions.map((expression, id) => (
                    <Container key={id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}>
                        <span style={{ width: "25px" }}>{id + 1})</span>
                        <ExpressionInputControl
                            expression={expression}
                            readOnly={true}
                        />
                        <span style={{ width: "7px" }}>=</span>
                        <OutlinedInput
                            style={{ height: "25px", width: "80px" }}
                            size="small"
                            value={answers[id].value}
                            error={answers[id].value == answers[id].correctValue}
                            readOnly={true}
                        />
                        <OutlinedInput
                            style={{ height: "25px", width: "80px" }}
                            size="small"
                            value={answers[id].correctValue}
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
                    Правильные ответы: {correctAnswers} ({toPercents(correctAnswers, expressionsAmount)})
                </Typography>
                <Typography variant="h4" component="h2" color="error">
                    Неправильные ответы: {incorrectAnswers} ({toPercents(incorrectAnswers, expressionsAmount)})
                </Typography>

                <Button variant="outlined" onClick={() => onFinished()}>Финиш</Button>
            </Container>
        </Container >
    );
}
