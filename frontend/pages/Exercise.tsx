import { Button, Container, Divider, TextField, Typography } from "@mui/material";
import { CountdownTimer } from "../components";
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
                    <>
                        <Container key={id} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            paddingLeft: "120px"
                        }}>
                            <Typography variant="h6" component="div">
                                {id + 1})
                            </Typography>
                            <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                                {problem}
                            </pre>
                            <Typography variant="subtitle1">
                                Ответ:
                            </Typography>

                            <TextField
                                style={{
                                    width: "150px",
                                }}
                                size="small"
                                variant="outlined"
                                value={answers[id]}
                                multiline
                                onChange={(ev) => answerChanged(id, ev.target.value)}
                            />
                        </Container>

                        <Divider />
                    </>
                ))}
            </Container>

            <Button variant="outlined" onClick={finished}>Готово</Button>
        </Container >
    );
}
