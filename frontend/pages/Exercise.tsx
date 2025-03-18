import { Button, Container, OutlinedInput } from "@mui/material";
import { CountdownTimer, ProblemInputControl } from "../components";
import { useEffect, useRef, useState } from "react";
import React from "react";

interface Props {
    timeout: number;
    problems: string[];
    onFinish: (duration: number, answers: string[]) => void;
}

function getDurationInSeconds(startDate: Date): number {
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - startDate.getTime();
    return differenceInMilliseconds / 1000;
}

export function Exercise({ timeout, problems, onFinish }: Props) {
    const [answers, setAnswers] = useState<string[]>(() => Array(problems.length).fill(null));

    const startDateRef = useRef(new Date());
    const startDate = startDateRef.current;

    useEffect(() => {
        const timerId = setTimeout(() => {
            const duration = getDurationInSeconds(startDate);
            onFinish(duration, answers);
        }, timeout * 60 * 1000);

        return () => clearTimeout(timerId);
    }, [timeout]);

    const answerChanged = (id: number, answer: string) => {
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[id] = answer;
            return newAnswers;
        });
    };

    const finished = () => {
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
            <CountdownTimer timeout={timeout} onExpire={finished} />

            <Container
                style={{
                    overflow: "hidden auto",
                }}
            >
                {problems.map((problem, id) => (
                    <Container key={id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "fit-content",
                            gap: "10px",
                            padding: "5px 0"
                        }}>
                        <span style={{ width: "20px", fontSize: "24px" }}>{id + 1})</span>
                        <ProblemInputControl
                            problem={problem}
                            answer={""}
                            readOnly={true}
                            onChange={(expr: string) => { }}
                            onAnswer={(answer) => answerChanged(id, answer)}
                        ></ProblemInputControl>
                    </Container>
                ))}
            </Container>

            <Button variant="outlined" onClick={finished}>Готово</Button>
        </Container >
    );
}
