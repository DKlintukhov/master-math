import { Button, Container, OutlinedInput } from "@mui/material";
import { Expression } from "../models";
import { ExpressionInputControl, CountdownTimer } from "../components";
import { useEffect, useRef, useState } from "react";

interface Props {
    timeout: number;
    expressions: Expression[];
    onFinish: (duration: number, answers: number[]) => void;
}

function getDurationInSeconds(startDate: Date): number {
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - startDate.getTime();
    return differenceInMilliseconds / 1000;
}

export function Exercise({ timeout, expressions, onFinish }: Props) {
    const [answers, setAnswers] = useState<number[]>(() => Array(expressions.length).fill(null));

    const startDateRef = useRef(new Date());
    const startDate = startDateRef.current;

    useEffect(() => {
        const timerId = setTimeout(() => {
            const duration = getDurationInSeconds(startDate);
            onFinish(duration, answers);
        }, timeout * 60 * 1000);

        return () => clearTimeout(timerId);
    }, [timeout]);

    const handleAnswerChange = (id: number, rawAnswer: string) => {
        if (rawAnswer.trim() === "")
            return;

        const answer = Number(rawAnswer);
        if (isNaN(answer))
            return;

        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[id] = answer;
            return newAnswers;
        });
    };

    const handleOnFinish = () => {
        onFinish(getDurationInSeconds(startDate), answers);
    };

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: "15px",
            height: "100%",
            padding: "10px 0"
        }}>
            <CountdownTimer timeout={timeout} onExpire={handleOnFinish} />

            <Container
                style={{
                    overflow: "hidden auto",
                    padding: "10px 0"
                }}
            >
                {expressions.map((expression, id) => (
                    <Container key={id} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        padding: "5px 0"
                    }}>
                        <span style={{ width: "30px" }}>{id + 1})</span>
                        <ExpressionInputControl
                            expression={expression}
                            readOnly={true}
                        />
                        <span style={{ width: "7px" }}>=</span>
                        <OutlinedInput
                            style={{ height: "25px", width: "90px", textAlignLast: "center" }}
                            size="small"
                            type="number"
                            onBlur={(e) => handleAnswerChange(id, e.target.value)}
                        />
                    </Container>
                ))}
            </Container>

            <Button variant="outlined" onClick={handleOnFinish}>Готово</Button>
        </Container >
    );
}
