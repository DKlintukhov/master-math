import Button from "@mui/material/Button";
import React, { useState } from "react";
import { Container, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { ProblemInputControl } from "../components";
import { Exercise, ExerciseLimits } from "../models";

interface Props {
    exercise: Exercise;
    onSave: (exercise: Exercise) => void;
    onCancel: () => void;
}

export function ExerciseBuilder({ exercise, onSave, onCancel }: Props) {
    const [problem, setProblem] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [problems, setProblems] = useState<string[]>([...exercise.problems]);
    const [answers, setAnswers] = useState<string[]>([...exercise.answers]);
    const [name, setName] = useState<string>(exercise.name);
    const [timeout, setTimeout] = useState<number>(exercise.timeout);

    const problemAdded = () => {
        setProblems([...problems, problem]);
        setAnswers([...answers, answer]);
        setProblem("");
        setAnswer("");
    }

    const problemDeleted = () => {
        problems.pop();
        answers.pop();
        setProblems([...problems]);
        setAnswers([...answers]);
    }

    const problemChanged = (id, problem: string) => {
        if (problem)
            problems[id] = problem;
    }

    const answerChanged = (id: number, answer: string) => {
        if (answer)
            answers[id] = answer;
    }

    const newProblemChanged = (problem: string) => {
        if (problem)
            setProblem(problem);
    }

    const newAnswerChanged = (answer: string) => {
        if (answer)
            setAnswer(answer);
    }

    const handleOnSave = () => {
        onSave({ id: 0, name, timeout, problems, answers });
    }

    const handleTimeoutChange = (rawtimeout: string) => {
        const timeout = Number(rawtimeout.trim());
        setTimeout(timeout);
    };

    return (
        <>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                padding: "5px 0"
            }}>
                <div style={{
                    alignContent: "center",
                    overflowY: "auto",
                    height: "100%"
                }}>
                    <Container style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        padding: "5px 0",
                    }}>
                        <div style={{
                            display: "flex",
                            gap: "30px",
                        }}>
                            <div style={{
                                paddingLeft: "25px",
                            }}>
                                <InputLabel>Название упражнения</InputLabel>
                                <TextField
                                    style={{
                                        width: "300px",
                                    }}
                                    size="medium"
                                    variant="outlined"
                                    value={name}
                                    multiline
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>

                            <div>
                                <InputLabel>Время (мин.)</InputLabel>
                                <OutlinedInput
                                    style={{
                                        width: "150px",
                                    }}
                                    error={timeout < 1 || timeout > ExerciseLimits.MAX_TIMEOUT}
                                    required
                                    defaultValue={timeout}
                                    type="number"
                                    onChange={(e) => handleTimeoutChange(e.target.value)}
                                />
                            </div>
                        </div>

                        {problems.map((expr, id) => (
                            <Container
                                key={id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr auto auto',
                                    alignItems: 'center',
                                    gridColumnGap: '10px',
                                    padding: '8px',
                                    width: "fit-content"
                                }}
                            >
                                <span>{id + 1}) </span>
                                <ProblemInputControl
                                    problem={expr}
                                    readOnly={false}
                                    answer={answers[id]}
                                    onChange={(expr) => problemChanged(id, expr)}
                                    onAnswer={(answer) => answerChanged(id, answer)}>
                                </ProblemInputControl>
                            </Container>
                        ))}
                        <Container
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto auto',
                                alignItems: 'center',
                                gridColumnGap: '10px',
                                padding: '8px',
                                width: "fit-content"
                            }}
                        >
                            <span>{problems.length + 1}) </span>
                            <ProblemInputControl
                                problem={problem}
                                readOnly={false}
                                answer={answer}
                                onChange={newProblemChanged}
                                onAnswer={newAnswerChanged}>
                            </ProblemInputControl>
                        </Container>
                        <Container style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px"
                        }}>
                            <Button variant="outlined" onClick={problemDeleted} disabled={problems.length < 1}>Удалить</Button>
                            <Button
                                variant="outlined"
                                onClick={problemAdded}
                                disabled={!problem || !answer || problems.length > ExerciseLimits.MAX_EPXRESSIONS_AMOUNT}>
                                Добавить
                            </Button>
                        </Container>
                    </Container>
                </div>

                <Container style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "15px",
                    padding: '10px 0',
                    height: "10%",
                }}>
                    <Button variant="outlined" onClick={() => handleOnSave()} disabled={problems.length < 1}>Сохранить</Button>
                    <Button variant="outlined" onClick={onCancel}>Назад</Button>
                </Container>
            </Container>
        </>
    );
}
