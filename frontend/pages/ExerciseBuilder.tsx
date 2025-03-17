import Button from "@mui/material/Button";
import React, { useState } from "react";
import { Container } from "@mui/material";
import { ExcerciseSetupDialog, ProblemInputControl } from "../components";
import { Exercise, ExerciseLimits } from "../models";

interface Props {
    onBuilt: (exercise: Exercise) => void;
    onSave: (exercise: Exercise) => void;
    onCancel: () => void;
}

export function ExerciseBuilder({ onBuilt, onSave, onCancel }: Props) {
    const [problem, setProblem] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [problems, setProblems] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

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

    const saveHandler = () => {
        setIsSaving(true);
        dialogOpenedHandler();
    }

    const startHandler = () => {
        setIsSaving(false);
        dialogOpenedHandler();
    }

    const confirmed = (name: string, timeout: number) => {
        dialogClosedHandler();

        if (isSaving) {
            setIsSaving(false);
            onSave({ name, timeout, problems, answers });
            return;
        }

        onBuilt({ name, timeout, problems, answers });
    }

    const dialogOpenedHandler = () => {
        setDialogOpened(true);
    }

    const dialogClosedHandler = () => {
        setDialogOpened(false);
    }

    return (
        <>
            {dialogOpened && <ExcerciseSetupDialog name="" onCancel={dialogClosedHandler} onConfirm={confirmed}></ExcerciseSetupDialog>}

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
                    <Button variant="outlined" onClick={saveHandler} disabled={problems.length < 1}>Сохранить</Button>
                    <Button variant="outlined" onClick={startHandler} disabled={problems.length < 1}>Начать</Button>
                    <Button variant="outlined" onClick={onCancel}>Назад</Button>
                </Container>
            </Container>
        </>
    );
}
